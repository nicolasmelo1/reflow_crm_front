import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Link from 'next/link';
import { SidebarCardBody, SidebarFormItem, SidebarLink } from '../../styles/Sidebar'
import { paths } from '../../utils/constants'


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