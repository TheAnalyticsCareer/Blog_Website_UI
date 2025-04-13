import { Outlet } from "react-router-dom";
import SwitchPage from "./SwitchPage";
import "./Layout.css";

function Layout() {
    return (
      <>
        <SwitchPage />
        <div className="content" style={{ paddingTop: '40px' }}> 
          
          <Outlet /> 
        </div>
      </>
    );
  }

export default Layout;
