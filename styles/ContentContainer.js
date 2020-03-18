import styled from 'styled-components'
import { Container } from 'react-bootstrap'

export default styled(({ sidebarIsOpen, ...rest }) => <Container {...rest} />)`
    padding: 0 20px 0 20px;
    left: ${props => (props.sidebarIsOpen ? '310px' : '0')}; 
    transition: left 0.3s ease-in-out;
    max-width: 100%;
    background-color: whitesmoke;
    
`