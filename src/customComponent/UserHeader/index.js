import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserHeader = () => {
  const [isAuth, setIsAuth] = useState('0');
  function hideMenu() {
    let tab = document.getElementById("qwert");
    console.log(tab);
    tab.classList.remove("active");
  }
  function showMenu() {
    let tab = document.getElementById("qwert");
    console.log(tab);
    tab.classList.add("active");
  }



  return (
    <>
      <header className="ib-header header-default header-fixed header--sticky fluid-header">
        <div className="container">
          <div className="header-inner d-flex align-items-center justify-content-between">
            <div className="header-left d-flex align-items-center">
              <div className="logo-wrapper" >
                <Link to="/" className="logo logo-light">
                  <img src="images/logo_icon.svg" alt="brand" className="logo_icon" />
                  <img src="images/logo_name.svg" className="ms-2 logo_name l" alt="brand" />
                </Link>
              </div>
              {/* <div className="mainmenu-wrapper">
                <span className=" d-none d-lg-block">
                  <form action="#" className="search-bar ">
                    <input type="text" name="search" placeholder="Search" id="search" />
                    <button className="search-btn" type="submit"> <i className="ri-search-line"></i></button>
                  </form>
                </span>
              </div> */}
            </div>
            <div className="header-right d-flex align-items-center">
              <nav id="sideNav" className="mainmenu-nav d-none d-xl-block">
                <ul className="mainmenu  me-md-2">
                  <li className=""><Link className="" to="/explore_collections">Explore</Link></li>
                  <li className=""><Link className="" to="/collections_stats">Stats</Link></li>
                  {/* <li className=""><Link className="" to="/rentnft">Buy NFTs</Link></li> */}
                  <li className=""><Link className="" to="#">Game</Link></li>
                </ul>
              </nav>
              <ul className="header-right-inner">
                <li className="setting-option d-block  d-lg-none ">
                  <div className="icon-box search-mobile-icon">
                    <button><i className="ri-search-line"></i></button>
                  </div>
                  <form id="header-search-1" action="#" method="GET" className="large-mobile-blog-search search-bar">
                    <input type="text" name="search" placeholder="Search" id="search_2" />
                    <button className="search-btn" type="submit"> <i className="ri-search-line"></i></button>
                  </form>
                </li>
                <li className="wallet-button">
                  <Link to="/login" className="btn btn-gradient btn-border-gradient"  >
                    <span><i className="ri-wallet-3-line d-block d-sm-none" ></i> Login</span>
                  </Link>
                  <Link to="/signup" className="btn  btn-border-gradient ms-2" >
                    <span><i className="ri-wallet-3-line d-block d-sm-none" ></i>Signup</span>
                  </Link>
                </li>
                <li className="setting-option mobile-menu-bar d-block d-xl-none">
                  <button className="hamberger-button" onClick={() => showMenu()} >
                    <i className="ri-menu-2-fill"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      <div className="popup-mobile-menu" id="qwert">
        <div className="inner">
          <div className="header-top">
            <div className="logo logo-custom-css">
              <Link to="/" className="logo logo-light">
                <img src="images/logo-white.png" alt="brand" />
              </Link>
            </div>
            <div className="close-menu">
              <button className="close-button" onClick={() => hideMenu()}>
                <i className="ri-close-fill"></i>
              </button>
            </div>
          </div>
          <nav>
            <ul className="mainmenu">
              <li className=""><Link className="" to="/explore">Explore</Link></li>
              <li className=""><Link className="" to="/stats">Stats</Link></li>
              <li className=""><Link className="" to="/buynft">Buy NFTs</Link></li>
              {/* <li className=""><Link className="" to="/rentnft">Rent NFTs</Link></li> */}
              <li className=""><Link className="" to="#">Game</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default UserHeader;
