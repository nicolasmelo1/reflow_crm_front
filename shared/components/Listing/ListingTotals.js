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
} from '../../styles/Listing'

/**
 * Since we render the totals the same way on the card and on the popover
 * we created this handy component, so you don't have to repeat code.
 * 
 * @param {Array<Object>} totals - The totals are an array, for fields that are number
 * we retrieve just one total element, but for fields that are not number, we count each 
 * occurence.
 */
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

/**
 * This component holds all of the total cards data and logic.
 * We just need this to render the totals card.
 * 
 * @param {Array<Object>} totals - The totals are an array, for fields that are number
 * we retrieve just one total element, but for fields that are not number, we count each 
 * occurence.
 * @param {String} formName - the name of the formulary the user is in, we can get this from the url parameters.
 */
const ListingTotals = (props) => {
    const totals = (props.totals) ? props.totals : []

    const onRemove = (totalId, index) => {
        props.totals.splice(index, 1)
        if (totalId) {
            props.onRemoveTotal(props.formName, totalId)
        }
        props.onUpdateTotals([...props.totals])
    }

    // overlaytrigger popperConfig explanation: https://stackoverflow.com/questions/54915720/react-bootstrap-overlaytrigger-is-not-positioned-correctly-while-container-has-o
    return (
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap'}}>
            {totals.map((card, index) => (
                <ListingTotalCardContainer key={index}>
                    <ListingTotalCardTitle>
                        <ListingTotalCardTitleLabel>
                            {card.field_label_name}
                            <ListingTotalCardTitleIcon icon="trash" onClick={e=> {onRemove(card.id, index)}}/>
                        </ListingTotalCardTitleLabel>
                    </ListingTotalCardTitle>
                    <OverlayTrigger trigger="click" placement="bottom" rootClose={true} delay={{ show: 250, hide: 100 }} overlay={<PopoverWithTotals elements={card.total}/>}
                    popperConfig={{
                        modifiers: {
                            preventOverflow: {
                                boundariesElement: 'offsetParent'
                            }
                        }
                    }} 
                    >
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