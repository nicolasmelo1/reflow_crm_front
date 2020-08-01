import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { OverlayTrigger, Popover } from 'react-bootstrap'
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


const PopoverWithAditionalInformation = React.forwardRef(({additionalInformation, ...rest}, ref) => {
    return (
        <Popover ref={ref} {...rest}>
            <Popover.Content style={{whiteSpace: 'pre-line'}}>
                {additionalInformation}
            </Popover.Content>
        </Popover>
    )
})

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const ChargeForm = (props) => {
    const currencyPrefix = '$'
    const additionalInformationByIndividualChargeName = {
        per_gb: 'Esse valor é relativo a toda a companhia. Portanto independente do número de usuários ou páginas.',
        per_chart_user: `Essa é a quantidade de gráficos que cada usuário da sua companhia pode criar por página.\n\nEsse valor não inclui gráficos com a opção PARA TODA A COMPANHIA setada.\n\nEsse valor varia em relação à quantidade de usuários.`,
        per_chart_company: `Essa é a quantidade de gráficos apenas admins podem criar pode criar por página.\n\nEsse valor inclui APENAS gráficos com a opção PARA TODA A COMPANHIA setada.\n\nEsse valor varia em relação à quantidade de usuários.`
    }

    const optionsForIndividualChargeTypes = {
        per_chart_company: [
            {
                label: '2', value: '2'
            },
            {
                label: '5', value: '5'
            },
            {
                label: '10', value: '10'
            }
        ],
        per_chart_user: [
            {
                label: '2', value: '2'
            },
            {
                label: '5', value: '5'
            },
            {
                label: '10', value: '10'
            }
        ],
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
        props.chargesData.forEach((chargeData, index) => {
            if (chargeData.name === name) {
                props.chargesData[index].quantity = parseInt(value)
            }
        })
        props.onChangeChargeData([...props.chargesData])
    }

    const getCompanyIndividualChargeValueQuantityByName = (name) => {
        const chargeData = props.chargesData.filter(chargeData => chargeData.name === name)
        if (chargeData.length > 0) {
            return chargeData.reduce((acumulator, value) => parseInt(acumulator) + parseInt(value.quantity), 0)
        } else {
            return 0
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

    useEffect(() => {
        const individualValueChargeNames = props.types.individual_charge_value_type.map(individualChargeValueType => individualChargeValueType.name)
        const individualValueChargeNamesOfTheCompany = Array.from(new Set(props.chargesData.map(chargeData => chargeData.name)))
        const chargesPerUser = props.chargesData.filter(chargeData => chargeData.name === 'per_user')
        
        if (individualValueChargeNames.length !== individualValueChargeNamesOfTheCompany.length) {
            let values = []
            for(let i=0; i<props.types.individual_charge_value_type.length; i++) {
                // check if company or user type
                if (!individualValueChargeNamesOfTheCompany.includes(props.types.individual_charge_value_type[i].name)) {
                    chargesPerUser.forEach(chargePerUser => {
                        values.push({
                            name: props.types.individual_charge_value_type[i].name,
                            quantity: optionsForIndividualChargeTypes[props.types.individual_charge_value_type[i].name][0].value,
                            user_id: chargePerUser.user_id
                        })
                    })
                }
            }
            props.onChangeChargeData([...props.chargesData, ...values])
        }

    }, [props.chargesData, props.types.individual_charge_value_type])

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
                            {individualChargeValueType.name !== 'per_user' ? (
                                <select 
                                style={{ width: '100%', border: '0', backgroundColor: 'transparent', userSelect: 'none', margin: '0 5px 1rem 5px', borderBottom: '1px solid #0dbf7e' }}
                                value={(getCompanyIndividualChargeValueQuantityByName(individualChargeValueType.name)/props.chargesData.filter(chargeData => chargeData.name === individualChargeValueType.name).length).toString()}
                                onChange={e => onChangeQuantity(e.target.value, individualChargeValueType.name)}
                                >
                                    {optionsForIndividualChargeTypes[individualChargeValueType.name].map((option, index)=> (
                                        <option key={index} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <p style={{ width: '100%', margin: '0 5px 1rem 5px'}}>
                                    {getCompanyIndividualChargeValueQuantityByName(individualChargeValueType.name)}
                                </p>
                            )}
                            <BillingChargeTableContentElement>
                                {types('pt-br', 'individual_charge_value_type', individualChargeValueType.name)}&nbsp;
                                {individualChargeValueType.name !== 'per_user' ? (
                                    <OverlayTrigger 
                                    trigger={['hover', 'focus']} 
                                    placement="auto" 
                                    rootClose={true}
                                    delay={{ show: 250, hide: 100 }} 
                                    overlay={<PopoverWithAditionalInformation additionalInformation={additionalInformationByIndividualChargeName[individualChargeValueType.name]}/>}
                                    >
                                        <FontAwesomeIcon icon={'info-circle'}/>
                                    </OverlayTrigger>
                                ) : ''}
                            </BillingChargeTableContentElement>
                            <BillingChargeTableContentElement>
                                {getTotalByName(individualChargeValueType.name)}
                            </BillingChargeTableContentElement>
                        </BillingChargeTableRow>
                    )) }
                </BillingFormularySectionContainer>
                <BillingFormularySectionContainer>
                    <BillingChargeTotalContainer>
                        {strings['pt-br']['billingChargeTotalHeaderLabel']}
                        <BillingChargeTotalValueLabel>{getTotal()}</BillingChargeTotalValueLabel>
                    </BillingChargeTotalContainer>
                </BillingFormularySectionContainer>
            </BillingFormularyContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default ChargeForm