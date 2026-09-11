# app/routes/auth.py

from fastapi import APIRouter, status

from app.deps import DbSession
from app.schemas.auth import LoginRequest, RefreshRequest, SignupRequest, TokenResponse
from app.services.auth_service import login, refresh, signup

router = APIRouter()


@router.post(
    "/signup",
    status_code=status.HTTP_201_CREATED,
)
async def signup_user(
    data: SignupRequest,
    db: DbSession,
) -> dict:
    user = await signup(
        db=db,
        name=data.name,
        email=data.email,
        password=data.password,
    )
    return {"message": "User created successfully", "user": user}


@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    response_model=TokenResponse,
)
async def login_user(
    data: LoginRequest,
    db: DbSession,
) -> TokenResponse:
    return await login(db=db, email=data.email, password=data.password)


@router.post(
    "/refresh",
    status_code=status.HTTP_200_OK,
    response_model=TokenResponse,
)
async def refresh_tokens(data: RefreshRequest) -> TokenResponse:
    return await refresh(data.refresh_token)
