import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { types, strings } from '../../utils/constants'
import dynamicImport from '../../utils/dynamicImport'
import {
    BillingFormularyContainer,
    BillingFormularySectionContainer,
    BillingChargeTableRow,
    BillingChargeTableHeaderElement,
    BillingChargeTableContentElement,
    BillingChargeTotalContainer,
    BillingChargeTotalValueLabel,
} from '../../styles/Billing'

const OverlayTrigger = dynamicImport('react-bootstrap', 'OverlayTrigger')
const Popover = dynamicImport('react-bootstrap', 'Popover')

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
 * PUT request to the server) so we can display the errors of the chargeData state for the user.
 * @param {Function} setChargeDataFormErrors - This is a function for the Billing component. This is to change the state of the 
 * `chargeDataFormErrors` object in the billing component. We use this for everytime we write in a field of the in this component formulary, 
 * this way we can dismiss the error alert on the field after he types.
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
    const [isGettingChargeData, _setIsGettingChargeData] = useState(false)
    const [totals, setTotals] = useState({
        total: 0,
        discounts: 0,
        total_by_name: []
    })
    const isGettingChargeDataRef = React.useRef(isGettingChargeData)
    const currencyPrefix = '$'
    const additionalInformationByIndividualChargeName = {
        per_gb: strings['pt-br']['billingChargePerGbAdditionalInformation'],
        per_pdf_download: strings['pt-br']['billingChargePerPDFDownloadAdditionalInformation'],
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
        per_pdf_download: [
            {
                label: '30', value: '30'
            },
            {
                label: '60', value: '60'
            },
            {
                label: '200', value: '200'
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

    // creating a ref to the state is the only way we can get the state changes in the eventHandler function,
    // so we can use it for the mousedown eventListenet function
    // NOTE: THIS IS ONLY FOR CLASS BASED COMPONENTS THAT USE HOOKS, class based might
    // work normally
    const setIsGettingChargeData = (data) => {
        isGettingChargeDataRef.current = data
        _setIsGettingChargeData(data)
    }

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
     * Changes the quantity of a particular ChargeName. This quantity is used is from a Select component, check `optionsForIndividualChargeTypes` variable
     * for details of the options the user can select. Each key on this object are also the names that we can update the quantity.
     * 
     * Sometimes a chargeType can be not for the hole company but for each user, so you have to make sure that when you update the quantity you
     * actually update the quantity for each user.
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

    /**
     * A function to get the total value of quantity based on a specific charge name. As you might see, we actually get the quantitiy of this name using 
     * reduce function, that is because some values are bound to each user and not the hole company. This means that EACH item in the array sometimes 
     * are the quantity for each user. So we have to sum the values for each item with the following name. 
     * 
     * For example we can have something like [{ name: "per_gb", quantity: 5, user_id: null }, { name: "per_chart_user", quantity: 5, user_id: 1 },
     * { name: "per_chart_user", quantity: 5, user_id: 2 }]
     * 
     * If you see closely, the per_gb have the user_id set to null, so this value is default for the hole company. On the other hand we have `per_chart_user`
     * with user_id as 1 and 2, so we have to sum the quantities for each user. 
     * 
     * Why don't you just multiply instead of using sum? Because the quantities might not be always the same. It's safer to always sum.
     * 
     * @param {String} name - Check the redux login.types for details or `optionsForIndividualChargeTypes` variable for the possible names you can
     * accept here.
     */
    const getCompanyIndividualChargeValueQuantityByName = (name) => {
        const chargeData = props.chargesData.filter(chargeData => chargeData.name === name)
        if (chargeData.length > 0) {
            return chargeData.reduce((acumulator, value) => parseInt(acumulator) + parseInt(value.quantity), 0)
        } else {
            return 0
        }
    }

    /**
     * This gets the total values by the charge name. The totals by each name are actually retrieved from the backend
     * so we don't do any calculation of totals on our side. This way we prevent any data being displayed wrongly for the user.
     * 
     * It's important to notice that we use the `getDecimals` function so we can display the total to the user formatted 
     * right for the user.
     * 
     * @param {String} name - Check the redux login.types for details or `optionsForIndividualChargeTypes` variable for the possible names you can
     * accept here.
     */
    const getTotalByName = (name) => {
        const total = totals.total_by_name.filter(total => total.name === name)
        if (total.length > 0) {
            return `${currencyPrefix} ${getDecimals(total[0].total)}`
        } else {
            return `${currencyPrefix} ${getDecimals('0')}`
        }
    }

    useEffect(() => {
        // This effect is fired everytime the user changes the chargesData array of objects. 
        // This effect is used to get the new totals based on his current data selected.
        // There was a bug that was firing the requests nonstop, with a reference we can prevent an infinite loop
        if (!isGettingChargeDataRef.current) {
            setIsGettingChargeData(true)
            props.onGetTotals(props.chargesData).then(response => {
                if (response && response.status === 200) {
                    setTotals(response.data.data)
                }
                setIsGettingChargeData(false)
            })
        }

    }, [props.chargesData])

    useEffect(() => {
        // This effect is for syncing the data from the server and the client side.
        // Imagine that we have added a new individual_charge_value_type in the backend, if this new type is for each user, we need to create it
        // for each user and make this new charge type in sync with the number of users. That's exactly what we do here.

        // Since the user cannot edit the individual_charge_value_type we need to handle it on our side. This is something that might not
        // happen very ofter, but since this could happen it's important that we prevent.

        // TL;DR: we are creating new charge_data for the company if they haven't been created before. This is used on created individual_charge_value_type
        // that were not assigned for the company.
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
                                    {!optionsForIndividualChargeTypes[individualChargeValueType.name].map(option => option.value).includes(getCompanyIndividualChargeValueQuantityByName(individualChargeValueType.name).toString()) ? 
                                    [].concat(optionsForIndividualChargeTypes[individualChargeValueType.name], 
                                    [{
                                        value: getCompanyIndividualChargeValueQuantityByName(individualChargeValueType.name), 
                                        label: getCompanyIndividualChargeValueQuantityByName(individualChargeValueType.name)}
                                    ]).map((option, index) => (
                                        <option key={index} value={option.value}>{option.label}</option>
                                    ))
                                    : optionsForIndividualChargeTypes[individualChargeValueType.name].map((option, index) => (
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