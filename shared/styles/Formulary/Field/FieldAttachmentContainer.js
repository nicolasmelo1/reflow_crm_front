import styled from 'styled-components'
import { Col } from 'react-bootstrap'

export default styled(({isInitial, ...rest}) => <Col {...rest}/>)`
    text-align: center;
    margin: auto;
    padding: 10px;
`