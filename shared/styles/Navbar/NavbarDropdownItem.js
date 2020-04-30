import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.a`
    display: block;
    text-decoration: none;
    color: #444;
    padding: 5px;

    &:hover {
        text-decoration: none;
        color: #0dbf7e
    }

    @media(max-width: 564px) {
        display: block;
        width: 100%;
        text-align: center;
        background-color: #f2f2f2;
        border-bottom: 1px solid #fff;
        &:first-child {
            border-top: 1px solid #fff;
        }
    }
    @media(min-width: 565px) {
        border-bottom: 1px solid #f2f2f2;
        float: none;
    }
`
:
null