from datetime import date, timedelta

from app.models.ingredients import IngredientStatusOptions


def expiry_status(expiry_date: date, today: date, warn_days: int = 3) -> IngredientStatusOptions:
    """Expired once the date has passed; close to expiring from `warn_days` before it, inclusive."""
    if expiry_date < today:
        return IngredientStatusOptions.EXPIRED
    if expiry_date <= today + timedelta(days=warn_days):
        return IngredientStatusOptions.CLOSE_TO_EXPIRE
    return IngredientStatusOptions.NOT_EXPIRED
