import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import Block from '../Blocks'
import deepCopy from '../../../utils/deepCopy'
import generateUUID from '../../../utils/generateUUID'
import { TableBlockOptions } from '../Toolbar/BlockOptions'
import Overlay from '../../../styles/Overlay'
import {
    BlockTableCell,
    BlockTableResizeButton,
    BlockTableTable
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
    
    /**
     * The special options of the table block
     * 
     * @returns {Object} - {
     *      id {BigInteger} - The id of the table option 
     *      rows_num {BigInteger} - The number of rows in the table
     *      columns_nul {BigInteger} - The number of columns in the table
     *      border_color {String} - A Hex string of the color of the border of the table.
     * }
     */
    const tableOptions = () => ({
            id: null,
            rows_num: 2,
            columns_num: 2,
            border_color: null
    })


    /**
     * Adds the order parameter correctly for each block
     */
    const reorderBlocks = () => {
        for (let i=0; i<props.block.rich_text_depends_on_blocks.length; i++) {
            props.block.rich_text_depends_on_blocks[i].order = i
        }
    }

    /**
     * Every cell of the table is initialy a normal Text block. This way we do not need to redo any funcionality 
     * for the table to be able to write, handle arrow navigation and add images. So when adding a new table, when adding 
     * a new row or column we will always use this function.
     * 
     * @param {BigInteger} order - The order of the block.
     * 
     * @return {Object} - see `.createNewBlock` function in Block component for reference on what the object looks like.
     */
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

    /**
     * To understand this you need to understand how we build the tables in the '.render()' function:
     * 
     * To build tables we transverse first by each row and then each column of the row. Then we go for the next row
     * and do the same thing.
     * 
     * So the order is: Build Row -> Build columns -> build next row -> build columns
     * 
     * So to find the row based on the blockIndex we need to divide it by the number of columns and get the floor.
     * 
     * Suppose we have a block with 2 columns and 2 rows and want to find the row of blockIndex = 2
     * 
     * 2/2 = 1 -> Math.floor(1) -> 1
     * 
     * Now 3 columns and 2 rows 
     * 
     * 2/3 = 0,6666 -> Math.floor(0,6666) -> 0
     * 
     * @param {BigInteger} blockIndex - The index of the block you want to find the rowIndex for
     * 
     * @returns {BigInteger} - Returns the row index starting at 0.
     */
    const findRowOfBlockByBlockIndex = (blockIndex) => {
        return Math.floor(blockIndex/props.block.table_option.columns_num)
    }

    /**
     * Read the explanation on `.findRowOfBlockByBlockIndex()` to understand how we render functions first and
     * how we find the row index
     * 
     * Then we need to find the column of the block and this is more tricky. Let's build a simple table
     * |-|-|-|
     * |0|1|2| -> Notice this row
     * |-|-|-|
     * |4|3|4|
     * |-|-|-|
     * 
     * If you notice the first row, this first row gives us the column indexes so what we need to do is find 
     * what blockIndex it would be if the block was on the first row.
     * 
     * @param {BigInteger} blockIndex - The index of the block you want to find the columnIndex for
     * 
     * @returns {BigInteger} - The index of the column, starting at index 0
     */
    const findColumnOfBlockByBlockIndex = (blockIndex) => {
        const rowIndex = findRowOfBlockByBlockIndex(blockIndex)
        return blockIndex - (props.block.table_option.columns_num*rowIndex)
    }

    /**
     * This function is used to check if the block has table options, if not we insert it.
     * 
     * Also we check, the number of dependent blocks, if the number does not match the number of columns*number of rows
     * we add new text blocks to "fill this gap" so every cell is a text block.
     */
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
    
    /**
     * Function for handling when the user clicks to add a new column or a new row.
     * 
     * You will notice that we do not have any parameters, we do this because we use the
     * selectedEdge state so we know if a row or a column was selected.
     * 
     * To add a new Row it's really straight forward: we need to multiply the number of columns by the row index and add i
     * This is because if we are adding a new row on index 2 of a 3x3 table we will add the blocks in position 6, 7 and 8
     * 
     * For columns it is more difficult, on 3x3 table, if we are adding a new column in index 2 we need to add in positions 3, 6 and 9
     * so what we do is loop through each row and add the column index to the columns number * i. Then we add i because on the loop
     * the index change as we add more elements. (for a 3x3 table, when we add the first element the table now has 10 elements, so we need
     * to add in position 7 and not 6.)
     */
    const onAddNewRowOrColumn = () => {
        if (selectedEdge.row.isSelected) {
            for (let i=0; i<props.block.table_option.columns_num; i++) {
                const newBlock = createEmptyTextBlock(0)
                props.block.rich_text_depends_on_blocks.splice((props.block.table_option.columns_num * selectedEdge.row.index) + i,0, newBlock)
            }
            props.block.table_option.rows_num = props.block.table_option.rows_num + 1
        } else {
            for (let i=0; i<props.block.table_option.rows_num; i++) {
                const newBlock = createEmptyTextBlock(0)
                props.block.rich_text_depends_on_blocks.splice(selectedEdge.column.index + (props.block.table_option.columns_num * i) + i,0, newBlock)
            }
            props.block.table_option.columns_num = props.block.table_option.columns_num + 1
        }
        selectedEdge.row.isSelected = false
        selectedEdge.column.isSelected = false
        selectedEdge.row.index = null
        selectedEdge.column.index = null

        setSelectedEdge({...selectedEdge})
        reorderBlocks()
        props.updateBlocks(props.block.uuid)
    }

    /**
     * Really similar to `.onAddNewRowOrColumn()` function. Excpet we are removing a column or a row.
     * 
     * Also, differently from `.onAddNewRowOrColumn()`, when the row is selected we remove the column, and when a column is selected
     * we remove the row.
     * 
     * We just remove if the row and the column is not the last one respectively.
     * 
     * Besides that, this function is really similar to the `.onAddNewRowOrColumn` function
     */
    const onRemoveRowOrColumn = () => {
        if (selectedEdge.row.isSelected) {
            if (props.block.table_option.columns_num > 1) {
                props.block.table_option.columns_num = props.block.table_option.columns_num - 1

                for (let i=0; i<props.block.table_option.rows_num; i++) {
                    props.block.rich_text_depends_on_blocks.splice(selectedEdge.column.index + (props.block.table_option.columns_num * i),1)
                }
                selectedEdge.row.isSelected = false
                setSelectedEdge({...selectedEdge})
                reorderBlocks()
                props.updateBlocks(props.block.uuid)
            }
        } else {
            if (props.block.table_option.rows_num > 1) {
                props.block.table_option.rows_num = props.block.table_option.rows_num - 1

                for (let i=0; i<props.block.table_option.columns_num; i++) {
                    props.block.rich_text_depends_on_blocks.splice((props.block.table_option.columns_num * selectedEdge.row.index), 1)
                }
                selectedEdge.column.isSelected = false
                setSelectedEdge({...selectedEdge})
                reorderBlocks()
                props.updateBlocks(props.block.uuid)
            }
        }
    }

    /**
     * When the user clicks to delete a children block in the toolbar we use this function, so we can create a new 
     * empty text block in its place
     * 
     * @param {String} blockUUID - The uuid of the block that is being deleted
     */
    const onDeleteChildrenBlock = (blockUUID) => {
        if (props.contextBlocks.length > 1) {
            const indexOfBlockInTable = props.block.rich_text_depends_on_blocks.findIndex(block => block.uuid === blockUUID)
            const newBlock = createEmptyTextBlock(indexOfBlockInTable)
            props.block.rich_text_depends_on_blocks.splice(indexOfBlockInTable, 1, newBlock)
            props.updateBlocks(newBlock.uuid)
        }
    }

    /**
     * Duplicates the children blocks, when each of the children wants to be duplicated this function takes over and handle
     * the duplication for them. This way we can set special conditions for different types of blocks when duplicating
     * 
     * @param {String} blockUUID - The uuid of the block that wants to be duplicated.
     */
    const onDuplicateChildrenBlock = (blockUUID) => {
        const duplicateBlock = (blockToDuplicate) => {
            let block = deepCopy(blockToDuplicate)
            block.uuid = generateUUID()
            block.rich_text_block_contents = block.rich_text_block_contents.map(content => {
                content.uuid = generateUUID()
                return content
            })
            props.customBlockOptions.forEach(option => {
                if (block[option]) {
                    block[option].id = null
                }
            })
            if (block.rich_text_depends_on_blocks && block.rich_text_depends_on_blocks.length > 0) {
                block.rich_text_depends_on_blocks = block.rich_text_depends_on_blocks.map(dependsOnBlock => duplicateBlock(dependsOnBlock))
            }
            return block
        }
        const indexOfBlockInContext = props.block.rich_text_depends_on_blocks.findIndex(block => block.uuid === blockUUID)
        if (indexOfBlockInContext !== props.block.rich_text_depends_on_blocks.length -1) {
            const block = duplicateBlock(props.block.rich_text_depends_on_blocks[indexOfBlockInContext])
            props.block.rich_text_depends_on_blocks.splice(indexOfBlockInContext + 1, 1, block)
            reorderBlocks()
            props.updateBlocks(null)
        }
    }

    /**
     * This handles when the user clicks enter on the Text block, instead of using the default behaviour, with this we
     * create a new block and go to the line right below it.
     * 
     * You might want to check `.onAddNewRowOrColumn()` function to understand how we add a new line.
     * 
     * @param {String} blockUUID - The uuid of the block of where you hit enter.
     */
    const onEnter = (blockUUID) => {
        const indexOfBlockInTable = props.block.rich_text_depends_on_blocks.findIndex(block => block.uuid === blockUUID)
        const newRowIndex = findRowOfBlockByBlockIndex(indexOfBlockInTable) + 1
        const columnIndex = findColumnOfBlockByBlockIndex(indexOfBlockInTable)
        props.block.table_option.rows_num = props.block.table_option.rows_num + 1
        let blockToFocus = null
        for (let i=0; i<props.block.table_option.columns_num; i++) {
            const newBlock = createEmptyTextBlock(0)
            if (i === columnIndex) blockToFocus = newBlock.uuid
            props.block.rich_text_depends_on_blocks.splice((props.block.table_option.columns_num*newRowIndex) + i,0, newBlock)
        }
        reorderBlocks()
        props.updateBlocks(blockToFocus)
    }

    useEffect(() => {
        // When mounting this component we check if it has the table options, otherwise we need to create it.
        // With this we can then mount the table on the screen.
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
            <BlockTableTable>
                <tbody>
                    {Array.apply(null, Array(props.block?.table_option?.rows_num ? props.block?.table_option?.rows_num : 0)).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {props.block.rich_text_depends_on_blocks.slice(rowIndex * columnsNumber, (rowIndex * columnsNumber) + columnsNumber).map((block, index) => {
                                const columnIndex = (rowIndex * columnsNumber) + index
                                block = block ? block : createEmptyTextBlock(rowIndex*columnIndex)
                                return (
                                    <BlockTableCell 
                                    key={block.uuid} 
                                    width={100/props.block.table_option.columns_num}
                                    >
                                        <Overlay text={'Clique para adicionar Coluna ou remover Linha'}>
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
                                        </Overlay>
                                        <Overlay text={'Clique para adicionar Coluna ou remover Linha'}>
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
                                        </Overlay>
                                        <Overlay text={'Clique para adicionar Linha ou remover Coluna'}>
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
                                        </Overlay>
                                        <Overlay text={'Clique para adicionar Linha ou remover Coluna'}>
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
                                        </Overlay>
                                        <Block 
                                        {...props} 
                                        block={block} 
                                        onDuplicateBlock={onDuplicateChildrenBlock}
                                        onDeleteBlock={onDeleteChildrenBlock}
                                        onRemoveCurrent={() => null}
                                        onRemoveAfter={() => null}
                                        contextBlocks={props.block.rich_text_depends_on_blocks} 
                                        onEnter={onEnter}
                                        />   
                                    </BlockTableCell>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </BlockTableTable>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}


export default Table