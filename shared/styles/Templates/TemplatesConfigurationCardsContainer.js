import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    
    @media(min-width: 640px) {
        flex-direction: row;
        justify-content: flex-start;
    }

    @media(max-width: 640px) {
        justify-content: center;
        align-items: center;
    }
`
:
styled(View)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
`