"""AI: Investigation agent — multi-step reasoning over a case file."""


def investigate(case_data: dict) -> dict:
    """
    Run a multi-step LLM reasoning chain over case evidence,
    returning an investigation summary and suggested next actions.

    TODO:
    - Use LangChain ReAct agent or OpenAI Assistants with tools:
        * search_similar_cases
        * check_suspect_history
        * cross_reference_locations
    """
    return {
        "case_number": case_data.get("case_number"),
        "summary": "Investigation agent stub — LLM integration pending",
        "suggested_actions": [],
        "confidence": 0.0,
    }
