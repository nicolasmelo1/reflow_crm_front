import React from 'react'
import {RichText, Layout} from '@shared/components'
import { withRouter } from 'next/router'
import Header from '../../components/Header'

class RichTextTestPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Layout hideNavBar={true} header={<Header title={'TEST RICH TEXT'}/>}>
                <RichText/>
            </Layout>
        )
    }
}


export default withRouter(RichTextTestPage)
