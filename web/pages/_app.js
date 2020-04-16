import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import {initStore} from '@shared/redux/store';

import reducer from '@shared/redux/reducers';
import storage from 'redux-persist/lib/storage'

/*
const initStore = (initialState = {}) => {
    const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    const enhancer = composeEnhancers(
        applyMiddleware(thunk),
    )
    const persistedReducer = persistReducer({
        key: 'primary',
        storage: storage,
        whitelist: ['login']
    }, reducer)

    const store = createStore(persistedReducer, initialState, enhancer)
    return store
}*/


class MyApp extends App {
    render() {
        const { Component, pageProps, store } = this.props
        console.log(process.env.APP)
        return (
            <Provider store={store}>
                <PersistGate persistor={persistStore(store)}>
                    <Component {...pageProps} />
                </PersistGate>
            </Provider>
        )
    }
}
console.log(process.env.APP)

export default withRedux(initStore, { debug: false })(MyApp)