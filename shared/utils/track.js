export const trackOpenedOnboarding = () => {
    if (process.env['APP'] === 'web' && process.env.NODE_ENV==='production') {
        fbq('track', 'Lead')
    }
}

export const trackFinishedOnboardingProcess = () => {
    if (process.env['APP'] === 'web' && window.lintrk && process.env.NODE_ENV==='production') {
        window.lintrk('track', { 
            conversion_id: 6503801 
        })
        fbq('track', 'CompleteRegistration')
    }
}