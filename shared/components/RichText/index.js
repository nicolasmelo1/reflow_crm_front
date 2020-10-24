import React from 'react'
import { View } from 'react-native'
import axios from 'axios'
import agent from '../../utils/agent'
import Block from './Blocks'
/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class RichText extends React.Component {
    constructor(props) {
        super(props)
        this.CancelToken = axios.CancelToken
        this.source = null
        this.state = {
            id: null,
            raw_text: '',
            rich_text_page_blocks: []
        }
    }

    componentDidMount = () => {
        this.source = this.CancelToken.source()
        agent.http.RICH_TEXT.getTestText(this.source).then(response => {
            if (response && response.status === 200) {
                this.setState(state => {
                    return response.data.data
                })
            }
        })
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <div>
                {this.state.rich_text_page_blocks.map((block, index) => (
                    <Block key={index} block={block} onChangeBlockContents={this.props.onChangeBlockContents}/>
                ))}
            </div>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default RichText