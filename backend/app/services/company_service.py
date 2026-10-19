import uuid

from sqlalchemy import Enum, String, Text, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.company import Company
from app.schemas.company import CompanyCreate, CompanyFieldRead, CompanyUpdate

_IMPORT_SKIP_COLUMNS = {"id", "created_at", "updated_at"}


def _column_type_name(column) -> str:
    if isinstance(column.type, Enum):
        return "enum"
    if isinstance(column.type, (String, Text)):
        return "string"
    return type(column.type).__name__.lower()


def get_company_import_fields() -> list[CompanyFieldRead]:
    return [
        CompanyFieldRead(
            field=column.name,
            type=_column_type_name(column),
            required=not column.nullable,
        )
        for column in Company.__table__.columns
        if column.name not in _IMPORT_SKIP_COLUMNS
    ]


async def create_company(db: AsyncSession, data: CompanyCreate) -> Company:
    company = Company(**data.model_dump(mode="json"))
    db.add(company)
    await db.commit()
    await db.refresh(company)
    return company


async def get_company(
    db: AsyncSession, company_id: uuid.UUID
) -> Company | None:
    return await db.get(Company, company_id)


async def get_companies(
    db: AsyncSession, skip: int = 0, limit: int = 100
) -> list[Company]:
    result = await db.scalars(select(Company).offset(skip).limit(limit))
    return list(result.all())


async def update_company(
    db: AsyncSession, company_id: uuid.UUID, data: CompanyUpdate
) -> Company | None:
    company = await db.get(Company, company_id)
    if company is None:
        return None
    updates = data.model_dump(exclude_unset=True, mode="json")
    for field, value in updates.items():
        setattr(company, field, value)
    await db.commit()
    await db.refresh(company)
    return company


async def delete_company(db: AsyncSession, company_id: uuid.UUID) -> bool:
    company = await db.get(Company, company_id)
    if company is None:
        return False
    await db.delete(company)
    await db.commit()
    return True
