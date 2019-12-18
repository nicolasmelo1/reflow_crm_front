import react from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
const GestaoDataAtualizacao = () => {
    return (
        <div className="parent">
            <style type="text/css">
                {`
                .inline-block-child {
                display: inline-block;
                }
                `}
            </style>
            <div class="inline-block-child">
                <p style={{ color: "#444444", fontSize: "30px", fontWeight: "600", fontStyle: "italic", fontFamily: "Segoe UI" }}>Data de Atualização: </p>
            </div>
            <div class="inline-block-child">
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" style={{ backgroundColor: "Transparent", color: "#0dbf7e", outline: "none", border: "none", fontSize: "30px", fontWeight: "600" }}>
                        16/07/2019 - 13/09/2019
            </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>16/07/2019 - 13/09/2019</Dropdown.Item>
                        <Dropdown.Item>17/05/2019 - 15/07/2019</Dropdown.Item>
                        <Dropdown.Item>19/03/2019 - 16/05/2019</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    )
}

export default GestaoDataAtualizacao;