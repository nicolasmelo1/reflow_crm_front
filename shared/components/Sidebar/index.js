import { Row, Col } from 'react-bootstrap'
import { View } from 'react-native'
import React from 'react'
import SidebarContainer from '../../styles/Sidebar/SidebarContainer'
import SidebarToggle from '../../styles/Sidebar/SidebarToggle'
import SidebarMenu from '../../styles/Sidebar/SidebarMenu'
import SidebarToggleContainer from '../../styles/Sidebar/SidebarToggleContainer'
import SidebarEditTemplateButton from '../../styles/Sidebar/SidebarEditTemplateButton'
import SidebarAddNewTemplateButton from '../../styles/Sidebar/SidebarAddNewTemplateButton'
import SidebarTopButtonsContainer from '../../styles/Sidebar/SidebarTopButtonsContainer'
//import { SidebarMenu, SidebarToggle, SidebarEditTemplateButton, SidebarAddNewTemplateButton } from '../../styles/Sidebar' // not implemented in RN
import SidebarGroup from './SidebarGroup'
//import SidebarGroupEdit from './SidebarGroupEdit'// not implemented in RN
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

    renderWeb() {
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
        )
    }

    
    renderMobile() {
        console.log(this.props.sidebar)
        return (
            <SidebarContainer >
                {this.props.sidebarIsOpen ? (
                    <SidebarMenu>
                        <View style={{ height: 40 }}>
                            <SidebarTopButtonsContainer horizontal={true}>
                                <SidebarEditTemplateButton 
                                onPress={e => this.enterEditMode(e)}
                                title={(this.state.isEditing) ? strings['pt-br']['goBack']: strings['pt-br']['sidebarEditTemplateButtonLabel']}
                                />
                                {(this.state.isEditing) ? null : <SidebarAddNewTemplateButton title={strings['pt-br']['sidebarAddNewTemplateButtonLabel']}/>}
                            </SidebarTopButtonsContainer>
                        </View>
                        <SidebarGroup elements={this.props.sidebar.initial}/>
                    </SidebarMenu>
                ) : null}
        
                <SidebarToggleContainer >
                    <SidebarToggle onPress={e=>this.props.setSidebarIsOpen(e)} sidebarIsOpen={this.props.sidebarIsOpen} title={(this.props.sidebarIsOpen) ? '<<<': '>>>'}/>
                    {this.props.children}
                </SidebarToggleContainer>
            </SidebarContainer> 
        )
    }


    render () {  
        if (process.env['APP'] === 'web') {
            return this.renderWeb()
        } else {
            return this.renderMobile()
        }
    }
}

export default connect(state => ({ sidebar: state.home.sidebar, login: state.login }), actions)(Sidebar);