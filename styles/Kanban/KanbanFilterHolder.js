import styled from 'styled-components'

export default styled.div`
    position: relative;
    display: inline-block;
    float: right;
    margin: 0;

    @media(min-width: 640px) {
        width: 200px;
        margin: 0;
    }
    @media(max-width: 640px) {
        width: 100%;
        margin: 5px 0 0 0;
    }
`