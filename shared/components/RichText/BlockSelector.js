import React from 'react'
import { View } from 'react-native'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const BlockSelector = React.forwardRef((props, ref) => {
    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div ref={ref} style={{position: 'absolute', transform: 'translate3d(0, 30px, 0)', maxHeight: '250px', width: '200px', backgroundColor: 'white'}}>
                {props.blockOptions.map((blockOption, index) => (
                    <button 
                    key={index}
                    onClick={(e) => {props.changeBlockType(blockOption.id)}}
                    style={{
                        display: 'block', 
                        width: '100%', 
                        borderBottom: '1px solid #f2f2f2', 
                        borderLeft: 0, 
                        borderTop:0, 
                        borderRight: 0, 
                        backgroundColor: '#fff',
                        boxShadow: 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px'}}
                    >
                        {blockOption.name}
                    </button>
                ))}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
})

export default BlockSelector