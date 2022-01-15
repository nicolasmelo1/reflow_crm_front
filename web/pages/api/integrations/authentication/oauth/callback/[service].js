import integrations from '../../../../../../../shared/utils/integrations'

export default function handler(req, res) {
    integrations().handleIntegrationOAuthCallback(req.query.service, req.query)
    res.status(200).send(
        '<script>window.close()</script>'
    )
}
