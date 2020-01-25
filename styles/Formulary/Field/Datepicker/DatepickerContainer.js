import styled from 'styled-components'

export default styled.div`
    float: left;
    position: absolute;
    padding: 5px;
    background: #444;
    width: 234px;
    height: 290px;
    box-shadow: 10px 10px 40px rgba(0,0,0,0.2);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px 0 #444444; 
    transform: translate3d(0px, ${props=> props.translate.toString()}px, 0px)
`