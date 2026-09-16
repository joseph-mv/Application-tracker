import uuid

from fastapi import APIRouter, HTTPException, status

from app.deps import CurrentUser, DbSession
from app.schemas.job_post import JobPostCreate, JobPostRead, JobPostUpdate
from app.services import job_post_service
from app.services.job_post_service import (
    CompanyNotFoundError,
    DuplicateUrlHashError,
)

router = APIRouter()


@router.post(
    "/",
    response_model=JobPostRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_job_post(
    payload: JobPostCreate,
    db: DbSession,
    _user: CurrentUser,
):
    try:
        return await job_post_service.create_job_post(db, payload)
    except CompanyNotFoundError:
        raise HTTPException(
            status_code=404, detail="Company not found"
        ) from None
    except DuplicateUrlHashError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Job post with this url_hash already exists",
        ) from None


@router.get("/", response_model=list[JobPostRead])
async def list_job_posts(
    db: DbSession,
    _user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
    company_id: uuid.UUID | None = None,
):
    return await job_post_service.get_job_posts(
        db, skip=skip, limit=limit, company_id=company_id
    )


@router.get("/by-url-hash/{url_hash}", response_model=JobPostRead)
async def get_job_post_by_url_hash(
    url_hash: str,
    db: DbSession,
    _user: CurrentUser,
):
    job_post = await job_post_service.get_job_post_by_url_hash(db, url_hash)
    if job_post is None:
        raise HTTPException(status_code=404, detail="Job post not found")
    return job_post


@router.get("/{job_post_id}", response_model=JobPostRead)
async def get_job_post(
    job_post_id: uuid.UUID,
    db: DbSession,
    _user: CurrentUser,
):
    job_post = await job_post_service.get_job_post(db, job_post_id)
    if job_post is None:
        raise HTTPException(status_code=404, detail="Job post not found")
    return job_post


@router.patch("/{job_post_id}", response_model=JobPostRead)
async def update_job_post(
    job_post_id: uuid.UUID,
    payload: JobPostUpdate,
    db: DbSession,
    _user: CurrentUser,
):
    job_post = await job_post_service.update_job_post(db, job_post_id, payload)
    if job_post is None:
        raise HTTPException(status_code=404, detail="Job post not found")
    return job_post


@router.delete("/{job_post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job_post(
    job_post_id: uuid.UUID,
    db: DbSession,
    _user: CurrentUser,
):
    deleted = await job_post_service.delete_job_post(db, job_post_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Job post not found")
