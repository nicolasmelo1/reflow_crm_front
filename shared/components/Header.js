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
        <meta charset="utf-8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="white"/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width, viewport-fit=cover"/>
        <meta name="name" content="Reflow"/>
        <meta name="description" content="Changing the way people work"/>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0dbf7e" />
        <link rel="apple-touch-icon" sizes="72x72" href="/pwa/images/icons/icon-72x72.png"/>
        <link rel="apple-touch-icon" sizes="96x96" href="/pwa/images/icons/icon-96x96.png"/>
        <link rel="apple-touch-icon" sizes="144x144" href="/pwa/images/icons/icon-144x144.png"/>
        <link rel="apple-touch-icon" sizes="152x152" href="/pwa/images/icons/icon-152x152.png"/>
        <link rel="apple-touch-icon" sizes="192x192" href="/pwa/images/icons/icon-192x192.png"/>
        <link rel="apple-touch-icon" sizes="384x384" href="/pwa/images/icons/icon-384x384.png"/>
        <link rel="apple-touch-icon" sizes="512x512" href="/pwa/images/icons/icon-512x512.png"/>
        <link rel="icon" type="image/png" sizes="72x72" href="/pwa/images/icons/icon-72x72.png"/>
        <link rel="manifest" href="/pwa/manifest.json" />
        
        <script type="text/javascript" src="/dragdroptouch/js/dragdroptouch.js"></script>
        <link rel="stylesheet" href="/bulma/css/bulma.min.css" />
        <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'></link>
        <link rel="stylesheet" href="/bootstrap/css/bootstrap-grid.min.css"/>
        <link rel="stylesheet" href="/bootstrap/css/bootstrap-reboot.min.css"/>
        <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css"/>
    </Head>
)

export default Header 