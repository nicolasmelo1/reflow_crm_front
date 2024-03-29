import React, { useEffect, useState } from 'react'
import { strings } from '../../utils/constants'
import delay from '../../utils/delay'
import Alert from '../Utils/Alert'
import { 
    SidebarCardBody, 
    SidebarAddButton, 
    SidebarFormItem,
    SidebarFormInput, 
    SidebarIconsContainer, 
    SidebarIcons, 
    SidebarDisabledFormLabel 
} from '../../styles/Sidebar'


const makeDelay = delay(1000)


const SidebarFormEdit = (props) => {
    const [errors, setErrors] = useState({})
    const [formularyIndexToRemove, setFormularyIndexToRemove] = useState(null)
    const [showAlert, setShowAlert] = useState(false)
    const isMounted = React.useRef()

    const onAddNewForm = () => {
        const groups = JSON.parse(JSON.stringify(props.groups))
        groups[props.groupIndex].form_group.splice(0, 0, {
            id: null,
            label_name: '',
            form_name: '',
            enabled: true,
            group: props.groups[props.groupIndex].id,
            order: 0
        })
        props.onChangeGroupState(groups)
    }

    /**
     * This is used to update in real time what the user types preventing him to save. For the user everything works in real time,
     * behind the curtains we will be waiting for him to finish typing before we update.
     * 
     * @param {BigInteger} formIndex - The order of the formulary
     * @param {Object} newFormData -
     */
    const onChangeForm = (formIndex, newFormData) => {
        const handleErrors = (response) => {
            if (response.data.status === 'error' && response.data.error !== null && response.data.error?.reason && response.data.error?.detail) {
                if (response.data.error.reason.includes('must_be_unique') && response.data.error.detail.includes('label_name')) {
                    const errors = {}
                    errors[formIndex] = 'must_be_unique'
                    setErrors(errors)
                }
            }
        }

        const groups = JSON.parse(JSON.stringify(props.groups))

        makeDelay(() => {
            if (![null, -1].includes(newFormData.id)) {
                props.onUpdateFormulary(newFormData, newFormData.id).then(response => {
                    handleErrors(response)
                })
            } else if (newFormData.id !== -1) {
                newFormData.id = -1
                groups[props.groupIndex].form_group[formIndex] = newFormData
                props.onChangeGroupState(groups)
                newFormData.id = null
                props.onCreateFormulary(newFormData).then(response => {
                    if (response.status === 200 && response.data.data !== null && isMounted.current) {
                        newFormData.id = response.data.data.id
                    } else {
                        newFormData.id = null
                    }
                    handleErrors(response)
                    groups[props.groupIndex].form_group[formIndex] = newFormData
                    props.onChangeGroupState(groups)
                })
            }
        })
        groups[props.groupIndex].form_group[formIndex] = newFormData
        props.onChangeGroupState(groups)
    }

    const onChangeFormName = (index, value) => {
        props.groups[props.groupIndex].form_group[index].label_name = value
        onChangeForm(index, props.groups[props.groupIndex].form_group[index])
        setErrors({})
    }

    const onDisableForm = (index) => {
        props.groups[props.groupIndex].form_group[index].enabled = !props.groups[props.groupIndex].form_group[index].enabled
        onChangeForm(index, props.groups[props.groupIndex].form_group[index])
    }

    const onRemoveForm = (index) => {
        const groups = JSON.parse(JSON.stringify(props.groups))
        const formToRemove = groups[props.groupIndex].form_group[index]
        if (formToRemove.id) {
            props.onRemoveFormulary(formToRemove.id)
        }
        
        groups[props.groupIndex].form_group.splice(index, 1)
        props.onChangeGroupState(groups)
        props.checkIfCurrentHasBeenDeleted(groups)      
    }

    const onMoveForm = (e, index) => {
        let formContainer = e.currentTarget.closest('.form-container')
        let elementRect = e.currentTarget.getBoundingClientRect()
        e.dataTransfer.setDragImage(formContainer, elementRect.width - elementRect.left - (elementRect.right - elementRect.width), 20)
        e.dataTransfer.setData('formToMoveIndex', index.toString())
        e.dataTransfer.setData('formToMoveGroupIndex', props.groupIndex.toString())
        setErrors({})
    }

    const onDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDragEnd = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    // almost equal as the onMoveField() function in FormularySectionsEdit component in the Formulary folder
    const onDrop = (e, index) => {
        e.preventDefault()
        e.stopPropagation()
        let movedFormIndex = parseInt(e.dataTransfer.getData('formToMoveIndex'))
        let movedFormGroupIndex = parseInt(e.dataTransfer.getData('formToMoveGroupIndex'))

        const movedElement = {...props.groups[movedFormGroupIndex].form_group[movedFormIndex]}
        let newArrayWithoutMoved = [...props.groups]
        newArrayWithoutMoved[movedFormGroupIndex].form_group = [...props.groups[movedFormGroupIndex].form_group.filter((_, index) => index !== movedFormIndex)]
        newArrayWithoutMoved[props.groupIndex].form_group.splice(index, 0, movedElement)
        const groups = props.reorder(newArrayWithoutMoved)
        const newFormData = groups[props.groupIndex].form_group[index]

        onChangeForm(index, newFormData)
        props.onChangeGroupState(groups)        
    }

    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
        }
    }, [])

    return (
        <SidebarCardBody>
            <Alert 
            alertTitle={strings['pt-br']['sidebarDeleteFormularyAlertTitle']} 
            alertMessage={strings['pt-br']['sidebarDeleteFormularyAlertContent']} 
            show={showAlert} 
            onHide={() => {
                setFormularyIndexToRemove(null)
                setShowAlert(false)
            }} 
            onAccept={() => {
                setShowAlert(false)
                onRemoveForm(formularyIndexToRemove)
            }}
            onAcceptButtonLabel={strings['pt-br']['sidebarDeleteFormularyAlertAcceptButtonLabel']}
            />
            <SidebarAddButton 
            text={strings['pt-br']['addNewFormButtonLabel']} 
            onClick={e => { onAddNewForm() }}
            />
            {props.forms.map((form, index) => {
                return (
                    <SidebarFormItem key={index} className="form-container" onDragOver={e => { onDragOver(e) }} onDrop={e => { onDrop(e, index) }}>
                        <SidebarIconsContainer>
                            <SidebarIcons size="sm" type="form" icon="eye" onClick={e=>{onDisableForm(index)}}/>
                            <SidebarIcons size="sm" type="form" icon="trash" onClick={e=>{
                                setFormularyIndexToRemove(index)
                                setShowAlert(true)                                
                            }}/>
                            <div draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveForm(e, index)}} onDragEnd={e=>{onDragEnd(e)}}  >
                                <SidebarIcons size="sm" type="form" icon="arrows-alt" />
                            </div>
                        </SidebarIconsContainer>
                        {form.enabled ? (
                                <div style={{ display: 'flex', flexDirection: 'column'}}>
                                    <SidebarFormInput 
                                    value={form.label_name} 
                                    onChange={e => { onChangeFormName(index,  e.target.value) }} 
                                    errors={errors[index] && errors[index] === 'must_be_unique'}
                                    />
                                    {errors[index] && errors[index] === 'must_be_unique' ? (
                                        <small style={{color: 'red'}}>
                                            {strings['pt-br']['mustBeUniqueFormErrorLabel']}
                                        </small>
                                    ): ''}
                                </div>
                        ) : (
                            <SidebarDisabledFormLabel eventKey="0">
                                {strings['pt-br']['disabledFormLabel']}
                            </SidebarDisabledFormLabel>
                        )}
                    </SidebarFormItem>
                )
            })}
        </SidebarCardBody>
    )

}

export default SidebarFormEdit