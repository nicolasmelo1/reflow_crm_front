import React from 'react'
import styled from 'styled-components'
import { ScrollView } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: absolute;
    transform: translate3d(0, 30px, 0); 
    max-height: 250px; 
    width: 200px;
    background-color: white;
    border: 1px solid #f2f2f2;
    border-radius: 10px;
    z-index: 2;
    box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
`
:
styled(ScrollView)`
    height: 90%;
`