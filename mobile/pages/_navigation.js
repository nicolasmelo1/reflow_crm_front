import React from 'react';
import * as Linking from 'expo-linking'
import { paths, pathsAsArray } from '@shared/utils/constants/paths'

export const navigationRef = React.createRef();

/**
 * 
 * @param {*} object 
 */
const getParameters = (object) => {
    if (object.params) {
        const { screen, params, ...otherParams } = object.params
        if (Object.keys(otherParams).length !== 0) {
            return {
                screen: object.screen,
                params: otherParams
            }
        } 
    }
    return {
        screen: object.screen
    }
}

/**
 * Reference here: https://stackoverflow.com/questions/37382011/get-last-item-of-nested-object 
 * @param {*} object 
 */
function destructureNestedAndConstructAppendingParams(nested, params){
    if (Object.keys(nested).length === 0) {
        return params
    }
    // destructuring
    const nestedElementsArray = []
    nestedElementsArray.push(getParameters(nested))
    while (nested.params) {
        nested = nested.params
        if (nested.screen) {
            nestedElementsArray.push(getParameters(nested))
        }
    }

    nestedElementsArray.reverse()

    // structuring
    let newNestedWithParams = {}
    for (let index=0; index < nestedElementsArray.length; index++) {
        if (index === 0) {
            let object = {
                screen: nestedElementsArray[index].screen,
                params: {
                    ...nestedElementsArray[index].params,
                    ...params
                }
            }
            newNestedWithParams = {...object}
        } else {
            newNestedWithParams = {
                screen: nestedElementsArray[index].screen,
                params: {
                    ...nestedElementsArray[index].params,
                    ...newNestedWithParams
                }
            }
        }
    }
    return newNestedWithParams
}

const checkUrl = (url) => {
    if (url) {
        for (let i =0; i<Object.getOwnPropertyNames(paths).length; i++) {
            const path = paths[Object.getOwnPropertyNames(paths)[i]]()
            const urlPath = path.asUrl.replace('/', '')
            const urlRegex = new RegExp(urlPath.replace(/\[\w+\]/g, String.raw`\w+`))
        
            if (url === urlPath || (urlPath !== '' && urlRegex.test(url))) {
                const regexToTest = new RegExp(urlPath.replace(/\[\w+\]/g, '(.*)'))
                const regexForVariables = new RegExp(urlPath.replace(/\[\w+\]/g, '\\[(.*)\\]'))
                const urlVariableNames = urlPath.match(regexForVariables)
                urlVariableNames.splice(0, 1)

                if (regexToTest.test(url)) {
                    const urlVariables = url.match(regexToTest)
                    urlVariables.splice(0, 1)
                    let urlParams = {}
                    urlVariableNames.forEach((name, index)=> {
                        urlParams[name] = urlVariables[index]
                    })
                    return {isValid: true, params: urlParams, pathData: path}
                }
            }
        }
    }
    return { isValid: false, params: {}}
}

/**
 * With this we can actually move trough the app with urls and not with the default
 * navigation. With this it becomes a lot easier for us to create urls that work on mobile
 * and also on desktop.
 * 
 * @param {*} links 
 * @param {*} isAuthenticated 
 */
export const handleNavigation = (links, isAuthenticated) => {
    if (links) {
        const parsedLink = Linking.parse(links)
        const { isValid, params, pathData } = checkUrl(parsedLink.path)
        if (isValid) {
            const parameters = Object.assign(params, parsedLink.queryParams)
            const root = pathData.asReactNavigationPath.root
            const nested = destructureNestedAndConstructAppendingParams(pathData.asReactNavigationPath.nested || {}, parameters)
            console.log(parameters)
            if (pathData.loginOnly && isAuthenticated || !pathData.loginOnly && !isAuthenticated) {
                navigationRef.current.navigate(root)
                // we actually use this to prevent a small bug from happening
                // this bug happens when we load the url from outside the app
                // it doesn't show the goback button to the initial navigation screen
                if (Object.keys(nested).length !== 0) {
                    navigationRef.current.navigate(root, nested)
                }
            } 
        }
    }
}