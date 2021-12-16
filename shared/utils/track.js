export const trackOpenedOnboarding = () => {
    if (process.env['APP'] === 'web' && process.env.NODE_ENV==='production' && window.fbq !== undefined) {
        try {
            window.fbq('track', 'Lead')
        } catch (e) {}
    }
}

export const trackFinishedOnboardingProcess = () => {
    if (process.env['APP'] === 'web' && window.lintrk && process.env.NODE_ENV==='production' && window.fbq !== undefined) {
        try {
            window.lintrk('track', { 
                conversion_id: 6503801 
            })
            window.fbq('track', 'CompleteRegistration')
        } catch (e) {}
    }
}