import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.button`
    diplay: flex;
    justify-content: center;
    align-items: center;
    padding: ${props => props.sidebarIsOpen ? '5px 10px': '8px 10px'};
    background-color: #0dbf7e;
    border-radius: 20px;
    border: 0;
    margin: 10px;
    ${props => props.sidebarIsOpen ? '' : 'width: 40px;'}


    &:hover {
        background-color: #fff;
        color: #0dbf7e
    }
`
:
styled(({...rest}) => <Text {...rest}/>)`
    color: #0dbf7e;
    font-size: 19px;
`