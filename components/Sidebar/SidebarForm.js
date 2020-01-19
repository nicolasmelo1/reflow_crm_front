import React from 'react'
import { Card, Row, Col} from 'react-bootstrap'
import { paths } from 'utils/constants'
import Link from 'next/link';
import actions from 'redux/actions'
import {connect} from 'react-redux'
import { SidebarCardBody, SidebarFormItem, SidebarLink } from 'styles/Sidebar'

class SidebarForm extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render () {
        return (
            <SidebarCardBody>
                { this.props.forms.map((element, index)=> {
                    return (
                        <SidebarFormItem key={index}>
                            <Row>
                                <Col>
                                    <Link href={paths.home(this.props.login.companyId, 'kanban', element.form_name)}><SidebarLink>{element.label_name}</SidebarLink></Link>
                                </Col>
                            </Row>
                        </SidebarFormItem>
                    )
                })}
            </SidebarCardBody>
        )
    }
}

export default connect(state=> ({ home: state.home, login: state.login }), actions)(SidebarForm);