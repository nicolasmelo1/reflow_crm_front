import Header from "./navbar/Header";
import Head from "next/head";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircle, faTasks, faChartBar, faCog, faBell } from '@fortawesome/free-solid-svg-icons'
import Sidebar from "./Sidebar"

library.add(faBell, faChartBar, faCircle, faCog, faTasks)

const Base = ( props ) => {
  return (
      <div>
          <Head>
                <title>Reflow</title>
                <link rel="stylesheet" href="/styles.css"/>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous"/>
          </Head>
          <Header/>
          <Sidebar/>
          { props.children }
      </div>
  )
};

export default Base;
