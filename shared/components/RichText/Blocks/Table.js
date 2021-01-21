import React, { useEffect } from 'react'
import { View } from 'react-native'
import Content from '../Content'
import Block from '../Blocks'
/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */



const Table = (props) => {

    /**
     * THis is a function for adding the toolbar in the root of the page.
     * With this simple function we can maintain a simple API for the components to follow and also allow
     * complex layouts to be created.
     * 
     * So let's start. HOW THE F•C* does this work?
     * - First things first: On the parent component we do not keep the state but instead we keep everything inside
     * of a ref. This way we can prevent rerendering stuff and just rerender when needed.
     * - Second of all you need to add this function on a useEffect hook or a componentDidUpdate, this way after every
     * rerender of your component we can keep track on what is changing and force the rerender of the hole page tree.
     * - Third but not least we save all of the data needed to render a Toolbar. This means we need the following parameters:
     *  - `blockUUID` - The uuid of the current block
     *  - `contentOptionComponent` - The React component of the content options we want to render, these are options of each content
     * of the block. They are usually the same, but sometimes you are not dealing with text, so you want to prevent the user
     * from selecting bold and so on.
     *  - `blockOptionComponent` - The React component of the BLOCK options we want to render, these are options for the specific
     * block you have selected.
     *  - `contentOptionProps` - The props that will go to `contentOptionComponent`
     *  - `blockOptionProps` - The props that will go to `blockOptionComponent`
     * 
     * HOW TO USE THIS:
     * You need to run this function ONLY inside of a useEffect of componentDidUpdate. MAKE SURE YOU ARE LISTENING TO THE
     * the state changes that you need. (for example, here we are listening for changes in props, every other state
     * change is irrelevant. When any of this states changes we want the toolbar to update accordingly.)
     */
    const addToolbar = () => {
        if (props.addToolbar) {      
            props.toolbarProps.blockUUID = props.block.uuid
            props.addToolbar({...props.toolbarProps})
        }
    }

    const tableOptions = () => ({
            id: null,
            rows_num: 2,
            columns_num: 2,
            border_color: null
    })

    const findRowOfBlockByBlockIndex = (blockIndex) => {
        
    }

    const checkIfTableOptionsAndInsertIt = () => {
        if (props.block.table_option === null) {
            props.block.table_option = tableOptions()
            if ([null, undefined].includes(props.block.rich_text_depends_on_blocks)) {
                props.block.rich_text_depends_on_blocks = []
            }
            for (let i = 0; i < props.block.table_option.rows_num * props.block.table_option.columns_num; i++) {
                props.block.rich_text_depends_on_blocks.push(props.createNewBlock({
                    order: i, 
                    blockTypeId: props.getBlockTypeIdByName('text')
                }))
            }
        }
        props.updateBlocks(props.block.uuid)
    }   

    const formatedTableData = () => {
        if (props.block.table_option) {
            let indexDataHelper = 0
            const tableData = Array.apply(null, Array(props.block.table_option.rows_num)).map(_ => {
                return Array.apply(null, Array(props.block.table_option.columns_num)).map(_ => {
                    let block = props.block.rich_text_depends_on_blocks[indexDataHelper]
                    if (!block) {
                        block = null
                    } else {
                        indexDataHelper++
                    }
                    return block
                })
            })
            return tableData
        } else {
            return []
        }
    }
    
    const onDeleteChildrenBlock = (blockUUID) => {
        if (props.contextBlocks.length > 1) {
            const indexOfBlockInTable = props.block.rich_text_depends_on_blocks.findIndex(block => block.uuid === blockUUID)
            const newBlock = props.createNewBlock({
                order: indexOfBlockInTable, 
                blockTypeId: props.getBlockTypeIdByName('text')
            })
            props.block.rich_text_depends_on_blocks.splice(indexOfBlockInTable, 1, newBlock)
            props.updateBlocks(newBlock.uuid)
        }
    }

    const onEnter = (blockUUID) => {
        const indexOfBlockInTable = props.block.rich_text_depends_on_blocks.findIndex(block => block.uuid === blockUUID)
        props.block.table_option.rows_num = props.block.table_option.rows_num + 1
        let blockToFocus = null
        for (let i=0; i<props.block.table_option.columns_num; i++) {
            const newBlock = props.createNewBlock({
                order: indexOfBlockInTable, 
                blockTypeId: props.getBlockTypeIdByName('text')
            })
            if (i === 0) blockToFocus = newBlock.uuid
            props.block.rich_text_depends_on_blocks.push(newBlock)
        }
        props.updateBlocks(blockToFocus)

    }

    useEffect(() => {
        checkIfTableOptionsAndInsertIt()
    }, [])

    useEffect(() => {
        addToolbar()
    }, [props.activeBlock])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }
    
    const renderWeb = () => {
        return (
            <table style={{ width: '100%'}}>
                <tbody>
                    {formatedTableData().map((tableColumnsData, tableRowIndex) => (
                        <tr key={tableRowIndex}>
                            {tableColumnsData.map((block, columnIndex) => (
                                <td key={columnIndex} style={{ border: '1px solid #000', padding: '10px', position: 'relative'}}>
                                    <button
                                    onClick={(e) => {props.updateBlocks(props.block.uuid)}}
                                    style={{
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        right: 0,
                                        bottom: 0,
                                        top: 0,
                                        width: '1px',
                                        backgroundColor: 'red',
                                        padding: 0,
                                        border: 0
                                    }}
                                    />
                                     <button
                                    onClick={(e) => {props.updateBlocks(props.block.uuid)}}
                                    style={{
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        left: 0,
                                        bottom: 0,
                                        top: 0,
                                        width: '1px',
                                        backgroundColor: 'red',
                                        padding: 0,
                                        border: 0
                                    }}
                                    />
                                     <button
                                    onClick={(e) => {props.updateBlocks(props.block.uuid)}}
                                    style={{
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        height: '1px',
                                        width: '100%',
                                        backgroundColor: 'red',
                                        padding: 0,
                                        border: 0
                                    }}
                                    />
                                     <button
                                    onClick={(e) => {props.updateBlocks(props.block.uuid)}}
                                    style={{
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        height: '1px',
                                        width: '100%',
                                        backgroundColor: 'red',
                                        padding: 0,
                                        border: 0
                                    }}
                                    />

                                    {block ? (
                                        <Block 
                                        {...props} 
                                        block={block} 
                                        onDeleteBlock={onDeleteChildrenBlock}
                                        contextBlocks={props.block.rich_text_depends_on_blocks} 
                                        onEnter={onEnter}
                                        />
                                    ) : (
                                        <Block 
                                        {...props} 
                                        block={props.createNewBlock({
                                            order: tableRowIndex*columnIndex, 
                                            blockTypeId: props.getBlockTypeIdByName('text')
                                        })} 
                                        onDeleteBlock={onDeleteChildrenBlock}
                                        contextBlocks={props.block.rich_text_depends_on_blocks} 
                                        onEnter={onEnter}
                                        />
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Table