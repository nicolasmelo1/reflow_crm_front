import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: absolute;
    max-width: 600px;
    margin-top: 10px;
    z-index: 10;
    background-color: #fff;
    box-shadow: 2px 2px 16px rgba(190, 205, 226, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.1);
    border-radius: 5px; 
    padding: 10px;
    right: 0;
    @media(max-width: 740px) {
        width: 100%;
    };

    @media(min-width: 740px) {
        width: 80vw;
    }
`
:
styled(View)``