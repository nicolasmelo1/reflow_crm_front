import React from 'react'
import { Card } from 'react-bootstrap'
import { ListingTotalCard, ListingTotalCardTitle, ListingTotalCardBody } from 'styles/Listing'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const ListingTotalCardGroup = (props) => {

    return (
        <>
            {props.cards.map(function (card, index) {
                return (
                    <ListingTotalCard>
                        <Card.Title>

                            <ListingTotalCardTitle>

                                {card.field_label_name}
                                <FontAwesomeIcon icon="trash" style={{ width: "20px", color: "red" }} />

                            </ListingTotalCardTitle>
                        </Card.Title>
                        <ListingTotalCardBody>
                            {card.total.map(function (each, aux) {
                                return (
                                    <>
                                        <p><strong>{each.option}:</strong> {each.value}</p>
                                    </>
                                )
                            })}
                        </ListingTotalCardBody>
                    </ListingTotalCard>
                )
            })}


        </>
    )
}
export default ListingTotalCardGroup