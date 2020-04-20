import styled from 'styled-components'
import { Container } from 'react-bootstrap'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled(({ sidebarIsOpen, ...rest }) => <Container {...rest} />)`
    padding: 30px 20px 0 20px;
    left: ${props => (props.sidebarIsOpen ? '310px' : '0')}; 
    transition: left 0.3s ease-in-out;
    max-width: 100%;    
`
:
styled(View)`
    padding: 10px;
    height: 100%;
    width: 100%;
    flex: 2;
    top: 0;
    flex-direction: row;
`