import agent from '@web/utils/agent'
const { apiHandler } = require('@web/utils/api')

// The actual controller from the API request.
const APIController = {
    post: async (req, res, headers) => {
        try {
            const response = await agent.API.createRecord(req.query.companyId, req.query.form, req.body, headers)
            res.status(200).json(response.data)
        } catch (e) {
            if (e.response?.data?.error?.reason) {
                res.status(e.response.status).json({
                    status: 'error',
                    error: {
                        reason: e.response.data.error.reason,
                        description: e.response?.data?.error?.description !== undefined ? e.response.data.error.description : null
                    }
                })
            } else if (e.response?.data?.reason) {
                res.status(e.response.status).json({
                    status: 'error',
                    error: {
                        reason: e.response?.data?.reason
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

/**
 * Acts as a middle man between the client and the server, this is used to control the requests that are sent to the server without
 * passing to the server directly. This supposedly will save resources from the backend and also will keep the API simple.
 *  
 * @param {next.NextApiRequest} req - The request object recieved from next, really similar to a express request object.
 * @param {next.NextApiResponse} res - The response object from next, really similar to a express response object. 
 */
export default apiHandler(APIController)

