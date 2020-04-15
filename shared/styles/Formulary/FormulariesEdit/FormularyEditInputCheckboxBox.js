import styled from 'styled-components'

const StyledCheckboxLabel = styled.label`
    margin: 0
`

const StyledCheckboxContainer = styled.div`
    background-color: #fff; 
    padding: 10px 5px
`

/**
 * @param {function} onChange - the onChange function when the user clicks
 * @param {Boolean} checked - the checked data
 * @param {String} text - the text to show to the user in the label
 */
const CheckboxBox = (props) => (
    <StyledCheckboxContainer>
        <StyledCheckboxLabel>
            <input type="checkbox" checked={props.checked} onChange={e => {props.onChange()}}/>&nbsp;{props.text}
        </StyledCheckboxLabel>
    </StyledCheckboxContainer>
)

export default CheckboxBox