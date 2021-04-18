import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { View } from 'react-native'
import Select from '../../Utils/Select'
import agent from '../../../utils/agent'
import { strings } from '../../../utils/constants'
import { FormulariesEdit }  from '../../../styles/Formulary'


const Connection = (props) => {
    const isMountedRef = React.useRef()
    const sourceRef = React.useRef()
    const [templateSelectIsOpen, setTemplateSelectIsOpen] = useState(false)
    const [formularySelectIsOpen, setFormularySelectIsOpen] = useState(false)
    const [fieldSelectIsOpen, setFieldSelectIsOpen] = useState(false)
    const [selectedGroupId, setSelectedGroupId] = useState(null)
    const [groupOptions, setGroupOptions] = useState({})
    const [selectedFormId, setSelectedFormId] = useState(null)
    const [formularyOptionsByGroupId, setFormularyOptionsByGroupId] = useState({})
    const [fieldOptionsByFormId, setFieldOptionsByFormId] = useState({})
    // ------------------------------------------------------------------------------------------
    /**
     * Handy function to retrieve a list of group options, remembers the groups are saved as a object where each key is the groupId
     * with this function we can retrieve it as a list.
     * 
     * @returns {Array<{value: String, label: String}>} - An array of objects where each object contains the `value` and `label` keys
     */
    const getGroupOptions = () => Object.values(groupOptions)
    // ------------------------------------------------------------------------------------------
    /**
     * Handy function to retrieve a list of formulary options, remembers the formularies are saved as a object where the first key is the 
     * groupId and the second key is the formId, after the first key it works similar to groups. With this function we can retrieve the 
     * formularies of a particular group as a list.
     * 
     * @param {BigInteger} selectedGroupId - The selected group id, notice that we can only retrieve a list of formularies if the group is selected
     * 
     * @returns {Array<{value: String, label: String}>} - An array of objects where each object contains the `value` and `label` keys
     */
    const getFormularyOptions = (selectedGroupId) => Object.values(formularyOptionsByGroupId[selectedGroupId])
    // ------------------------------------------------------------------------------------------
     /**
     * Handy function to retrieve a list of field options, remembers the fields are saved as a object where the first key is the 
     * formularyId and the second key is the fieldId, similar to formularies. With this function we can retrieve the fields of a particular formulary 
     * as a list.
     * 
     * @param {BigInteger} selectedFormId - The selected form id, notice that we can only retrieve a list of fields if the form is selected
     * 
     * @returns {Array<{value: String, label: String}>} - An array of objects where each object contains the `value` and `label` keys
     */
    const getFieldOptions = (selectedFormId) => Object.values(fieldOptionsByFormId[selectedFormId])
    // ------------------------------------------------------------------------------------------
    /**
     * When the user changes the selected group in the selector we use this function.
     * 
     * @param {Array<BigInteger>} data - An array of selected group ids
     */
    const onChangeGroup = (data) => {
        if (data.length > 1) {
            setSelectedGroupId(data[0])
        } else {
            setSelectedGroupId(null)
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user changes the selected form in the selector we use this function.
     * 
     * @param {Array<BigInteger>} data - An array of selected form ids, usually just one.
     */
    const onChangeForm = (data) => {
        if (data.length > 1) {
            setSelectedFormId(data[0])
        } else {
            setSelectedFormId(null)
        }
        setSelectedFormId(data[0])
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user changes the selected field in the selector we use this function.
     * 
     * @param {Array<BigInteger>} data - An array of selected field ids, usually just one.
     */
    const onChangeField = (data) => {
        props.field.form_field_as_option = (data.length > 1) ? data[0] : null
        props.onUpdateField(props.field)
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    // When the component renders we get the field options that can serve as connection.
    // First we cannot connect to itself, so we don't end up with recursion. 
    // The data recieved is a list of all of the fields and each field with its form_id its group_id and also the label names
    // This way we DO NOT NEED to store in any way the selected group or form. The selected group and the selected form
    // is retrieved when we loop through the fields. This helps this be concise and simple.
    //
    // The options are always dictionaries, this way we can keep the uniqueness of each object. For groups, each key is the group_id
    // For forms the first key is the group_id and the second key is the form_id. And last for fields the first key is the
    // form_id and the second is the group_id, this way we can only show the field if the form and the groups are selected.
    useEffect(() => {
        isMountedRef.current = true
        sourceRef.current = axios.CancelToken.source()
        agent.http.FORMULARY.getFormularySettingsConnectionFieldOptions(sourceRef.current, props.formId).then(response => {
            if (isMountedRef.current && response && response.status === 200) {
                const connectionFieldOptions = response.data.data
                const createOption = (value, label) => ({
                    value: value,
                    label: label
                })
                let groups = {}
                let formularies = {}
                let fields = {}
                let selectedFormId = null
                let selectedGroupId = null
                
                for (let i=0; i<connectionFieldOptions.length; i++) {
                    const groupId = connectionFieldOptions[i].group_id
                    const groupName = connectionFieldOptions[i].group_name
                    const formId = connectionFieldOptions[i].form_id
                    const formLabelName = connectionFieldOptions[i].form_label_name
                    const fieldId = connectionFieldOptions[i].id
                    const fieldLabelName = connectionFieldOptions[i].label_name

                    if (fields[formId]) {
                        fields[formId][fieldId] = createOption(fieldId, fieldLabelName)
                    } else {
                        fields[formId] = {}
                        fields[formId][fieldId] = createOption(fieldId, fieldLabelName)
                    }

                    if (formularies[groupId]) {
                        formularies[groupId][formId] = createOption(formId, formLabelName)
                    } else {
                        formularies[groupId] = {}
                        formularies[groupId][formId] = createOption(formId, formLabelName)
                    }
                    
                    groups[groupId] = createOption(groupId, groupName)
                    if (props.field.form_field_as_option === fieldId) {
                        selectedFormId = formId
                        selectedGroupId = groupId
                    }
                } 

                setGroupOptions(groups)
                setFormularyOptionsByGroupId(formularies)
                setFieldOptionsByFormId(fields)

                if (props.field.form_field_as_option !== null) {
                    setSelectedFormId(selectedFormId)
                    setSelectedGroupId(selectedGroupId)
                }
            }
        })
        return () => {
            if (sourceRef.current) {
                isMountedRef.current = false
                sourceRef.current.cancel()
            }
        }
    }, [])
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
            <div>
                <FormulariesEdit.FieldFormFieldContainer>
                    <FormulariesEdit.FieldFormLabel>
                        {strings['pt-br']['formularyEditFieldConnectionTemplateSelectorLabel']}
                    </FormulariesEdit.FieldFormLabel>
                    <FormulariesEdit.SelectorContainer isOpen={templateSelectIsOpen}>
                        <Select 
                        isOpen={templateSelectIsOpen}
                        setIsOpen={setTemplateSelectIsOpen}
                        options={getGroupOptions()} 
                        initialValues={getGroupOptions().filter(group => group.value === selectedGroupId)} 
                        onChange={onChangeGroup} 
                        />
                    </FormulariesEdit.SelectorContainer> 
                </FormulariesEdit.FieldFormFieldContainer>
                {selectedGroupId !== null ? (
                    <FormulariesEdit.FieldFormFieldContainer>
                        <FormulariesEdit.FieldFormLabel>
                            {strings['pt-br']['formularyEditFieldConnectionFormularySelectorLabel']}
                        </FormulariesEdit.FieldFormLabel>
                        <FormulariesEdit.SelectorContainer isOpen={formularySelectIsOpen}>
                            <Select 
                            isOpen={formularySelectIsOpen}
                            setIsOpen={setFormularySelectIsOpen}
                            options={getFormularyOptions(selectedGroupId)} 
                            initialValues={getFormularyOptions(selectedGroupId).filter(form => form.value === selectedFormId)} 
                            onChange={onChangeForm} 
                            />
                        </FormulariesEdit.SelectorContainer>
                    </FormulariesEdit.FieldFormFieldContainer>
                ): ''}
                {selectedFormId !== null ?  (
                    <FormulariesEdit.FieldFormFieldContainer>
                        <FormulariesEdit.FieldFormLabel>
                            {strings['pt-br']['formularyEditFieldConnectionFieldSelectorLabel']}
                        </FormulariesEdit.FieldFormLabel>
                        <FormulariesEdit.SelectorContainer isOpen={fieldSelectIsOpen}>
                            <Select 
                            isOpen={fieldSelectIsOpen}
                            setIsOpen={setFieldSelectIsOpen}
                            options={getFieldOptions(selectedFormId)} 
                            initialValues={getFieldOptions(selectedFormId).filter(field => field.value === props.field.form_field_as_option)} 
                            onChange={onChangeField} 
                            />
                        </FormulariesEdit.SelectorContainer>
                    </FormulariesEdit.FieldFormFieldContainer>
                ): ''}
            </div>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile() 
}

export default Connection