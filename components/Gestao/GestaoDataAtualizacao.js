import react from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { GestaoDataLabel, GestaoDataDiv, GestaoDataDropdownToggle } from 'styles/Gestao'

const GestaoDataAtualizacao = () => {
    return (
        <div>

            <GestaoDataDiv>
                <GestaoDataLabel>Data de Atualização: </GestaoDataLabel>
            </GestaoDataDiv>
            <GestaoDataDiv>
                <Dropdown>
                    <GestaoDataDropdownToggle>
                        16/07/2019 - 13/09/2019
                    </GestaoDataDropdownToggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>16/07/2019 - 13/09/2019</Dropdown.Item>
                        <Dropdown.Item>17/05/2019 - 15/07/2019</Dropdown.Item>
                        <Dropdown.Item>19/03/2019 - 16/05/2019</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </GestaoDataDiv>
        </div>
    )
}

export default GestaoDataAtualizacao;