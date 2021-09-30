import React, { useState } from 'react'
import { View } from 'react-native'
import AutomationCreationShowroom from './AutomationCreationShowroom'
import Styled from './styles'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const AutomationCreationForm = (props) => {
    const [automationData, setAutomationData] = useState({
        name: '',
        description: '',
        automation_trigger: null,
        automation_actions: []
    })
    const [selectedTriggerOrActionId, setSelectedTriggerOrActionId] = useState(null)
    const [selectedAppId, setSelectedAppId] = useState(null)
    const [isSelecting, _setIsSelecting] = useState({
        trigger: false,
        action: false
    })

    const setIsSelecting = ({isSelectingTrigger=false, isSelectingAction=false}) => {
        if (isSelectingAction) isSelectingTrigger = false
        if (isSelectingTrigger) isSelectingAction = false

        _setIsSelecting({ trigger: isSelectingTrigger, action: isSelectingAction })
    }


    const addTrigger = (triggerId, inputDataId) => {
        return {
            app_trigger_id: triggerId,
            input_data_id: inputDataId
        }
    }

    const addAction = (actionId, inputDataId, customScript) => {
        return {
            app_action_id: actionId,
            input_data_id: inputDataId,
            custom_script: customScript
        }
    }

    /**
     * When the user selects an action we update the automationData state with this data.
     * 
     * @param {BigInt} actionId 
     * @param {BigInt} inputDataId 
     * @param {String} customScript 
     */
    const onSelectAction = (actionId, inputDataId, customScript) => {
        automationData.automation_actions.splice(0, 1, addAction(actionId, inputDataId, customScript))
        setAutomationData({...automationData})
    }

    const onSelectTrigger = (triggerId, inputDataId) => {
        automationData.automation_trigger = addTrigger(triggerId, inputDataId)
        setAutomationData({...automationData})
    }

    /**
     * Handles the onGoBack button just for going back, as simple as this sounds
     * to create an automation the user will go on a Flow, the flow is:
     * - Select the Trigger or the Action
     * - Select the App from a list of triggers or actions
     * - Select the Action or trigger from the app
     * - Connect and fill the formulary for the trigger and action
     * Go back to step 1 after finishing for the trigger, and then after
     * finishing from the action.
     */
    const onGoBack = () => {
        if (selectedTriggerOrActionId !== null) {
            setSelectedTriggerOrActionId(null)
        } else if (selectedAppId !== null) {
            setSelectedAppId(null)
        } else if (isSelecting.trigger || isSelecting.action) {
            setIsSelecting({isSelectingTrigger: false, isSelectingAction: false})
        } else {
            props.setAutomationCreationIsOpen(false)
        }
    }

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <Styled.AutomationCreationGoBackButton
                onClick={(e) => onGoBack()}
                >
                    <Styled.AutomationCreationGoBackButtonIcon 
                    icon={'chevron-left'}
                    />
                    <Styled.AutomationCreationGoBackButtonLabel>
                        {' Voltar'}
                    </Styled.AutomationCreationGoBackButtonLabel>
                </Styled.AutomationCreationGoBackButton>
                <Styled.AutomationCreationContainer>
                    {isSelecting.trigger || isSelecting.action ? (
                        <AutomationCreationShowroom
                        types={props.types}
                        onGetInputFormulary={props.onGetInputFormulary}
                        availableApps={props.availableApps}
                        selectedTriggerOrActionId={selectedTriggerOrActionId}
                        setSelectedTriggerOrActionId={setSelectedTriggerOrActionId}
                        selectedAppId={selectedAppId}
                        setSelectedAppId={setSelectedAppId}
                        onSelectAction={onSelectAction}
                        onSelectTrigger={onSelectTrigger}
                        isSelectingTrigger={isSelecting.trigger}
                        isSelectingAction={isSelecting.action}
                        />
                    ) : (
                        <React.Fragment>
                            <Styled.AutomationCreationIfThisThanThatContainer>
                                {'Se Isto'}
                                <Styled.AutomationCreationIfThisThanThatButton
                                onClick={(e) => setIsSelecting({isSelectingTrigger: true})}
                                >
                                    {'Adicionar'}
                                </Styled.AutomationCreationIfThisThanThatButton>
                            </Styled.AutomationCreationIfThisThanThatContainer>
                            <Styled.AutomationCreationIfThisThanThatLineBetween/>
                            <Styled.AutomationCreationIfThisThanThatContainer
                            >
                                {'Então Isso'}
                                <Styled.AutomationCreationIfThisThanThatButton
                                onClick={(e) => setIsSelecting({isSelectingAction: true})}
                                >
                                    {'Adicionar'}
                                </Styled.AutomationCreationIfThisThanThatButton>
                            </Styled.AutomationCreationIfThisThanThatContainer>
                        </React.Fragment>
                    )}
                    
                </Styled.AutomationCreationContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default AutomationCreationForm