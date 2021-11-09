import formidable from 'formidable'
import agent from '@web/utils/agent'
const { apiHandler } = require('@web/utils/api')

export const config = {
    api: {
        bodyParser: false
    }
}

/**
 * Upload a new draft file in the database, used for saving files in the database.
 */
const DraftController = {
    post: async (req, res, headers) => {
        const form = formidable({ multiples: true })
        try {
            const response = await new Promise((resolve, reject) => {
                form.parse(req, async (err, fields, files) => {
                    const firstFileName = Object.keys(files)[0]
                    if (firstFileName) {
                        try {
                            const response = await agent.createDraft(req.query.companyId, files[firstFileName], headers)
                            resolve(response)
                        } catch (e) {
                            reject(e)
                        }
                    } else {
                        reject('no_file_found')
                    }
                })
            })
            res.status(200).json(response.data)
        } catch (e) {
            if (e === 'no_file_found') {
                res.status(403).json({
                    status: 'error',
                    error: {
                        reason: 'no_file_found'
                    }
                })
            } else {
                res.status(e.response.status).json({
                    status: 'error',
                    error: {
                        reason: e.response?.data?.reason
                    }
                })
            }
        }        
    } 
}

export default apiHandler(DraftController)