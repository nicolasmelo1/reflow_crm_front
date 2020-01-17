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
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"/>
    </Head>
)

export default Header 