import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import Block from '../Blocks'
import deepCopy from '../../../utils/deepCopy'
import generateUUID from '../../../utils/generateUUID'
import { strings } from '../../../utils/constants'
import { TableBlockOptions } from '../Toolbar/BlockOptions'
import Overlay from '../../../styles/Overlay'
import {
    BlockTableCell,
    BlockTableResizeButton,
    BlockTableTable
} from '../../../styles/RichText'


/**
 * The component of the table block.
 * 
 * The table block actually does nothing much by itself, it just effectively renders the table on the richText
 * and is a specific way of organizing other blocks. This means that to use this block we actually need other 
 * children blocks. In the specific case of the table every cell of the table is obligatory an empty text block.
 * 
 * This means that on every cell of the table we have just a normal text block and all of his power. If you see slate
 * or even Quill in Clickup, none of them offers this much flexibility to their tables.
 * 
 * The number of rows and the number of columns are calculated by counting the number of elements of 
 * `props.block.table_option.text_table_option_row_dimensions` and `props.block.table_option.text_table_option_column_dimensions`
 * respectively. Each of those parameters holds the height in px for each row and the width in % for each column.
 * 
 * IMPORTANT: We filter the blocks that can be created inside of the table because we want to prevent tables inside tables
 * to optimize performance.
 * 
 * @param {Object} props {... all of the props defined in the Block and Text components}
 */
