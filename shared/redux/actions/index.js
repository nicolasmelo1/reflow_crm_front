import login from './login';
import home from './home';
import notify from './notify'
import notification from './notification'
import templates from './templates'
import onboarding from './onboarding'
import changepassword from './changepassword'
import billing from './billing'

export default {
    ...home,
    ...login,
    ...notify,
    ...notification,
    ...templates,
    ...onboarding,
    ...billing,
    ...changepassword
}