import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { types, strings } from '../../utils/constants'
import delay from '../../utils/delay'
import dynamicImport from '../../utils/dynamicImport'
import {
    BillingFormularyContainer,
    BillingFormularySectionContainer,
    BillingChargePlanContainer,
    BillingChargePlanCardContainer,
    BillingChargePlanDefaultQuantityLabel,
    BillingChargePlanIndividualChargeValueContainer,
    BillingChargePlanSelectButton,
    BillingChargePlanTitle,
    BillingChargeTotalContainer,
    BillingChargeTotalValueLabel
} from '../../styles/Billing'

const OverlayTrigger = dynamicImport('react-bootstrap', 'OverlayTrigger')
const Popover = dynamicImport('react-bootstrap', 'Popover')
const Spinner = dynamicImport('react-bootstrap', 'Spinner')


const makeDelay = delay(1000)

const PopoverWithAditionalInformation = React.forwardRef(({additionalInformation, ...rest}, ref) => {
    return (
        <Popover ref={ref} {...rest}>
            <Popover.Body style={{whiteSpace: 'pre-line'}}>
                {additionalInformation}
            </Popover.Body>
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
    const plansPermissionsByPlanIdRef = React.useRef()
    const isMountedRef = React.useRef()
    const isGettingChargeDataRef = React.useRef(isGettingChargeData)
    const currencyPrefix = '$'

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
     * Function supposed to be used when the user selects a new plan from the plan selector. When he does this what we do is that we automatically
     * assign the default values for him so he will have the access to the functionalities of the plan he selected. The access to the functionalities
     * is usually given by a number, this is the number of interactions he can do with the functionality until it reaches its peek.
     * 
     * @param {number} planId - The id of the plan that he has selected.
     */
    const onChangePlan = (planId) => {
        if (props.chargesData.planId !== planId) {
            retrievePlansPermissionsByPlanIdRef()
            plansPermissionsByPlanIdRef.current[planId].forEach(planPermission => {
                let doesIndividualValueExistsInChargeData = false
                for (const chargeData of props.chargesData.data) {
                    if (planPermission.individual_charge_value_type_id === chargeData.individual_charge_value_type_id) {
                        doesIndividualValueExistsInChargeData = true
                        if (planPermission.default_quantity !== null) {
                            chargeData.quantity = planPermission.default_quantity
                            break
                        }
                    } 
                }
                if (doesIndividualValueExistsInChargeData === false) {
                    props.chargesData.data.push({
                        individual_charge_value_type_id: planPermission.individual_charge_value_type_id,
                        quantity: planPermission.default_quantity
                    })
                }
            })
            props.onChangeChargeData({planId: planId, data: [...props.chargesData.data]})
        }
    }

    /**
     * This is used to cache the plans permissions for each planId. This way it becomes a lot easier to retrieve
     * the values when we need them.
     */
    const retrievePlansPermissionsByPlanIdRef = () => {
        if ([null, undefined].includes(plansPermissionsByPlanIdRef.current)) {
            plansPermissionsByPlanIdRef.current = {}
            for (const plan of props.plans) {
                plansPermissionsByPlanIdRef.current[plan.id] = plan.billing_plan_permissions
            }
        }
    }

    /**
     * This is called to get the default quantity of the of a individualChargeValueTypeId for a given planId.
     * 
     * So in other words what this does is retrieve how many stuff he can do in the platform for each functionality 
     * for every plan.
     * 
     * @param {number} planId - The id of the plan.
     * @param {number} individualChargeValueTypeId - The idividual chargeValueId to retrieve the default quantity for
     * the given planId.
     * 
     * @returns {number} - The default quantity to retrieve for the given planId.
     */
    const getDefaultQuantity = (planId, individualChargeValueTypeId) => {
        retrievePlansPermissionsByPlanIdRef()
        const planPermissions = plansPermissionsByPlanIdRef.current[planId]
        for (const planPermission of planPermissions) {
            if (planPermission.individual_charge_value_type_id === individualChargeValueTypeId) {
                return planPermission.default_quantity
            }
        }
        return 0
    }

    /**
     * Gets the totals by each individual value charge id. As you see in the function that we call to get the total we
     * actually send a post request because what we do here is change each individualCharveValueType quantity.
     */
    const onGetTotal = (chargesData) => {
        const body = {
            plan_id: chargesData.planId,
            current_company_charges: chargesData.data
        }
        props.onGetTotals(body).then(response => {
            if (isMountedRef.current) {
                if (response && response.status === 200) {
                    setTotals(response.data.data)
                }
                setIsGettingChargeData(false)
            }
        })
    }

    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
        }
    }, [])

    useEffect(() => {      
        setIsGettingChargeData(true)
        onGetTotal(props.chargesData)
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
                    <BillingChargePlanContainer>
                        {props.plans.map(plan => (
                            <BillingChargePlanCardContainer
                            key={plan.id}
                            isSelected={plan.id === props.chargesData.planId}
                            numberOfPlans={props.plans.length}
                            >
                                <BillingChargePlanTitle>
                                    {plan.name}
                                </BillingChargePlanTitle>
                                {(props?.types?.individual_charge_value_type || []).map(individualChargeValueType => {
                                    const defaultQuantity = getDefaultQuantity(plan.id, individualChargeValueType.id)
                                    return (
                                        <BillingChargePlanIndividualChargeValueContainer 
                                        key={individualChargeValueType.id}
                                        >
                                            <React.Fragment>
                                                <BillingChargePlanDefaultQuantityLabel>
                                                    {defaultQuantity === 0 ? `❌` : defaultQuantity !== null ? defaultQuantity : 'Ilimitado'}
                                                </BillingChargePlanDefaultQuantityLabel>
                                                <p
                                                style={{
                                                    width: '20px',
                                                    textAlign: 'center'
                                                }}
                                                > 
                                                    {'-'} 
                                                </p>
                                            </React.Fragment>
                                            <p
                                            style={{
                                                width: 'calc((100% / 2) + 50px)',
                                            }}
                                            >
                                                {types('pt-br', 'individual_charge_value_type', individualChargeValueType.name)}
                                            </p>
                                        </BillingChargePlanIndividualChargeValueContainer>
                                    )
                                })}
                                <BillingChargePlanSelectButton
                                onClick={(e) => onChangePlan(plan.id)}
                                disabled={plan.id === props.chargesData.planId}
                                >
                                    {strings['pt-br']['billingChargeSelectPlanButtonLabel']}
                                </BillingChargePlanSelectButton>
                            </BillingChargePlanCardContainer>
                        ))}
                    </BillingChargePlanContainer>
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