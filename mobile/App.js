
import React, { useState, useEffect } from 'react'
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { initStore } from '@shared/redux/store'
import { NavigationContainer } from '@react-navigation/native'
import  { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Data from './pages/data'
import Navbar from '@shared/components/Navbar'
import Layout from '@shared/components/Layout'
import Login from '@shared/components/Login'
import { AsyncStorage, Text } from 'react-native'


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
        } else {
            const Tab = createBottomTabNavigator()
            return (
                <Navbar Tab={Tab} HomeComponent={Data}/>
            )
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
                <NavigationContainer>
                    {getComponent()}
                </NavigationContainer>
            </PersistGate>
        </Provider>
    )
}


export default App
