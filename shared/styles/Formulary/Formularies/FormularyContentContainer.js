import styled from 'styled-components'

export default styled(({isOpen, height,...rest}) => <div {...rest}/>)`
    box-shadow: -5px 5px 20px #444;
    background-color: #444; 
    overflow-y: auto; 
    float: right; 
    display: block;
    position: relative;
    padding: ${props=> props.isOpen ? '10px' : '0'};
    transition: height 0.3s ease-in-out, padding 0.3s ease-in-out;

    @media(max-width: 420px) {
        min-height: ${props=> props.isOpen ? `calc(var(--app-height) - 50px)` : '0'};
        height: ${props=> props.isOpen ? `calc(var(--app-height) - 50px)` : '0'};
    }

    @media(min-width: 420px) {
        margin-right: 15px;
        width:80vw; 
        border-radius: 10px 0 0 0; 
        height: ${props=> props.isOpen ? '80vh' : '0'};

    }
`