import enum


class CompanyType(str, enum.Enum):
    product = "product"
    service = "service"
    hybrid = "hybrid"
