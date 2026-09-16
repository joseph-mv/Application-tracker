import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.enums import (
    EmploymentType,
    ExperienceLevel,
    PostingStatus,
    RemoteType,
)


class JobPost(Base):
    __tablename__ = "job_posts"
    __table_args__ = (UniqueConstraint("url_hash", name="uq_job_posts_url_hash"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
    )
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description_raw: Mapped[str | None] = mapped_column(Text)
    description_summary: Mapped[str | None] = mapped_column(Text)
    posting_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    url_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    external_id: Mapped[str | None] = mapped_column(String(255))
    employment_type: Mapped[EmploymentType | None] = mapped_column(
        Enum(EmploymentType, name="employmenttype")
    )
    experience_level: Mapped[ExperienceLevel | None] = mapped_column(
        Enum(ExperienceLevel, name="experiencelevel")
    )
    remote_type: Mapped[RemoteType | None] = mapped_column(
        Enum(RemoteType, name="remotetype")
    )
    location: Mapped[str | None] = mapped_column(String(500))
    salary_min: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    salary_max: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    currency: Mapped[str | None] = mapped_column(String(3))
    date_posted: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    posting_status: Mapped[PostingStatus] = mapped_column(
        Enum(PostingStatus, name="postingstatus"),
        nullable=False,
        default=PostingStatus.active,
    )
    last_checked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    raw_payload: Mapped[dict | None] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
