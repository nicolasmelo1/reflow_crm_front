import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { ListingEditButtonIcon, ListingDeleteButtonIcon, ListingTableContentElement, ListingTableContentPopoverElement } from 'styles/Listing'

const PopoverWithContent = React.forwardRef((props, ref) => {
    return (
        <Popover ref={ref} {...props}>
            <Popover.Content>
                {props.elements ? props.elements.map((element, index) => (
                    <ListingTableContentPopoverElement key={index} hasBorderBottom={index < props.elements.length-1}>
                        {element.value}
                    </ListingTableContentPopoverElement>
                )): ''}
            </Popover.Content>
        </Popover>
    )
})

const TableContentElement = (props) => {
    return (
        <OverlayTrigger 
        trigger="click"
        placement="bottom"
        rootClose={true}
        delay={{ show: 250, hide: 100 }}
        overlay={<PopoverWithContent elements={props.elements}/>}
        >
            <ListingTableContentElement>
                {(props.elements.length !== 0) ? props.elements[0].value: ''}
            </ListingTableContentElement>
        </OverlayTrigger>

    )
}

const ListingTableContent = (props) => {
    return (
        <tbody>
            {props.data.map((data, index) => {
                return (
                    <tr key={index}>
                        {props.headers.filter(head => head.user_selected).map((head, index) => {
                            const elements = data.dynamic_form_value.filter(data => data.field_name == head.name)
                            return (
                                <TableContentElement key={index} elements={elements}/>
                            )
                        })}
                        <ListingTableContentElement isTableButton={true}>
                            <ListingEditButtonIcon icon="pencil-alt" onClick={e=> {props.setFormularyId(data.id)}}/>
                        </ListingTableContentElement>
                        <ListingTableContentElement isTableButton={true}>
                            <ListingDeleteButtonIcon icon="trash" />
                        </ListingTableContentElement>
                    </tr>
                )
            })}

        </tbody>

    )
}

export default ListingTableContent