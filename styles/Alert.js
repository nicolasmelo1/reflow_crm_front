import { Alert } from 'react-bootstrap'
import styled, { keyframes } from 'styled-components'

const goUp = keyframes`
    0% {
        transform: translateY(0);
    }
    
    75% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(-100%);
    }
`;

const StyledAlert = styled(Alert)`
    animation: ${goUp} 5s;
`

export default StyledAlert