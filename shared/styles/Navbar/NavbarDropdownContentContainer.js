import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.div`
    float: none;
    margin-top: 5px;

    @media(max-width: 723px) {
        display: block;
        text-align: center;
        width: 100%;
    }
    @media(min-width: 724px) {
        background-color: #fff;
        border-radius: 8px;
        border: 1px solid #f2f2f2;
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