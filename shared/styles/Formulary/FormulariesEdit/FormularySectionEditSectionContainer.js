import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    margin: 5px 0;
    border: 1px solid #f2f2f2; 
    border-radius: 10px
`
:
styled(View)``