# app/services/auth_service.py

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.user import User
from app.services.user_service import get_user_by_email


async def signup(
    db: AsyncSession,
    name: str,
    email: str,
    password: str,
) -> User:

    # 1. Check whether email is already registered
    existing_user = await get_user_by_email(
        db,
        email,
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    # 2. Hash password
    hashed_password = hash_password(password)

    # 3. Create User model
    user = User(
        name=name,
        email=email,
        hashed_password=hashed_password,
    )

    # 4. Save to database
    db.add(user)

    await db.commit()

    return {"message": "User created successfully"}
