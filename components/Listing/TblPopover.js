import React from 'react'

import { TblPopoverIcon, TblPopoverHead } from 'styles/Listing'

const TblPopover = (props) => {

    return (
        <TblPopoverHead>
            <TblPopoverIcon icon="sort-amount-down" />
            {props.element}
        </TblPopoverHead>
    )
}


export default TblPopover;