"""AI: Summarizer — generate concise summaries of case descriptions."""


def summarize_case(description: str, max_sentences: int = 3) -> str:
    """
    Summarise a long case description using an LLM.

    TODO:
    - Call OpenAI chat completion or HuggingFace pipeline.
    - Apply extractive/abstractive summarisation.
    """
    if not description:
        return "No description provided."

    # Stub: return first N sentences
    sentences = description.split(". ")
    return ". ".join(sentences[:max_sentences]) + ("." if len(sentences) > max_sentences else "")
