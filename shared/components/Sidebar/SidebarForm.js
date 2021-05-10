import React from 'react'
import { SidebarCardBody, SidebarFormItem, SidebarLink } from '../../styles/Sidebar'
import { paths } from '../../utils/constants'
import dynamicImport from '../../utils/dynamicImport'
import Overlay from '../../styles/Overlay'

const Link = dynamicImport('next/link')

const SidebarForm = (props) => {
    return (
        <SidebarCardBody>
            {props.forms.map((form, index)=> {
                return (
                    <SidebarFormItem key={index}>
                        <Link 
                        href={paths.home().asUrl} 
                        as={paths.home(form.form_name).asUrl}
                        >
                            {props.sidebarIsOpen ? (
                                <SidebarLink isSelected={form.form_name === props.selectedFormulary}>
                                    {form.label_name}
                                </SidebarLink>
                            ) : (
                                <Overlay
                                placement={'right'}
                                text={form.label_name}
                                >
                                    <SidebarLink 
                                    isSelected={form.form_name === props.selectedFormulary}>
                                        {props.getFirstLetterBetweenSpacesOfString(form.label_name)}
                                    </SidebarLink>
                                </Overlay>
                            )}
                        </Link>
                    </SidebarFormItem>
                )
            })}
        </SidebarCardBody>
    )
}

export default SidebarForm;