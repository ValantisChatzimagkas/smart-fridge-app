from datetime import date, timedelta

import pytest

from app.expiry import expiry_status
from app.models.ingredients import IngredientStatusOptions as S

TODAY = date(2026, 6, 15)


@pytest.mark.parametrize(
    ("days_ahead", "warn_days", "expected"),
    [
        (-30, 3, S.EXPIRED),
        (-1, 3, S.EXPIRED),
        (0, 3, S.CLOSE_TO_EXPIRE),  # expires today: still edible
        (1, 3, S.CLOSE_TO_EXPIRE),
        (3, 3, S.CLOSE_TO_EXPIRE),  # exactly warn_days ahead
        (4, 3, S.NOT_EXPIRED),
        (365, 3, S.NOT_EXPIRED),
        (7, 7, S.CLOSE_TO_EXPIRE),
        (8, 7, S.NOT_EXPIRED),
        (0, 0, S.CLOSE_TO_EXPIRE),
        (1, 0, S.NOT_EXPIRED),
    ],
)
def test_expiry_status(days_ahead, warn_days, expected):
    assert expiry_status(TODAY + timedelta(days=days_ahead), TODAY, warn_days) == expected
