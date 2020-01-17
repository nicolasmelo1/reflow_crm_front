import { Provider } from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { initStore } from '../redux/store';
import React from 'react';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

class MyApp extends App {
   
    static async getInitialProps({ Component, ctx }) {
        const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
        return {pageProps};
    }

    render() {
        const { Component, pageProps, store } = this.props;
        return (
        <Provider store={store}>
            <PersistGate persistor={persistStore(store)}>
                <Component {...pageProps} />
            </PersistGate>
        </Provider>
        );
    }
}


export default withRedux(initStore, { debug: false })(MyApp)