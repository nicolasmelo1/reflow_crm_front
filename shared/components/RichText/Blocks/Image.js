import React, { useState, useEffect } from 'react'
import Toolbar from '../Toolbar'
import { View } from 'react-native'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Image = (props) => {
    const imageBlockRef = React.useRef(null)
    
    const onMouseDownWeb = (e) => {
        if (!imageBlockRef.current.contains(e.target)) {
            props.updateBlocks(null)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", onMouseDownWeb)
        return () => {
            document.removeEventListener("mousedown", onMouseDownWeb)
        }
    }, [])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div ref={imageBlockRef}>
                <button 
                onClick={(e) => {props.isEditable ? props.updateBlocks(props.block.uuid) : null}}
                style={{
                    backgroundColor: '#f2f2f2', 
                    borderRadius: '5px', 
                    border: '1px solid #bfbfbf',
                    width: '100%', 
                    padding: '10px',
                    textAlign: 'left'
                }}>
                    {'Clique para inserir uma imagem'}
                </button>
                {props.block.uuid === props.activeBlock ? (
                    <div 
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        backgroundColor: '#bfbfbf',
                        left: 0,
                        top: '40px',
                        height: '100px',
                        width: '200px',
                    }}>
                        <label>
                            {'Selecionar arquivo'}
                            <input type={'file'} style={{ display: 'none' }} accept={'image/*'}/>
                        </label>
                    </div>
                ) : ''}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Image