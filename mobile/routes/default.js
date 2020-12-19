import React, { useState } from 'react'
import Navbar from '@shared/components/Navbar'
import  { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Data from '../pages/data'
import Notification from '../pages/notification'
import ConfigurationRoute from './configuration'
import { HomeToolsMenuContext } from '../contexts'
import HomeRoutes from './home'

const MainRoutes = (props) => {
    const Tab = createBottomTabNavigator()
    const [isHomeToolsMenuOpen, setIsHomeToolsMenuOpen] = useState(false)

    return (
        <HomeToolsMenuContext.Provider value={{
            isHomeToolsMenuOpen: isHomeToolsMenuOpen,
            setIsHomeToolsMenuOpen: setIsHomeToolsMenuOpen
        }}>
            <Navbar 
            Tab={Tab} 
            isHomeToolsMenuOpen={isHomeToolsMenuOpen}
            setIsHomeToolsMenuOpen={setIsHomeToolsMenuOpen}
            HomeComponent={HomeRoutes}
            NotificationComponent={Notification}
            ConfigurationComponent={ConfigurationRoute}
            />
        </HomeToolsMenuContext.Provider>
    )
}

export default MainRoutes