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
 * This component is responsible for the Charge Form of the hole billing formulary. This is actually one of the most important component
 * looking at the business side, because this component is where the user can select each stuff he wants to use. This is like the permissions
 * he can have, these permissions are like: How many charts he can have in the dashboard? How many notifications he can create? And so on.
 * 
 * @param {Object} chargeDataFormErrors - This object holds all the errors data where each field_name (where field name is each key of the object we send in the
 * PUT request to the server) so we can display holds a list with all the errors of this particular list.
 * @param {Function} setChargeDataFormErrors - This is a function for the Billing component. This is to change the state of the 
 * `chargeDataFormErrors` object in the billing component. We use this for everytime we write in the formulary, this way we dismiss the error after he types.
 * @param {Function} onChangeChargeData - This is a redux action to change the reducer redux state of the chargeData. This change the complete array of
 * the chargeData.
 * @param {Function} onGetTotals - This a redux action used to get the totals data. Totals are never calculated here, they are calculated on the backend
 * because the formula can change often
 * @param {Array<Object>} chargesData - An array with objects where each object is the specific charge data. Each object is like the following:
 * > {
 *      name: "per_user"
 *      quantity: 1
 *      user_id: 19
 * }
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff 
 */
const ChargeForm = (props) => {
    const currencyPrefix = '$'
    const additionalInformationByIndividualChargeName = {
        per_gb: strings['pt-br']['billingChargePerGbAdditionalInformation'],
        per_chart_user: strings['pt-br']['billingChargePerChartUserAdditionalInformation'],
        per_chart_company: strings['pt-br']['billingChargePerChartCompanyAdditionalInformation']
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
    const [totals, setTotals] = useState({
        total: 0,
        discounts: 0,
        total_by_name: []
    })

    /**
     * This function is used to format the number of the total, for pt-br for example the decimals should be separated by ', ' and not by '.'
     * If you want to display a currency value, use this function.
     * 
     * @param {BigInteger} number - The number, usually as float so we can change the format to display to the user.
     */
    const getDecimals = (number) => {
        if (number.toString().includes('.')) {
            return number.toString().split('.')[0] + ',' + number.toString().split('.')[1].substring(0, 2)
        } else {
            return number.toString() + ',00' 
        }
    }

    /**
     * Changes the quantity of a particular ChargeName. This quantity is used a select, check `optionsForIndividualChargeTypes` variable
     * for details of the options the user can select. Each key on this object are also the names that we can update the quantity.
     * 
     * Sometimes a chargeType can be not for the hole company but for each user, so you have to make sure that when you update the quantity you
     * actually updates the quantity for each user.
     * 
     * @param {String} value - The value recieved is String, but should be a digit so it can be parsed as INT
     * @param {String} name - Check the redux login.types for details or `optionsForIndividualChargeTypes` variable for the possible names you can
     * accept here.
     */
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
        const total = totals.total_by_name.filter(total => total.name === name)
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
                {totals.discounts != 0 ? (
                    <BillingFormularySectionContainer>
                        <BillingChargeTotalContainer style={{ color: '#0dbf7e'}}>
                            {strings['pt-br']['billingChargeDiscountLabel'].replace('{}', `${currencyPrefix} ${getDecimals(totals.discounts)}`)}
                        </BillingChargeTotalContainer>
                    </BillingFormularySectionContainer>
                ) : ''}
                <BillingFormularySectionContainer>
                    <BillingChargeTotalContainer>
                        {strings['pt-br']['billingChargeTotalHeaderLabel']}
                        <BillingChargeTotalValueLabel>{`${currencyPrefix} ${getDecimals(totals.total)}`}</BillingChargeTotalValueLabel>
                    </BillingChargeTotalContainer>
                </BillingFormularySectionContainer>
            </BillingFormularyContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default ChargeForm