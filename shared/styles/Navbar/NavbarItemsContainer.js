import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.div`
    @media(max-width: 564px) {
        position: fixed;
        bottom: 0;
        left: 0;
        diplay: flex;
        justify-content: center;
        align-items: center;
        z-index: 30;
        background-color: #fff;
        width: 100%;
        height: ${props=> props.isOpen ? 'calc(var(--app-height) - 65px)': '0'};
        transition: height 0.3s ease-in-out;
    }
    @media(min-width: 565px) {
        float: right;
    }
`
:
null