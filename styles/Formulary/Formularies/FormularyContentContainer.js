import styled from 'styled-components'

export default styled(({isOpen, ...rest}) => <div {...rest}/>)`
    box-shadow: 0 4px 20px 0 #444444; 
    background-color: #444; 
    border-radius: 10px 0 0 0; 
    overflow-y: auto; 
    float: right; 
    display: block;
    position: relative;
    padding: ${props=> props.isOpen ? '10px' : '0'};
    height: ${props=> props.isOpen ? '80vh' : '0'};
    transition: height 0.3s ease-in-out, padding 0.3s ease-in-out;

    @media(min-width: 420px) {
        margin-right: 15px;
        width:80vw; 
    }
`