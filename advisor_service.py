class AdvisorService:
    def __init__(self):
        # Default mock slabs (TANGEDCO / general Indian step-up style)
        # Format: (upper_limit, rate_per_unit)
        self.default_slabs = [
            (200, 3.0),
            (400, 4.5),
            (500, 6.0),
            (float('inf'), 9.0)
        ]

    def check_slab_warning(self, current_consumption_kwh: float, slabs=None):
        """
        Acts as a Financial Advisor. Checks if the user is close to a higher tariff bracket.
        """
        if slabs is None:
            slabs = self.default_slabs

        # Find the current slab
        current_rate = 0
        next_threshold = None
        next_rate = None

        for limit, rate in slabs:
            if current_consumption_kwh <= limit:
                current_rate = rate
                next_threshold = limit
                # Find the rate of the next slab
                idx = slabs.index((limit, rate))
                if idx + 1 < len(slabs):
                    next_rate = slabs[idx + 1][1]
                break
        
        # If we are in the highest slab, there is no 'next' threshold
        if next_threshold == float('inf') or not next_rate:
            return {"active": False, "message": "You are in the maximum tariff bracket."}

        units_away = next_threshold - current_consumption_kwh

        # If within 10 units of the next bracket
        if 0 < units_away <= 10:
            return {
                "active": True,
                "visual_state": "CRITICAL_GOLD",
                "nudge": f"Alert! You are {units_away:.1f} units away from the ₹{next_rate}/unit bracket. Switch to Solar-only mode for the next 2 days to keep your bill at the lower rate!",
                "current_rate": current_rate,
                "next_rate": next_rate,
                "units_away": units_away
            }
        
        return {
            "active": False,
            "message": f"You are safely in the ₹{current_rate}/unit bracket. ({units_away:.1f} units until next slab)"
        }
