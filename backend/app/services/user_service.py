# app/services/user_service.py

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


async def get_user_by_email(
    db: AsyncSession,
    email: str,
) -> User | None:

    result = await db.scalars(
        select(User).where(User.email == email)
    )

    return result.one_or_none()


async def get_user_by_id(
    db: AsyncSession,
    user_id: uuid.UUID,
) -> User | None:
    result = await db.scalars(
        select(User).where(User.id == user_id)
    )

    return result.one_or_none()
