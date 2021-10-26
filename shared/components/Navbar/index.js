import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import axios from 'axios'
import NavbarLink from './NavbarLink' 
import NavbarDropdown from './NavbarDropdown'
import { strings, paths } from '../../utils/constants'
import actions from '../../redux/actions'
import dynamicImport from '../../utils/dynamicImport'
import isAdmin from '../../utils/isAdmin'
import isEqual from '../../utils/isEqual'
import Styled from './styles'

const connect = dynamicImport('reduxConnect', 'default')
const Router = dynamicImport('next/router')

/** 
 * On the browser this component is called inside of the Layout component, but since React Navigation works differently, on mobile 
 * we need to call it on the App.js component since it needs to be on the root of the page.
 * 
 * Since this component is called everytime the user is logged in you can make requests here to retrieve specific data from logged 
 * users
 */
class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.navbarContainer = React.createRef()
        this.CancelToken = axios.CancelToken
        this.source = null
        this.state = {
            isOpen: false,
            notifications: null,
            homeFormularyData: null
        }
    }

    setIsOpen = (isOpen) => {
        this.setState(state=> state.isOpen = isOpen)
    }

    handleApiDocumentation = () => {
        Router.push(paths.apiDocumentation().asUrl, paths.apiDocumentation().asUrl,{ shallow: true })
    }

    handleLogout = (e) => {
        Router.push(paths.login().asUrl, paths.login().asUrl,{ shallow: true })
        this.props.onDeauthenticate()
    }

    handleBilling = () => {
        Router.push(paths.billing().asUrl, paths.billing().asUrl, { shallow: true })
    }

    handleTemplates = () => {
        Router.push(paths.templates().asUrl, paths.templates().asUrl, { shallow: true})
    }

    handleUsers = () => {
        Router.push(paths.users().asUrl, paths.users().asUrl, { shallow: true })
    }

    handleCompany = () => {
        Router.push(paths.company().asUrl, paths.company().asUrl, { shallow: true })
    }

    handlePDFTempalte = () => {
        Router.push(
            paths.pdfTemplatesSettings().asUrl, 
            paths.pdfTemplatesSettings(this.props.login.primaryForm).asUrl, 
            { shallow: true }
        )
    }

    freeTrialRemainingDays = () => {
        const createdAt = new Date(this.props.company.created_at)
        const freeTrialDueDate = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate() + this.props.company.free_trial_days)
        const today = new Date()
        return Math.ceil((freeTrialDueDate - today) / (1000 * 60 * 60 * 24))
    }

    isFreeTrial = () => {
        if (this.props.company.created_at && !this.props.company.is_paying_company) {
            const freeDaysLeft = this.freeTrialRemainingDays()
            if (0 <= freeDaysLeft) {
                return true
            }
        }
        return false
    }

    getConfigDropdown = () => {
        let defaultConfigDropdown = [
            {
                label: strings['pt-br']['headerLogoutLabel'],
                href: '#',
                onClick: this.handleLogout
            }
        ]

        if (isAdmin(this.props.login.types?.defaults?.profile_type, this.props.login.user)) {
            defaultConfigDropdown = [
                {
                    label: strings['pt-br']['headerCompanyLabel'],
                    href: '#',
                    onClick: this.handleCompany
                },
                {
                    label: strings['pt-br']['headerBillingLabel'],
                    href: '#',
                    onClick: this.handleBilling
                },
                {
                    label: strings['pt-br']['headerUsersLabel'],
                    href:'#',
                    onClick: this.handleUsers
                },
                ...defaultConfigDropdown,
            ]
            if (this.props.login.user.username === 'reflow@reflow.com.br') {
                defaultConfigDropdown.splice(0, 0, {
                    label: strings['pt-br']['headerTemplateLabel'],
                    href: '#',
                    onClick: this.handleTemplates
                })
            }
        } 

        if (this.props.login.user?.has_api_access_key) {
            defaultConfigDropdown.splice(0, 0, {
                label: strings['pt-br']['headerApiDocumentationLabel'],
                href: '#',
                onClick: this.handleApiDocumentation
            })
        }

        return defaultConfigDropdown
    }

    updateNavbarHeightWeb = () => {
        if (process.env['APP'] === 'web' && this.navbarContainer.current && typeof document !== 'undefined') {
            setTimeout(() => {
                if (this.navbarContainer.current) {
                    document.documentElement.style.setProperty(
                        '--app-navbar-height', 
                        `${this.navbarContainer.current.clientHeight}px`
                    )                                
                }
            }, 500)
        }
    }

    getToolsDropdown = () => {
        let toolsDropdown = [
            {
                label: strings['pt-br']['headerHomePdfGeneratorTools'],
                href: '#',
                onClick: this.handlePDFTempalte
            }
        ]
        return toolsDropdown
    }

    componentDidMount = () => {
        this.source = this.CancelToken.source()
        this.props.onGetNewNotifications(this.source)
        this.props.onGetCompanyData(this.source)
        this.props.onGetUserData(this.source, this.props.login.company_id)
        this.updateNavbarHeightWeb()
    }
    
    componentDidUpdate = (prevProps) => {
        if (
            this.props.navbar.isInHomeScreen && 
            this.props.sidebar.initial.length > 0 &&
            ((this.state.homeFormularyData !== null && this.state.homeFormularyData.form_name !== this.props.login.primaryForm) || 
            this.state.homeFormularyData === null)
        ) {
            const formularyName = this.props.login.primaryForm
            const groups = this.props.sidebar.initial
            let formularyData = null
            
            for (let groupIndex=0; groupIndex<groups.length; groupIndex++){
                for (let formularyIndex=0; formularyIndex<groups[groupIndex].form_group.length; formularyIndex++) {
                    if (groups[groupIndex].form_group[formularyIndex].form_name === formularyName) {
                        formularyData = JSON.parse(JSON.stringify(groups[groupIndex].form_group[formularyIndex]))
                        break
                    }
                }
            }
            
            if (!isEqual(formularyData, this.state.homeFormularyData) && formularyData !== null) {
                this.setState(state => ({
                    ...state,
                    homeFormularyData: formularyData
                }))
            }
        }
    }

    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }

    renderWeb = () => {
        return (
            <Styled.NavbarContainer 
            ref={this.navbarContainer}
            >
                <Styled.NavbarLogo 
                showSideBar={this.props.showSideBar}
                onLoad={(e)=> {
                    this.updateNavbarHeightWeb()
                }}
                src={!['', null].includes(this.props.company.logo_image_url) ? this.props.company.logo_image_url : '/complete_logo.png'}
                />
                {this.isFreeTrial() && isAdmin(this.props.login.types?.defaults?.profile_type, this.props.login.user) ? (
                    <Styled.NavbarFreeTrialAlertButton 
                    onClick={e=> {this.handleBilling()}}
                    >
                        <Styled.NavbarFreeTrialAlertText 
                        isBold={true
                        }>
                            {`${this.freeTrialRemainingDays()}`}
                        </Styled.NavbarFreeTrialAlertText>
                        <Styled.NavbarFreeTrialAlertText>
                            {strings['pt-br']['headerFreeTrialAlertDaysLabel']}
                        </Styled.NavbarFreeTrialAlertText>
                        <Styled.NavbarFreeTrialAlertText isBold={true}>
                            {strings['pt-br']['headerFreeTrialUpdateNowLabel']}
                        </Styled.NavbarFreeTrialAlertText>
                    </Styled.NavbarFreeTrialAlertButton>
                ) : ''}
                <Styled.NavbarToggleButton 
                onClick={e=> {this.setIsOpen(!this.state.isOpen)}}
                >
                    <FontAwesomeIcon 
                    icon={this.state.isOpen ? 'times' : 'bars'}
                    />
                </Styled.NavbarToggleButton>
                <Styled.NavbarItemsContainer 
                isOpen={this.state.isOpen}
                >
                    <Styled.NavbarItemsContainerHeader>
                        <img
                            style={{
                                width: '110px',
                                marginBottom: '15px'
                            }}
                            src={!['', null].includes(this.props.company.logo_image_url) ? this.props.company.logo_image_url : '/complete_logo.png'}
                        />
                        <div 
                        style={{ 
                            top: '10px',
                            right: '10px',
                            position: 'absolute'
                        }}
                        >
                            <Styled.NavbarToggleButton 
                            onClick={e=> {this.setIsOpen(!this.state.isOpen)}}
                            >
                                <FontAwesomeIcon 
                                icon={this.state.isOpen ? 'times' : 'bars'}
                                />
                            </Styled.NavbarToggleButton>
                        </div>
                    </Styled.NavbarItemsContainerHeader>
                    {(this.props.navbar.isInHomeScreen && this.state.homeFormularyData !== null) ? (
                        <NavbarDropdown 
                        icon='tasks' 
                        label={this.state.homeFormularyData.label_name} 
                        items={this.getToolsDropdown()}
                        />
                    ) : (
                        <NavbarLink 
                        link={paths.home(this.props.login.primaryForm).asUrl} 
                        slug={paths.home().asUrl} 
                        icon='tasks' 
                        label={strings['pt-br']['headerGestaoLabel']}
                        />
                    )}
                    <NavbarLink 
                    badge={this.props.notificationBadge > 0 ? this.props.notificationBadge : null} 
                    link={paths.notifications().asUrl} 
                    slug={paths.notifications().asUrl} 
                    icon='bell' 
                    label={strings['pt-br']['headerNotificationLabel']}
                    />
                    <NavbarDropdown 
                    icon='cog' 
                    label={strings['pt-br']['headerSettingsLabel']} 
                    items={this.getConfigDropdown()}
                    />
                </Styled.NavbarItemsContainer>
            </Styled.NavbarContainer>
        )
    }


    renderMobile() {
        const Tab = this.props.Tab
        return (
            <Tab.Navigator initialRouteName={'home'}>
                <Tab.Screen 
                name="home" 
                component={this.props.HomeComponent}
                options={{
                    title: this.props.navbar.setIsHomeToolsMenuOpen && this.state.homeFormularyData !== null ? this.state.homeFormularyData.label_name : 'Home'
                }}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        if (this.props.navbar.isInHomeScreen) {
                            e.preventDefault()
                            this.props.setIsHomeToolsMenuOpen(!this.props.isHomeToolsMenuOpen)
                        } else {
                            e.preventDefault()
                            navigation.navigate('data')
                        }
                    },
                })}/>
                <Tab.Screen name="notifications" component={this.props.NotificationComponent}/>
                <Tab.Screen name="configurations" component={this.props.ConfigurationComponent}/>
            </Tab.Navigator>
        )
    }

    render() {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
};

export default connect(store => ({
    login: store.login, 
    sidebar: store.home.sidebar,
    company: store.company, 
    navbar: store.navbar,
    notificationBadge: store.notification.notification.badge 
}), actions)(Navbar)