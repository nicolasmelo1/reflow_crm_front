import React from 'react'
import { View } from 'react-native'
import axios from 'axios'
import { connect } from 'react-redux'
import actions from '../../redux/actions'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class Company extends React.Component {
    constructor(props) {
        super(props)
        this.cancelToken = axios.CancelToken
        this.source = null
    }

    componentDidMount = () => {
        this.source = this.cancelToken.source()
        this.props.onGetCompanyUpdateData(this.source)
    }

    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <div style={{width: '100%', backgroundColor: '#fff', borderRadius: '5px', padding: '10px'}}>
                <input type={'text'} />
            </div>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ company: state.company }), actions)(Company)