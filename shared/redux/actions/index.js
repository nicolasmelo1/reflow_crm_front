import login from './login';
import home from './home';
import notify from './notify'
import notification from './notification'

export default {
    ...home,
    ...login,
    ...notify,
    ...notification
};