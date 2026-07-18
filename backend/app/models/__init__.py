"""
models package — re-exports every ORM class so existing imports
like `from app.models import CaseMaster` continue to work unchanged.

Import ORDER matters: tables that are referenced by FK must be imported first
so SQLAlchemy registers them before the dependent model is mapped.
"""

# Enums (kept for now — not used by active models but not removed yet)
from app.models.enums import CaseStatus, EmployeeRole, Gender, AccusedStatus  # noqa: F401

# Independent lookup tables
from app.models.casestatus   import CaseStatusLookup  # noqa: F401
from app.models.crimehead    import CrimeHead          # noqa: F401
from app.models.crimesubhead import CrimeSubHead       # noqa: F401

# Core tables (FK dependencies: State → District → Employee → CaseMaster)
from app.models.state    import State     # noqa: F401
from app.models.district import District  # noqa: F401
from app.models.employee import Employee  # noqa: F401

# Dependent tables
from app.models.case    import CaseMaster  # noqa: F401
from app.models.victim  import Victim      # noqa: F401
from app.models.accused import Accused     # noqa: F401
