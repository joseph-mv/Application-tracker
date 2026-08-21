from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def get_applications():
    return {"message": "Hello, World!"}