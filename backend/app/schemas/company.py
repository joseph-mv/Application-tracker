import uuid
from datetime import datetime
from typing import Any

from pydantic import AnyUrl, BaseModel, ConfigDict, Field

from app.enums import CompanyType


class CompanyBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    domain: str | None = Field(default=None, max_length=255)
    website: AnyUrl | None = None
    career_page_url: AnyUrl | None = None
    linkedin_url: AnyUrl | None = None
    industry: str | None = Field(default=None, max_length=255)
    company_type: CompanyType | None = None
    size: str | None = Field(default=None, max_length=100)
    headquarters_location: str | None = Field(default=None, max_length=500)
    logo_url: AnyUrl | None = None
    notes: str | None = None


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    domain: str | None = Field(default=None, max_length=255)
    website: AnyUrl | None = None
    career_page_url: AnyUrl | None = None
    linkedin_url: AnyUrl | None = None
    industry: str | None = Field(default=None, max_length=255)
    company_type: CompanyType | None = None
    size: str | None = Field(default=None, max_length=100)
    headquarters_location: str | None = Field(default=None, max_length=500)
    logo_url: AnyUrl | None = None
    notes: str | None = None


class CompanyRead(CompanyBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class CompanyFieldRead(BaseModel):
    name: str
    type: str
    required: bool
    constraints: dict[str, Any]
