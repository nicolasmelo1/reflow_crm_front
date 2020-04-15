import { ERROR } from '../types';
import Router from 'next/router'
import { paths } from '../../utils/constants'

export default async (state = {}, action) => {
    switch (action.type) {
        case ERROR:
            if (action.payload.reason) {
                if (['invalid_token', 'login_required'].includes(response.reason)){
                    Router.push(paths.login())
                }
            } 
            return action.payload
        default:
            return state;
    }
};