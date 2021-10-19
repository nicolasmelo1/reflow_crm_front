const agent = require('@web/utils/agent')

const APIController = {
    post: async (req, res) => {
        try {
            const response = await agent.API.createRecord(req.query.companyId, req.query.form, req.body)
            res.status(200).json({
                status: 'ok'
            })
        } catch (e) {
            if (e.response?.data?.error?.reason) {
                res.status(e.response.statusCode).json({
                    status: 'error',
                    error: {
                        reason: e.response.data.error.reason
                    }
                })
            } else {
                res.status(403).json({
                    status: 'error',
                    error: {
                        reason: 'Unknown'
                    }
                })
            }
        }
    }
}

export default async function handler(req, res) {
    const methodHandler = APIController[req.method.toLowerCase()]
    if (methodHandler) {
        await methodHandler(req, res)
    } else {
        res.status(405).json({
            'status': 'error',
            'error': {
                'reason': 'method_not_allowed'
            }
        })
    }  
}

