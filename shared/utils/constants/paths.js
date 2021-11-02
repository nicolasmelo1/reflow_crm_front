import { companyId } from '../agent/utils'


/**
 * Since usually paths to navigate to are constants we define them here.
 * THey are defined as functions so we can pass parameters.
 * 
 * It's important to understand paths represents two things and they are usually opposite:
 * 1 - A simple url path
 * 2 - The React navigation path based for this component, with this we can navigate easily in React Native with urls
 *     like we navigate in Next.js.
 * 
 * @returns {Object} - It must ALWAYS follow the following structure: 
 * {
 *      asUrl: '/notifications',
 *      adminOnly: false,
 *      webOnly: false,
 *      loginOnly: false,
 *      asReactNavigationPath: {
 *          root: 'notifications',
 *          nested: {}
 *      }
 * }
 * 
 * "asReactNavigationPath.nested" - are the second argument of the navigate function, so it should follow the react navigation docs for nested:
 *  {
 *      screen: 'Settings',
 *      params: {
 *          screen: 'Sound',
 *          params: {
 *              screen: 'Media',
 *          },
 *      }
 *  }
 * 
 * 
 * Reference for React Navigation docs: https://reactnavigation.org/docs/nesting-navigators/#navigating-to-a-screen-in-a-nested-navigator
 */
const paths = {
    empty() {
        return { 
            asUrl: '/',
            adminOnly: false,
            webOnly: false,
            loginOnly: false,
            asReactNavigationPath: {
                root: '',
                nested: {}
            }
        }
    },
    login() {
        return { 
            asUrl: '/login',
            adminOnly: false,
            webOnly: false,
            loginOnly: false,
            asReactNavigationPath: {
                root: 'login',
                nested: {}
            }
        }
    },
    onboarding() {
        return { 
            asUrl: '/onboarding',
            adminOnly: false,
            webOnly: false,
            loginOnly: false,
            asReactNavigationPath: {
                root: 'onboarding',
                nested: {}
            }
        }
    },
    changepassword() {
        return { 
            asUrl: '/changepassword',
            adminOnly: false,
            webOnly: false,
            loginOnly: false,
            asReactNavigationPath: {
                root: 'changepassword',
                nested: {}
            }
        }
    },
    home(form) {
        return { 
            asUrl: form ? `/home/${form}` : `/home/[form]`,
            adminOnly: false,
            webOnly: false,
            loginOnly: true,
            asReactNavigationPath: {
                root: 'home',
                nested: {}
            }
        }
    },
    apiDocumentation() {
        return { 
            asUrl: '/documentation/api',
            adminOnly: false,
            webOnly: false,
            loginOnly: true,
            asReactNavigationPath: {
                root: 'documentation',
                nested: {
                    screen: 'api',
                }
            }
        }
    },
    notifications() {
        return { 
            asUrl: '/notifications',
            adminOnly: false,
            webOnly: false,
            loginOnly: true,
            asReactNavigationPath: {
                root: 'navigation',
                nested: {}
            }
        }
    },
    billing() {
        return { 
            asUrl: '/settings/billing',
            adminOnly: true,
            webOnly: true,
            loginOnly: true,
            asReactNavigationPath: {
                root: '',
                nested: {}
            }
        }
    },
    users() {
        return { 
            asUrl: '/settings/users',
            adminOnly: true,
            webOnly: false,
            loginOnly: true,
            asReactNavigationPath: {
                root: 'configurations',
                nested: {
                    screen: 'users'
                }
            }
        }
    },
    company() {
        return {
            asUrl: '/settings/company',
            adminOnly: true,
            webOnly: false,
            loginOnly: true,
            asReactNavigationPath: {
                root: 'configurations',
                nested: {
                    screen: 'company'
                }
            }
        }
    },
    templates() {
        return {
            asUrl: '/settings/template',
            adminOnly: true,
            webOnly: false,
            loginOnly: true,
            asReactNavigationPath: {
                root: 'configurations',
                nested: {
                    screen: 'template'
                }
            }
        }
    },
    pdfTemplatesSettings(form) {
        return {
            asUrl: form ? `/pdf_generator/${form}` : `/pdf_generator/[form]`,
            adminOnly: false,
            webOnly: false,
            loginOnly: true,
            asReactNavigationPath: {
                root: 'home',
                nested: {}
            }
        }
    },
    pdfTemplates(form, formDataId) {
        return {
            asUrl: form && formDataId ? `/pdf_generator/${form}/${formDataId}` : `/pdf_generator/[form]/[formDataId]`,
            adminOnly: false,
            webOnly: false,
            loginOnly: true,
            asReactNavigationPath: {
                root: 'home',
                nested: {}
            }
        }
    },
    publicFormulary(form) {
        return { 
            asUrl: form && companyId ? `/public/form/${companyId}/${form}` : `/public/form/[companyId]/[form]`,
            adminOnly: false,
            webOnly: false,
            loginOnly: false,
            asReactNavigationPath: {
                root: 'public',
                nested: {
                    screen: 'form'
                }
            }
        }
    },
}

const pathsAsArray = Object.getOwnPropertyNames(paths).map(functionName => paths[functionName]())

export { paths, pathsAsArray }