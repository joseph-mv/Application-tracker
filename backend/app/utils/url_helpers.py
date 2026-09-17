import hashlib
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode

# Query params to strip because they don't affect the job's identity
TRACKING_PARAMS = {
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    "ref", "refid", "trk", "trackingId", "gclid", "fbclid", "mc_cid", "mc_eid",
    "session_id", "sid", "src",
}


def normalize_url(raw_url: str) -> str:
    """Normalize a job posting URL so duplicates hash to the same value."""
    parts = urlsplit(str(raw_url).strip())

    # Lowercase scheme + domain (paths can be case-sensitive, so leave those)
    scheme = "https"  # treat http/https as equivalent
    netloc = parts.netloc.lower()
    if netloc.startswith("www."):
        netloc = netloc[4:]

    # Strip trailing slash from path
    path = parts.path.rstrip("/")

    # Remove tracking query params, keep the rest sorted for consistency
    query_pairs = parse_qsl(parts.query, keep_blank_values=True)
    filtered_pairs = sorted(
        (k, v) for k, v in query_pairs if k.lower() not in TRACKING_PARAMS
    )
    query = urlencode(filtered_pairs)

    # Drop the fragment entirely (e.g. #section)
    normalized = urlunsplit((scheme, netloc, path, query, ""))
    return normalized


def generate_url_hash(posting_url: str) -> str:
    """Generate a stable SHA-256 hash from a normalized job posting URL."""
    normalized = normalize_url(posting_url)
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


# # Example usage
# if __name__ == "__main__":
#     url1 = "https://www.linkedin.com/jobs/view/1234567?utm_source=share&trk=abc"
#     url2 = "http://linkedin.com/jobs/view/1234567/"

#     print(generate_url_hash(url1))
#     print(generate_url_hash(url2))
#     print(generate_url_hash(url1) == generate_url_hash(url2))  # True