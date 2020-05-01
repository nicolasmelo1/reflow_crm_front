
import React, { useState, useEffect } from 'react'
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { initStore } from '@shared/redux/store'
import { NavigationContainer } from '@react-navigation/native'
import  { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Data from './pages/data'
import Notification from './pages/notification'
import Navbar from '@shared/components/Navbar'
import Layout from '@shared/components/Layout'
import Login from '@shared/components/Login'
import { AsyncStorage, Text, Platform, Vibration } from 'react-native'
import { Notifications } from 'expo'
import { getAsync, NOTIFICATIONS } from 'expo-permissions'
import Constants from 'expo-constants';

const App = (props) => {
    //const { Component, pageProps, store } = this.props
    const store = initStore()
    const [router, setRouter] = useState('login')
    
    registerForPushNotificationsAsync = async () => {
        if (Constants.isDevice) {
            const { status: existingStatus } = await getAsync(NOTIFICATIONS);
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await askAsync(NOTIFICATIONS);
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            token = await Notifications.getExpoPushTokenAsync();
            console.log(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }
    
        if (Platform.OS === 'android') {
            Notifications.createChannelAndroidAsync('default', {
                name: 'default',
                sound: true,
                priority: 'max',
                vibrate: [0, 250, 250, 250],
            });
        }
    };
    
    const handleNotification = notification => {
        Vibration.vibrate();
        console.log(notification);
    }
    
    const getComponent = () => {
        console.log('teste1')
        if (router === 'login') {
            return (
                <Layout setRouter={setRouter}>
                    <Login setRouter={setRouter}/>
                </Layout>
            )
        } else {
            const Tab = createBottomTabNavigator()
            console.log('teste2')

            return (
                <Navbar 
                Tab={Tab} 
                HomeComponent={Data}
                NotificationComponent={Notification}
                />
            )
        }
    }
    
    AsyncStorage.getItem('token').then(token=> {
        if (token === '') {
            //registerForPushNotificationsAsync()
            //Notifications.addListener(handleNotification);
            setRouter('login')
        } else {
            registerForPushNotificationsAsync()
            //Notifications.addListener(handleNotification);
        }
    })

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistStore(store)}>
                <NavigationContainer>
                    {getComponent()}
                </NavigationContainer>
            </PersistGate>
        </Provider>
    )
}


export default App