import { Row, Col } from 'react-bootstrap'
import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SidebarMenu, SidebarToggle, SidebarToggleContainer, SidebarContainer, SidebarTopButtonsContainer, SidebarEditTemplateButton, SidebarAddNewTemplateButton } from '../../styles/Sidebar' // not implemented in RN
import SidebarGroup from './SidebarGroup'
import SidebarGroupEdit from './SidebarGroupEdit'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import { strings } from '../../utils/constants'
import isAdmin from '../../utils/isAdmin'
import axios from 'axios'

/*** 
 * This is the sidebar of management pages, like kanban, listing and others, this side bar right now is only rendered in those pages.
 * It's important to notice the constructor, we make a request while constructing the component. 
 * */
class Sidebar extends React.Component {
    constructor(props){
        super(props)
        this.CancelToken = axios.CancelToken
        this.source = null
        this.state = {
            isEditing: false
        }
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

    componentDidMount() {
        this.source = this.CancelToken.source()
        // force to load templates if the user is logged and doesn't have any template
        this.props.onGetForms(this.source).then(response => {
            if (response && response.status === 200 && response.data.data.length === 0) {
                this.props.setAddTemplates(true)
            }
        })
    }

    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }
    
    renderMobile() {
        return (
            <SidebarContainer sidebarIsOpen={this.props.sidebarIsOpen}>
                <SidebarMenu>
                    <View style={{ height: 40 }}>
                        <SidebarTopButtonsContainer horizontal={true}>
                            <TouchableOpacity onPress={e => this.enterEditMode(e)} style={{padding: 10}}>
                                <SidebarEditTemplateButton>
                                    {(this.state.isEditing) ? strings['pt-br']['goBack']: strings['pt-br']['sidebarEditTemplateButtonLabel']}
                                </SidebarEditTemplateButton>
                            </TouchableOpacity>
                            {(this.state.isEditing) ? 
                            null : (
                                <TouchableOpacity onPress={e => this.props.setAddTemplates(true)} style={{padding: 10}}>
                                    <SidebarAddNewTemplateButton>
                                        {strings['pt-br']['sidebarAddNewTemplateButtonLabel']}
                                    </SidebarAddNewTemplateButton>
                                </TouchableOpacity>
                            )}
                        </SidebarTopButtonsContainer>
                    </View>
                    <SidebarGroup groups={this.props.sidebar.initial}/>
                </SidebarMenu>
                <SidebarToggleContainer>
                    <View style={{ flexDirection: 'row', width:'100%', justifyContent:'space-between'}}>
                        <SidebarToggle activeOpacity={0.8} onPress={e=> {
                            this.props.setSidebarIsOpen(e)
                        }}>
                            <Text style={{color: '#0dbf7e', alignSelf:'center'}}>{(this.props.sidebarIsOpen) ? '<<<': '>>>'}</Text>
                        </SidebarToggle>
                    </View>
                    {this.props.children}
                </SidebarToggleContainer>
            </SidebarContainer> 
        )
    }

    renderWeb() {
        return (
            <Row style={{ margin: '0'}}>
                <Col style={{ padding: '0'}}>
                    <SidebarToggle onClick={e=>this.props.setSidebarIsOpen(e)} sidebarIsOpen={this.props.sidebarIsOpen}>
                        {(this.props.sidebarIsOpen) ? '<<<': '>>>'}
                    </SidebarToggle>
                    <SidebarMenu sidebarIsOpen={this.props.sidebarIsOpen} >
                        {isAdmin(this.props.login?.types?.defaults?.profile_type, this.props.login?.user) ? (
                            <div>
                                <SidebarEditTemplateButton onClick={e => this.enterEditMode(e)}>{(this.state.isEditing) ? strings['pt-br']['goBack']: strings['pt-br']['sidebarEditTemplateButtonLabel']}</SidebarEditTemplateButton>
                                { (this.state.isEditing) ? null: <SidebarAddNewTemplateButton onClick={e => this.props.setAddTemplates(true) }>{strings['pt-br']['sidebarAddNewTemplateButtonLabel']}</SidebarAddNewTemplateButton>}
                            </div>
                        ) : null}
                        { (this.state.isEditing) ? (
                            <SidebarGroupEdit 
                            companyId={this.props.login.companyId}
                            groups={this.props.sidebar.update}
                            onRemoveGroup={this.props.onRemoveGroup}
                            onUpdateGroup={this.props.onUpdateGroup}
                            onChangeGroupState={this.props.onChangeGroupState}
                            onCreateOrUpdateForm={this.props.onCreateOrUpdateForm}
                            onCreateFormulary={this.props.onCreateFormulary}
                            onUpdateFormulary={this.props.onUpdateFormulary}
                            onAddNewForm={this.props.onAddNewForm}
                            onRemoveFormulary={this.props.onRemoveFormulary}
                            />
                        ): (
                            <SidebarGroup 
                            groups={this.props.sidebar.initial}
                            selectedFormulary={this.props.login.primaryForm}
                            />
                        )}
                    </SidebarMenu>
                </Col>
            </Row>
        )
    }

    render () {  
        return (process.env['APP'] === 'web') ? this.renderWeb(): this.renderMobile()
    }
}

export default connect(state => ({ sidebar: state.home.sidebar, login: state.login }), actions)(Sidebar);