import React, { useEffect, useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthService from "../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../customComponent/CustomAlertMessage";

const Footer = () => {

  const [emailAddress, setEmaliAddress] = useState('')

  const handleSubscribe = async (emailAddress) => {
    await AuthService.subscribeEmail(emailAddress).then(async result => {
      if (result.success) {
        try {
          alertSuccessMessage(result.message);
          setEmaliAddress('');
        } catch (error) {
          alertErrorMessage(result.message);
        }
      } else {
        alertErrorMessage(result.message);
      }
    });
  }


  return (
    <footer className="footer-wrapper" >
      <div className="footer-inner pt-120 pb-40">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-8">
              <div className="footer-widget first-block">
                <div className="mb-4">
                  <Link to="/" className="logo-light"><img src="images/logo-white.png" alt="brand" /></Link>
                </div>
                <p className="mb-5">Enter your email to get notified by battle infinity for latest updates.</p>
                <form>
                  <div className="subscribe-mail">
                    <input type="text" name="email" id="subscribe-email" placeholder="Email Address" value={emailAddress} onChange={(e) => setEmaliAddress(e.target.value)} />
                    <button className="btn btn-small btn-gradient" type="button" onClick={() => handleSubscribe(emailAddress)}><span><i className="ri-send-plane-line"></i></span></button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 mb-8">
              <div className="footer-widget">
                <h4>Battle Infnity</h4>
                <ul className="footer-list-widget">
                  <li><Link to="/explore_collections">Explore</Link></li>
                  <li><Link to="/rentnft">Rent NFTs</Link></li>
                  <li><Link to="/about-us">About</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 mb-8">
              <div className="footer-widget">
                <h4>My Account</h4>
                <ul className="footer-list-widget">
                  <li><Link to="/profile" >Profile</Link></li>
                  <li><Link to="/my_collection">My Collections</Link></li>
                  <li><Link to="settings">Settings</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 mb-8">
              <div className="footer-widget">
                <h4>Resources</h4>
                <ul className="footer-list-widget">
                  <li><Link to="/helpcenter">Help Center</Link></li>
                  <li><Link to="/platforstatus">Platform Status</Link></li>
                  <li><Link to="/partners">Partners</Link></li>
                </ul>

              </div>
            </div>
            <div className="col-lg-2 col-md-6 mb-8">
              <div className="footer-widget">
                <h4>Community</h4>
                <ul className="footer-list-widget">
                  <li><Link to="/suggstedfeatures">Suggsted Features</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        <div className="container">
          <div className="row align-items-center" >
            <div className="col-md-6" >
              <p className="mb-0" >Copyright © 2022 Battle Infinity. Designed & developed by <Link to="https://appinop.com/" target="_blank">Appinop Technologies</Link></p>
            </div>
            <div className="col-md-6 " >
              <div className="social justify-content-end">
                <Link className="icon-facebook" to="#"><i className="ri-facebook-line"></i></Link>
                <Link className="icon-twitter" to="#"><i className="ri-twitter-line"></i></Link>
                <Link className="icon-instagram" to="#"><i className="ri-instagram-line"></i></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;