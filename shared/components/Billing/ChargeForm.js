import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { types, strings } from '../../utils/constants'
import {
    BillingFormularyContainer,
    BillingFormularySectionContainer,
    BillingChargeTableRow,
    BillingChargeTableHeaderElement,
    BillingChargeTableContentElement
} from '../../styles/Billing'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const ChargeForm = (props) => {
    const currencyPrefix = '$'
    const [totals, setTotals] = useState([])

    const getChargeTypeByChargeTypeId = (id) => {
        const chargeType = props.types.charge_type.filter(chargeType => chargeType.id === id)
        if (chargeType.length > 0) {
            return chargeType[0].name
        } else {
            return ''
        }
    } 
    const getCompanyIndividualChargeValueQuantityByName = (name) => {
        const chargeData = props.chargesData.filter(chargeData => chargeData.name === name)
        if (chargeData.length > 0) {
            return chargeData.reduce((acumulator, value) => acumulator + value.quantity, 0)
        } else {
            return ''
        }
    }

    const getTotalByName = (name) => {
        const total = totals.filter(total => total.name === name)
        if (total.length > 0) {
            return `${currencyPrefix} ${total[0].total.toString().replace('.', ',')}`
        } else {
            return ''
        }
    }

    useEffect(() => {
        props.onGetTotals(props.chargesData).then(response => {
            if (response && response.status === 200) {
                setTotals(response.data.data)
            }
        })
    }, [props.chargesData])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <BillingFormularyContainer>
                <BillingFormularySectionContainer>
                    <BillingChargeTableRow>
                        <BillingChargeTableHeaderElement>
                            {strings['pt-br']['billingChargeTableHeaderQuantityLabel']}
                        </BillingChargeTableHeaderElement>
                        <BillingChargeTableHeaderElement>
                            {strings['pt-br']['billingChargeTableHeaderDescriptionLabel']}
                        </BillingChargeTableHeaderElement>
                        <BillingChargeTableHeaderElement>
                            {strings['pt-br']['billingChargeTableHeaderValueLabel']}
                        </BillingChargeTableHeaderElement>
                    </BillingChargeTableRow>
                    {props.types.individual_charge_value_type.map((individualChargeValueType, index) => (
                        <BillingChargeTableRow>
                            { getChargeTypeByChargeTypeId(individualChargeValueType.charge_type_id) === 'company' ? (
                                 <input 
                                 style={{ width: '100%', textAlign: 'center', border: '0', backgroundColor: 'transparent', userSelect: 'none', marginBottom: '1rem', borderBottom: '1px solid #0dbf7e' }}
                                 value={getCompanyIndividualChargeValueQuantityByName(individualChargeValueType.name)}
                                 onChange={e => onChangeQuantity()}
                                 />
                            ) : (
                                <BillingChargeTableContentElement>
                                    {getCompanyIndividualChargeValueQuantityByName(individualChargeValueType.name)}
                                </BillingChargeTableContentElement>
                            )}
                            <BillingChargeTableContentElement>
                                {types('pt-br', 'individual_charge_value_type', individualChargeValueType.name)}
                            </BillingChargeTableContentElement>
                            <BillingChargeTableContentElement>
                                {getTotalByName(individualChargeValueType.name)}
                            </BillingChargeTableContentElement>
                        </BillingChargeTableRow>
                    )) }
                </BillingFormularySectionContainer>
            </BillingFormularyContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default ChargeForm