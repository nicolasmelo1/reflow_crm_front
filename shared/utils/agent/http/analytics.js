import requests from "../requests"


const ANALYTICS = {
    trackUserStartedOnboarding: async (visitorId) => {
        return await requests.post(`analytics/track/user_started_onboarding/`, {visitor_id: visitorId})
    }
}

export default ANALYTICS