import React, { useState } from 'react';
import { Button, FormGroup, Form, Collapse } from 'react-bootstrap';
const KanbanConfigButton = (props) => {

    const [field, setField] = useState("")

    function setKanbanScope(e) {
        e.preventDefault()
        let urlParams = {
            from: '03/01/2020',
            to: '02/03/2020',
            page: 1,
            fields: props.card_options,
            search_value: [],
            search_exact: ["1"],
            search_field: []
        }
        setField(e)
        urlParams.search_value = field.label
        urlParams.search_field = field.name
        props.onGetDimensionOrder('negocios', field.name)
        props.onGetDataKanban(urlParams, 'negocios')
    }

    const [open, setOpen] = useState(false); // Collapse stuff

    return (
        <>
            <Button onClick={() => setOpen(!open)} aria-controls="confobr" aria-expanded={open}> Config. Obrig. </Button>
            <Collapse in={open}>
                <h2>Dimensão</h2>
                <Form>
                    <FormGroup controlId="dimension-form">
                        <Form.Control as="select" value="" onChange={e => (setKanbanScope(e.target.value))}>
                            {props.card_options.map(function (option, index) {
                                return <option key={index} value={option}>{option.label}</option>
                            })}
                        </Form.Control>
                    </FormGroup>
                </Form>
            </Collapse>
        </>
    )
}
export default KanbanConfigButton