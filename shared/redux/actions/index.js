import login from './login';
import errors from './errors';
import home from './home';
import notify from './notify'

export default {
    ...home,
    ...login,
    ...errors,
    ...notify
};