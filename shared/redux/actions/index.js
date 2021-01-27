import login from './login';
import home from './home';
import notify from './notify'
import notification from './notification'
import templates from './templates'
import onboarding from './onboarding'
import changepassword from './changepassword'
import billing from './billing'
import users from './users'
import company from './company'
import pdf_generator from './pdf_generator'
import draft from './draft'
import navbar from './navbar'
import rich_text from './rich_text'

export default {
    ...home,
    ...login,
    ...notify,
    ...notification,
    ...templates,
    ...onboarding,
    ...billing,
    ...users,
    ...company,
    ...changepassword,
    ...pdf_generator,
    ...rich_text,
    ...draft,
    ...navbar
}