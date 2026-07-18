"""
schemas package — re-exports all Pydantic schemas.
Any router can do: from app.schemas import CaseOut, AccusedCreate, etc.
"""
from app.schemas.state    import StateBase, StateCreate, StateOut          # noqa: F401
from app.schemas.district import DistrictBase, DistrictCreate, DistrictOut  # noqa: F401
from app.schemas.employee import EmployeeBase, EmployeeCreate, EmployeeOut  # noqa: F401
from app.schemas.case     import CaseCreate, CaseUpdate, CaseOut            # noqa: F401
from app.schemas.victim   import VictimBase, VictimCreate, VictimUpdate, VictimOut    # noqa: F401
from app.schemas.accused  import AccusedBase, AccusedCreate, AccusedUpdate, AccusedOut  # noqa: F401
from app.schemas.analytics import (                                                     # noqa: F401
    APIResponse, wrap,
    DashboardStats, HotspotEntry, MonthlyTrend, CrimeTypeTrend,
    RepeatOffender, PendingCase,
    GraphNode, GraphEdge, GraphStats, GraphResult,
)
