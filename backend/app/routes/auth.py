# app/routes/auth.py

from fastapi import APIRouter, status

from app.schemas.auth import SignupRequest
# from app.schemas.user import UserResponse
from app.services.auth_service import signup

from app.deps import DbSession


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
