import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.div`
    float: none;
    margin-top: 5px;

    @media(max-width: 564px) {
        display: block;
        text-align: center;
        width: 100%;
    }
    @media(min-width: 565px) {
        background-color: #fff;
        box-shadow: 0px 4px 5px 0px rgba(0,0,0,0.2);
        margin-left: 5px;
        margin-right: 5px; 
        width: 90% !important;
        z-index: 1;
        position: absolute;
    }
`
:
null