import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { types, strings } from '../../utils/constants'
import delay from '../../utils/delay'
import dynamicImport from '../../utils/dynamicImport'
import {
    BillingFormularyContainer,
    BillingFormularySectionContainer,
    BillingChargeTableRow,
    BillingChargeTableHeaderElement,
    BillingChargeTableContentElement,
    BillingChargeTotalContainer,
    BillingChargeTotalValueLabel,
    BillingChargeTableIndividualQuantityContainer,
    BillingChargeTableIndividualQuantityButton
} from '../../styles/Billing'

const OverlayTrigger = dynamicImport('react-bootstrap', 'OverlayTrigger')
const Popover = dynamicImport('react-bootstrap', 'Popover')
const Spinner = dynamicImport('react-bootstrap', 'Spinner')


const makeDelay = delay(1000)

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
    const isMountedRef = React.useRef()
    const isFirstTotalLoad = React.useRef(true)
    const isGettingChargeDataRef = React.useRef(isGettingChargeData)
    const currencyPrefix = '$'
    const additionalInformationByIndividualChargeName = {
        per_gb: strings['pt-br']['billingChargePerGbAdditionalInformation'],
        per_pdf_download: strings['pt-br']['billingChargePerPDFDownloadAdditionalInformation'],
        per_chart_user: strings['pt-br']['billingChargePerChartUserAdditionalInformation'],
        per_chart_company: strings['pt-br']['billingChargePerChartCompanyAdditionalInformation']
    }

    const optionsForIndividualChargeTypes = {
        per_chart_company: [2,5,10],
        per_chart_user: [2, 5, 10],
        per_pdf_download: [30, 60, 200],
        per_gb: [5, 10, 15]
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
                props.chargesData[index].quantity = Number.isNaN(parseInt(value)) ? 0 : parseInt(value).toString()
            }
        })
        props.onChangeChargeData([...props.chargesData])
    }

    /**
     * When the user clicks the `plus` (+) icon of the individual value charge to increase the number. When the user do this we get one of the default options for him. 
     * The user can set `free numbers` (numbers that are not pre-defined) if he changes the value directly in the input
     * 
     * @param {BigInteger} currentValue - The current value of this individual_value_charge type name.
     * @param {String} name - Check the redux login.types for details or `optionsForIndividualChargeTypes` object keys for the possible names you can
     * accept here.
     */
    const getNextQuantityForValueName = (currentValue, name) => {
        if (optionsForIndividualChargeTypes[name]) {
            const selectedIndex = optionsForIndividualChargeTypes[name].findIndex(option=> option.toString() === currentValue.toString())
            if (selectedIndex + 1 < optionsForIndividualChargeTypes[name].length) {
                return optionsForIndividualChargeTypes[name][selectedIndex + 1]
            } 
        }
        return currentValue
    }

    /**
     * When the user clicks the `minus` (-) icon of the individual value charge to decrease the number. When the user do this we get one of the default options for him. 
     * The user can set `free numbers` (numbers that are not pre-defined) if he changes the value directly in the input
     * 
     * @param {BigInteger} currentValue - The current value of this individual_value_charge type name.
     * @param {String} name - Check the redux login.types for details or `optionsForIndividualChargeTypes` object keys for the possible names you can
     * accept here.
     */
    const getPreviousQuantityForValueName = (currentValue, name) => {
        if (optionsForIndividualChargeTypes[name]) {
            let selectedIndex = optionsForIndividualChargeTypes[name].findIndex(option=> parseInt(option) === parseInt(currentValue))
            selectedIndex = selectedIndex === -1 ? optionsForIndividualChargeTypes[name].length : selectedIndex
            if (selectedIndex - 1 >= 0) {
                return optionsForIndividualChargeTypes[name][selectedIndex - 1]
            }
        }
        return currentValue
    }

    /**
     * Gets the totals by each individual value charge name.
     */
    const onGetTotal = () => {
        props.onGetTotals(props.chargesData).then(response => {
            if (isMountedRef.current) {
                if (response && response.status === 200) {
                    setTotals(response.data.data)
                }
                setIsGettingChargeData(false)
            }
        })
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
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
        }
    }, [])

    useEffect(() => {
        // This effect is fired everytime the user changes the chargesData array of objects. 
        // This effect is used to get the new totals based on his current data selected.
        // There was a bug that was firing the requests nonstop, with a reference we can prevent an infinite loop
        if (!isGettingChargeDataRef.current) {
            setIsGettingChargeData(true)
            if (isFirstTotalLoad.current) {
                onGetTotal()
                isFirstTotalLoad.current = false
            }
            makeDelay(() => {
                onGetTotal()
            })
        }
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
                    {(props?.types?.individual_charge_value_type || []).map((individualChargeValueType, index) => (
                        <BillingChargeTableRow key={index}>
                            {individualChargeValueType.name !== 'per_user' ? (
                                <BillingChargeTableIndividualQuantityContainer>
                                    <BillingChargeTableIndividualQuantityButton
                                    onClick={(e) => onChangeQuantity(
                                        getPreviousQuantityForValueName(
                                            getCompanyIndividualChargeValueQuantityByName(individualChargeValueType.name), 
                                            individualChargeValueType.name
                                        ), 
                                        individualChargeValueType.name
                                    )}>
                                        {'-'}
                                    </BillingChargeTableIndividualQuantityButton>
                                    <input 
                                    style={{
                                        width: 100,
                                        border: 0,
                                        textAlign: 'center'
                                    }}
                                    value={getCompanyIndividualChargeValueQuantityByName(individualChargeValueType.name)}
                                    onChange={(e) => onChangeQuantity(e.target.value, individualChargeValueType.name)}  
                                    type={'text'} 
                                    autoComplete={'whathever'}
                                    />
                                    <BillingChargeTableIndividualQuantityButton
                                    onClick={(e) => onChangeQuantity(
                                        getNextQuantityForValueName(
                                            getCompanyIndividualChargeValueQuantityByName(individualChargeValueType.name), 
                                            individualChargeValueType.name
                                        ), 
                                        individualChargeValueType.name
                                    )}>
                                        {'+'}
                                    </BillingChargeTableIndividualQuantityButton>
                                </BillingChargeTableIndividualQuantityContainer>
                            ) : (
                                <p style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
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
                        <BillingChargeTotalValueLabel>
                            {isGettingChargeData ? (
                                <Spinner animation={'border'}/>
                            ) : `${currencyPrefix} ${getDecimals(totals.total)}`}
                        </BillingChargeTotalValueLabel>
                    </BillingChargeTotalContainer>
                </BillingFormularySectionContainer>
            </BillingFormularyContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default ChargeForm