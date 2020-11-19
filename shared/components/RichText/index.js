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
        this.types = {
            billing: {},
            data: {},
            defaults: {
                text_alignment_type: [
                    {
                        id: 1,
                        name: 'left',
                        order: 1
                    },
                    {
                        id: 3,
                        name: 'center',
                        order: 2
                    },
                    {
                        id: 2,
                        name: 'right',
                        order: 3
                    },
                ]
            }
        }
        /*this.state = {
            id: null,
            raw_text: '',
            rich_text_page_blocks: []
        }*/
        this.state = {
            activeBlock: null,
            data: {
                id: 1,
                raw_text: "",
                rich_text_page_blocks: [
                    {
                        id: 1,
                        uuid: "7495ff92-c16b-45d0-94cd-d02d1056c113",
                        image_option: null,
                        list_option: null,
                        text_option: {
                            id: 1,
                            alignment_type: 1
                        },
                        table_option: null,
                        block_type: 1,
                        order: 1,
                        rich_text_block_contents: [
                            {
                                order: 1,
                                uuid: "3d1d811c-eddf-4c5b-bccb-9e2f1fc52443",
                                text: "Eu",
                                text_size: 12,
                                is_bold: false,
                                is_italic: false,
                                is_underline: false,
                                is_code: false,
                                latex_equation: "",
                                marker_color: "",
                                text_color: "",
                                link: null
                            },
                            {
                                order: 2,
                                uuid: "e2f9a2c0-d6ca-44ab-8819-0d5c499cd521",
                                text: "AMO",
                                text_size: 12,
                                is_bold: true,
                                is_italic: true,
                                is_underline: false,
                                is_code: false,
                                latex_equation: "",
                                marker_color: "",
                                text_color: "",
                                link: null
                            },
                            {
                                order: 3,
                                uuid: "dbf716aa-7b01-4477-89ef-3013ecbce2a3",
                                text: "Gatos\n",
                                text_size: 12,
                                is_bold: false,
                                is_italic: true,
                                is_underline: true,
                                is_code: true,
                                latex_equation: "",
                                marker_color: "",
                                text_color: "",
                                link: null
                            }
                        ],
                        rich_text_depends_on_blocks: []
                    }
                    /*{
                        id: 4,
                        uuid: "d37d2821-ca19-42cd-9e01-c8cc18237f27",
                        image_option: null,
                        list_option: null,
                        text_option: null,
                        table_option: {
                            id: 1,
                            rows_num: 2,
                            columns_num: 2,
                            border_color: ""
                        },
                        block_type: 2,
                        order: 4,
                        rich_text_block_contents: [],
                        rich_text_depends_on_blocks: [
                            {
                                id: 2,
                                uuid: "75722a40-e659-4787-95e5-fb1ea1d5d223",
                                image_option: null,
                                list_option: null,
                                text_option: {
                                    id: 2,
                                    alignment_type: 2
                                },
                                table_option: null,
                                block_type: 1,
                                order: 2,
                                rich_text_block_contents: [
                                    {
                                        order: 4,
                                        uuid: "1dc179fa-bd6c-4680-95b9-d24e8dad2544",
                                        text: "Coluna 1",
                                        text_size: '',
                                        is_bold: false,
                                        is_italic: false,
                                        is_underline: false,
                                        is_code: false,
                                        latex_equation: null,
                                        marker_color: null,
                                        text_color: null,
                                        link: null
                                    }
                                ],
                                rich_text_depends_on_blocks: []
                            },
                            {
                                id: 3,
                                uuid: "2038ee11-1c97-4c03-8895-b64306d8e79a",
                                image_option: null,
                                list_option: null,
                                text_option: {
                                    id: 3,
                                    alignment_type: 2
                                },
                                table_option: null,
                                block_type: 1,
                                order: 3,
                                rich_text_block_contents: [
                                    {
                                        order: 5,
                                        uuid: "ad5ee394-654c-4723-a372-20652fb11663",
                                        text: "Coluna 2",
                                        text_size: '',
                                        is_bold: false,
                                        is_italic: false,
                                        is_underline: false,
                                        is_code: false,
                                        latex_equation: null,
                                        marker_color: null,
                                        text_color: null,
                                        link: null
                                    }
                                ],
                                rich_text_depends_on_blocks: []
                            },
                            {
                                id: 5,
                                uuid: "2388835a-5244-491e-bd9c-a086d0fc2cdb",
                                image_option: null,
                                list_option: null,
                                text_option: {
                                    id: 4,
                                    alignment_type: 2
                                },
                                table_option: null,
                                block_type: 1,
                                order: 5,
                                rich_text_block_contents: [
                                    {
                                        order: 6,
                                        uuid: "401d74e5-c1ea-4978-911d-792e491d059c",
                                        text: "Coluna 1.2",
                                        text_size: '',
                                        is_bold: true,
                                        is_italic: false,
                                        is_underline: false,
                                        is_code: false,
                                        latex_equation: null,
                                        marker_color: null,
                                        text_color: null,
                                        link: null
                                    }
                                ],
                                rich_text_depends_on_blocks: []
                            }
                        ]
                    }*/
                ]
            }
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

    componentDidMount = () => {
        this.source = this.CancelToken.source()
        /*agent.http.RICH_TEXT.getTestText(this.source).then(response => {
            if (response && response.status === 200) {
                this.setState(state => {
                    return response.data.data
                })
            }
        })*/
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <div style={{ height: 'var(--app-height)', overflow: 'auto', backgroundColor: '#fff', padding: '10px', margin: '40px 0 0 0' }}>
                <div>
                    {this.state.data.rich_text_page_blocks.map((block, index) => (
                        <Block 
                        key={block.uuid} 
                        block={block} 
                        types={this.types}
                        activeBlock={this.state.activeBlock} 
                        updateBlocks={this.updateBlocks} 
                        contextBlocks={this.state.data.rich_text_page_blocks}
                        />
                    ))}
                </div>
                <pre
                dangerouslySetInnerHTML={{__html: JSON.stringify(this.state, null, '\t')}}
                />
            </div>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default RichText