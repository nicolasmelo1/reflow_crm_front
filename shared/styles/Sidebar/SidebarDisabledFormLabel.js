import React from 'react'
import styled from 'styled-components';

export default process.env['APP'] === 'web' ? 
styled.p`
    margin: 0;
    padding: 0;
    color: #fff
`
:
null