from app.routes.applications import router as applications_router
from app.routes.auth import router as auth_router
from app.routes.companies import router as companies_router
from app.routes.job_posts import router as job_posts_router

__all__ = [
    "applications_router",
    "auth_router",
    "companies_router",
    "job_posts_router",
]
