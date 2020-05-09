import { Row, Col } from 'react-bootstrap'
import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SidebarMenu, SidebarToggle, SidebarToggleContainer, SidebarContainer, SidebarTopButtonsContainer, SidebarEditTemplateButton, SidebarAddNewTemplateButton } from '../../styles/Sidebar' // not implemented in RN
import SidebarGroup from './SidebarGroup'
import SidebarGroupEdit from './SidebarGroupEdit'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import { strings } from '../../utils/constants'
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
    
    componentDidMount() {
        this.source = this.CancelToken.source()
        this.props.onGetForms(this.source)
    }

    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
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

    renderWeb() {
        return (
            <Row style={{ margin: '0'}}>
                <Col style={{ padding: '0'}}>
                    <SidebarToggle onClick={e=>this.props.setSidebarIsOpen(e)} sidebarIsOpen={this.props.sidebarIsOpen}>
                        {(this.props.sidebarIsOpen) ? '<<<': '>>>'}
                    </SidebarToggle>
                    <SidebarMenu sidebarIsOpen={this.props.sidebarIsOpen} >
                        <SidebarEditTemplateButton onClick={e => this.enterEditMode(e)}>{(this.state.isEditing) ? strings['pt-br']['goBack']: strings['pt-br']['sidebarEditTemplateButtonLabel']}</SidebarEditTemplateButton>
                        { (this.state.isEditing) ? '': <SidebarAddNewTemplateButton onClick={e => this.props.setAddTemplates(true) }>{strings['pt-br']['sidebarAddNewTemplateButtonLabel']}</SidebarAddNewTemplateButton>}
                        { (this.state.isEditing) ? (
                            <SidebarGroupEdit 
                            companyId={this.props.companyId}
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
                            <SidebarGroup elements={this.props.sidebar.initial}/>
                        )}
                    </SidebarMenu>
                </Col>
            </Row>
        )
    }

    
    renderMobile() {
        return (
            <SidebarContainer sidebarIsOpen={this.props.sidebarIsOpen}>
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
        
                <SidebarToggleContainer>
                    <TouchableOpacity style={{backgroundColor: '#17242D', justifyContent:'center', borderRadius: 2, height: 40, width: 60}} activeOpacity={0.8} onPress={e=> {
                        this.props.setSidebarIsOpen(e)
                    }}>
                        <Text style={{color: '#0dbf7e', alignSelf:'center'}}>{(this.props.sidebarIsOpen) ? '<<<': '>>>'}</Text>
                    </TouchableOpacity>
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

export default connect(state => ({ sidebar: state.home.sidebar, companyId: state.login.companyId }), actions)(Sidebar);