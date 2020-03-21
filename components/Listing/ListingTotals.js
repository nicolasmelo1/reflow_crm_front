import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { 
    ListingTotalCardContainer, 
    ListingTotalCardTitle, 
    ListingTotalCardContent, 
    ListingTotalCardTitleLabel, 
    ListingTotalCardTitleIcon, 
    ListingTotalCardTotalContainer, 
    ListingTotalCardTotalLabel 
} from 'styles/Listing'

const Totals = (props) => {
    return (
        <div>
            {props.totals.map((total, index) => (
                <ListingTotalCardTotalContainer key={index} hasBorderBottom={index < props.totals.length-1}>
                    <ListingTotalCardTotalLabel>
                        {total.option}
                    </ListingTotalCardTotalLabel>
                    <ListingTotalCardTotalLabel isTotal={true}>
                        {total.value}
                    </ListingTotalCardTotalLabel>
                </ListingTotalCardTotalContainer>
            ))}
        </div>
    )
}

const PopoverWithTotals = React.forwardRef((props, ref) => {
    return (
        <Popover ref={ref} {...props}>
            <Popover.Content>
                {props.elements ? (<Totals totals={props.elements}/>): ''}
            </Popover.Content>
        </Popover>
    )
})

const ListingTotals = (props) => {
    const totals = (props.totals) ? props.totals : []

    const onRemove = (totalId, index) => {
        props.totals.splice(index, 1)
        if (totalId) {
            props.onRemoveTotal(props.formName, totalId)
        }
        props.onUpdateTotals([...props.totals])
    }

    return (
        <div>
            {totals.map((card, index) => (
                <ListingTotalCardContainer key={index}>
                    <ListingTotalCardTitle>
                        <ListingTotalCardTitleLabel>
                            {card.field_label_name}
                            <ListingTotalCardTitleIcon icon="trash" onClick={e=> {onRemove(card.id, index)}}/>
                        </ListingTotalCardTitleLabel>
                    </ListingTotalCardTitle>
                    <OverlayTrigger trigger="click" placement="bottom" rootClose={true} delay={{ show: 250, hide: 100 }} overlay={<PopoverWithTotals elements={card.total}/>}>
                        <ListingTotalCardContent>
                            <Totals totals={card.total}/>
                        </ListingTotalCardContent>
                    </OverlayTrigger>
                </ListingTotalCardContainer>
            ))}
        </div>
    )
}
export default ListingTotals