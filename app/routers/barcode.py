from fastapi import File, UploadFile, APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from requests import get as http_get
from pyzbar.pyzbar import decode
from PIL import Image
from io import BytesIO
import re
from dict_deep import deep_get

router = APIRouter(prefix="/barcode", tags=["barcode"])

# Keys to fetch
PRODUCT_FIELDS = {
    'barcode': 'product.code',
    'product_name': 'product.product_name_en',
    'brands': 'product.brands',
    'countries': 'product.countries',
    'allergens': 'product.allergens',
    'keywords': 'product._keywords',
    'energy_kcal': 'product.nutriments.energy-kcal',
    'fat': 'product.nutriments.fat',
    'sugars': 'product.nutriments.sugars',
    'fiber': 'product.nutriments.fiber',
    'proteins': 'product.nutriments.proteins',
    'salt': 'product.nutriments.salt',
    'nutriscore_grade': 'product.nutriscore_grade',
    'ecoscore_grade': 'product.ecoscore_grade'
}


def extract_info_from_barcode(product: dict):
    try:
        return dict(
            map(lambda x: (x[0], deep_get(product, x[1])), PRODUCT_FIELDS.items())
        )

    except Exception as e:
        raise e


def parse_gs1_data(data: str):
    parsed = {}

    # Regex-based GS1 Application Identifier (AI) extraction
    matches = re.findall(r'\((\d{2})\)([^\(]+)', data)
    for ai, value in matches:
        if ai == '01':
            parsed['gtin'] = value
        elif ai == '17':
            parsed['expiry_date'] = f"20{value[:2]}-{value[2:4]}-{value[4:]}"
        elif ai == '10':
            parsed['batch'] = value
        else:
            parsed[f'ai_{ai}'] = value

    return parsed


@router.post("process-barcode/")
async def scan_barcode(file: UploadFile = File(...)):
    image = Image.open(BytesIO(await file.read()))
    decoded_objects = decode(image)

    if not decoded_objects:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"error": "No barcode detected"})

    results = []
    for obj in decoded_objects:
        raw_data = obj.data.decode("utf-8")
        barcode_type = obj.type

        # Try GS1 parsing if barcode looks structured
        if '(' in raw_data:
            parsed_data = parse_gs1_data(raw_data)
        else:
            parsed_data = {"raw": raw_data}

        # endpoint to get more data
        #    "data": {
        #         "raw": "5201671001517"
        #       }
        # barcode = data['data']['raw'] #"5201671001517"
        # https://world.openfoodfacts.org/api/v0/product/{barcode}.json

        try:
            retrieved_data = http_get(url=f"https://world.openfoodfacts.org/api/v0/product/{parsed_data}.json")
            results.append({
                "type": barcode_type,
                "data": extract_info_from_barcode(retrieved_data.json())
            })
        except Exception as ex:
            raise ex
        except HTTPException:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    return {"results": results}
