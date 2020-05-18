import styled from 'styled-components'
import { Dropdown } from 'react-bootstrap'

export default styled(Dropdown.Menu)`
    width: 100%;
    padding: 0;
    overflow: auto;

    @media(max-width: 640px) {
        max-height: calc(var(--app-height) - 231px);
    };

    @media(min-width: 640px) {
        max-height: calc(var(--app-height) - 191px);
    };
`