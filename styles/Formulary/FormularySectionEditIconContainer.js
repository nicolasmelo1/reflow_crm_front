import styled from 'styled-components'
import { Col } from 'react-bootstrap'

export default styled(Col)`
    color: #444;
    border-radius: 5px;
    margin: 10px 10px;
    box-shadow: ${props=> props.isOpen ? 'inset 5px 5px 10px #dcdcdc, inset -5px -5px 10px #ffffff': '5px 5px 5px #d0d0d0, -5px -5px 5px #ffffff'};
    text-align: center;
    cursor: pointer;

    &:hover {
        box-shadow: inset 5px 5px 10px #dcdcdc, 
                    inset -5px -5px 10px #ffffff;
    }
`