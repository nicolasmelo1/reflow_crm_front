import login from './login';
import errors from './errors';
import home from './home';


export default {
    ...home,
    ...login,
    ...errors
};