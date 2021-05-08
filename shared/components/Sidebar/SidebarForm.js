import React from 'react'
import { SidebarCardBody, SidebarFormItem, SidebarLink } from '../../styles/Sidebar'
import { paths } from '../../utils/constants'
import dynamicImport from '../../utils/dynamicImport'

const Link = dynamicImport('next/link')

const SidebarForm = (props) => {
    return (
        <SidebarCardBody>
            {props.forms.map((form, index)=> {
                return (
                    <SidebarFormItem key={index}>
                        <Link href={paths.home().asUrl} as={paths.home(form.form_name).asUrl}>
                            <SidebarLink isSelected={form.form_name === props.selectedFormulary}>
                                {props.sidebarIsOpen ? form.label_name : props.getFirstLetterBetweenSpacesOfString(form.label_name)}
                            </SidebarLink>
                        </Link>
                    </SidebarFormItem>
                )
            })}
        </SidebarCardBody>
    )
}

export default SidebarForm;