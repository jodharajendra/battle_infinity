import React, { useEffect, useState, useContext, useRef } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import SideBar from "../../../customComponent/SideBar";
import { ProfileContext } from "../../../context/ProfileProvider";
import { Link, useNavigate } from "react-router-dom";

const Notification = () => {

  const [profileState, updateProfileState] = useContext(ProfileContext);

  const navigate = useNavigate();

  const handleLogOut = () => {
    updateProfileState({});
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  }

  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollTop();
    handleGetNotification();
  }, []);

  const scrollTop = () => {
    messagesEndRef?.current?.scrollIntoView(true)
  }

  const [sales, setSales] = useState("true");
  const [successfulBids, setSuccessfulBids] = useState("true");
  const [bidsOutbids, setBidsOutbids] = useState("true");
  const [expiredBids, setExpiredBids] = useState("true");
  const [notificationData, setNotificationData] = useState([]);








  const handleGetNotification = async () => {
    await AuthService.getNotification().then(async result => {
      if (result.success) {
        try {
          alertSuccessMessage(result.message);
          setNotificationData(result?.data?.notifications)
        } catch (error) {
          alertErrorMessage(error);
          // console.log('error', `${error}`);
        }
      } else {
        if (result.message === 'jwt expired') {
          // alertErrorMessage('result.message');
          handlerefreshToken();
          handleGetNotification();
        } else {
          // alertErrorMessage('result.message');
          handleLogOut();
        }
        // console.log(result.message, 'result.message');
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
        //  alertErrorMessage('Raj');
        handleLogOut();
      }
    });
  }


  const handleNotification = async (sales, successfulBids, bidsOutbids, expiredBids) => {
    await AuthService.updateNotification(sales, successfulBids, bidsOutbids, expiredBids).then(async result => {
      if (result.success) {
        try {
          alertSuccessMessage(result.message);
        } catch (error) {
          alertErrorMessage(error);
          // console.log('error', `${error}`);
        }
      } else {
        alertErrorMessage(result.message);
      }
    });
  }


  // console.log(sales, 'salessales');


  return (
    <>
      <div className="page_wrapper settings_wrapper" ref={messagesEndRef}>
        <section className="form_sec">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-12">
                <div className="main_panel nft_c_bar">
                  <SideBar />

                  <div className="nft_main_bar side_main_panel">
                    <div className="my_account" >
                      <section className="profile_sec">
                        <div className="container">
                          <h3> Notifications </h3>
                          <p>  Select the kinds of notifications you’d like receive to your email and in-app notifications center</p>
                          <hr />
                          <form className="d-block mt-5" >
                            <div className="form-group  mb-3" >
                              <div className="d-flex justify-content-between align-items-center" >
                                <div>
                                  <label className="up_label" >
                                    Sales
                                  </label>
                                  <span>
                                    When one of your NFTs sells
                                  </span>
                                </div>
                                <label class="switch" for="check_1">
                                  <input type="checkbox" id="check_1" value={sales} onChange={(e) => setSales(e.target.value)} />
                                  <span class="slider"></span>
                                </label>
                              </div>
                            </div>

                            <div className="form-group  mb-3" >
                              <div className="d-flex justify-content-between align-items-center" >
                                <div>
                                  <label className="up_label" >
                                    Successful bids
                                  </label>
                                  <span>
                                    When your bid was successful and the NFT is in your wallet
                                  </span>
                                </div>
                                <label class="switch" for="check_2">
                                  <input type="checkbox" id="check_2" value={successfulBids} onChange={(e) => setSuccessfulBids(e.target.value)} />
                                  <span class="slider"></span>
                                </label>
                              </div>
                            </div>
                            <div className="form-group  mb-3" >
                              <div className="d-flex justify-content-between align-items-center" >
                                <div>
                                  <label className="up_label" >
                                    Bids & Outbids
                                  </label>
                                  <span>
                                    When someone bids on one of your items or outbids yours bids
                                  </span>
                                </div>

                                <label class="switch" for="check_3">
                                  <input type="checkbox" id="check_3" value={bidsOutbids} onChange={(e) => setBidsOutbids(e.target.value)} />
                                  <span class="slider"></span>
                                </label>
                              </div>
                            </div>
                            <div className="form-group  mb-3" >
                              <div className="d-flex justify-content-between align-items-center" >
                                <div>
                                  <label className="up_label" >
                                    Expired bids
                                  </label>
                                  <span>
                                    When your bid expires or gets deactivated because of insufficient funds
                                  </span>
                                </div>
                                <label class="switch" for="check_4">
                                  <input type="checkbox" id="check_4" checked value={expiredBids} onChange={(e) => setExpiredBids(e.target.value)} />
                                  <span class="slider"></span>
                                </label>
                              </div>
                            </div>
                            <br/>
                            <hr/>
                            <div className="form-group d-flex justify-content-center" >

                            <button class="btn btn-gradient btn-border-gradient px-5 btn-block w-50 text-aling-center" type="button" onClick={() => handleNotification(sales, successfulBids, bidsOutbids, expiredBids)}>
                              <span class="d-block w-100 text-center">
                                Update Notification's
                              </span>
                            </button>
                            </div>

                          </form>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Notification;
