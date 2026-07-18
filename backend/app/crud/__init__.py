"""
crud package — re-exports all CRUD functions.
Any router can do: from app.crud import create_case, get_accused_by_case, etc.
"""
from app.crud.state    import get_states, get_state, create_state           # noqa: F401
from app.crud.district import get_districts, get_district, create_district  # noqa: F401
from app.crud.employee import get_employees, get_employee, create_employee  # noqa: F401
from app.crud.case     import (                                              # noqa: F401
    get_cases, get_case, get_case_by_number,
    create_case, update_case, delete_case,
)
from app.crud.victim   import (                                              # noqa: F401
    get_victims_by_case, get_victim,
    create_victim, update_victim, delete_victim,
)
from app.crud.accused  import (                                              # noqa: F401
    get_accused_by_case, get_accused, search_accused_by_name,
    create_accused, update_accused, delete_accused,
)
