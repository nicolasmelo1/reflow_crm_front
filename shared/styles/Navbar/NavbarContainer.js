import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?
styled.nav`
    padding: 13px 10px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    user-select: none;
    app-region: drag;
`
:
null