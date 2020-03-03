import styled from 'styled-components'

export default styled.div`
    background-color: ${props=> props.isConditional ? '#f2f2f2': 'transparent'};
    border-radius: 10px;
    margin-bottom: 5px;
    padding: 5px;
`