import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.company import Company
from app.schemas.company import (
    CompanyBase,
    CompanyCreate,
    CompanyFieldRead,
    CompanyUpdate,
)
from app.utils.schema_fields import field_constraints, field_type_name


def get_company_import_fields() -> list[CompanyFieldRead]:
    return [
        CompanyFieldRead(
            name=name,
            type=field_type_name(info.annotation),
            required=info.is_required(),
            constraints=field_constraints(info),
        )
        for name, info in CompanyBase.model_fields.items()
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
