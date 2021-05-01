import styled from 'styled-components'
import { View } from 'react-native'

const getPadding = (props) => {
    if (props.showSideBar) {
        return '30px 20px 0 20px'
    } else if (props.isNotLogged) {
        return '0'
    } else {
        return '10px 20px 0 20px'
    }
}

export default process.env['APP'] === 'web' ? 
styled.div`
    padding: ${props => getPadding(props)};
    max-width: 100%;    
    height: ${props => props.hideNavBar ? 'var(--app-height)' : 'calc(var(--app-height) - var(--app-navbar-height))'};
`
:
styled(View)`
    height: 100%;
    width: 100%;
    flex: 2;
    top: 0;
    flex-direction: row;
`