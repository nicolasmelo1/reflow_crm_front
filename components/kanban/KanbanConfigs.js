import react from 'react'
import { Col, Dropdown } from 'react-bootstrap'

const KanbanConfig = () => {
    return (
        <Col sm={{ span: 3, }}>
            <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-config" size="sm" style={{ background: "#444444", borderRadius: "20px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "400" }}>
                        Configurações Obrigatórias
                    </span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item>config 1</Dropdown.Item>
                    <Dropdown.Item>config 2</Dropdown.Item>
                    <Dropdown.Item>config 3</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Col>
    )
}
export default KanbanConfig;