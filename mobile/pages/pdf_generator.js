import React, { useContext } from 'react'
import Layout from '@shared/components/Layout'
import { View } from 'react-native'
import PDFGenerator from '@shared/components/PDFGenerator'
import { AuthenticationContext } from '../contexts'

const PDFGeneratorPage = (props) => {
    const authentication = useContext(AuthenticationContext)

    return (
        <Layout navigation={props.navigation} setIsAuthenticated={authentication.setIsAuthenticated}>
            <View>
                <PDFGenerator />
            </View>
        </Layout>
    )
}

export default PDFGeneratorPage