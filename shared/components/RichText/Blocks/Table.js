import React from 'react'
import { View } from 'react-native'
import Content from '../Content'
import Blocks from '../Blocks'
/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */



const Table = (props) => {
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

    const renderMobile = () => {
        return (
            <View></View>
        )
    }
    
    const renderWeb = () => {
        return (
            <table>
                <tbody>
                    {tableData.map((tableColumnsData, tableRowIndex) => (
                        <tr key={tableRowIndex}>
                            {tableColumnsData.map((block, columnIndex) => (
                                <td key={columnIndex} style={{ border: '1px solid #000', padding: '10px'}}>
                                    {block ? (<Blocks {...props} block={block}/>) : ('')}
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