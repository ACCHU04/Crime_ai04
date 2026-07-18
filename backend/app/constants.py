"""
Shared constants — case status names matching the casestatus lookup table.

Always use these instead of hardcoding status strings in services/routers.
"""

STATUS_UNDER_INVESTIGATION = "Under Investigation"
STATUS_CHARGESHEET_FILED   = "Chargesheet Filed"
STATUS_CLOSED              = "Closed"
STATUS_PENDING_TRIAL       = "Pending Trial"
STATUS_CONVICTED          = "Convicted"
STATUS_ACQUITTED          = "Acquitted"
