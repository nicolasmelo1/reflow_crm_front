import styled from 'styled-components'

export default styled.div`
    height: ${props=> (props.isOpen) ? '80px': '0'};
    width: 100%;
    background-color: red;
    transition: height 0.3s ease-in-out;
`