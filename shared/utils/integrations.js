import config, { FRONT_END_HOST } from '../config'
import axios from 'axios'
import agent from './agent'

const integrations = () => {
    const integrationsToAuthenticate = []

    const serviceNameByUrls = {
        'google_sheets': `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=63386062001-id1pq8bk96mo43fkg4r0e2n12ebi2mnu.apps.googleusercontent.com&redirect_uri=${FRONT_END_HOST.slice(0, -1)}/integrations/authentication/oauth/callback/${'google_sheets'}&scope=https://www.googleapis.com/auth/spreadsheets&access_type=offline&include_granted_scopes=true`
    }

    return {
        addIntegrationToAuthenticate: (appName) => {
            if (!integrationsToAuthenticate.includes(appName)) {
                integrationsToAuthenticate.push(appName)
            }
        },
        authenticateOnIntegrations: () => {
            integrationsToAuthenticate.forEach(appName => {
                const url = serviceNameByUrls[appName]
                window.open(url, '_blank')
            })
        },
        handleIntegrationOAuthCallback: async (serviceName, queryData) => {
            switch (serviceName) {
                case 'google_sheets':
                    if (queryData.code) {
                        const code = queryData.code
                        const url = `https://oauth2.googleapis.com/token`
                        const clientId = config.GOOGLE_SHEETS_CLIENT_ID
                        const clientSecret = config.GOOGLE_SHEETS_CLIENT_SECRET
                        const params = new URLSearchParams()
                        params.append('code', code)
                        params.append('client_id', clientId)
                        params.append('client_secret', clientSecret)
                        params.append('grant_type', 'authorization_code')
                        params.append('redirect_uri', `${FRONT_END_HOST.slice(0, -1)}/integrations/authentication/oauth/callback/${'google_sheets'}`)
                        const response = await axios.post(url, params)
                        await agent.http.INTEGRATION.createIntegration(serviceName, {
                            access_token: response.data.access_token,
                            refresh_token: response.data.refresh_token,
                            secret_token: null,
                            extra_data: JSON.stringify({
                                expires_in: response.data.expires_in,
                                code: code,
                                client_id: clientId,
                                client_secret: clientSecret,
                                scope: response.data.scope
                            })
                        })
                    }
                    break
            }
        }
    }
}


export default integrations