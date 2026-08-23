from fastapi import FastAPI

from app.routes import applications_router, auth_router, companies_router

app = FastAPI(
    title="Application Tracker API",
    version="1.0.0",
)


app.include_router(
    applications_router,
    prefix="/api/v1/applications",
    tags=["applications"],
)

app.include_router(
    companies_router,
    prefix="/api/v1/companies",
    tags=["companies"],
)

app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["auth"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Application Tracker API!"}


@app.get("/health")
def health_check():
    return {"status": "ok"}