import React from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { strings } from '../../utils/constants' 
import { Formularies } from '../../styles/Formulary'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const FormularyToolbar = (props) => {
    const isToShowToolbar = () => {
        return !props.isInConnectedFormulary && props.formularyType === 'full' && !props.isLoading
    }

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                {isToShowToolbar() ? (
                    <Formularies.Toolbar.Container>
                        {props.isEditingShare ? '' : (
                            <Formularies.Toolbar.Button onClick={e => props.onGoToOrLeaveEditing()}>
                                <FontAwesomeIcon icon={props.isEditing ? 'chevron-left' : 'pencil-alt'}/>
                                &nbsp;
                                {props.isEditing ? strings['pt-br']['formularyFinishEditButtonLabel'] : strings['pt-br']['formularyEditButtonLabel']}
                            </Formularies.Toolbar.Button>
                        )} 
                        {props.isEditing ? '' : (
                            <React.Fragment>
                                <Formularies.Toolbar.Button onClick={(e) => props.onClickShare()}>
                                    <FontAwesomeIcon icon={props.isEditingShare ? 'chevron-left' : 'share-alt'}/>
                                    &nbsp;
                                    {props.isEditingShare ?  strings['pt-br']['formularyFinishEditButtonLabel'] : strings['pt-br']['formularyShareButtonLabel']}
                                </Formularies.Toolbar.Button>
                                {!props.isInConnectedFormulary && props.formularyId && !props.isEditingShare ? (
                                    <React.Fragment>
                                        <Formularies.Toolbar.Separator/>
                                        <Formularies.Toolbar.Button
                                        onClick={(e) => props.onClickPDFTemplates()}
                                        >
                                            <FontAwesomeIcon icon="file-alt"/>&nbsp;{'PDF'}
                                        </Formularies.Toolbar.Button>
                                    </React.Fragment>
                                ) : ''}
                            </React.Fragment>
                        )}
                    </Formularies.Toolbar.Container>
                ) : ''}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default FormularyToolbar