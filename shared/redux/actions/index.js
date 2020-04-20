import login from './login';
import home from './home';
import notify from './notify'

export default {
    ...home,
    ...login,
    ...notify
};