import Header from "./navbar/Header";
import Head from "next/head";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash, faCircle, faTasks, faChartBar, faCog, faBell, faArrowsAlt, faEdit, faCloudUploadAlt, faBars, faPen, faFilter, faSortAmountDown} from '@fortawesome/free-solid-svg-icons'
import Sidebar from "./Sidebar"

library.add(faTrash, faBell, faChartBar, faCircle, faCog, faTasks, faArrowsAlt, faEdit, faCloudUploadAlt, faBars, faPen, faFilter, faSortAmountDown)

const Base = ( props ) => {
  return (
      <>
          <Head>
                <title>Reflow</title>
                <link rel="stylesheet" href="/styles.css"/>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous"/>
          </Head>
          <Header/>
          <body>
            { props.children }
          </body>
      </>
  )
};

export default Base;
