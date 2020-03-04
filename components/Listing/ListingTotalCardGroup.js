import React from 'react'
import { Card } from 'react-bootstrap'
import { ListingTotalCard, ListingTotalCardTitle, ListingTotalCardBody } from 'styles/Listing'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const ListingTotalCardGroup = (props) => {
    const totalCards = (props.cards) ? props.cards : []

    return (
        <div>
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
                            {card.total.map(function (each, index) {
                                return (
                                    <div key={index}>
                                        <p>
                                            {each.option}:
                                        </p>
                                        <p>
                                            {each.value}
                                        </p>
                                    </div>
                                )
                            })}
                        </ListingTotalCardBody>
                    </ListingTotalCard>
                )
            })}
        </div>
    )
}
export default ListingTotalCardGroup