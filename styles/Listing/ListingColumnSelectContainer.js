import styled from 'styled-components'
import { Dropdown } from 'react-bootstrap'

export default styled(Dropdown)`
    @media(max-width: 440px) {
        width: 100%;
    };
    @media(min-width: 440px) {
        float: right;
    }
`