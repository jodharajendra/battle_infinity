import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState, useContext, useRef, useEffect } from "react";
import '@rainbow-me/rainbowkit/styles.css';
import { useAccount } from 'wagmi'
import { ProfileContext } from "../../context/ProfileProvider";
import AuthService from "../../api/services/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { alertErrorMessage, alertSuccessMessage } from "../../customComponent/CustomAlertMessage";
import { ApiConfig } from "../../api/apiConfig/apiConfig";

const AuthHeader = () => {
  const { address, isConnecting, isDisconnected } = useAccount()
  const [profileState, updateProfileState] = useContext(ProfileContext);
  const walletAddress = localStorage.getItem("wallet_address");
  const [logoImage, setLogoImage] = useState("");
  const [searchDetailData, setSearchDetailData] = useState("");
  const [searchDataList, setSearchDataList] = useState("");
  const navigate = useNavigate();
  const messagesEndRef = useRef(null)
  const [profileWallet, setProfileWallet] = useState([]);

  function hideMenu() {
    let tab = document.getElementById("qwert");
    tab.classList.remove("active");
  }

  function showMenu() {
    let tab = document.getElementById("qwert");
    tab.classList.add("active");
  }

  const handleLogOut = () => {
    updateProfileState({});
    localStorage.clear();
    window.location.reload();
    localStorage.setItem("isShowModel", 'true');
    navigate("/login");
    window.location.reload();
  }


  useEffect(() => {
    scrollTop();
    handleuserProfile();
  }, []);

  const scrollTop = () => {
    messagesEndRef?.current?.scrollIntoView(true)
  }

  const handleuserProfile = async () => {
    await AuthService.getUserDetails().then(async result => {
      if (result.success) {
        try {
          setLogoImage(result?.data?.logo);
          setProfileWallet(result?.data?.wallet_address)
        } catch (error) {
        }
      } else {
        if (result.message === 'jwt expired') {
          handlerefreshToken();
          handleuserProfile();
        } else {
          handleLogOut();
        }
      }
    });
  }


  const handlerefreshToken = async () => {
    await AuthService.refreshTokenData().then(async result => {
      if (result.success) {
        localStorage.setItem('accessToken', result?.data?.accessToken);
        localStorage.setItem('refreshToken', result?.data?.refreshToken);
        updateProfileState(result.data);
      } else {
        handleLogOut();
      }
    });
  }


  const handleusergetDetailsSearch = async (searchDetailData) => {
    await AuthService.getSearchDetails(searchDetailData).then(async result => {
      if (result.success) {
        console.log(result, 'resultR');
        try {
          setSearchDataList(result?.data);
          nextPage(result?.data);
        } catch (error) {
        }
      } else {
        if (result.message === 'jwt expired') {
          handlerefreshToken();
          handleuserProfile();
        } else {
          handleLogOut();
        }
      }
    });
  }

  const nextPage = (data) => {
    navigate('/marketplace-search', { state: data });
    setSearchDetailData('')
  };


  console.log(profileWallet, 'profileWallet');

  return (
    <>
      <header className="ib-header header-default header-fixed header--sticky fluid-header" >
        <div className="container">
          <div className="header-inner d-flex align-items-center justify-content-between">
            <div className="header-left d-flex align-items-center">
              <div className="logo-wrapper" ref={messagesEndRef}>
                <Link to='/' className="logo logo-light">
                  <img src="images/logo_icon.svg" alt="brand" className="logo_icon" />
                  <img src="images/logo_name.svg" className="ms-2 logo_name l" alt="brand" />
                </Link>
              </div>
              <div className="mainmenu-wrapper">
                <span className=" d-none d-lg-block">
                  <form className="search-bar ">
                    <input type="text" name="search" r placeholder="Search" id="search" value={searchDetailData} onChange={(e) => setSearchDetailData(e.target.value)} />
                    <button className="search-btn" type="button" onClick={() => handleusergetDetailsSearch(searchDetailData)}> <i className="ri-search-line"></i></button>
                  </form>
                </span>
              </div>
            </div>
            <div className="header-right d-flex align-items-center">
              <nav id="sideNav" className="mainmenu-nav d-none d-xl-block">
                <ul className="mainmenu  me-md-2">
                  <li className=""><Link className="" to="/explore_collections">Explore</Link></li>
                  <li className=""><Link className="" to="/collections_stats">Stats</Link></li>
                  <li className="has-dropdown  "><Link className=""> NFT's </Link>
                    <ul className="submenu">
                      <li className=""><Link className="" to="/buynft">Buy NFTs</Link></li>
                      <li className=""><Link className="" to="/rentnft">Rent NFTs</Link></li>
                      <li className=""><Link className="" to="auction_nft">Auction NFTs</Link></li>
                      <li className=""><Link className="" to="bundleList">Bundle NFTs</Link></li>
                    </ul>
                  </li>
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
                <li className="avatar-info"> <Link to="#">
                  {
                    logoImage ?
                      <img src={`${ApiConfig.baseUrl + logoImage}`} />
                      :
                      <img src="images/avatar/user_lg.jpg" alt="user avatar" />
                  }
                </Link>
                  <ul className="submenu">
                    <li><Link to="/profile"><i className="ri-user-line"></i> Profile</Link></li>
                    <li><Link to="my_collection"><i className="ri-layout-grid-line"></i>My Collection</Link></li>
                    <li><Link to="new_nft"><i className="ri-edit-line"></i> Create NFT</Link></li>
                    <li><Link to="/new_bundle"><i class="ri-layout-grid-fill"></i> Create Bundels</Link></li>
                    <li><Link to="/settings"><i class="ri-settings-line"></i> Settings</Link></li>
                    <li><Link to="/notifications"><i class="ri-notification-4-line"></i> Notifications</Link></li>
                    <li><Link style={{ cursor: 'pointer' }} onClick={() => handleLogOut()}> <i class="ri-shut-down-line"></i> Logout</Link></li>
                  </ul>
                </li>



                {
                  walletAddress === '0xC1fEec289C4110A103F7A3F759cFA7a61d18a173' || profileWallet === '0xC1fEec289C4110A103F7A3F759cFA7a61d18a173' ? ''
                    :

                    <li className="wallet-button " >
                      <button className="btn btn-gradient btn-border-gradient">
                        <ConnectButton showBalance={false} />

                      </button>
                    </li>
                }



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
              <li className=""><Link className="" to="/rentnft">Rent NFTs</Link></li>
              <li className=""><Link className="" to="auction_nft">Auction NFTs</Link></li>
              <li className=""><Link className="" to="#">Game</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default AuthHeader;
