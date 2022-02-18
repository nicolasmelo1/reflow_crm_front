import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import axios from 'axios'
import NavbarLink from './NavbarLink' 
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
        this.profileDropdownButtonRef = React.createRef()
        this.settingsDropdownButtonRef = React.createRef()
        this.homeDropdownButtonRef = React.createRef()
        this.CancelToken = axios.CancelToken
        this.source = null
        this.state = {
            isOpen: false,
            isHomeMenuOpen: false,
            isSettingsMenuOpen: false,
            isProfileMenuOpen: false,
            notifications: null,
            homeFormularyData: null
        }
    }

    setIsOpen = (isOpen) => this.setState(state => ({...state, isOpen}))
    setIsProfileMenuOpen = (isProfileMenuOpen) => this.setState(state=> ({ ...state, isProfileMenuOpen }))
    setIsSettingsMenuOpen = (isSettingsMenuOpen) => this.setState(state=> ({ ...state, isSettingsMenuOpen }))
    setIsHomeMenuOpen = (isHomeMenuOpen) => this.setState(state=> ({ ...state, isHomeMenuOpen }))

    handleApiDocumentation = () => {
        Router.push(paths.apiDocumentation().asUrl, paths.apiDocumentation().asUrl,{ shallow: true })
    }

    handleProfile = () => {
        Router.push(paths.profile().asUrl, paths.profile().asUrl,{ shallow: true })
    }

    handleLogout = () => {
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

    handlePDFTemplate = () => {
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

    webCloseDropdownWhenClickOutsideWeb = (e) => {
        if (this.profileDropdownButtonRef.current && !this.profileDropdownButtonRef.current.contains(e.target)) this.setIsProfileMenuOpen(false)
        if (this.settingsDropdownButtonRef.current && !this.settingsDropdownButtonRef.current.contains(e.target)) this.setIsSettingsMenuOpen(false)
        if (this.homeDropdownButtonRef.current && !this.homeDropdownButtonRef.current.contains(e.target)) this.setIsHomeMenuOpen(false)
    }

    isProfileImageDefined = () => ![null, undefined, ''].includes(this.props?.login?.user?.profile_image_url)

    componentDidMount = () => {
        this.source = this.CancelToken.source()
        this.props.onGetNewNotifications(this.source)
        this.props.onGetCompanyData(this.source)
        this.props.onGetUserData(this.source, this.props.login.company_id)
        this.updateNavbarHeightWeb()

        if (process.env['APP'] === 'web') document.addEventListener('click', this.webCloseDropdownWhenClickOutsideWeb)
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
        if (process.env['APP'] === 'web') document.removeEventListener('click', this.webCloseDropdownWhenClickOutsideWeb)

        if (this.source) {
            this.source.cancel()
        }
    }

    renderWeb = () => {
        return (
            <Styled.NavbarContainer 
            ref={this.navbarContainer}
            isOpen={this.state.isOpen}
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
                        <Styled.NavbarDropdownContainer
                        ref={this.homeDropdownButtonRef}
                        >
                            <Styled.NavbarDropdown 
                            onClick={() => this.setIsHomeMenuOpen(!this.state.isHomeMenuOpen)}
                            >
                                <Styled.NavbarDropdownButton
                                isOpen={this.state.isHomeMenuOpen} 
                                >
                                    <Styled.NavbarLinkIconContainer>
                                        <Styled.NavbarLinkIcon 
                                        icon={'tasks'}
                                        />
                                    </Styled.NavbarLinkIconContainer>
                                    <Styled.NavbarLinkLabel>
                                        {this.state.homeFormularyData.label_name}
                                    </Styled.NavbarLinkLabel>
                                    <Styled.NavbarDropdownArrowIcon 
                                    icon={this.state.isHomeMenuOpen ? 'chevron-up' : 'chevron-down'} 
                                    />
                                </Styled.NavbarDropdownButton>
                                <div style={{ position: 'relative' }}>
                                    {this.state.isHomeMenuOpen === true ? (
                                        <Styled.NavbarDropdownContentContainer>
                                            <Styled.NavbarDropdownItemButton
                                            onClick={() => this.handlePDFTemplate()}
                                            >
                                                {strings['pt-br']['headerHomePdfGeneratorTools']}
                                            </Styled.NavbarDropdownItemButton>
                                        </Styled.NavbarDropdownContentContainer>
                                    ) : ''}
                                </div>
                            </Styled.NavbarDropdown>
                        </Styled.NavbarDropdownContainer>
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
                    <Styled.NavbarDropdownContainer
                    ref={this.settingsDropdownButtonRef}
                    >
                        <Styled.NavbarDropdown 
                        onClick={() => this.setIsSettingsMenuOpen(!this.state.isSettingsMenuOpen)}
                        >
                            <Styled.NavbarDropdownButton
                            isOpen={this.state.isSettingsMenuOpen} 
                            >
                                <Styled.NavbarLinkIconContainer>
                                    <Styled.NavbarLinkIcon 
                                    icon={'cog'}
                                    />
                                </Styled.NavbarLinkIconContainer>
                                <Styled.NavbarLinkLabel>
                                    {strings['pt-br']['headerSettingsLabel']}
                                </Styled.NavbarLinkLabel>
                                <Styled.NavbarDropdownArrowIcon 
                                icon={this.state.isSettingsMenuOpen ? 'chevron-up' : 'chevron-down'} 
                                />
                            </Styled.NavbarDropdownButton>
                            <div style={{ position: 'relative' }}>
                                {this.state.isSettingsMenuOpen === true ? (
                                    <Styled.NavbarDropdownContentContainer>
                                        {!['', null, undefined].includes(this.props.login.user?.api_access_key) ? (
                                            <Styled.NavbarDropdownItemButton
                                            onClick={() => this.handleApiDocumentation()}
                                            >
                                                {strings['pt-br']['headerApiDocumentationLabel']}
                                            </Styled.NavbarDropdownItemButton>
                                        ) : ''}
                                        {this?.props?.login?.user?.username === 'reflow@reflow.com.br' ? (
                                            <Styled.NavbarDropdownItemButton
                                            onClick={() => this.handleTemplates()}
                                            >
                                                {strings['pt-br']['headerTemplateLabel']}
                                            </Styled.NavbarDropdownItemButton>
                                        ) : ''}
                                        {isAdmin(this.props.login.types?.defaults?.profile_type, this.props.login.user) ? (
                                            <React.Fragment>
                                                <Styled.NavbarDropdownItemButton
                                                onClick={() => this.handleCompany()}
                                                >
                                                    {strings['pt-br']['headerCompanyLabel']}
                                                </Styled.NavbarDropdownItemButton>
                                                <Styled.NavbarDropdownItemButton
                                                onClick={() => this.handleBilling()}
                                                >
                                                    {strings['pt-br']['headerBillingLabel']}
                                                </Styled.NavbarDropdownItemButton>
                                                <Styled.NavbarDropdownItemButton
                                                onClick={() => this.handleUsers()}
                                                >
                                                    {strings['pt-br']['headerUsersLabel']}
                                                </Styled.NavbarDropdownItemButton>
                                            </React.Fragment>
                                        ) : ''}
                                    </Styled.NavbarDropdownContentContainer>
                                ) : ''}
                            </div>
                        </Styled.NavbarDropdown>
                    </Styled.NavbarDropdownContainer>
                    <Styled.NavbarUserImageButton
                    ref={this.profileDropdownButtonRef}
                    onClick={() => this.setIsProfileMenuOpen(!this.state.isProfileMenuOpen)}
                    >
                        <Styled.NavbarUserImageWrapper>
                            {this.isProfileImageDefined() === true ? (
                                <img 
                                draggable={false} 
                                src={this.props.login.user.profile_image_url}
                                />
                            ) : (
                                <FontAwesomeIcon 
                                style={{ color: '#bfbfbf'}}
                                icon={'user'}
                                size='2x'
                                />
                            )}
                        </Styled.NavbarUserImageWrapper>
                        {this.state.isProfileMenuOpen ? (
                            <Styled.NavbarUserDropdownContainer>
                                <Styled.NavbarUserDropdownButton
                                onClick={() => this.handleProfile()}
                                >
                                    {strings['pt-br']['headerEditProfileLabel']}
                                </Styled.NavbarUserDropdownButton>
                                <Styled.NavbarUserDropdownButton
                                hasBorderAtBottom={false}
                                isLogout={true}
                                onClick={() => this.handleLogout()}
                                >
                                    {strings['pt-br']['headerLogoutLabel']}
                                </Styled.NavbarUserDropdownButton>
                            </Styled.NavbarUserDropdownContainer>
                        ) : ''}
                    </Styled.NavbarUserImageButton>
                </Styled.NavbarItemsContainer>
            </Styled.NavbarContainer>
        )
    }


    renderMobile = () => {
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

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(store => ({
    login: store.login, 
    sidebar: store.home.sidebar,
    company: store.company, 
    navbar: store.navbar,
    notificationBadge: store.notification.notification.badge 
}), actions)(Navbar)