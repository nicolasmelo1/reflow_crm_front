import React from 'react';
import * as Linking from 'expo-linking'
import { paths } from '@shared/utils/constants'

export const navigationRef = React.createRef();

const checkUrl = (url) => {
    if (url) {
        for (let i =0; i<Object.getOwnPropertyNames(paths).length; i++) {
            const slugUrl = paths[Object.getOwnPropertyNames(paths)[i]]().replace(/^\//g, '')
            if (url === '' && url === slugUrl) {
                return {isValid: true, params: {}, urlName: Object.getOwnPropertyNames(paths)[i]}
            }
            if (slugUrl !== '') {
            // substitute all of the parameters in [] to \w+ so we can validate
                const regexToTest = new RegExp(slugUrl.replace(/\[\w+\]/g, '(.*)'))
                const regexForVariables = new RegExp(slugUrl.replace(/\[\w+\]/g, '\\[(.*)\\]'))
                const urlVariableNames = slugUrl.match(regexForVariables)
                urlVariableNames.splice(0, 1)

                if (regexToTest.test(url)) {
                    const urlVariables = url.match(regexToTest)
                    urlVariables.splice(0, 1)
                    let urlParams = {}
                    urlVariableNames.forEach((name, index)=> {
                        urlParams[name] = urlVariables[index]
                    })
                    return {isValid: true, params: urlParams, urlName: Object.getOwnPropertyNames(paths)[i]}
                }
            }
        }
    }
    return { isValid: false, params: {}}
}

// okay, so this might be kinda tricky, but this conforms with your paths in @shared/utils/constants/paths
// With this your Screens NEED to be on lowercase, with this we can easily navigate between screens. The name
// of the screen you want to open when the user access a certain url must be conformed and defined in apps.
// you can send parameters if you want to the url. See next.js documentation for details. But anyway, parameters
// in the url MUST be between `[]` with the web version of the app.
export const handleNavigation = (links) => {
    if (links) {
        const parsedLink = Linking.parse(links)
        const { isValid, params, urlName } = checkUrl(parsedLink.path)
        if (isValid) {
            const parameters = Object.assign(params, parsedLink.queryParams)
            try {
                navigationRef.current?.navigate(urlName, parameters)
            } catch {}
        }
    }
}