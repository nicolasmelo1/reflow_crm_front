import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    padding: 0 10px;
    border: 1px solid #f2f2f2;
    border-radius: 4px;
    width: 100%;
    position: sticky;
    background-color: white;
    padding: 10px;

`
:
styled(View)``