const Table = (props) => {
    const [selectedEdge, _setSelectedEdge] = useState({
        row: {
            isSelected: false,
            index: null
        },
        column: {
            isSelected: false,
            index: null
        },
    })
    const [rowDimensions, _setRowDimensions] = useState(
        props.block.table_option?.text_table_option_row_dimensions ? 
        props.block.table_option.text_table_option_row_dimensions : 
        Array.from(Array(2).keys()).map(_ => ({ height: null }))
    )
    const [columnDimensions, _setColumnDimensions] = useState(
        props.block.table_option?.text_table_option_column_dimensions ? 
        props.block.table_option.text_table_option_column_dimensions : 
        Array.from(Array(2).keys()).map(_ => ({ width: 100/2 }))
    )
    const rowDimensionsRef = React.useRef(rowDimensions)
    const columnDimensionsRef = React.useRef(columnDimensions)
    const isResizing = React.useRef(false)
    const resizingRef = React.useRef({
        pageX: null,
        pageY: null
    })
    const selectedEdgeRef = React.useRef(selectedEdge)
    const setSelectedEdge = (data) => {
        _setSelectedEdge(data)
        selectedEdgeRef.current = data
    }

    const setColumnDimensions = (data) => {
        _setColumnDimensions(data)
        columnDimensionsRef.current = data
    }

    const setRowDimensions = (data) => {
        _setRowDimensions(data)
        rowDimensionsRef.current = data
    }

    /**
     * Adds the table toolbar when the user clicks on one of the table edges.
     * 
     * You can see `.addToolbar` on the Block component to see how this works and how to configure it.
     */
    const addToolbar = () => {
        props.toolbarProps.blockOptionComponent = TableBlockOptions
        props.toolbarProps.blockOptionProps = {
            selectedEdge: selectedEdge,
            onChangeTableBorderColor: onChangeTableBorderColor,
            tableBorderColor: props.block.table_option.border_color,
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
     *      border_color {String} - The Hex string of the color of the border
     *      text_table_option_column_dimensions {Array<{width: {BigInteger}}>} - Holds the number of columns in the table and the width in % of each column
     *      text_table_option_row_dimensions {Array<{height: {BigInteger}}>} - Holds the number of rows in the table and the height in px of each row
     * }
     */
    const tableOptions = () => ({
            id: null,
            border_color: null,
            text_table_option_column_dimensions: columnDimensionsRef.current,
            text_table_option_row_dimensions: rowDimensionsRef.current
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
        return Math.floor(blockIndex/props.block.table_option.text_table_option_column_dimensions.length)
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
        return blockIndex - (props.block.table_option.text_table_option_column_dimensions.length*rowIndex)
    }

    /**
     * This function is used to check if the block has table options, if not we insert it.
     * 
     * Also we check, the number of dependent blocks, if the number does not match the number of columns*number of rows
     * we add new text blocks to "fill this gap" so every cell is a text block.
     */
    const checkIfTableOptionsAndInsertIt = () => {
        if (props.block.table_option === null || 
            (props.block.table_option.text_table_option_row_dimensions || []).length === 0 ||
            (props.block.table_option.text_table_option_column_dimensions || []).length === 0) {

            props.block.table_option = tableOptions()
            if ([null, undefined].includes(props.block.rich_text_depends_on_blocks)) {
                props.block.rich_text_depends_on_blocks = []
            }
            for (let i = 0; i < props.block.table_option.text_table_option_row_dimensions.length * props.block.table_option.text_table_option_column_dimensions.length; i++) {
                if (i >= props.block.rich_text_depends_on_blocks.length) {
                    props.block.rich_text_depends_on_blocks.push(createEmptyTextBlock(i))
                }
            }
            props.updateBlocks(props.block.uuid)
        }
    }   
    /**
     * This gets the index of the block that the caret should go when the user press the arrow key down or right
     * 
     * @param {String} blockUUID - The uuid of the block that is currently focused
     * @param {Object} isUpOrLeftPressed - {
     *      isDownPressed: {Boolean} - If the down arrow was pressed
     *      isRightPressed: {Boolean} - If the right arrow was pressed
     * } 
     */
    const onHandleNextBlockArrowNavigation = (blockUUID, isDownOrRightPressed) => {
        const indexOfCurrentBlock = props.block.rich_text_depends_on_blocks.findIndex(block => block.uuid === blockUUID)
        let nextTextBlockIndex = -1
        if (isDownOrRightPressed.isDownPressed) {
            for (let i = indexOfCurrentBlock; i < props.block.rich_text_depends_on_blocks.length; i += props.block.table_option.text_table_option_column_dimensions.length) {
                if (props.block.rich_text_depends_on_blocks[i].block_type === props.getBlockTypeIdByName('text') && i > indexOfCurrentBlock) {
                    nextTextBlockIndex = i
                    break
                }
            }
        } else {
            for (let i = indexOfCurrentBlock; i < props.block.rich_text_depends_on_blocks.length; i++) {
                if (props.block.rich_text_depends_on_blocks[i].block_type === props.getBlockTypeIdByName('text') && i > indexOfCurrentBlock) {
                    nextTextBlockIndex = i
                    break
                }
            } 
        }
        return nextTextBlockIndex
    }
    
    /**
     * This gets the index of the block that the caret should go when the user press the arrow key up or left
     * 
     * @param {String} blockUUID - The uuid of the block that is currently focused
     * @param {Object} isUpOrLeftPressed - {
     *      isUpPressed: {Boolean} - If the up arrow was pressed
     *      isLeftPressed: {Boolean} - If the left arrow was pressed
     * }
     */
    const onHandlePreviousBlockArrowNavigation = (blockUUID, isUpOrLeftPressed) => {
        const indexOfCurrentBlock = props.block.rich_text_depends_on_blocks.findIndex(block => block.uuid === blockUUID)
        let previousTextBlockIndex = -1
        if (isUpOrLeftPressed.isUpPressed) {
            for (let i = indexOfCurrentBlock; i >= 0; i -= props.block.table_option.text_table_option_column_dimensions.length) {
                if (props.block.rich_text_depends_on_blocks[i].block_type === props.getBlockTypeIdByName('text') && i < indexOfCurrentBlock) {
                    
                    previousTextBlockIndex = i
                    break
                }
            }
        } else {
            for (let i = indexOfCurrentBlock; i >= 0; i--) {
                if (props.block.rich_text_depends_on_blocks[i].block_type === props.getBlockTypeIdByName('text') && i < indexOfCurrentBlock) {
                    previousTextBlockIndex = i
                    break
                }
            } 
        }
        return previousTextBlockIndex
    }
    /**
     * Resizes the table column and also it's row. It's important to notice that hen resizing columns we only accept resizing the midle columns
     * For resizing rows we use pixels normally so no special attention is needed, for resizing columns however we use percentages.
     * 
     * @param {Object} e - The object of the event recieved from mousemove event.
     */
    const onResizeTableCell = (e) => {
        if (isResizing.current && resizingRef.current.pageX && resizingRef.current.pageY) {
            if (selectedEdgeRef.current.column.isSelected && selectedEdgeRef.current.column.index > 0 && selectedEdgeRef.current.column.index < props.block.table_option.text_table_option_column_dimensions.length) {
                if (e.pageX > resizingRef.current.pageX && columnDimensionsRef.current[selectedEdgeRef.current.column.index].width - 1 >= 0) {
                    columnDimensionsRef.current[selectedEdgeRef.current.column.index].width = columnDimensionsRef.current[selectedEdgeRef.current.column.index].width - 1
                    columnDimensionsRef.current[selectedEdgeRef.current.column.index - 1].width = columnDimensionsRef.current[selectedEdgeRef.current.column.index - 1].width + 1

                }
                if (e.pageX < resizingRef.current.pageX && columnDimensionsRef.current[selectedEdgeRef.current.column.index].width + 1 <= 100) {
                    columnDimensionsRef.current[selectedEdgeRef.current.column.index].width = columnDimensionsRef.current[selectedEdgeRef.current.column.index].width + 1
                    columnDimensionsRef.current[selectedEdgeRef.current.column.index - 1].width = columnDimensionsRef.current[selectedEdgeRef.current.column.index - 1].width - 1
                }
            } else if (selectedEdgeRef.current.row.isSelected && selectedEdgeRef.current.row.index > 0) {
                if (e.pageY > resizingRef.current.pageY) {
                    const currentHeight = rowDimensionsRef.current[selectedEdgeRef.current.row.index-1].height 
                    rowDimensionsRef.current[selectedEdgeRef.current.row.index-1].height = currentHeight ? currentHeight + (e.pageY - resizingRef.current.pageY) : 60
                }
                if (e.pageY < resizingRef.current.pageY && rowDimensionsRef.current[selectedEdgeRef.current.row.index-1].height > 1) {
                    const currentHeight = rowDimensionsRef.current[selectedEdgeRef.current.row.index-1].height 
                    rowDimensionsRef.current[selectedEdgeRef.current.row.index-1].height = currentHeight ? currentHeight - (resizingRef.current.pageY - e.pageY) : 60
                }
            }
            resizingRef.current.pageY = e.pageY
            resizingRef.current.pageX = e.pageX
            setColumnDimensions([...columnDimensionsRef.current])
            setRowDimensions([...rowDimensionsRef.current])
        }
    }

    /**
     * When the user release the mouse button we reset the isResizingref and resizingRef references and set the 
     * the column dimension and row dimension to the block.
     * 
     * @param {Object} e - The object of the event recieved from mouseup event.
     */
    const onMouseUp = (e) => {
        if (isResizing.current) {
            isResizing.current = false
            resizingRef.current = { pageX: null, pageY: null}
            props.block.table_option.text_table_option_row_dimensions = [...rowDimensionsRef.current]
            props.block.table_option.text_table_option_column_dimensions = [...columnDimensionsRef.current]
            props.updateBlocks(props.block.uuid)
        }
    }

    /**
     * When the user clicks with the mouse on one of the edge buttons
     * 
     * @param {Object} e - The object of the event recieved from onMouseDown event from react.
     */
    const onMouseDown = (e) => {
        resizingRef.current = {pageX: e.pageX, pageY: e.pageY}
        isResizing.current = true
    }

    /**
     * We don't want tables to exist inside another table, so to prevent this we use this function that
     * gets by each block_type what block_types it can contain, with this we filter the blockTypes option on the children blocks.
     * So when the user press '/' it will show fewer blocks.
     */
    const getBlocksItCanContain = () => {
        if (props.blockCanContainBlocks[props.block.block_type]) {
            return props.blockTypes.filter(blockType => props.blockCanContainBlocks[props.block.block_type].includes(blockType.id))
        } else {
            return props.blockTypes
        }
    }

    /**
     * Fired from the toolbar to change the color of the borders of the table.
     * 
     * @param {String} newBorderColor - Could be also null, this sets the color of the border as hex string.
     */
    const onChangeTableBorderColor = (newBorderColor) => {
        if (newBorderColor === '') {
            newBorderColor === null
        }
        props.block.table_option.border_color = newBorderColor
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
        let newColumnDimensions = columnDimensions
        let newRowDimensions = rowDimensions
        if (selectedEdge.row.isSelected) {
            for (let i=0; i<props.block.table_option.text_table_option_column_dimensions.length; i++) {
                const newBlock = createEmptyTextBlock(0)
                props.block.rich_text_depends_on_blocks.splice((props.block.table_option.text_table_option_column_dimensions.length * selectedEdge.row.index) + i,0, newBlock)
            }
            rowDimensions.push({ height: null })
            newRowDimensions = newRowDimensions.map(rowDimension => (rowDimension.height ? { height: rowDimension.height} : { height: null}))
            props.block.table_option.text_table_option_row_dimensions = newRowDimensions
            setRowDimensions([...newRowDimensions])
        } else {
            for (let i=0; i<props.block.table_option.text_table_option_row_dimensions.length; i++) {
                const newBlock = createEmptyTextBlock(0)
                props.block.rich_text_depends_on_blocks.splice(selectedEdge.column.index + (props.block.table_option.text_table_option_column_dimensions.length * i) + i,0, newBlock)
            }
            columnDimensions.push({ width: null })
            newColumnDimensions = columnDimensions.map(_ => ({ width: 100/columnDimensions.length}))
            props.block.table_option.text_table_option_column_dimensions = newColumnDimensions
            setColumnDimensions([...newColumnDimensions])
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
            if (props.block.table_option.text_table_option_column_dimensions.length > 1) {
                columnDimensions.splice(selectedEdge.column.index, 1)
                props.block.table_option.text_table_option_column_dimensions = columnDimensions

                for (let i=0; i<props.block.table_option.text_table_option_row_dimensions.length; i++) {
                    props.block.rich_text_depends_on_blocks.splice(selectedEdge.column.index + (props.block.table_option.text_table_option_column_dimensions.length * i),1)
                }
                selectedEdge.row.isSelected = false
                setColumnDimensions([...columnDimensions])
                setSelectedEdge({...selectedEdge})
                reorderBlocks()
                props.updateBlocks(props.block.uuid)
            }
        } else {
            if (props.block.table_option.text_table_option_row_dimensions.length > 1) {
                rowDimensions.splice(selectedEdge.row.index, 1)
                props.block.table_option.text_table_option_row_dimensions = rowDimensions
                for (let i=0; i<props.block.table_option.text_table_option_column_dimensions.length; i++) {
                    props.block.rich_text_depends_on_blocks.splice((props.block.table_option.text_table_option_column_dimensions.length * selectedEdge.row.index), 1)
                }
                selectedEdge.column.isSelected = false
                setRowDimensions([...rowDimensions])
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
        if (process.env['APP'] === 'web') {
            let newRowDimensions = rowDimensions
            const indexOfBlockInTable = props.block.rich_text_depends_on_blocks.findIndex(block => block.uuid === blockUUID)
            const newRowIndex = findRowOfBlockByBlockIndex(indexOfBlockInTable) + 1
            const columnIndex = findColumnOfBlockByBlockIndex(indexOfBlockInTable)
            rowDimensions.push({ height: null })
            newRowDimensions = newRowDimensions.map(rowDimension => (rowDimension.height ? { height: rowDimension.height} : { height: null}))
            props.block.table_option.text_table_option_row_dimensions = newRowDimensions
            let blockToFocus = null
            for (let i=0; i<props.block.table_option.text_table_option_column_dimensions.length; i++) {
                const newBlock = createEmptyTextBlock(0)
                if (i === columnIndex) blockToFocus = newBlock.uuid
                props.block.rich_text_depends_on_blocks.splice((props.block.table_option.text_table_option_column_dimensions.length*newRowIndex) + i,0, newBlock)
            }
            setRowDimensions([...newRowDimensions])
            reorderBlocks()
            props.updateBlocks(blockToFocus)
        }
    }

    useEffect(() => {
        // When mounting this component we check if it has the table options, otherwise we need to create it.
        // With this we can then mount the table on the screen.
        checkIfTableOptionsAndInsertIt()
        if (props.block.table_option?.text_table_option_column_dimensions && 
            JSON.stringify(props.block.table_option?.text_table_option_column_dimensions) !== JSON.stringify(columnDimensions)) {
                setColumnDimensions(props.block.table_option?.text_table_option_column_dimensions)
        }
        if (props.block.table_option?.text_table_option_row_dimensions &&
            JSON.stringify(props.block.table_option?.text_table_option_row_dimensions) !== JSON.stringify(rowDimensions)) {
                setRowDimensions(props.block.table_option?.text_table_option_row_dimensions)
        }

        if (process.env['APP'] === 'web') {
            document.addEventListener("mousemove", onResizeTableCell)
            document.addEventListener("mouseup", onMouseUp)

        }

        return () => {
            if (process.env['APP'] === 'web') {
                document.removeEventListener("mousemove", onResizeTableCell)
                document.removeEventListener("mouseup", onMouseUp)
            }
        }
    }, [])

    useEffect(() => {
        addToolbar()
    }, [props.activeBlock, selectedEdge])

    const columnsNumber = (props.block?.table_option?.text_table_option_column_dimensions || []).length

    const renderMobile = () => {
        return (
            <ScrollView horizontal={true} 
            keyboardShouldPersistTaps={'handled'}
            centerContent={true}
            >
                <View>
                    {(props.block?.table_option?.text_table_option_row_dimensions || []).map((_, rowIndex) => (
                        <View 
                        key={rowIndex}
                        style={{ 
                            display: 'flex',
                            flexDirection: 'row'
                        }}
                        >
                            {props.block.rich_text_depends_on_blocks.slice(rowIndex * columnsNumber, (rowIndex * columnsNumber) + columnsNumber).map((block, index) => {
                                const columnIndex = (rowIndex * columnsNumber) + index
                                block = block ? block : createEmptyTextBlock(rowIndex*columnIndex)
                                console.log(props.block.table_option.border_color)
                                return (
                                    <BlockTableCell
                                    key={block.uuid} 
                                    borderColor={props.block.table_option.border_color}
                                    isLastRow={rowIndex === (props.block?.table_option?.text_table_option_row_dimensions || []).length - 1}
                                    isLastColumn={index === columnsNumber - 1}
                                    >   
                                        <BlockTableResizeButton
                                            style={({ pressed }) => [
                                                {
                                                  backgroundColor: pressed
                                                    ? '#0dbf7e'
                                                    : 'red'
                                                }
                                            ]}
                                            buttonType={{isRight: true}}
                                            onPress={(e) => {
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
                                            onPress={(e) => {
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
                                            onPress={(e) => {
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
                                            onPress={(e) => {
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
                                        blockTypes={getBlocksItCanContain()}
                                        handleArrowNavigationNextBlockIndex={onHandleNextBlockArrowNavigation}
                                        handleArrowNavigationPreviousBlockIndex={onHandlePreviousBlockArrowNavigation}
                                        onDuplicateBlock={onDuplicateChildrenBlock}
                                        onDeleteBlock={onDeleteChildrenBlock}
                                        onRemoveCurrent={() => null}
                                        onRemoveAfter={() => null}
                                        contextBlocks={props.block.rich_text_depends_on_blocks} 
                                        onEnter={null}
                                        />   
                                    </BlockTableCell>
                                )
                            })}
                        </View>
                    ))}
                </View>
            </ScrollView>
        )
    }
    
    const renderWeb = () => {
        return (
            <BlockTableTable>
                <tbody>
                    {(props.block?.table_option?.text_table_option_row_dimensions || []).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {props.block.rich_text_depends_on_blocks.slice(rowIndex * columnsNumber, (rowIndex * columnsNumber) + columnsNumber).map((block, index) => {
                                const columnIndex = (rowIndex * columnsNumber) + index
                                block = block ? block : createEmptyTextBlock(rowIndex*columnIndex)
                                return (
                                    <BlockTableCell 
                                    key={block.uuid} 
                                    borderColor={props.block.table_option.border_color}
                                    height={rowDimensions[rowIndex].height}
                                    width={columnDimensions[index].width}
                                    >
                                        <Overlay 
                                        hasFocusTrigger={false}
                                        text={strings['pt-br']['richTextTableVerticalEdgeOverlayExplanationLabel']}
                                        >
                                            <BlockTableResizeButton
                                            buttonType={{isRight: true}}
                                            onMouseDown={(e) => {
                                                onMouseDown(e)
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
                                        <Overlay 
                                        hasFocusTrigger={false}
                                        text={strings['pt-br']['richTextTableVerticalEdgeOverlayExplanationLabel']}
                                        >
                                            <BlockTableResizeButton
                                            buttonType={{isLeft: true}}
                                            onMouseDown={(e) => {
                                                onMouseDown(e)
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
                                        <Overlay 
                                        hasFocusTrigger={false}
                                        text={strings['pt-br']['richTextTableHorizontalEdgeOverlayExplanationLabel']}
                                        >
                                            <BlockTableResizeButton
                                            buttonType={{isTop: true}}
                                            onMouseDown={(e) => {
                                                onMouseDown(e)
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
                                        <Overlay 
                                        hasFocusTrigger={false}
                                        text={strings['pt-br']['richTextTableHorizontalEdgeOverlayExplanationLabel']}
                                        >
                                            <BlockTableResizeButton
                                            buttonType={{isBottom: true}}
                                            onMouseDown={(e) => {
                                                onMouseDown(e)
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
                                        blockTypes={getBlocksItCanContain()}
                                        handleArrowNavigationNextBlockIndex={onHandleNextBlockArrowNavigation}
                                        handleArrowNavigationPreviousBlockIndex={onHandlePreviousBlockArrowNavigation}
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