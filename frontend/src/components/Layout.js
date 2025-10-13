import React from "react";
import AppNavbar from "./Navbar";
import Footer from "./Footer";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="layout-wrapper">
      <AppNavbar />
      <div className="layout-bg">
        <main className="page-content">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
