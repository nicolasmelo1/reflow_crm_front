import { Row, Col, Button } from 'react-bootstrap'
import React from 'react'
import { SidebarMenu } from 'styles/Sidebar'
import SidebarGroup from './SidebarGroup'
import actions from 'redux/actions'
import { connect } from 'react-redux';

/*** 
 * This is the sidebar of management pages, like kanban, listing and others, this side bar right now is only rendered in those pages.
 * It's important to notice the constructor, we make a request while constructing the component. 
 * */
class Sidebar extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isEditing: false
        }
        this.props.onGetForms()
    }
    enterEditMode(e) {
        e.preventDefault()
        this.setState(state => {
            if (!state.isEditing){
                this.props.onGetUpdateForms()
            } else {
                this.props.onGetForms()
            }
            return {
                isEditing: !state.isEditing
            }
        })
    }

    render () {  
        return (
            <Row>
                <Col>
                    <SidebarMenu pageWrapId="content-container" outerContainerId="main-container">
                        <SidebarGroup 
                        elements={(this.state.isEditing) ? this.props.sidebar.update : this.props.sidebar.initial } 
                        isEditing={this.state.isEditing}
                        onCreateOrUpdateGroup={this.props.onCreateOrUpdateGroup}
                        />
                        <Button onClick={e => this.enterEditMode(e)}>Editar template</Button>
                    </SidebarMenu>
                </Col>
            </Row>
        );
    }
}

export default connect(state => ({ sidebar: state.home.sidebar }), actions)(Sidebar);