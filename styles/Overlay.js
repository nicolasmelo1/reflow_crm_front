import { OverlayTrigger, Tooltip } from 'react-bootstrap'

/**
 * Pop over to show when the user hover a button or a element
 * 
 * @param {String} text - Text to show on popover
 */
const Overlay = (props) => {
    return (
        <OverlayTrigger trigger="hover" placement="bottom" delay={{ show: 250, hide: 250 }} overlay={<Tooltip>{props.text}</Tooltip>}  
        popperConfig={{
            modifiers: {
                preventOverflow: {
                    boundariesElement: 'offsetParent'
                }
            }
        }}>
            {props.children}
        </OverlayTrigger>
    )
}
export default Overlay