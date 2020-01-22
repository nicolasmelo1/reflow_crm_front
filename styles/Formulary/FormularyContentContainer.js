import styled from 'styled-components'

export default styled(({isOpen, ...rest}) => <div {...rest}/>)`
    box-shadow: 0 4px 20px 0 #444444; 
    background-color: #444; 
    border-radius: 10px 0 0 0; 
    width:80vw; 
    overflow-y: auto; 
    float: right; 
    display: block;
    margin-right: 15px;
    height: ${props=> props.isOpen ? '80vh' : '0'};
    transition: height 0.7s ease-in-out;
`