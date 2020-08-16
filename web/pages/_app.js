import React from 'react';
import { Provider } from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { initStore } from '@shared/redux/store';
import agent from '@shared/utils/agent';
import strings from '@shared/utils/constants/strings'
import Alert from '@shared/components/Utils/Alert'
import SplashScreen from '../components/styles/SplashScreen'
import SplashLogo from '../components/styles/SplashLogo'

class MyApp extends App {

    constructor(props) {
        super(props)
        this.state = {
            showLogo: false,
            showSplashScreen: true,
            showSetPushNotificationAlert: false
        }
    }

    // You might want to check this https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    // we need this for the formulary height that was causing some bugs on chrome on android phones.
    appHeight = () => document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
    appWidth = () => document.documentElement.style.setProperty('--app-width', `${window.innerWidth}px`)
    
    setShowSetPushNotificationAlert = (data) => (this._ismounted) ? this.setState(state => state.showSetPushNotificationAlert = data) : null

    setAppDefaults = () => {
        this.appHeight()
        this.appWidth()
    }

    userIsLogged = () => {
        return window.localStorage.getItem('token') && window.localStorage.getItem('token') !== ''
    }

    registerServiceWorker = () => {
        if ((process.env.NODE_ENV==='production' || process.env.REGISTER_SW_IN_DEV_MODE) && typeof navigator !== 'undefined' && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).then(function (registration) {
                    // force the service worker to always update
                    registration.update()
                    //if(process.env.NODE_ENV !== 'production') {
                    console.log('SW registered: ', registration)
                    //}
                }).catch(function (registrationError) {
                    //if(process.env.NODE_ENV !== 'production') {
                    console.log('SW registration failed: ', registrationError)
                    //}
                })
            })
        }
    }

    canAskForNotification = () => window.Notification && Notification.permission !== "denied" && Notification.permission !== 'granted'

    askUserPermissionForNotification = async () => {
        const subscribePushManager = (serviceWorker) => serviceWorker.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: 'BGw7hx-ChfbFYuxBAsfAVaABLtzX93bdjMLIy7l2XYZO-jOofoIOvicKfXvhpM0K9TTDCOmBCRZYGyG5p42tcAg'})
        const createSubscriptionBodyToServer = (subscriptionData) => {
            return {
                endpoint: subscriptionData.endpoint,
                token: JSON.stringify(subscriptionData),
                push_notification_tag_type_name: 'web'
            }
        }

        if (typeof Notification !== 'undefined' && this.canAskForNotification()) {
            Notification.requestPermission().then(async consent=> {
                if (consent !== "granted") {
                    console.log('consent not granted')
                } else {
                    const serviceWorker = await navigator.serviceWorker.ready
                    const subscription = await serviceWorker.pushManager.getSubscription()

                    // subscribe and return the subscription, if the user has a subscription, unsubscribe
                    subscribePushManager(serviceWorker).then(subscription=> {
                        agent.http.LOGIN.registerPushNotification(createSubscriptionBodyToServer(subscription.toJSON())).then(response => {
                            if (response && response.status !== 200) {
                                subscription.unsubscribe()
                            }
                        })
                    }).catch(_=> {
                        // TODO: delete subscription based on endpoint
                        subscription.unsubscribe().then(_ => {
                            subscribePushManager(serviceWorker).then(subscription=> {
                                agent.http.LOGIN.registerPushNotification(createSubscriptionBodyToServer(subscription.toJSON())).then(response => {
                                    if (response && response.status !== 200) {
                                        subscription.unsubscribe()
                                    }
                                })
                            })
                        }).catch({})
                    })
                }
            })
        }
    }

    componentDidMount() {
        this._ismounted = true
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', this.setAppDefaults)
            this.setAppDefaults()
            this.registerServiceWorker()
            if (this.userIsLogged()) {
                setTimeout(() => {
                    if (this._ismounted) {
                        this.setState(state => state.showLogo = true)
                        if (this.canAskForNotification()) this.setShowSetPushNotificationAlert(true)
                    }
                }, 100)
        
                setTimeout(() => {
                    if (this._ismounted) this.setState(state => state.showSplashScreen = false)
                }, 2000)
            } else {
                setTimeout(() => {
                    if (this._ismounted) this.setState(state => state.showSplashScreen = false)
                })
            }
        }
    }

    componentWillUnmount = () => {
        this._ismounted = false
    }
    
    render() {
        const { Component, pageProps, store } = this.props
        return (
            <Provider store={store}>
                <PersistGate persistor={persistStore(store)}>
                    {this.state.showSplashScreen ? (
                        <SplashScreen>
                            <SplashLogo src="/complete_logo.png" showLogo={this.state.showLogo}/>
                        </SplashScreen>
                    ) : ''}
                    <Alert 
                    alertTitle={strings['pt-br']['notificationBrowserPermissionAlertTitle']}
                    alertMessage={strings['pt-br']['notificationBrowserPermissionAlertMessage']} 
                    show={this.state.showSetPushNotificationAlert} 
                    onHide={() => this.setShowSetPushNotificationAlert(false)} 
                    onAccept={() => {
                        this.setShowSetPushNotificationAlert(false)
                        this.askUserPermissionForNotification()
                    }}
                    onAcceptButtonLabel={strings['pt-br']['notificationBrowserPermissionAlertOkButton']}
                    />
                    <Component {...pageProps} />
                </PersistGate>
            </Provider>
        )
    }
}

export default withRedux(initStore, { debug: false })(MyApp)