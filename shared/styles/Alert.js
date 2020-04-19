import styled, { keyframes } from 'styled-components'


export default styled.div`
    background-color: ${props => props.variant === 'error' ? '#f8d7da' : '#d4edda' };
    padding: 10px;
    margin-bottom: 5px;
    animation: ${keyframes`
                    0% {
                        transform: translateY(0);
                    }
                    
                    75% {
                        transform: translateY(0);
                    }

                    100% {
                        transform: translateY(-100%);
                    }
                `} 5s;
`