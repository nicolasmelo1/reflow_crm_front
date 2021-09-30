import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import AutomationCreationInputFormulary from './AutomationCreationInputFormulary'
import Styled from './styles'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const AutomationCreationAppDetail = (props) => {
    const [triggersOrActions, setTriggersOrActions] = useState([])

    /**
     * Retrieves the data from the selected action or trigger, we will retrieve it 
     * only if `selectedTriggerOrActionId` props is not null. Also we will know if we need
     * to retrieve the data from the action or the trigger by the `isSelectingTrigger` props which will be true if the 
     * user is selecting a trigger or false if not.
     * 
     * @returns {Object} - Returns either the trigger or action object data or returns an empty object. This way
     * we can transverse the object and will not get an error. Since we return also an empty object, be aware that 
     * retrieving nested parameters might cause an error, so try to always use the ?. (optional chaining) of node
     */
    const getSelectedActionOrTriggerData = () => {
        if (props.selectedTriggerOrActionId) {
            if (props.isSelectingTrigger) {
                const filteredAppTriggers = props.appData.automation_app_triggers.filter(automationAppTrigger => automationAppTrigger.id === props.selectedTriggerOrActionId)
                if (filteredAppTriggers.length > 0) {
                    return filteredAppTriggers[0]
                }
            } else {
                const filteredAppActions = props.appData.automation_app_triggers.filter(automationAppTrigger => automationAppTrigger.id === props.selectedTriggerOrActionId)
                if (filteredAppActions.length > 0) {
                    return filteredAppActions[0]
                }
            }
        }
        return {}
    }

    /**
     * When user clicks a Action or a Trigger we will see if there is an input 
     * formulary for it, if
     */
    const onClickActionOrTriggerButton = (actionOrTriggerId) => {
        props.setSelectedTriggerOrActionId(actionOrTriggerId)
    }

    useEffect(() => {
        if (props.isSelectingTrigger) {
            setTriggersOrActions(props.appData.automation_app_triggers)
        } else if (props.isSelectingAction) {
            setTriggersOrActions(props.appData.automation_app_actions)
        } else {
            setTriggersOrActions([...props.appData.automation_app_triggers, ...props.appData.automation_app_actions])
        }
    }, [])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <React.Fragment>
                {![undefined, null].includes(getSelectedActionOrTriggerData().input_formulary) ? (
                    <AutomationCreationInputFormulary
                    types={props.types}
                    onGetInputFormulary={props.onGetInputFormulary}
                    triggerOrActionData={getSelectedActionOrTriggerData()}
                    appData={props.appData}
                    />
                ) : (
                    <Styled.AutomationCreationAppDetailContainer>
                        <Styled.AutomationCreationAppDetailHeader
                        appColor={props.appData.app_color}
                        >
                            <Styled.AutomationCreationAppDetailHeaderAppTitle>
                                {props.appData.name}
                            </Styled.AutomationCreationAppDetailHeaderAppTitle>
                            <Styled.AutomationCreationAppDetailHeaderAppDescription>
                                {props.appData.description}
                            </Styled.AutomationCreationAppDetailHeaderAppDescription>
                        </Styled.AutomationCreationAppDetailHeader>
                        <Styled.AutomationCreationAppDetailTriggerOrActionButtonsContainer>
                            {triggersOrActions.map(triggerOrAction => (
                                <Styled.AutomationCreationAppDetailTriggerOrActionButton
                                key={triggerOrAction.id}
                                onClick={(e) => onClickActionOrTriggerButton(triggerOrAction.id)}
                                appColor={props.appData.app_color}
                                >
                                    <p style={{
                                        fontWeight: 'bold'
                                    }}>
                                        {triggerOrAction.name}
                                    </p>
                                    <p>{triggerOrAction.description}</p>
                                </Styled.AutomationCreationAppDetailTriggerOrActionButton>
                            ))}
                        </Styled.AutomationCreationAppDetailTriggerOrActionButtonsContainer>
                    </Styled.AutomationCreationAppDetailContainer>
                )}
            </React.Fragment>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default AutomationCreationAppDetail