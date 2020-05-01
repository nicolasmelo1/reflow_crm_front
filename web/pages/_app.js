import React from 'react';
import { Provider } from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { initStore } from '@shared/redux/store';
import agent from '@shared/redux/agent';

class MyApp extends App {

    // You might want to check this https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    // we need this for the formulary height that was causing some bugs on chrome on android phones.
    appHeight = () => document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)

    createSubscriptionBodyToServer = (subscriptionData) => {
        return {
            endpoint: subscriptionData.endpoint,
            token: JSON.stringify(subscriptionData),
            push_notification_tag_type: 'web'
        }
    }

    registerServiceWorker = () => {
        if (typeof navigator !== 'undefined' && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).then(function (registration) {
                    // force the service worker to always update
                    registration.update()
                    if(process.env.NODE_ENV !== 'production') {
                        console.log('SW registered: ', registration)
                    }
                }).catch(function (registrationError) {
                    if(process.env.NODE_ENV !== 'production') {
                        console.log('SW registration failed: ', registrationError)
                    }
                })
            })
        }
    }

    subscribePushManager = (serviceWorker) => {
        return serviceWorker.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: 'BGw7hx-ChfbFYuxBAsfAVaABLtzX93bdjMLIy7l2XYZO-jOofoIOvicKfXvhpM0K9TTDCOmBCRZYGyG5p42tcAg'})
    }

    askUserPermissionForNotification = async () => {
        return Notification.requestPermission().then(async consent=> {
            if (consent !== "granted") {
                console.log('consent not granted')
            } else {
                const serviceWorker = await navigator.serviceWorker.ready;
                const subscription = await serviceWorker.pushManager.getSubscription()
                if (subscription === null || process.env.NODE_ENV !== 'production') {
                    // subscribe and return the subscription, if the user has a subscription, uns
                    this.subscribePushManager(serviceWorker).then(subscription=> {
                        agent.LOGIN.registerPushNotification(this.createSubscriptionBodyToServer(subscription.toJSON()))
                    }).catch(_=> {
                        // TODO: delete subscription based on endpoint
                        subscription.unsubscribe().then(_ => {
                            this.subscribePushManager(serviceWorker).then(subscription=> {
                                agent.LOGIN.registerPushNotification(this.createSubscriptionBodyToServer(subscription.toJSON()))
                            })
                        }).catch({})
                    })
                }
            }
        })
    }

    componentDidMount() {
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', this.appHeight)
            this.appHeight()
            this.registerServiceWorker()
            if (window.localStorage.token && window.localStorage.token !== '') {
                this.askUserPermissionForNotification()
            }
        }
    }

 

    render() {
        const { Component, pageProps, store } = this.props
        return (
            <Provider store={store}>
                <PersistGate persistor={persistStore(store)}>
                    <Component {...pageProps} />
                </PersistGate>
            </Provider>
        )
    }
}

export default withRedux(initStore, { debug: false })(MyApp)