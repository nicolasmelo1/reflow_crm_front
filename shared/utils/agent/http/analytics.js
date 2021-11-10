import requests from "../requests"


const ANALYTICS = {
    trackUserStartedOnboarding: async (visitorId) => {
        return await requests.post(`analytics/track/user_started_onboarding/`, {visitor_id: visitorId})
    },
    submitSurveyAnswer: async (surveyId, body) => {
        return await requests.post(`analytics/survey/${surveyId}/`, body)
    },
    retrieveSurvey: async (source, surveyId) => {
        return await requests.get(`analytics/survey/${surveyId}/`, {}, {}, source)
    },
}

export default ANALYTICS