import React from 'react'
import { ListingEditButton, ListingDeleteButton, ListingEditButtonIcon, ListingDeleteButtonIcon } from 'styles/Listing'


const ListagemTableContent = (props) => {

    const header = props.headers.field_headers || [];

    return (

        <tbody>

            {props.contents.map((content, index) => {

                let row = header.filter(head => head.user_selected).map((head, index) => {
                    const element = content.dynamic_form_value.filter(data => data.field_name == head.name)


                    if (element.length == 0) {
                        return <td key={index}></td>
                    } else {
                        return (<td key={index}>{element[0].value}</td>)

                    }
                });

                return (
                    <tr key={index}>
                        {row}
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