
import React, { useState, useEffect } from 'react'
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { initStore } from '@shared/redux/store'
import Layout from '@shared/components/Layout'
import Login from '@shared/components/Login'
import { Text, AsyncStorage } from 'react-native'


const App = (props) => {
    //const { Component, pageProps, store } = this.props
    const store = initStore()

    const [router, setRouter] = useState('login')

    const getComponent = () => {
        if (router === 'login') {
            return (
                <Layout setRouter={setRouter}>
                    <Login setRouter={setRouter}/>
                </Layout>
            )
        } else if (router === 'data') {
            return (
                <Layout showSideBar={true} setRouter={setRouter}>
                    <Text>Teste</Text>
                </Layout>
            )
        } else {
            return null
        }
    }

    useEffect(() => {
        AsyncStorage.getItem('token').then(token=> {
            if (token !== '') {
                setRouter('data')
            }
        })
    }, [])

    return (
        <Provider store={store}>
            <PersistGate persistor={persistStore(store)}>
                {getComponent()}
            </PersistGate>
        </Provider>
    )
}


export default App
