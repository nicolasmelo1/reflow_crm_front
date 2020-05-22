import React, { useState } from 'react'
import { AuthenticationContext } from '../contexts'
import { getAsync, NOTIFICATIONS } from 'expo-permissions'
import Constants from 'expo-constants'
import { AsyncStorage, Platform, Vibration } from 'react-native'
import { Notifications } from 'expo'
import { handleNavigation } from './_navigation.js';
import * as Linking from 'expo-linking'
import { LoginRoutes, MainRoutes } from '../routes'
import { useEffect } from 'react'


const Main = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const registerForPushNotificationsAsync = async () => {
        const { status: existingStatus } = await getAsync(NOTIFICATIONS)
        let finalStatus = existingStatus
        if (existingStatus !== 'granted') {
            const { status } = await askAsync(NOTIFICATIONS)
            finalStatus = status
        }
        if (finalStatus !== 'granted') {
            if (__DEV__) {
                console.log('Failed to get push token for push notification!')
            }
            return
        }
    
        if (Platform.OS === 'android') {
            Notifications.createChannelAndroidAsync('default', {
                name: 'default',
                sound: true,
                priority: 'max',
                vibrate: [0, 250, 250, 250],
            })
        }
        Notifications.getExpoPushTokenAsync().then(token => {
            if (token) {
            }
        }).catch(() => {})
    }
    
    const handleNotification = notification => {
        Vibration.vibrate()
    }
    
    const getComponent = () => {
        if (!isAuthenticated) {
            return <LoginRoutes />
        } else {
            return <MainRoutes/>
        }
    }
    
    AsyncStorage.getItem('token').then(token=> {
        if (!token || token === '') {
            setIsAuthenticated(false)
        } else {
            setIsAuthenticated(true)
            if (Constants.isDevice) {
                registerForPushNotificationsAsync()
                Notifications.addListener(handleNotification);
            }
        }
    })

    useEffect(() => {
        Linking.addEventListener('url', (e) => {
            handleNavigation(e.url)
        })
        Linking.getInitialURL().then(response => {
            handleNavigation(response)
        })
        return () => {
            Linking.removeEventListener('url')
        }
    }, [])

    return (
        <AuthenticationContext.Provider value={{
            isAuthenticated: isAuthenticated,
            setIsAuthenticated: setIsAuthenticated
        }}>
            {getComponent()}
        </AuthenticationContext.Provider>
    )
}

export default Main
