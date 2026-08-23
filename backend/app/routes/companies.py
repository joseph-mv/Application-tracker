import uuid

from fastapi import APIRouter, HTTPException, status

from app.deps import DbSession
from app.schemas.company import CompanyCreate, CompanyRead, CompanyUpdate
from app.services import company_service

router = APIRouter()


@router.post(
    "/",
    response_model=CompanyRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_company(payload: CompanyCreate, db: DbSession):
    return await company_service.create_company(db, payload)


@router.get("/", response_model=list[CompanyRead])
async def list_companies(db: DbSession, skip: int = 0, limit: int = 100):
    return await company_service.get_companies(db, skip, limit)


@router.get("/{company_id}", response_model=CompanyRead)
async def get_company(company_id: uuid.UUID, db: DbSession):
    company = await company_service.get_company(db, company_id)
    if company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.patch("/{company_id}", response_model=CompanyRead)
async def update_company(
    company_id: uuid.UUID,
    payload: CompanyUpdate,
    db: DbSession,
):
    company = await company_service.update_company(db, company_id, payload)
    if company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(company_id: uuid.UUID, db: DbSession):
    deleted = await company_service.delete_company(db, company_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Company not found")
