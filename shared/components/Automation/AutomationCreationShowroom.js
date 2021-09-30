import React, {useState, useEffect} from 'react'
import { View } from 'react-native'
import AutomationCreationAppDetail from './AutomationCreationAppDetail'
import Styled from './styles'


/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const AutomationAppCreationShowroom = (props) => {
    const [availableAppsByTriggerOrAction, setAvailableAppsByTriggerOrAction] = useState(props.availableApps)

    const getAppDataByAppId = (appId) => {
        const availableApps = availableAppsByTriggerOrAction
        for(let i =0; i< availableApps.length; i++) {
            if (availableApps[i].id === props.selectedAppId) {
                return availableApps[i]
            }
        }
        return {}
    }

    useEffect(() => {
        if (props.isSelectingTrigger || props.isSelectingAction) {
            const filteredAvailableApps = availableAppsByTriggerOrAction.filter(app => {
                if (props.isSelectingTrigger) {
                    return app.automation_app_triggers.length > 0
                } else {
                    return app.automation_app_actions.length > 0
                }
            })
            setAvailableAppsByTriggerOrAction(filteredAvailableApps)
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
                {props.selectedAppId !== null ? (
                    <AutomationCreationAppDetail
                    types={props.types}
                    onGetInputFormulary={props.onGetInputFormulary}
                    appData={getAppDataByAppId(props.selectedAppId)}
                    onSelectAction={props.onSelectAction}
                    onSelectTrigger={props.onSelectTrigger}
                    selectedTriggerOrActionId={props.selectedTriggerOrActionId}
                    setSelectedTriggerOrActionId={props.setSelectedTriggerOrActionId}
                    isSelectingTrigger={props.isSelectingTrigger}
                    isSelectingAction={props.isSelectingAction}
                    />
                ) : (
                    <Styled.AutomationCreationShowroomContainer>
                        <Styled.AutomationCreationShowroomSearchBar type={'text'}/>
                        <div>
                            {availableAppsByTriggerOrAction.map(app => (
                                <Styled.AutomationCreationShowroomAppButton 
                                key={app.id}
                                appColor={app.app_color}
                                onClick={(e) => props.setSelectedAppId(app.id)}
                                >
                                    {app.name}
                                </Styled.AutomationCreationShowroomAppButton>
                            ))}
                        </div>
                    </Styled.AutomationCreationShowroomContainer>
                )}
            </React.Fragment>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default AutomationAppCreationShowroom