import React from 'react'
import { View } from 'react-native'
import { strings } from '../../../../utils/constants'
import { 
    TableBlockOptionAddOrRemoveButton,
} from '../../../../styles/RichText'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const TableBlockOptions = (props) => {
    const getAddButtonLabel = () => {
        if (props.selectedEdge.row.isSelected) {
            return strings['pt-br']['richTextTableToolbarAddRowButtonLabel']
        } else {
            return strings['pt-br']['richTextTableToolbarAddColumnButtonLabel']
        }
    } 

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
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TableBlockOptions