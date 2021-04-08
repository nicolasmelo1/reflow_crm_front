import React from 'react'
import { SidebarCardBody, SidebarFormItem, SidebarLink } from '../../styles/Sidebar'
import { paths } from '../../utils/constants'
import dynamicImport from '../../utils/dynamicImport'

const Link = dynamicImport('next/link')
const Col = dynamicImport('react-bootstrap', 'Col')
const Row = dynamicImport('react-bootstrap', 'Row')

const SidebarForm = (props) => {
    return (
        <SidebarCardBody>
            { props.forms.map((form, index)=> {
                return (
                    <SidebarFormItem key={index}>
                        <Row>
                            <Col>
                                <Link href={paths.home().asUrl} as={paths.home(form.form_name).asUrl}>
                                    <SidebarLink isSelected={form.form_name === props.selectedFormulary}>
                                        {form.label_name}
                                    </SidebarLink>
                                </Link>
                            </Col>
                        </Row>
                    </SidebarFormItem>
                )
            })}
        </SidebarCardBody>
    )
}

export default SidebarForm;