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
    height: ${props => props.hideNavBar ? 'var(--app-height)' : 'calc(var(--app-height) - var(--app-navbar-height))'};
    
    @media(min-width: 420px) {
        position: absolute;
        ${props => props.showSidebar ? `
            width: calc(var(--app-width) - 60px);
            left: 60px;
        `: `
            width: var(--app-width);
        `}
        transition: width 0.3s ease-in-out, left 0.3s ease-in-out;
    }
    @media(max-width: 420px) {
        width: var(--app-width);
    }

`
:
styled(View)`
    height: 100%;
    width: 100%;
    flex: 2;
    top: 0;
    flex-direction: row;
`