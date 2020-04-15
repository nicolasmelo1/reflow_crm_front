import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Link from 'next/link';
import { connect } from 'react-redux'
import { SidebarCardBody, SidebarFormItem, SidebarLink } from '../../styles/Sidebar'
import { paths } from '../../utils/constants'
import actions from '../../redux/actions'



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
                                    <Link href={paths.home(element.form_name, true)} as={paths.home(element.form_name)}>
                                        <SidebarLink>{element.label_name}</SidebarLink>
                                    </Link>
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