import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?  
styled.div`
    position: absolute;
    padding: 5px;
    background: #17242D;
    width: 234px;
    height: 320px;
    box-shadow: 10px 10px 40px rgba(0,0,0,0.2);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px 0 #17242D; 
    z-index: 6;
    transform: translate3d(0px, ${props=> props.translate.toString()}px, 0px)
`
:
null