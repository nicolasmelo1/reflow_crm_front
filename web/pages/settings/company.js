import React from 'react'
import { Layout, Company } from '@shared/components'
import Header from '../../components/Header'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class CompanyPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render = () => {
        return (
            <Layout header={<Header title={'Empresa'}/>}>
                <Company/>
            </Layout>
        )
    }

    
}

export default CompanyPage