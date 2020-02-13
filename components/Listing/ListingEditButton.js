import React from 'react'
import { Button } from 'react-bootstrap/lib/InputGroup'
import ListingEditButtonIcon from 'styles/Listing'


const ListingEditButton = () => {
    return (
        <Button>
            <ListingEditButtonIcon icon="trash" />
        </Button>
    )
}

export default ListingEditButton;
