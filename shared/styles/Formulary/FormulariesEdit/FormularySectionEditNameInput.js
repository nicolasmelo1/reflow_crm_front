import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input`
    border: 0;
    border-bottom: 2px solid ${props => props.errors ? 'red' : props.isConditional ? '#0dbf7e': '#17242D'};
    color: #fff;
    width: 100%;
    font-weight: bold;
    font-size: 2rem;
    background-color: transparent;
    padding: 10px 10px;

    &:focus {
        border-bottom: 2px solid ${props => props.errors ? 'red' : props.isConditional ? 
            '#f2f2f2': '#0dbf7e'
        };

        outline: none;
    }
`
:
styled(Text)``