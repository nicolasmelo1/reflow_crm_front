import React, { useState } from 'react';
import ListingColSelectButton from 'styles/Listing';
import { Button, Dropdown, FormControl } from 'react-bootstrap';


const ListingColumnSelectButton = (props) => {
    const header = props.headers.field_headers || [];

    const onToggleSelect = (e, index) => {
        e.preventDefault()
        props.onUpdateSelected(index, 'negocios')
    }

    const SelectMenu = React.forwardRef(
        ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
            const [value, setValue] = useState('');

            return (
                <div
                    ref={ref}
                    style={style}
                    className={className}
                    aria-labelledby={labeledBy}
                >
                    <FormControl
                        autoFocus
                        className="mx-3 my-2 w-auto"
                        placeholder="Filtrar colunas"
                        onChange={e => setValue(e.target.value)}
                        value={value}
                    />
                    <ul className="list-unstyled">
                        {React.Children.toArray(children).filter(
                            child =>
                                !value || child.props.children.toLowerCase().startsWith(value),
                        )}
                    </ul>
                </div>
            );
        },
    );



    return (

        <Dropdown>
            <Dropdown.Toggle as={Button} id="dropdown-custom-components">
                Selecionar colunas exibidas
            </Dropdown.Toggle>

            <Dropdown.Menu as={SelectMenu}>
                {header.map(function (data, index) {
                    return (
                        <Dropdown.Item
                            as="button"
                            eventKey={index}
                            onClick={e => onToggleSelect(e, index)}
                            active={data.user_selected}
                            key={index}
                        >
                            {data.label_name}
                        </Dropdown.Item>
                    )
                })}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default ListingColumnSelectButton;