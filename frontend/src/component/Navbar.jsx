import "../Style/navbar.css";
import { Link } from "react-router-dom";
import logo from "../image/logo.png";
// import logo from "../image/logo.svg";
import Searchbutton from "./Searchbutton";

function Navbar() {
  return (
    <>
      <div className="header">
        <div className="glass bounce">
          <div className="app_link">
        <div className="logo bounce_img">
          <Link to='/'>

            <img src={logo} alt="Logo" />
          </Link>
            <div className="logotexts">
              <p>Indian Institute Of Technology Jodhpur</p>
              <p>भारतीय प्रौद्योगिकी संस्थान जोधपुर</p>
            </div>
            
        <div className="treeD">
          <Link to="/ImageTree">
              3D
            </Link>
            <div className="line "></div>
    </div>
        </div>
        
              <Searchbutton />
            {/* </div> */}
            
            
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
