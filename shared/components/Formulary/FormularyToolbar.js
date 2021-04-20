import React from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { strings } from '../../utils/constants' 
import { Formularies } from '../../styles/Formulary'

/**
 * This toolbar component will contain all of the tools of the formulary, buttons to edit the formulary, button to share, and 
 * buttons of many more functionalities to come. This is called a toolbar because it was inspired by the rich-text's toolbar.
 * 
 * @param {Boolean} isEditing - True if the user is editing the formulary and false if not.
 * @param {Boolean} isEditingShare - True if the user is editing the public formulary, and false if not
 * @param {Boolean} isLoading - While we are loading data this is set to true, after that this is set to false.
 * @param {Boolean} isToShowToEdit - If the form opened is a connected formulary, we should NOT show the button to edit the formulary,
 * otherwise we should. Also we should only show the button to edit the formulary when the user is an admin.
 * @param {Boolean} isInConnectedFormulary - Same as before, if the user is in a connected formulary, we DO NOT show the toolbar, otherwise
 * we show the toolbar.
 * @param {BigInteger} formularyId - If you are editing some data, this should be defined, if you are creating a new data, it should be null.
 * @param {Function} onGoToOrLeaveEditing - Go to or Leaves the editing page.
 * @param {Function} onClickShare - When the user clicks to edit the share formulary.
 * @param {Function} onClickPDFTemplates - When the user clicks to create a new template with the form data.
 * @param {('full'|'preview'|'embbed')} formularyType - this have some differeces on what is shown to the user,
 * - embbed - is the formulary that is used to embed in external websites and urls, so, for the external world. 
 * it deactivates funcionalities like: add new or edit connection field is not available, cannot edit.
 * - preview - the formulary is fully functional, except it doesn't have a save button
 * - full - usually the formulary that is used in the home page.
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