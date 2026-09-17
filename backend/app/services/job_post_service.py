import uuid

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.company import Company
from app.models.job_post import JobPost
from app.schemas.job_post import JobPostCreate, JobPostUpdate
from app.utils.url_helpers import generate_url_hash


class DuplicateUrlHashError(Exception):
    pass


class CompanyNotFoundError(Exception):
    pass


async def create_job_post(db: AsyncSession, data: JobPostCreate) -> JobPost:
    company = await db.get(Company, data.company_id)
    if company is None:
        raise CompanyNotFoundError
    url_hash = generate_url_hash(data.posting_url)
    job_post = JobPost(url_hash=url_hash, **data.model_dump(mode="json"))
    db.add(job_post)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise DuplicateUrlHashError from exc
    await db.refresh(job_post)
    return job_post


async def get_job_post(
    db: AsyncSession, job_post_id: uuid.UUID
) -> JobPost | None:
    return await db.get(JobPost, job_post_id)


async def get_job_post_by_url_hash(
    db: AsyncSession, url_hash: str
) -> JobPost | None:
    stmt = select(JobPost).where(JobPost.url_hash == url_hash)
    result = await db.scalars(stmt)
    return result.first()


async def get_job_posts(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100,
    company_id: uuid.UUID | None = None,
) -> list[JobPost]:
    stmt = select(JobPost)
    if company_id is not None:
        stmt = stmt.where(JobPost.company_id == company_id)
    stmt = stmt.offset(skip).limit(limit)
    result = await db.scalars(stmt)
    return list(result.all())


async def update_job_post(
    db: AsyncSession, job_post_id: uuid.UUID, data: JobPostUpdate
) -> JobPost | None:
    job_post = await db.get(JobPost, job_post_id)
    if job_post is None:
        return None
    updates = data.model_dump(exclude_unset=True, mode="json")
    for field, value in updates.items():
        setattr(job_post, field, value)
    await db.commit()
    await db.refresh(job_post)
    return job_post


async def delete_job_post(db: AsyncSession, job_post_id: uuid.UUID) -> bool:
    job_post = await db.get(JobPost, job_post_id)
    if job_post is None:
        return False
    await db.delete(job_post)
    await db.commit()
    return True
