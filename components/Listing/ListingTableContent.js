import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { ListingEditButton, ListingDeleteButton, ListingEditButtonIcon, ListingDeleteButtonIcon } from 'styles/Listing'

const PopoverWithContent = React.forwardRef((props, ref) => {
    return (
        <Popover ref={ref} {...props}>
            <Popover.Content>
                {props.elements ? props.elements.map((element, index) => (
                    <p key={index} style={{ borderBottom: '1px solid #bfbfbf', padding: '0', margin: '5px'}}>
                        {element.value}
                    </p>
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
            <td style={{ maxHeight: '20px', overflow: 'hidden', maxWidth: '50px', border:'1px solid #f2f2f2', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                {(props.elements.length !== 0) ? props.elements[0].value: ''}
            </td>
        </OverlayTrigger>

    )
}


const ListingTableContent = (props) => {

    const headers = (props.headers && props.headers.field_headers) ? props.headers.field_headers: []
    const contents = (props.contents) ? props.contents: []
    
    return (
        <tbody>
            {contents.map((content, index) => {
                return (
                    <tr key={index} style={{ maxHeight: '20px'}}>
                        {headers.filter(head => head.user_selected).map((head, index) => {
                            const elements = content.dynamic_form_value.filter(data => data.field_name == head.name)
                            return (
                                <TableContentElement key={index} elements={elements}/>
                            )
                        })}
                        <td>
                            <ListingEditButton onClick={e=> {props.setFormularyId(content.id)}}>
                                <ListingEditButtonIcon icon="trash"/>
                            </ListingEditButton>
                        </td>
                        <td>
                            <ListingDeleteButton>
                                <ListingDeleteButtonIcon icon="trash" />
                            </ListingDeleteButton>
                        </td>
                    </tr>
                )
            })}

        </tbody>

    )
}

export default ListingTableContent