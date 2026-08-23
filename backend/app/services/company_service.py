import uuid

from sqlalchemy.orm import Session

from app.models.company import Company
from app.schemas.company import CompanyCreate, CompanyUpdate


def create_company(db: Session, data: CompanyCreate) -> Company:
    company = Company(**data.model_dump(mode="json"))
    db.add(company)
    db.commit()
    db.refresh(company)
    return company


def get_company(db: Session, company_id: uuid.UUID) -> Company | None:
    return db.get(Company, company_id)


def get_companies(db: Session, skip: int = 0, limit: int = 100) -> list[Company]:
    return db.query(Company).offset(skip).limit(limit).all()


def update_company(
    db: Session, company_id: uuid.UUID, data: CompanyUpdate
) -> Company | None:
    company = db.get(Company, company_id)
    if company is None:
        return None
    updates = data.model_dump(exclude_unset=True, mode="json")
    for field, value in updates.items():
        setattr(company, field, value)
    db.commit()
    db.refresh(company)
    return company


def delete_company(db: Session, company_id: uuid.UUID) -> bool:
    company = db.get(Company, company_id)
    if company is None:
        return False
    db.delete(company)
    db.commit()
    return True
