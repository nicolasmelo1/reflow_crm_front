import React from 'react'
import { Card } from 'react-bootstrap'
import { ListingTotalCard, ListingTotalCardTitle, ListingTotalCardBody } from 'styles/Listing'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const ListingTotalCardGroup = (props) => {
    const totalCards = (props.cards) ? props.cards : []

    return (
        <div style={{display: 'inline-block'}}>
            {totalCards.map(function (card, index) {
                return (
                    <ListingTotalCard key={index}>
                        <Card.Title>
                            <ListingTotalCardTitle>
                                {card.field_label_name}
                                <FontAwesomeIcon icon="trash" style={{ width: "20px", color: "red" }} />
                            </ListingTotalCardTitle>
                        </Card.Title>
                        <ListingTotalCardBody>
                            <table key={index}>
                                <tbody>
                                    {card.total.map(function (each, index) {
                                        return (
                                            <tr key={index}>
                                                <td style={{margin: '0', fontSize: '12px'}}>
                                                    {each.option}
                                                </td>
                                                <td style={{margin: '0', fontSize: '12px', fontWeight: 'bold'}}>
                                                    {each.value}
                                                </td>
                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </table>
                        </ListingTotalCardBody>
                    </ListingTotalCard>
                )
            })}
        </div>
    )
}
export default ListingTotalCardGroup