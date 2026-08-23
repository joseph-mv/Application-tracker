from app.routes.applications import router as applications_router
from app.routes.companies import router as companies_router
from app.routes.auth import router as auth_router

__all__ = ["applications_router", "companies_router", "auth_router"]
