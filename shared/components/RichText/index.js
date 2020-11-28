import React from 'react'
import { View } from 'react-native'
import axios from 'axios'
import { connect } from 'react-redux'
import generateUUID from '../../utils/generateUUID'
import isEqual from '../../utils/isEqual'
import Block from './Blocks'
import { 
    RichTextContainer,
    RichTextBlocksContainer
} from '../../styles/RichText'


/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class RichText extends React.Component {
    constructor(props) {
        super(props)
        this.CancelToken = axios.CancelToken
        this.source = null
        /*this.state = {
            id: null,
            raw_text: '',
            rich_text_page_blocks: []
        }*/
        this.state = {
            activeBlock: null,
            data: this.props.initialData && Object.keys(this.props.initialData).length !== 0 ? 
            JSON.parse(JSON.stringify(this.props.initialData)) : this.createNewPage()
        }
    }
    
    getBlockTypeIdByName = (blockName) => {
        if (this.props.types?.rich_text?.block_type !== undefined) {
            for (let i=0; i<this.props.types?.rich_text?.block_type.length; i++) {
                if (this.props.types.rich_text.block_type[i].name === blockName) {
                    return this.props.types.rich_text.block_type[i].id
                }
            }
        } return null
    } 

    getAligmentTypeIdByName = (alignmentName) => {
        if (this.props.types?.rich_text?.alignment_type !== undefined) {
            for (let i=0; i<this.props.types?.rich_text?.alignment_type.length; i++) {
                if (this.props.types.rich_text.alignment_type[i].name === alignmentName) {
                    return this.props.types.rich_text.alignment_type[i].id
                }
            }
        } 
        return null
    }

    /**
     * 
     */
    createNewPage = () => {
        const alignmentType = this.getAligmentTypeIdByName('left')
        const blockType = this.getBlockTypeIdByName('text')

        return {
            id: null,
            raw_text: "",
            rich_text_page_blocks: [
                {
                    id: null,
                    uuid: generateUUID(),
                    image_option: null,
                    list_option: null,
                    text_option: {
                        id: null,
                        alignment_type: alignmentType
                    },
                    table_option: null,
                    block_type: blockType,
                    order: 0,
                    rich_text_block_contents: [
                        {
                            order: 0,
                            uuid: generateUUID(),
                            text: "Digite aqui\n",
                            text_size: 12,
                            is_bold: false,
                            is_italic: false,
                            is_underline: false,
                            is_code: false,
                            is_custom: false,
                            custom_value: '',
                            latex_equation: null,
                            marker_color: "",
                            text_color: "",
                            link: null
                        }
                    ]
                }
            ]
        }

    }

    /**
     * We update the state by reference, it means this might work like a blackBox for some people.
     * Reference: https://stackoverflow.com/questions/373419/whats-the-difference-between-passing-by-reference-vs-passing-by-value
     * When we pass the block data to the Block components below we pass a reference.
     * It means we pass the location in memory of this object and not a copy. That's exactly how `useRef()` hook
     * works. It bundles your values to an object. An object is always passed between functions as reference
     * and not as value.
     * 
     * With a reference when the object changes inside of a function, the object outside the scope of
     * this function will also update. 
     * 
     * In our case, when we update the `block` props inside of the components 
     * since we are updating the reference data, the state here will also be updated. 
     * This happens because the props in our child components DOES NOT HAVE A COPY OF EACH BLOCK OBJECT they hold the actual block object.
     * You can add a `console.log` to this.state inside of this function when you update the props in a child component 
     * to see how this works.
     */
    updateBlocks = (activeBlock) => {
        this.setState(state => ({
            activeBlock: activeBlock,
            data:{...this.state.data}
        }))
    }

    updateData = (data) => {
        this.setState(state => ({
            ...state,
            data: data
        }))
    }

    componentDidUpdate = (prevProps) => {
        if (
            !isEqual(this.props.initialData, prevProps.initialData) &&
            this.props.initialData && 
            Object.keys(this.props.initialData).length !== 0
        ) {
            this.updateData(JSON.parse(JSON.stringify(this.props.initialData)))
        }
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }
    
    renderWeb = () => {
        return (
            <RichTextContainer height={this.props.height}>
                <RichTextBlocksContainer>
                    {this.state.data.rich_text_page_blocks.map((block, index) => (
                        <Block 
                        key={block.uuid} 
                        block={block} 
                        types={this.props.types}
                        isEditable={this.props.isEditable ? this.props.isEditable : true}
                        activeBlock={this.state.activeBlock} 
                        updateBlocks={this.updateBlocks} 
                        contextBlocks={this.state.data.rich_text_page_blocks}
                        renderCustomContent={this.props.renderCustomContent}
                        getAligmentTypeIdByName={this.getAligmentTypeIdByName}
                        getBlockTypeIdByName={this.getBlockTypeIdByName}
                        handleUnmanagedContent={this.props.handleUnmanagedContent}
                        unmanagedContentValue={this.props.unmanagedContentValue}
                        isUnmanagedContentSelectorOpen={this.props.isUnmanagedContentSelectorOpen}
                        onOpenUnmanagedContentSelector={this.props.onOpenUnmanagedContentSelector}
                        onChangeUnmanagedContentValue={this.props.onChangeUnmanagedContentValue}
                        />
                    ))}
                </RichTextBlocksContainer>
                {/*<pre
                dangerouslySetInnerHTML={{__html: JSON.stringify(this.state, null, '\t')}}
                />*/}
            </RichTextContainer>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ types: state.login.types }), {})(RichText)