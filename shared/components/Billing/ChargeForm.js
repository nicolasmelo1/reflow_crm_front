import React, { useEffect } from 'react'
import { View } from 'react-native'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const ChargeForm = (props) => {

    const getCompanyIndividualChargeValueQuantityByName = (name) => {

    }


    useEffect(() => {
        props.onGetTotals(props.chargesData).then(response => {
            console.log(response)
        })
    }, [])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div style={{ backgroundColor:'#17242D', padding: '10px 10px 10px 10px', margin: '0 3px'}}>
                <div style={{ width: '100%', marginBottom: '10px', borderRadius: '5px', backgroundColor:'#fff', padding: '10px' }}>
                    <h2 style={{ color: '#17242D' }}>Teste</h2>
                    <div style={{display:'flex', flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between'}}>
                        <p>Quantidade</p>
                        <p>Descrição</p>
                        <p>Valor</p>
                    </div>
                    {props.types.individual_charge_value_type.map(individualChargeValueType => (
                        <div style={{display:'flex', flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between'}}>
                            <p>Quantidade</p>
                            <p>{individualChargeValueType.name}</p>
                            <p>Valor</p>
                        </div>
                    )) }
                </div>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default ChargeForm