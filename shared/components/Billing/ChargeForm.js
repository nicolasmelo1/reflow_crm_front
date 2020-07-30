import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { types, strings } from '../../utils/constants'
import {
    BillingFormularyContainer,
    BillingFormularySectionContainer,
    BillingChargeTableRow,
    BillingChargeTableHeaderElement,
    BillingChargeTableContentElement,
    BillingChargeTotalContainer,
    BillingChargeTotalValueLabel,
} from '../../styles/Billing'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const ChargeForm = (props) => {
    const currencyPrefix = '$'
    const optionsForIndividualChargeTypes = {
        per_gb: [
            {
                label: '5', value: '5'
            },
            {
                label: '10', value: '10'
            },
            {
                label: '15', value: '15'
            }
        ]
    }
    const [totals, setTotals] = useState([])

    const getDecimals = (number) => {
        if (number.toString().includes('.')) {
            return number.toString().split('.')[0] + ',' + number.toString().split('.')[1].substring(0, 2)
        } else {
            return number.toString() + ',00' 
        }
    }

    const getTotal = () => {
        return `${currencyPrefix} ${getDecimals((totals.length > 0) ? totals.reduce((acumulator, value) => acumulator + value.total, 0) : '0')}`
    }

    const onChangeQuantity = (value, name) => {
        console.log(name)
        const chargeIndex = props.chargesData.findIndex(chargeData => chargeData.name === name)
        console.log(value)
        if (chargeIndex !== -1) {
            props.chargesData[chargeIndex].quantity = value
            props.onChangeChargeData([...props.chargesData])
        }
    }

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
            console.log(chargeData.reduce((acumulator, value) => parseInt(acumulator) + parseInt(value.quantity), 0))
            return chargeData.reduce((acumulator, value) => parseInt(acumulator) + parseInt(value.quantity), 0).toString()
        } else {
            return ''
        }
    }

    const getTotalByName = (name) => {
        const total = totals.filter(total => total.name === name)
        if (total.length > 0) {
            return `${currencyPrefix} ${getDecimals(total[0].total)}`
        } else {
            return `${currencyPrefix} ${getDecimals('0')}`
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
                        <BillingChargeTableRow key={index}>
                            {getChargeTypeByChargeTypeId(individualChargeValueType.charge_type_id) === 'company' ? (
                                <select 
                                style={{ width: '100%', textAlign: 'center', border: '0', backgroundColor: 'transparent', userSelect: 'none', marginBottom: '1rem', borderBottom: '1px solid #0dbf7e' }}
                                value={getCompanyIndividualChargeValueQuantityByName(individualChargeValueType.name)}
                                onChange={e => onChangeQuantity(e.target.value, individualChargeValueType.name)}
                                >
                                    {optionsForIndividualChargeTypes[individualChargeValueType.name].map((option, index)=> (
                                        <option key={index} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
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
                <BillingFormularySectionContainer>
                    <BillingChargeTotalContainer>
                        Total
                        <BillingChargeTotalValueLabel>{getTotal()}</BillingChargeTotalValueLabel>
                    </BillingChargeTotalContainer>
                </BillingFormularySectionContainer>
            </BillingFormularyContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default ChargeForm