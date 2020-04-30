import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export default process.env['APP'] === 'web' ? 
styled.div`
    display: inline-block;
    margin-right: 8px;
    ${props=> props.badge ? `
        &:after {
            background-color: #0dbf7e;
            border-radius: 30px;
            color: #fff;
            content: "${props.badge}";
            font-weight: bold;
            font-size: 11px;
            margin-top: -10px;
            margin-left: -10px;
            min-width: 20px;
            padding: 2px;
            position: absolute;
            text-align: center;
        }
    ` : ''}
`
:
null