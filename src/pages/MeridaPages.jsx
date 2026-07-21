import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import Sidebar from "../componets/Sidebar";
import Footer from "../componets/Footer";
import Topbar from "../componets/Topbar";
import DetalleMerida from "../componets/DetalleMerida";

function MeridaPages() {
  return (
   
    <div id="wrapper">
     <Sidebar/>
      {/* Content Wrapper */}
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          
          {/* Topbar */}
          <Topbar/>

          {/* Begin Page Content */}
          <div className="container-fluid">

                   {/* Delegado vencido */}
                    <div className="row">
                      <DetalleMerida/>
                    </div>
          </div>
        </div>
         <Footer/>
      </div>
    </div>
    
  );
};


export default MeridaPages