import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 180px;
    height: 180px;
    margin: 5px;
    top: 0;
    vertical-align:top;
    right: 0;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 3px 6px #20253F;
    display: inline-block;
    background-color: #fff;
`
:
styled(View)`
    width: 150px;
    height: 150px;
    margin: 5px;
    top: 0;
    right: 0;
    border-radius: 10px;
    border: #20253F;
    background-color: #fff;
`