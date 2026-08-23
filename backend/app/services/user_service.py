# app/services/user_service.py

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


def get_user_by_email(
    db: Session,
    email: str,
) -> User | None:

    result = db.scalars(
        select(User).where(User.email == email)
    )

    return result.one_or_none()