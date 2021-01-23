import React from 'react'
import { View } from 'react-native'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const TableBlockOptions = (props) => {
    const getAddButtonLabel = () => {
        if (props.selectedEdge.row.isSelected) {
            return 'Adicionar Linha'
        } else {
            return 'Adicionar Coluna'
        }
    } 

    const getRemoveButtonlabel = () => {
        if (props.selectedEdge.row.isSelected) {
            return 'Remover Coluna'
        } else {
            return 'Remover Linha'
        }
    }

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <button onClick={(e) => props.onAddNewRowOrColumn()}>
                    {getAddButtonLabel()}
                </button>
                <button onClick={(e) => props.onRemoveRowOrColumn()}>
                    {getRemoveButtonlabel()}
                </button>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TableBlockOptions