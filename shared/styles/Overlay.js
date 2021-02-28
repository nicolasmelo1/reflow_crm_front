import dynamicImport from '../utils/dynamicImport'

const OverlayTrigger = dynamicImport('react-bootstrap', 'OverlayTrigger')
const Tooltip = dynamicImport('react-bootstrap', 'Tooltip')


/**
 * Pop over to show when the user hover a button or a element
 * 
 * @param {String} text - Text to show on popover
 */
const Overlay = (props) => {
    return (
        <OverlayTrigger 
        trigger={['hover', 'hover']} 
        placement="bottom" 
        delay={{ show: props.delay ? props.delay : 250, hide: props.delay ? props.delay : 100 }} 
        overlay={<Tooltip>{props.text}</Tooltip>}  
        popperConfig={{
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 5],
                    },
                },
                {
                    name: 'preventOverflow',
                    options: {
                        boundary: 'offsetParent'
                    }
                }
            ]
        }}>
            {props.children}
        </OverlayTrigger>
    )
}
export default Overlay