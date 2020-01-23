import React from 'react'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const TblPopover = (props) => {

    let popover = (
        <Popover>
            <Popover.Title as="h3">
                {props.element}
            </Popover.Title>
            <Popover.Content>
                <ButtonGroup vertical>
                    {allUnique}
                </ButtonGroup>
            </Popover.Content>
        </Popover>
    );

    return (



        <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <th style={{ backgroundColor: "#f2f2f2", color: "#0dbf7e", fontSize: "20px", fontWeight: "700" }}>
                <FontAwesomeIcon icon="sort-amount-down" style={{ width: "19px", color: "gray" }} />
                {props.element}
            </th>
        </OverlayTrigger>



    )
}


export default TblPopover;