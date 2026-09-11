# app/services/auth_service.py

import uuid

import jwt
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.auth import TokenResponse
from app.services.user_service import get_user_by_email


async def signup(
    db: AsyncSession,
    name: str,
    email: str,
    password: str,
) -> User:

    existing_user = await get_user_by_email(
        db,
        email,
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    hashed_password = hash_password(password)

    user = User(
        name=name,
        email=email,
        hashed_password=hashed_password,
    )

    db.add(user)

    await db.commit()

    return user


def _create_token_response(user_id: uuid.UUID) -> TokenResponse:
    subject = str(user_id)
    return TokenResponse(
        access_token=create_access_token(subject),
        refresh_token=create_refresh_token(subject),
    )


async def login(
    db: AsyncSession,
    email: str,
    password: str,
) -> TokenResponse:
    user = await get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    return _create_token_response(user.id)


async def refresh(refresh_token: str) -> TokenResponse:
    try:
        payload = decode_token(refresh_token)
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        ) from None

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    subject = payload.get("sub")
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    try:
        user_id = uuid.UUID(subject)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        ) from None

    return _create_token_response(user_id)
