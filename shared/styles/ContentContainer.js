import styled from 'styled-components'
import { Container } from 'react-bootstrap'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled(({ showSideBar, sidebarIsOpen, ...rest }) => <Container {...rest} />)`
    padding: ${props => props.showSideBar ? '30px 20px 0 20px' : '10px 20px 0 20px'};
    left: ${props => (props.sidebarIsOpen ? '310px' : '0')}; 
    transition: left 0.3s ease-in-out;
    max-width: 100%;    
    background-color: #f2f2f2;
    height: calc(var(--app-height) - 70px);
`
:
styled(View)`
    height: 100%;
    width: 100%;
    flex: 2;
    top: 0;
    flex-direction: row;
`