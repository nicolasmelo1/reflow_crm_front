import Head from 'next/head';
import React from 'react'
/*** 
 * Component used for defining the <head> tag inside your HTML, if you want a component that acts as a Header on the page you are in
 * please name anything else except Header
 * 
 * PROPS:
 * title (String) - Defines the title of the page
 * */
const Header = (props) => (
    <Head>
        <title>{ props.title }</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/>
        <script type="text/javascript" src="/dragdroptouch/js/dragdroptouch.js"></script>
        <link rel="stylesheet" href="/bulma/css/bulma.min.css" />
        <link rel="stylesheet" href="/bootstrap/css/bootstrap-grid.min.css"/>
        <link rel="stylesheet" href="/bootstrap/css/bootstrap-reboot.min.css"/>
        <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css"/>
    </Head>
)

export default Header 