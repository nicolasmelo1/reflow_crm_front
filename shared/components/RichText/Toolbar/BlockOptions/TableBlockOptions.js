import React, { useState } from 'react'
import { View } from 'react-native'
import { strings } from '../../../../utils/constants'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { 
    TableBlockOptionAddOrRemoveButton,
    TableBlockOptionTableBorderColorActivationButton,
    TableBlockOptionTableBorderColorContainer,
    TableBlockOptionTableBorderColorOptionsContainer,
    TableBlockOptionTableBorderColorOptionButton
} from '../../../../styles/RichText'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const TableBlockOptions = (props) => {
    const [isBorderColorOptionsOpen, setIsBorderColorOptionsOpen] = useState(false)
    const borderColors = [
        '', 
        '#ffffff',
        '#0dbf7e', 
        '#17242D', 
        '#bfbfbf', 
        '#444444', 
        '#ff5ac4', 
        '#ff158a', 
        '#bb3354', 
        '#7f5347',
        '#ff662e',
        '#ffcb00',
        '#cab641',
        '#9cd326',
        '#037f4b',
        '#0086c0',
        '#579cfc',
        '#66ccff'
    ]

    /**
     * Used when rendering the toolbar of the table. If the row edge is selected we show to add a new row,
     * otherwise we show to add a column. This is just for changing the text of the button.
     */
    const getAddButtonLabel = () => {
        if (props.selectedEdge.row.isSelected) {
            return strings['pt-br']['richTextTableToolbarAddRowButtonLabel']
        } else {
            return strings['pt-br']['richTextTableToolbarAddColumnButtonLabel']
        }
    } 

    /**
     * Similar to `.getAddButtonLabel()` but it's the opposite, when the row is selected we show to delete the column
     * and when the column is selected we show to delete the row. This is just for changing the text of the button.
     */
    const getRemoveButtonlabel = () => {
        if (props.selectedEdge.row.isSelected) {
            return strings['pt-br']['richTextTableToolbarRemoveColumnButtonLabel']
        } else {
            return strings['pt-br']['richTextTableToolbarRemoveRowButtonLabel']
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
                {props.selectedEdge.row.isSelected || props.selectedEdge.column.isSelected ? (
                    <React.Fragment>
                        <TableBlockOptionAddOrRemoveButton onClick={(e) => props.onAddNewRowOrColumn()}>
                            {getAddButtonLabel()}
                        </TableBlockOptionAddOrRemoveButton>
                        <TableBlockOptionAddOrRemoveButton onClick={(e) => props.onRemoveRowOrColumn()}>
                            {getRemoveButtonlabel()}
                        </TableBlockOptionAddOrRemoveButton>
                    </React.Fragment>
                ) : ''}
                <TableBlockOptionTableBorderColorContainer>
                    <TableBlockOptionTableBorderColorActivationButton
                    onClick={(e) => setIsBorderColorOptionsOpen(!isBorderColorOptionsOpen)}
                    >
                        <FontAwesomeIcon icon={'border-all'}/>
                    </TableBlockOptionTableBorderColorActivationButton>
                    {isBorderColorOptionsOpen ? (
                        <TableBlockOptionTableBorderColorOptionsContainer>
                            {borderColors.map(color => (
                                <TableBlockOptionTableBorderColorOptionButton
                                key={color} 
                                borderColor={color}
                                onClick={(e) => {
                                    setIsBorderColorOptionsOpen(!isBorderColorOptionsOpen)
                                    props.onChangeTableBorderColor(color)
                                }}
                                >
                                    <FontAwesomeIcon icon={'border-all'}/>
                                </TableBlockOptionTableBorderColorOptionButton>
                            ))}
                        </TableBlockOptionTableBorderColorOptionsContainer>
                    ) : ''}
                </TableBlockOptionTableBorderColorContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TableBlockOptions