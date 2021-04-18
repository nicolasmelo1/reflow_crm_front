import React, { useEffect, useState} from 'react'
import axios from 'axios'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { strings, paths } from '../../utils/constants'
import delay from '../../utils/delay'
import { FRONT_END_HOST } from '../../config'
import { Formularies } from '../../styles/Formulary'


const makeDelay = delay(2000)
/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const FormularyPublicEdit = (props) => {
    const sourceRef = React.useRef()
    const [greetingsText, setGreetingsText] = useState('')
    const [descriptionText, setDescriptionText] = useState('')
    const [isToShowSubmitAnotherButton, setIsToShowSubmitAnotherButton] = useState(false)
    const [publicAccessKey, setPublicAccessKey] = useState('')
    const [fields, setFields] = useState([])
    const [selectedFields, setSelectedFields] = useState([])
    
    const publicFormularyUrl = `${FRONT_END_HOST.substring(0, FRONT_END_HOST.length-1)}${paths.publicFormulary(props.formularyBuildData.form_name).asUrl}?public_access_key=${publicAccessKey}`
    // ------------------------------------------------------------------------------------------
    /**
     * When the user selects a field we automatically update the backend with this field. With this the user does not need to hit save after making changes.
     * 
     * When the user unselects all the fields it means the formulary is not public anymore.
     * 
     * @param {BigInteger} fieldId - The id of the field that was selected or unselected so we can update the list of selected fieldIds
     */
    const onSelectField = (fieldId) => {
        let newSelectedFields = []
        if (selectedFields.includes(fieldId)) {
            newSelectedFields = selectedFields.filter(selectedField => selectedField !== fieldId)
        } else {
            selectedFields.push(fieldId)
            newSelectedFields = selectedFields
        }
        setSelectedFields([...newSelectedFields])
        props.onUpdatePublicFormulary(
            props.formularyBuildData.id, 
            greetingsText,
            descriptionText,
            isToShowSubmitAnotherButton,
            newSelectedFields
            ).then(response => {
            if (response && response.status === 200) {
                setPublicAccessKey(response.data.data.public_access_key)
            }
        })
    }
    // ------------------------------------------------------------------------------------------
    const autoResizeTextAreaWeb = (element) => {
        element.style.height = "5px";
        element.style.height = (element.scrollHeight)+"px";    
    }
    // ------------------------------------------------------------------------------------------
    const onCopyLinkWeb = (link) => {
        if (process.env['APP'] === 'web') {
            const copyText = document.createElement('textarea')
            
            copyText.value = link
            copyText.setAttribute('readonly', '')
            copyText.style.position = 'absolute'

            document.body.appendChild(copyText)

            copyText.select()
            copyText.setSelectionRange(0, 99999)

            document.execCommand('copy')

            document.body.removeChild(copyText)
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Adds the greetings message after the user has submited the formulary.
     * 
     * @param {String} text - The greetings text message, this can be multiline
     */
    const onChangeGreetingsMessage = (text) => {
        text = (text === '') ? null : text
        makeDelay(() => {
            props.onUpdatePublicFormulary(
                props.formularyBuildData.id, 
                text,
                descriptionText,
                isToShowSubmitAnotherButton, 
                selectedFields
            )
        })
        setGreetingsText(text)
    } 
    // ------------------------------------------------------------------------------------------
    /**
     * Adds a descripition message on the top of the formulary so the user knows what he will fill.
     * 
     * @param {String} text - The description text message, this can be multiline
     */
    const onChangeDescriptionMessage = (text) => {
        text = (text === '') ? null : text
        makeDelay(() => {
            props.onUpdatePublicFormulary(
                props.formularyBuildData.id, 
                greetingsText,
                text,
                isToShowSubmitAnotherButton, 
                selectedFields
            )
        })
        setDescriptionText(text)
    } 
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        sourceRef.current = axios.CancelToken.source()
        props.onGetPublicFormulary(sourceRef.current, props.formularyBuildData.id).then(response => {
            if (response && response.status === 200) {
                setPublicAccessKey(response.data.data.public_access_key)
                setIsToShowSubmitAnotherButton(response.data.data.is_to_submit_another_response_button)
                setDescriptionText(response.data.data.description_message)
                setGreetingsText(response.data.data.greetings_message)
                setSelectedFields(response.data.data.public_access_form_public_access_fields.map(field => field.field_id))
            }
        })
        return () => {
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (props.formularyBuildData && props.formularyBuildData.depends_on_form) {
            setFields([].concat.apply([], props.formularyBuildData.depends_on_form.map(formData => formData.form_fields)))
        }
    }, [props.formularyBuildData])
    /////////////////////////////////////////////////////////////////////////////////////////////
    //########################################################################################//
    const renderMobile = () => {
        return (
            <View></View>
        )
    }
    //########################################################################################//
    const renderWeb = () => {
        return (
            <Formularies.PublicEdit.Container>
                {selectedFields.length > 0 ? (
                    <Formularies.PublicEdit.LinkContainer>
                        <Formularies.PublicEdit.FormTitle>
                            {strings['pt-br']['formularyPublicEditLinkToPublicFormTitle']}
                        </Formularies.PublicEdit.FormTitle>
                        <Formularies.PublicEdit.LinkAnchorContainer>
                            <Formularies.PublicEdit.LinkCopyButton
                            onClick={(e) => onCopyLinkWeb(publicFormularyUrl)}
                            >
                                <FontAwesomeIcon icon={'copy'} style={{ color: '#0dbf7e' }}/>
                            </Formularies.PublicEdit.LinkCopyButton>
                            <Formularies.PublicEdit.LinkAnchor 
                            href={publicFormularyUrl} 
                            target="_blank"
                            >
                                {publicFormularyUrl}
                            </Formularies.PublicEdit.LinkAnchor>                        </Formularies.PublicEdit.LinkAnchorContainer>
                    </Formularies.PublicEdit.LinkContainer>
                ) : (
                    <Formularies.PublicEdit.FormTitle isNotPublicMessageTitle={true}>
                        {strings['pt-br']['formularyPublicEditFormIsNotPublicTitle']}
                    </Formularies.PublicEdit.FormTitle>
                )}
                <Formularies.PublicEdit.FormTitle>
                    {strings['pt-br']['formularyPublicEditAditionalSettingsTitle']}
                </Formularies.PublicEdit.FormTitle>
                <div style={{
                    marginBottom: '10px'
                }}>
                    <label style={{ margin: 0}}>
                        {strings['pt-br']['formularyPublicEditDescriptionInputLabel']}
                    </label>
                    <Formularies.PublicEdit.Input 
                    placeholder={strings['pt-br']['formularyPublicEditDescriptionInputPlaceholder']}
                    value={descriptionText ? descriptionText : ''}
                    onChange={(e) => {
                        autoResizeTextAreaWeb(e.target)
                        onChangeDescriptionMessage(e.target.value)
                    }}
                    rows={1}
                    />
                </div>
                <div style={{
                    marginBottom: '10px'
                }}>
                    <label style={{ margin: 0}}>
                        {strings['pt-br']['formularyPublicEditGreetingsInputLabel']}
                    </label>
                    <Formularies.PublicEdit.Input
                    placeholder={strings['pt-br']['formularyPublicEditGreetingsInputPlaceholder']}
                    value={greetingsText ? greetingsText : ''}
                    onChange={(e) => {
                        autoResizeTextAreaWeb(e.target)
                        onChangeGreetingsMessage(e.target.value)
                    }}
                    rows={1}
                    />
                </div>
                <div>
                    <label style={{userSelect: 'none', cursor: 'pointer', marginBottom: '30px'}}>
                        <input
                        style={{marginRight: '5px'}}
                        type={'checkbox'} 
                        checked={isToShowSubmitAnotherButton}
                        onChange={(e) => {
                            setIsToShowSubmitAnotherButton(!isToShowSubmitAnotherButton)
                            props.onUpdatePublicFormulary(
                                props.formularyBuildData.id, 
                                greetingsText,
                                descriptionText,
                                !isToShowSubmitAnotherButton, 
                                selectedFields
                            )
                        }}
                        />
                        {strings['pt-br']['formularyPublicEditIsToShowAnotherCheckboxLabel']}
                    </label>
                </div>
                <Formularies.PublicEdit.FieldSelector.Container>
                    <Formularies.PublicEdit.FormTitle>
                        {strings['pt-br']['formularyPublicEditSelectFieldsTitle']}
                    </Formularies.PublicEdit.FormTitle>
                    {fields.map(field => (
                        <Formularies.PublicEdit.FieldSelector.Button 
                        key={field.id}
                        isSelected={selectedFields.includes(field.id)}
                        onClick={(e) => onSelectField(field.id)}
                        >
                            <Formularies.PublicEdit.FieldSelector.Label>
                                {field.label_name}
                            </Formularies.PublicEdit.FieldSelector.Label>
                            <Formularies.PublicEdit.FieldSelector.Icon
                            icon={selectedFields.includes(field.id) ? 'check': 'times'} 
                            isSelected={selectedFields.includes(field.id)}
                            />
                        </Formularies.PublicEdit.FieldSelector.Button>
                    ))}
                </Formularies.PublicEdit.FieldSelector.Container>
            </Formularies.PublicEdit.Container>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default FormularyPublicEdit