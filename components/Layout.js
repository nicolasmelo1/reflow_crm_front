import Nav from "./Nav";
import Head from "next/head";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircle, faTasks, faChartBar, faCog, faBell } from '@fortawesome/free-solid-svg-icons'

library.add(faBell, faChartBar, faCircle, faCog, faTasks)

const Layout = ( props ) => {
  return (
      <div>
          <Head>
                <title>Reflow</title>
                <link rel="stylesheet" href="/styles.css"/>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"/>
          </Head>
          <Nav/>
          { props.children }
      </div>
  )
};

export default Layout;
