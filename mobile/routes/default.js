import React from 'react'
import Navbar from '@shared/components/Navbar'
import  { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Data from '../pages/data'
import Notification from '../pages/notification'
import ConfigurationRoute from './configuration'

const MainRoutes = (props) => {
    const Tab = createBottomTabNavigator()

    return (
        <Navbar 
        Tab={Tab} 
        HomeComponent={Data}
        NotificationComponent={Notification}
        ConfigurationComponent={ConfigurationRoute}
        />
    )
}

export default MainRoutes