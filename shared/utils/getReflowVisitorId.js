/**
 * You need to check reflow_tracking project that is the script we embed in the reflow website to track the user
 * before he becomes a user of reflow.
 * 
 * Since the cookie lives in the browser of the user, this is used so we retrieve the original visitor id
 */
const getReflowVisitorId = () => {
    if (process.env['APP'] === 'web') {
        console.log(process.env['REFLOW_VISITOR_ID_COOKIE_KEY'])
        const reflowVisitorIdRegex = new RegExp(`${process.env['REFLOW_VISITOR_ID_COOKIE_KEY']}=[0-9A-z\-]+`)
        
        const matchedVisitorIdInCookie = document.cookie.match(reflowVisitorIdRegex)

        const generatedUserId = matchedVisitorIdInCookie !== null && matchedVisitorIdInCookie.length > 0 ? 
            matchedVisitorIdInCookie[0].replace(`${process.env['REFLOW_VISITOR_ID_COOKIE_KEY']}=`, '') : ''
        return generatedUserId
    }
    return ''
}

export default getReflowVisitorId