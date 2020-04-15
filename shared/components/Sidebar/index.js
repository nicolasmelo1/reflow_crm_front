import { Row, Col } from 'react-bootstrap'
import React from 'react'
import { SidebarMenu, SidebarToggle, SidebarEditTemplateButton, SidebarAddNewTemplateButton } from '../../styles/Sidebar'
import SidebarGroup from './SidebarGroup'
import SidebarGroupEdit from './SidebarGroupEdit'
import actions from '../../redux/actions'
import { connect } from 'react-redux';
import { strings } from '../../utils/constants'
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
    
    enterEditMode = (e) => {
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
            <Row style={{ margin: '0'}}>
                <Col style={{ padding: '0'}}>
                    <SidebarToggle onClick={e=>this.props.setSidebarIsOpen(e)} sidebarIsOpen={this.props.sidebarIsOpen}>
                        {(this.props.sidebarIsOpen) ? '<<<': '>>>'}
                    </SidebarToggle>
                    <SidebarMenu sidebarIsOpen={this.props.sidebarIsOpen} >
                        <SidebarEditTemplateButton onClick={e => this.enterEditMode(e)}>{(this.state.isEditing) ? strings['pt-br']['goBack']: strings['pt-br']['sidebarEditTemplateButtonLabel']}</SidebarEditTemplateButton>
                        { (this.state.isEditing) ? '': <SidebarAddNewTemplateButton>{strings['pt-br']['sidebarAddNewTemplateButtonLabel']}</SidebarAddNewTemplateButton>}
                        { (this.state.isEditing) ? (
                            <SidebarGroupEdit 
                            companyId={this.props.login.companyId}
                            groups={this.props.sidebar.update}
                            onUpdateGroup={this.props.onUpdateGroup}
                            onChangeGroupState={this.props.onChangeGroupState}
                            onCreateOrUpdateForm={this.props.onCreateOrUpdateForm}
                            onCreateFormulary={this.props.onCreateFormulary}
                            onUpdateFormulary={this.props.onUpdateFormulary}
                            onAddNewForm={this.props.onAddNewForm}
                            onRemoveFormulary={this.props.onRemoveFormulary}
                            />
                        ): (
                            <SidebarGroup elements={this.props.sidebar.initial}/>
                        )}
                    </SidebarMenu>
                </Col>
            </Row>
        );
    }
}

export default connect(state => ({ sidebar: state.home.sidebar, login: state.login }), actions)(Sidebar);