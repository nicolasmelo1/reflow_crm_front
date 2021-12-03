import React from 'react'
import { SidebarCardBody, SidebarFormItem, SidebarFormButton } from '../../styles/Sidebar'
import { paths } from '../../utils/constants'
import dynamicImport from '../../utils/dynamicImport'
import Overlay from '../../styles/Overlay'

const Router = dynamicImport('next/router')

const SidebarForm = (props) => {
    const onClickToGoToFormulary = (formName) => {
        if (process.env['APP'] === 'web') {
            Router.push(paths.home().asUrl, paths.home(formName).asUrl, { shallow: true })
        } 
    }

    return (
        <SidebarCardBody>
            {props.forms.map((form, index)=> {
                return (
                    <SidebarFormItem 
                    isSelected={form.form_name === props.selectedFormulary}
                    key={index}>
                        {props.sidebarIsOpen ? (
                            <SidebarFormButton 
                            onClick={(e) => onClickToGoToFormulary(form.form_name)}
                            isSelected={form.form_name === props.selectedFormulary}
                            >
                                {form.label_name}
                            </SidebarFormButton>
                        ) : (
                            <Overlay
                            placement={'right'}
                            text={form.label_name}
                            >
                                <SidebarFormButton
                                onClick={(e) => onClickToGoToFormulary(form.form_name)} 
                                isSelected={form.form_name === props.selectedFormulary}
                                >
                                    {props.getFirstLetterBetweenSpacesOfString(form.label_name)}
                                </SidebarFormButton>
                            </Overlay>
                        )}
                    </SidebarFormItem>
                )
            })}
        </SidebarCardBody>
    )
}

export default SidebarForm;