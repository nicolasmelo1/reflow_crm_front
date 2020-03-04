import React from 'react'
import { ListingEditButton, ListingDeleteButton, ListingEditButtonIcon, ListingDeleteButtonIcon } from 'styles/Listing'


const ListagemTableContent = (props) => {

    const headers = (props.headers && props.headers.field_headers) ? props.headers.field_headers: []
    const contents = (props.contents) ? props.contents: []
    
    return (
        <tbody>
            {contents.map((content, index) => {
                return (
                    <tr key={index}>
                        {headers.filter(head => head.user_selected).map((head, index) => {
                            const element = content.dynamic_form_value.filter(data => data.field_name == head.name)
                            if (element.length == 0) {
                                return (
                                    <td key={index}></td>
                                )
                            } else {
                                return (
                                    <td key={index}>{element[0].value}</td>
                                )
                            }
                        })}
                        <td>
                            <ListingEditButton>
                                <ListingEditButtonIcon icon="trash" />
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

export default ListagemTableContent