const agent = require('@web/utils/agent')

/**
 * This is used for extracting the headers or the token from the query params and append it
 * to the request we make to the backend.
 * 
 * The backend will only accept bearer tokens but since we use this as the middle man between the server and the client
 * we can accept stuff like query params for example.
 * 
 * @param {next.NextApiRequest} req - The actual request object recieved from the API.
 * @param {Object} headers - If you append something to the headers before running this function you can pass the headers here,
 * by default it create a new object to be used as headers
 * 
 * @returns {Object} - {
 *      secretToken: {String} - the secret token extracted from the request.,
 *      headers: {Object} - The actual headers object to be used in axios request
 * }
 */
const getAuthenticationTokenAndAppendToHeaders = (req, headers={}) => {
    let secretToken = ''
    if (req.headers['authorization']) {
        secretToken = req.headers['authorization'].replace(/^(Bearer )/g, req.headers['authorization'])
        headers = {
            ...headers,
            'Authorization': req.headers['authorization']
        }
    } else if (req.query['secret_token']) {
        secretToken = req.query['secret_token']
        headers = {
            ...headers,
            'Authorization': `Bearer ${req.query['secret_token']}`
        }
    }

    return {secretToken, headers}
}

/**
 * This is a function that retruns a new function, instead of creating global variables we create a new object while this 
 * function exists, the returned function will be enclosed, this make it more contained and i think that less error prone since
 * it is not a global variable.
 * 
 * We need to run this function outside the function call in a global variable, then the returned value will be a function 
 * this function can be used in your controllers. Example:
 * 
 * ```
 * const checkRateLimiting = rateLimitingGateway()
 * 
 * const APIController = {
 *      post: async (req, res) => {
 *          // code
 *         const { hasReachedRateLimiting, rateLimiting } = checkRateLimiting(req.url, secretToken)
 *          // code
 *      }
 * }
 * ```
 * 
 * @returns {Function} - The callback function to be used in your controllers
 */
const rateLimitingGateway = () => {
    // TODO: This should be handled by redis and not in memory here. Transfer this to redis only.
    const rateLimiting = {}

    return (path, method, secretToken) => {
        let isValidRequest = true
        if (rateLimiting[secretToken]) {
            const thisRequestDate = new Date()
            const isNewRequestBeingCalledInLessThanTenSeconds = (
                ((thisRequestDate - rateLimiting[secretToken].latestRequestDate)/1000) < 10
            )
            if (isNewRequestBeingCalledInLessThanTenSeconds) {
                if (rateLimiting[secretToken].requestCounter > 3) {
                    isValidRequest = false
                    rateLimiting[secretToken] = {
                        ...rateLimiting[secretToken],
                        latestRequestUrl: path,
                        latestRequestMethod: method,
                        requestCounter: rateLimiting[secretToken].requestCounter + 1
                    }
                } else {
                    rateLimiting[secretToken] = {
                        latestRequestDate: new Date(),
                        latestRequestUrl: path,
                        latestRequestMethod: method,
                        requestCounter: rateLimiting[secretToken].requestCounter + 1
                    }
                }
            } else {
                rateLimiting[secretToken] = {
                    latestRequestDate: new Date(),
                    latestRequestUrl: path,
                    latestRequestMethod: method,
                    requestCounter: 1
                }
            }
        } else {
            rateLimiting[secretToken] = {
                latestRequestDate: new Date(),
                latestRequestUrl: path,
                latestRequestMethod: method,
                requestCounter: 1
            }
        }

        return {
            hasReachedRateLimiting: !isValidRequest,
            rateLimiting: rateLimiting[secretToken]
        }
    }
}

const checkRateLimiting = rateLimitingGateway()

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
                        reason: e.response.data.error.reason
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
export default async function handler(req, res) {
    const methodHandler = APIController[req.method.toLowerCase()]
    const { secretToken, headers } = getAuthenticationTokenAndAppendToHeaders(req, {})
    const { hasReachedRateLimiting } = checkRateLimiting(req.url, req.method, secretToken)

    if (headers['Authorization'] === undefined) {
        res.status(401).json({
            status: 'error',
            error: {
                reason: 'secret_token_is_obligatory'
            }
        })
    } else if (hasReachedRateLimiting) {
        res.status(429).json({
            status: 'error',
            error: {
                reason: 'reached_rate_limiting'
            }
        })
    } else if (methodHandler === undefined) {
        res.status(405).json({
            status: 'error',
            error: {
                reason: 'method_not_allowed'
            }
        })
    } else {
        await methodHandler(req, res, headers)
    }
}

