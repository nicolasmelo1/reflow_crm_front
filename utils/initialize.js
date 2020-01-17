import Router from 'next/router';

// checks if the page is being loaded on the server, and if so, get auth token from the cookie:
export default function (ctx) {
    const token = ctx.store.getState().authentication.token;

    if (token && (ctx.pathname === '/')) {
        setTimeout(function () {
            Router.push('/');
        }, 0);
    }

}