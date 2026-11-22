# Smart Fridge App

[![CI](https://github.com/ValantisChatzimagkas/smart-fridge-app/actions/workflows/ci.yml/badge.svg)](https://github.com/ValantisChatzimagkas/smart-fridge-app/actions/workflows/ci.yml)

Track the ingredients in your fridge to reduce food waste and avoid eating food that has gone bad. Register products by snapping a photo of their barcode; product details are looked up automatically.

### Why
This app was built with two goals in mind:
1. Reduce food waste
2. Get hands-on experience with React

### Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** FastAPI, Beanie (MongoDB ODM), pyzbar (barcode decoding)
- **Database:** MongoDB
- **Infra:** Docker Compose

### Getting Started
```bash
docker compose up --build
```
- UI: http://localhost:5173
- API docs: http://localhost:8000/docs

## 🚧 Roadmap

### 🎨 UI

| Feature/Task                                                                                                                                         | Description                       | Status | Priority |
|------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|--------|----------|
| Register a product with barcode photo upload                                                                                                         |                                   | X      | HIGH     |
| Testing                                                                                                                                              | Write tests for the crucial parts | X      | HIGH     |
| Register new product                                                                                                                                 |                                   | X      | HIGH     |
| Create/Register account                                                                                                                              |                                   | X      | HIGH     |
| Login                                                                                                                                                |                                   | X      | HIGH     |
| Refactor UI from take photo component                                                                                                                |                                   | X      | MEDIUM   |
| Add logic to take photo and specify that in this photo we have for example expiry date, this will be send to API on the OCR endpoint to be processed |                                   | X      | MEDIUM   |
| Refactor and display filter and take photo components in a better UX way                                                                             |                                   | X      | LOW      |

### 🛠 BACKEND

| Feature/Task                           | Description                                                                                                                                                                                                       | Status | Priority |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|----------|
| Authentication Endpoint                |                                                                                                                                                                                                                   | X      | HIGH     |
| OCR Endpoint                           | Endpoint that will use OCR to scan an image and fetch specified data from image. E.g. when sending request specify that we scan for field expiry date so that we bind the expiry date field with the scanned info | X      | MEDIUM   |
| Testing                                | Write tests for the crucial parts                                                                                                                                                                                 | X      | HIGH     |
| Protect endpoints via authentication   |                                                                                                                                                                                                                   | X      | HIGH     |
| Ingredient status transition           | Implement service that processes ingredients and sets their status to expired or close to expire                                                                                                                  | X      | MEDIUM   |
| Expire/Close to expire alerts          | Implement service that sends alerts about expired or close to expire alerts                                                                                                                                       | X      | MEDIUM   |
| Close to expire recipes recommendation | Use a database that can recommend recipes using the close to expire products                                                                                                                                      | X      | LOW      |

## License

[MIT](LICENSE)
