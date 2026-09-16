import enum


class CompanyType(str, enum.Enum):
    product = "product"
    service = "service"
    hybrid = "hybrid"


class EmploymentType(str, enum.Enum):
    full_time = "full_time"
    part_time = "part_time"
    contract = "contract"
    internship = "internship"
    temporary = "temporary"
    freelance = "freelance"


class ExperienceLevel(str, enum.Enum):
    intern = "intern"
    entry = "entry"
    mid = "mid"
    senior = "senior"
    staff = "staff"
    principal = "principal"
    executive = "executive"


class RemoteType(str, enum.Enum):
    on_site = "on_site"
    remote = "remote"
    hybrid = "hybrid"


class PostingStatus(str, enum.Enum):
    active = "active"
    expired = "expired"
    filled = "filled"
    removed = "removed"
    unknown = "unknown"
