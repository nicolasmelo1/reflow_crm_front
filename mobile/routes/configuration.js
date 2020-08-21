import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import ConfigurationPage from '../pages/configuration'
import UsersPage from '../pages/users'

const ConfigurationRoutes = (props) => {
    const Stack = createStackNavigator()

    return (
        <Stack.Navigator initialRouteName={'configuration'}>
            <Stack.Screen name={'configuration'} component={ConfigurationPage} options={{headerShown: false, title: 'Configurações'}}/>
            <Stack.Screen name={'users'} component={UsersPage} options={{title: 'Usuários', headerTintColor: '#0dbf7e'}}/>
        </Stack.Navigator>
    )
}

export default ConfigurationRoutes