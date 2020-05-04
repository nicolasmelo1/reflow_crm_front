import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'


const Templates = (props) => {
    return (
        <div style={{position: 'fixed', backgroundColor: '#f2f2f2', top: 0, left: 0, height: '100vh', width: '100vw'}}>
            <button style={{margin: '10px', color: 'black', border: 0, backgroundColor: 'transparent'}}  onClick={e=>props.setAddTemplates(false)}>
                <FontAwesomeIcon icon={'chevron-left'} /> Voltar
            </button>
            <div style={{ display: 'flex', flexDirection: 'row'}}>
                <div style={{ flexDirection: 'column', color:'black'}}>
                    <h2 style={{ color: '#0dbf7e' }}>Seleção de Templates</h2>
                    <p>Vendas</p>
                </div>
                <div style={{ flexDirection: 'column', color:'black'}}>
                    <p>Teste2</p>
                </div>
            </div>
        </div>
    )
}

export default Templates