import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: absolute;
    max-width: 600px;
    z-index: 10;
    background-color: #20253F;
    border-radius: 5px; 
    padding: 10px;
    box-shadow: 0 4px 20px 0 black;

    @media(max-width: 740px) {
        width: 91vw;
    };

    @media(min-width: 740px) {
        width: 80vw;
    }
`
:
styled(View)``