import React, { memo, useEffect, useState } from 'react'
import { View } from 'react-native'
import isEqual from '../../../utils/isEqual'

import Content from '../Content'
import Block from '../Blocks'
import { TableBlockOptions } from '../Toolbar/BlockOptions'
import {
    BlockTableResizeButton
} from '../../../styles/RichText'
/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */



const Table = (props) => {
    const [selectedEdge, setSelectedEdge] = useState({
        row: {
            isSelected: false,
            index: null
        },
        column: {
            isSelected: false,
            index: null
        },
    })

    /**
     * Adds the table toolbar when the user clicks on one of the table edges.
     * 
     * You can see `.addToolbar` on the Block component to see how this works and how to configure it.
     */
    const addToolbar = () => {
        props.toolbarProps.blockOptionComponent = TableBlockOptions
        props.toolbarProps.blockOptionProps = {
            selectedEdge: selectedEdge,
            onAddNewRowOrColumn: onAddNewRowOrColumn,
            onRemoveRowOrColumn: onRemoveRowOrColumn
        }
        props.addToolbar({...props.toolbarProps})
    }
    
    const tableOptions = () => ({
            id: null,
            rows_num: 2,
            columns_num: 2,
            border_color: null
    })

    const createEmptyTextBlock = (order) => {
        return props.createNewBlock({
            order: order, 
            blockTypeId: props.getBlockTypeIdByName('text'),
            textOptions: {
                id: null,
                alignment_type: props.getAligmentTypeIdByName('left')
            }
        })
    }

    const findRowOfBlockByBlockIndex = (blockIndex) => {
        return Math.floor(blockIndex/props.block.table_option.columns_num)
    }

    const findColumnOfBlockByBlockIndex = (blockIndex) => {
        const rowIndex = findRowOfBlockByBlockIndex(blockIndex)
        return blockIndex - (props.block.table_option.columns_num*rowIndex)
    }

    const checkIfTableOptionsAndInsertIt = () => {
        if (props.block.table_option === null) {
            props.block.table_option = tableOptions()
            if ([null, undefined].includes(props.block.rich_text_depends_on_blocks)) {
                props.block.rich_text_depends_on_blocks = []
            }
            for (let i = 0; i < props.block.table_option.rows_num * props.block.table_option.columns_num; i++) {
                if (i >= props.block.rich_text_depends_on_blocks.length) {
                    props.block.rich_text_depends_on_blocks.push(createEmptyTextBlock(i))
                }
            }
        }
        props.updateBlocks(props.block.uuid)
    }   
    
    const onAddNewRowOrColumn = () => {
        if (selectedEdge.row.isSelected) {
            for (let i=0; i<props.block.table_option.columns_num; i++) {
                const newBlock = createEmptyTextBlock((props.block.table_option.columns_num * selectedEdge.row.index) + i)
                props.block.rich_text_depends_on_blocks.splice((props.block.table_option.columns_num * selectedEdge.row.index) + i,0, newBlock)
            }
            props.block.table_option.rows_num = props.block.table_option.rows_num + 1
        } else {
            for (let i=0; i<props.block.table_option.rows_num; i++) {
                const newBlock = createEmptyTextBlock((props.block.table_option.rows_num * selectedEdge.column.index) + i)
                props.block.rich_text_depends_on_blocks.splice(selectedEdge.column.index + (props.block.table_option.columns_num * i) + i,0, newBlock)
            }
            props.block.table_option.columns_num = props.block.table_option.columns_num + 1
        }
        props.updateBlocks(props.block.uuid)
    }

    const onRemoveRowOrColumn = () => {
        if (selectedEdge.row.isSelected) {
            if (props.block.table_option.columns_num > 1) {
                for (let i=0; i<props.block.table_option.rows_num; i++) {
                    props.block.rich_text_depends_on_blocks.splice(selectedEdge.column.index + (props.block.table_option.columns_num * i) - i,1)
                }
                props.block.table_option.columns_num = props.block.table_option.columns_num - 1
                props.updateBlocks(props.block.uuid)
            }
        } else {
            if (props.block.table_option.rows_num > 1) {
                for (let i=0; i<props.block.table_option.columns_num; i++) {
                    props.block.rich_text_depends_on_blocks.splice((props.block.table_option.columns_num * selectedEdge.row.index), 1)
                }
                props.block.table_option.rows_num = props.block.table_option.rows_num - 1
                props.updateBlocks(props.block.uuid)
            }
        }
    }

    const onDeleteChildrenBlock = (blockUUID) => {
        if (props.contextBlocks.length > 1) {
            const indexOfBlockInTable = props.block.rich_text_depends_on_blocks.findIndex(block => block.uuid === blockUUID)
            const newBlock = createEmptyTextBlock(indexOfBlockInTable)
            props.block.rich_text_depends_on_blocks.splice(indexOfBlockInTable, 1, newBlock)
            props.updateBlocks(newBlock.uuid)
        }
    }

    const onEnter = (blockUUID) => {
        const indexOfBlockInTable = props.block.rich_text_depends_on_blocks.findIndex(block => block.uuid === blockUUID)
        const newRowIndex = findRowOfBlockByBlockIndex(indexOfBlockInTable) + 1
        const columnIndex = findColumnOfBlockByBlockIndex(indexOfBlockInTable)
        props.block.table_option.rows_num = props.block.table_option.rows_num + 1
        let blockToFocus = null
        for (let i=0; i<props.block.table_option.columns_num; i++) {
            const newBlock = createEmptyTextBlock((props.block.table_option.columns_num*newRowIndex) + i)
            if (i === columnIndex) blockToFocus = newBlock.uuid
            props.block.rich_text_depends_on_blocks.splice((props.block.table_option.columns_num*newRowIndex) + i,0, newBlock)
        }
        props.updateBlocks(blockToFocus)
    }

    useEffect(() => {
        checkIfTableOptionsAndInsertIt()
    }, [])

    useEffect(() => {
        addToolbar()
    }, [props.activeBlock, selectedEdge])

    const columnsNumber = props.block?.table_option?.columns_num ? props.block?.table_option?.columns_num : 0

    const renderMobile = () => {
        return (
            <View></View>
        )
    }
    
    const renderWeb = () => {
        return (
            <table style={{ width: '100%'}}>
                <tbody>
                    {Array.apply(null, Array(props.block?.table_option?.rows_num ? props.block?.table_option?.rows_num : 0)).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {props.block.rich_text_depends_on_blocks.slice(rowIndex * columnsNumber, (rowIndex * columnsNumber) + columnsNumber).map((block, index) => {
                                const columnIndex = (rowIndex * columnsNumber) + index
                                block = block ? block : createEmptyTextBlock(rowIndex*columnIndex)
                                return (
                                    <td key={block.uuid} 
                                    style={{ 
                                        border: '1px solid #000', 
                                        padding: '10px', 
                                        position: 'relative', 
                                        width: `${100/props.block.table_option.columns_num}%`
                                    }}>
                                        <BlockTableResizeButton
                                        buttonType={{isRight: true}}
                                        onClick={(e) => {
                                            setSelectedEdge({
                                                row: {
                                                    isSelected: false,
                                                    index: rowIndex
                                                },
                                                column: {
                                                    isSelected: true,
                                                    index: columnIndex+1
                                                }
                                            })
                                            props.updateBlocks(props.block.uuid)
                                        }}
                                        />
                                        <BlockTableResizeButton
                                        buttonType={{isLeft: true}}
                                        onClick={(e) => {
                                            setSelectedEdge({
                                                row: {
                                                    isSelected: false,
                                                    index: rowIndex
                                                },
                                                column: {
                                                    isSelected: true,
                                                    index: columnIndex
                                                }
                                            })
                                            props.updateBlocks(props.block.uuid)
                                        }}
                                        />
                                        <BlockTableResizeButton
                                        buttonType={{isTop: true}}
                                        onClick={(e) => {
                                            setSelectedEdge({
                                                row: {
                                                    isSelected: true,
                                                    index: rowIndex
                                                },
                                                column: {
                                                    isSelected: false,
                                                    index: columnIndex
                                                }
                                            })
                                            props.updateBlocks(props.block.uuid)
                                        }}
                                        />
                                        <BlockTableResizeButton
                                        buttonType={{isBottom: true}}
                                        onClick={(e) => {
                                            setSelectedEdge({
                                                row: {
                                                    isSelected: true,
                                                    index: rowIndex + 1
                                                },
                                                column: {
                                                    isSelected: false,
                                                    index: columnIndex
                                                }
                                            })
                                            props.updateBlocks(props.block.uuid)
                                        }}
                                        />
                                        <Block 
                                        {...props} 
                                        block={block} 
                                        onDeleteBlock={onDeleteChildrenBlock}
                                        onRemoveCurrent={() => null}
                                        onRemoveAfter={() => null}
                                        contextBlocks={props.block.rich_text_depends_on_blocks} 
                                        onEnter={onEnter}
                                        />   
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}


export default Table