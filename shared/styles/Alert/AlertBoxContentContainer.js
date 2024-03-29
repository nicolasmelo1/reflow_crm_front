import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    padding: 10px;
    width: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #20253F !important;
    height: 80%;
    text-align: left !important;
    border-radius: 5px;
`
:
styled(View)``