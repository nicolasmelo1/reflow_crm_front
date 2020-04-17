import { OverlayTrigger, Tooltip } from 'react-bootstrap'

/**
 * Pop over to show when the user hover a button or a element
 * 
 * @param {String} text - Text to show on popover
 */
const Overlay = (props) => {
    return (
        <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" delay={{ show: 250, hide: 250 }} overlay={<Tooltip>{props.text}</Tooltip>}  
        popperConfig={{
            modifiers: [
                {
                    name: 'preventOverflow',
                    options: {
                        boundary: 'offsetParent' // false by default
                    }
                }
            ]
        }}>
            {props.children}
        </OverlayTrigger>
    )
}
export default Overlay