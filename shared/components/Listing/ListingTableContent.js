import React, { useState } from 'react'
import dynamicImport from '../../utils/dynamicImport'
import { strings } from '../../utils/constants'
import Alert from '../Utils/Alert'
import PopoverContent from '../../styles/PopoverContent'
import Styled from './styles'

const OverlayTrigger = dynamicImport('react-bootstrap', 'OverlayTrigger')
const Popover = dynamicImport('react-bootstrap', 'Popover')
const useRouter = dynamicImport('next/router', 'useRouter')

const PopoverWithContent = React.forwardRef((props, ref) => {
    return (
        <Popover ref={ref} {...props}>
            <PopoverContent>
                {props.elements ? props.elements.map((element, index) => (
                    <Styled.ListingTableContentPopoverElement key={index} hasBorderBottom={index < props.elements.length-1}>
                        {element.value}
                    </Styled.ListingTableContentPopoverElement>
                )): ''}
            </PopoverContent>
        </Popover>
    )
})

/**
 * Component that renders each element of the table. We need this especially because
 * each element of the table has a popover, since each element has a fixed height, 
 * not all data is shown to the user, especially for multi sections and multi options
 * 
 * @param {Array<Object>} elements - All of the elements of the field, since the single 
 * field can have multiple values we recieve all of the values in a array for this field
 */
const TableContentElement = (props) => {

    const getElementValue = () => {
        if (props.elements.length !== 0) {
            return props.elements[0].value
        } else if (props.elements.length > 1) {
            return props.elements[props.elements.length - 1].value
        } else {
            return ''
        }
    }

    return (
        <OverlayTrigger 
        trigger="click"
        placement="auto"
        rootClose={true}
        delay={{ show: 250, hide: 100 }}
        overlay={<PopoverWithContent elements={props.elements}/>}
        >
            <Styled.ListingTableContentElement
            isEven={props.isEven}
            >
                {getElementValue()}
            </Styled.ListingTableContentElement>
        </OverlayTrigger>
    )
}


/**
 * This component all of the content of the table, so, all of the data.
 * 
 * @param {Function} setFormularyId - This function is actually retrieved from the page, this function retrieved 
 * from the Data page sets a FormularyId when the user clicks the pencil button to edit and open the formulary.
 * @param {Object} headers - object containing primarly all of the fields in the header.
 * @param {Array<Object>} data - The data to display on the table.
 */
const ListingTableContent = (props) => {
    const router = useRouter()
    const [formularyIdToRemove, setFormularyIdToRemove] = useState(null)
    const [showAlert, setShowAlert] = useState(false)

    const removeForm = (formId) => {
        const data = JSON.parse(JSON.stringify(props.data.filter(form=> form.id !== formId)))
        props.onRemoveData(data, router.query.form, formId)
        setFormularyIdToRemove(null)
    }

    return (
        <tbody>
            <tr>
                <td style={{ padding: 0}}>
                    <Alert 
                    alertTitle={strings['pt-br']['listingDeleteAlertTitle']}
                    alertMessage={strings['pt-br']['listingDeleteAlertContent']} 
                    show={showAlert} 
                    onHide={() => {
                        setFormularyIdToRemove(null)
                        setShowAlert(false)
                    }} 
                    onAccept={() => {
                        setShowAlert(false)
                        removeForm(formularyIdToRemove)
                    }}
                    onAcceptButtonLabel={strings['pt-br']['listingDeleteAlertAcceptButtonLabel']}
                    />
                </td>
            </tr>
            {props.data.map((data, dataIndex) => (
                <tr key={data.id}>
                    <Styled.ListingTableContentElement 
                    isEven={dataIndex % 2 === 0}
                    isTableButton={true}
                    >
                        <Styled.ListingEditButtonIcon icon="pencil-alt" onClick={e=> {props.setFormularyId(data.id)}}/>
                    </Styled.ListingTableContentElement>
                    <Styled.ListingTableContentElement 
                    isEven={dataIndex % 2 === 0}
                    isTableButton={true}
                    >
                        <Styled.ListingDeleteButtonIcon icon="trash" onClick={e=> {
                            setFormularyIdToRemove(data.id)
                            setShowAlert(true)
                        }}/>
                    </Styled.ListingTableContentElement>
                    {props.fieldHeaders.filter(head => head.is_selected).map((head, headIndex) => {
                        const elements = (data) ? data.dynamic_form_value.filter(data => data.field_name == head.field.name): []
                        return (
                            <TableContentElement 
                            key={dataIndex+headIndex} 
                            isEven={dataIndex % 2 === 0}
                            elements={elements}
                            />
                        )
                    })}
                </tr>
            ))}
        </tbody>
    )
}

export default ListingTableContent