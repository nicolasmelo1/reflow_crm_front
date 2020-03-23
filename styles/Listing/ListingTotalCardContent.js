import styled from 'styled-components'
import { Card } from 'react-bootstrap'

export default styled(Card.Body)`
    font-size: 18px;
    margin: 0;
    padding: 0 10px 10px 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;
    max-height: 80px;
`