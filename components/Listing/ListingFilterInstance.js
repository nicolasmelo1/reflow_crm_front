import React, { useState } from 'react'
import { InputGroup, Dropdown, DropdownButton, FormControl, Button } from 'react-bootstrap'

const ListingFilterInstance = (props) => {

    const [formButtonTitle, setFormButtonTitle] = useState((props.parameter.label_name != "") ? props.parameter.label_name : "Filtrar por...");

    const prependFilterEvent = function (event, head) {
        event.stopPropagation();
        setFormButtonTitle(head.label_name)
        changeFilterState(head.name, head.label_name, props.parameter.value)
    }

    function changeFilterState(field_name, label_name, value) {
        props.filterState[props.ind] = {
            field_name: field_name,
            label_name: label_name,
            value: value
        }
        props.setFormInstanceNumber([...props.filterState])

    }

    return (
        <InputGroup>
            <DropdownButton
                as={InputGroup.Prepend}
                variant="outline-secondary"
                title={formButtonTitle}
            >
                {props.headers.map(function (head, index) {
                    return (
                        <Dropdown.Item
                            as="button"
                            onClick={e => (prependFilterEvent(e, head))}
                            key={index}
                        >
                            {head.label_name}
                        </Dropdown.Item>
                    )
                })}
            </DropdownButton>
            <FormControl
                placeholder="Palavra-chave"
                value={props.parameter.value}
                onChange={e => changeFilterState(props.parameter.label_name, props.parameter.field_name, e.target.value)}
            />
            <Button as={InputGroup.Append}> X </Button>
        </InputGroup>

    )
}

export default ListingFilterInstance;