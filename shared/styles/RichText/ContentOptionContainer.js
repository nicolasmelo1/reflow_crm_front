import React from 'react'
import styled from 'styled-components'
import { ScrollView } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    padding: 5px 10px;
    border: 1px solid #f2f2f2;
    border-radius: 4px;
    position: absolute;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    transform: translate3d(0, -45px, 0);
    box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
`
:
styled(ScrollView)`
`