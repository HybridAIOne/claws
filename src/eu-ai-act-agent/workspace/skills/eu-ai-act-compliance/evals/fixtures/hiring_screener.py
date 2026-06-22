# Synthetic fixture — an automated CV screening tool. Not real code.
# Exercises high-risk domain (Annex III §4 employment) detection.
from transformers import pipeline

ranker = pipeline("text-classification")


def screen_resume(applicant_text: str) -> float:
    """Rank a candidate for a role — an Annex III §4 employment use-case."""
    return ranker(applicant_text)[0]["score"]
