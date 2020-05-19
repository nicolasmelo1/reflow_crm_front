import login from './login';
import home from './home';
import notify from './notify'
import notification from './notification'
import templates from './templates'
import onboarding from './onboarding'

export default {
    ...home,
    ...login,
    ...notify,
    ...notification,
    ...templates,
    ...onboarding
};