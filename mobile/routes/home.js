import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import DataPage from '../pages/data'
import PDFGeneratorPage from '../pages/pdf_generator'
import CompanyPage from '../pages/company'
import TemplatePage from '../pages/template'

const HomeRoutes = (props) => {
    const Stack = createStackNavigator()

    return (
        <Stack.Navigator initialRouteName={'data'}>
            <Stack.Screen name={'data'} component={DataPage} options={{headerShown: false, title: 'Gestão'}}/>
            <Stack.Screen name={'pdf_generator'} component={PDFGeneratorPage} options={{title: 'Gerador de PDF', headerTintColor: '#0dbf7e'}}/>
        </Stack.Navigator>
    )
}

export default HomeRoutes