import uuid
from datetime import datetime
from decimal import Decimal
from typing import Any

from pydantic import AnyUrl, BaseModel, ConfigDict, Field

from app.enums import (
    EmploymentType,
    ExperienceLevel,
    PostingStatus,
    RemoteType,
)


class JobPostBase(BaseModel):
    title: str = Field(..., max_length=500)
    description_raw: str | None = None
    description_summary: str | None = None
    posting_url: AnyUrl
    external_id: str | None = Field(default=None, max_length=255)
    employment_type: EmploymentType | None = None
    experience_level: ExperienceLevel | None = None
    remote_type: RemoteType | None = None
    location: str | None = Field(default=None, max_length=500)
    salary_min: Decimal | None = None
    salary_max: Decimal | None = None
    currency: str | None = Field(default=None, max_length=3)
    date_posted: datetime | None = None
    posting_status: PostingStatus = PostingStatus.active
    last_checked_at: datetime | None = None
    expires_at: datetime | None = None
    raw_payload: dict[str, Any] | None = None


class JobPostCreate(JobPostBase):
    company_id: uuid.UUID


class JobPostUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=500)
    description_raw: str | None = None
    description_summary: str | None = None
    posting_url: AnyUrl | None = None
    external_id: str | None = Field(default=None, max_length=255)
    employment_type: EmploymentType | None = None
    experience_level: ExperienceLevel | None = None
    remote_type: RemoteType | None = None
    location: str | None = Field(default=None, max_length=500)
    salary_min: Decimal | None = None
    salary_max: Decimal | None = None
    currency: str | None = Field(default=None, max_length=3)
    date_posted: datetime | None = None
    posting_status: PostingStatus | None = None
    last_checked_at: datetime | None = None
    expires_at: datetime | None = None
    raw_payload: dict[str, Any] | None = None


class JobPostRead(JobPostBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
