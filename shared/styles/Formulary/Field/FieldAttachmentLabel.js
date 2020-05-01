import styled from 'styled-components'

export default styled(({isInitial, ...rest}) => <label {...rest}/>)`
    box-shadow: ${props=> props.isInitial ? '#17242D 0px 3px 3px -2px, #17242D 0px 3px 4px 0px, #17242D 0px 1px 8px 0px': '0'};
    background-color: ${props=> props.isInitial ? '#17242D': '0'};
    border: ${props=> props.isInitial ? '1px solid #fff': '0'};
    padding:5px;
    cursor: pointer;
    border-radius: 10px;
    margin: 0;
`