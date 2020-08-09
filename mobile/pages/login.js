import React, { useState, useContext } from 'react'
import Layout from '@shared/components/Layout'
import Login from '@shared/components/Login'
import { AuthenticationContext } from '../contexts'

const LoginPage = (props) => {
    const [addTemplates, setAddTemplates] = useState(false) 
    const authentication = useContext(AuthenticationContext)

    return (
        <Layout setIsAuthenticated={authentication.setIsAuthenticated} isNotLogged={true} addTemplates={addTemplates}>
            <Login setIsAuthenticated={authentication.setIsAuthenticated} setAddTemplates={setAddTemplates}/>
        </Layout>
    )
}

export default LoginPage