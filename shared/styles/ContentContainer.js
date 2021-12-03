import styled from 'styled-components'
import { View } from 'react-native'

const getPaddingMobile = (props) => {
    if (props.showSideBar) {
        return '35px 20px 0 20px'
    } else if (props.isNotLogged) {
        return '0'
    } else {
        return '10px 20px 0 20px'
    }
}

const getPaddingDesktop = (props) => {
    if (props.showSideBar) {
        return '10px 20px 0px 20px'
    } else if (props.isNotLogged) {
        return '0'
    } else {
        return '10px 20px 0 20px'
    }
}

export default process.env['APP'] === 'web' ? 
styled.div`
    height: ${props => props.hideNavBar ? 'var(--app-height)' : 'calc(var(--app-height) - var(--app-navbar-height))'};
    background-color: #F7F9FC;
    font-size: 13px;
    @media(min-width: 420px) {
        padding: ${props => getPaddingDesktop(props)};
        position: absolute;
        ${props => props.showSideBar ? `
            width: calc(var(--app-width) - 60px);
            left: 60px;
        `: `
            width: var(--app-width);
        `}
    }
    @media(max-width: 420px) {
        padding: ${props => getPaddingMobile(props)};
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