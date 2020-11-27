import React from 'react'
import {PDFGenerator, Layout} from '@shared/components'
import { withRouter } from 'next/router'
import Header from '../../components/Header'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class PDFGeneratorPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render = () => {
        return (
            <Layout hideNavBar={true} header={<Header title={'TEST RICH TEXT'}/>}>
                <PDFGenerator/>
            </Layout>
        )
    }
}

export default PDFGeneratorPage