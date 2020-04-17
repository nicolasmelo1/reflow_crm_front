import React from 'react';
import { Provider } from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { initStore } from '@shared/redux/store';


class MyApp extends App {

    // You might want to check this https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    // we need this for the formulary height that was causing some bugs on chrome on android phones.
    appHeight = () => document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)

    componentDidMount() {
        window.addEventListener('resize', this.appHeight)
        this.appHeight()
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