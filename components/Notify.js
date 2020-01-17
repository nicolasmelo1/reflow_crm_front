
import ReactDOM from 'react-dom'
import React from 'react'
import StyledAlert from 'styles/Alert'


/*** 
 * Really simple component to create notifications on the page you are in.
 * To render it please use ReactDOM.render(), example:
 * > ReactDOM.render(<Notify variant="danger"/>, document.querySelector('.notifications-container'));
 * 
 * PROPS:
 * message (string) - The message to display on the alert
 * variant (String) - Defines the variant of the alert, please see: https://react-bootstrap.github.io/components/alerts/#examples
 * */
class Notify extends React.Component {
    constructor (props) {
        super(props)
    }
    componentDidMount() {
        setTimeout(function(){ 
            ReactDOM.unmountComponentAtNode(document.querySelector('.notifications-container'))
        }, 5000);
    }
    render () {
        return (
            <StyledAlert className="notify" variant={this.props.variant}>
                {this.props.message}
            </StyledAlert>
        )
    }
}

export default Notify