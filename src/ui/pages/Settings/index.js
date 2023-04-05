import React, { useRef, useEffect, useState, useContext } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import SideBar from "../../../customComponent/SideBar";
import { ProfileContext } from "../../../context/ProfileProvider";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import { Link, useNavigate } from "react-router-dom";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";

const Settings = () => {
  const messagesEndRef = useRef(null)
  useEffect(() => {
    scrollTop()
  }, []);
  const scrollTop = () => {
    messagesEndRef?.current?.scrollIntoView(true)
  }

  const [localLogoImage, setLocalLogoImage] = useState('');
  const [logoImage, setLogoImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [localBannerImage, setLocalBannerImage] = useState('');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [emailId, setEmailId] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [instagram, setInstagram] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [getBannerImage, setGetBannerImage] = useState("");
  const [getLogoImage, setGetLogoImage] = useState("");


  const handleChangeBannerImage = async (event) => {
    event.preventDefault();
    const fileUploaded = event.target.files[0];
    const imgata = URL.createObjectURL(fileUploaded);
    setBannerImage(imgata);
    handleUpdateBannerImage(fileUploaded)
  }


  const handleChangeLogoImage = async (event) => {
    event.preventDefault();
    const fileUploaded = event.target.files[0];
    const imgata = URL.createObjectURL(fileUploaded);
    setLogoImage(imgata);
    handleUpdateLogoImages(fileUploaded);
  }


  const handleUpdateProfile = async (firstName, lastName, userName, shortBio, emailId, facebookLink, twitterLink, instagram, socialLink) => {
    await AuthService.updateProfile(localLogoImage, localBannerImage, firstName, lastName, userName, shortBio, emailId, facebookLink, twitterLink, instagram, socialLink).then(async result => {
      if (result.success) {
        try {
          alertSuccessMessage(result.message);
          handleuserProfile();
          window.location.reload();
        } catch (error) {
          alertErrorMessage(error);
          // console.log('error', `${error}`);
        }
      } else {
        alertErrorMessage(result.message);
      }
    });
  }

  useEffect(() => {
    handleuserProfile();
  }, [])

  const [profileState, updateProfileState] = useContext(ProfileContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    updateProfileState({});
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  }

  const handleuserProfile = async () => {
    await AuthService.getUserDetails().then(async result => {
      if (result.success) {
        try {
          setFirstName(result?.data?.first_name);
          setLastName(result?.data?.last_name);
          setUserName(result?.data?.username);
          setEmailId(result?.data?.email_or_phone);
          setBannerImage(result?.data?.cover_photo);
          setLogoImage(result?.data?.logo);
          setFacebookLink(result?.data?.social_connections?.facebookLink);
          setSocialLink(result?.data?.social_connections?.socialLink);
          setInstagram(result?.data?.social_connections?.instagram);
          setTwitterLink(result?.data?.social_connections?.twitter);
          setShortBio(result?.data?.profile_description);
        } catch (error) {
          alertErrorMessage(result.message);
        }
      } else {
        if (result.message === 'jwt expired') {
          handlerefreshToken();
          handleuserProfile();
        } else {
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


  const handleUpdateLogoImages = async (logoImage) => {
    var formData = new FormData();
    formData.append('file', logoImage);
    await AuthService.updateLogoImages(formData).then(async result => {
      if (result.success) {
        LoaderHelper.loaderStatus(false);
        try {
          alertSuccessMessage(result.message);
          setLocalLogoImage(result?.data);
        } catch (error) {
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage(result.message);
      }
    });
  }


  const handleUpdateBannerImage = async (bannerImage) => {
    var formData = new FormData();
    formData.append('file', bannerImage);
    await AuthService.updateBannerImage(formData).then(async result => {
      if (result.success) {
        LoaderHelper.loaderStatus(false);
        try {
          alertSuccessMessage(result.message);
          setLocalBannerImage(result?.data);

        } catch (error) {
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage(result.message);
      }
    });
  }


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
                          <h3> Edit Profile </h3>
                          <p> Enter Details to update your profile</p>
                          <div className="bg-cover mt-3">
                            <div class="change-photo-btn">
                              <span>
                                {/* <i class="ri-upload-line me-2"></i> */}
                                Upload Photo</span>
                              <input type="file" class="upload" onChange={handleChangeBannerImage} />
                            </div>
                            {localBannerImage ?
                              <img src={`${ApiConfig.baseUrl + localBannerImage}`} />
                              : bannerImage ?

                                <img src={`${ApiConfig.baseUrl + bannerImage}`} />
                                :
                                <img src='images/banners/banner_1.png' />
                            }
                          </div>
                          <div className="user_img" >
                            <div class="change-photo-btn"> Upload Photo <input type="file" class="upload" onChange={handleChangeLogoImage} /></div>
                            {localLogoImage ?
                              <img src={`${ApiConfig.baseUrl + localLogoImage}`} />

                              : logoImage ?
                                <img src={`${ApiConfig.baseUrl + logoImage}`} />
                                :
                                <img src='images/avatar/user_lg.jpg' />

                            }

                          </div>
                          <form className="row mt-4" >
                            <div className="col-lg-6" >
                              <div class="field-box form-group">
                                <label for="name" class="up_label">First Name  </label>
                                <input id="name" type="text" placeholder="Enter your Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                              </div>
                            </div>
                            <div className="col-lg-6" >
                              <div class="field-box form-group">
                                <label for="name" class="up_label">Last Name  </label>
                                <input id="name" type="text" placeholder="Enter your Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                              </div>
                            </div>
                            <div className="col-lg-6" >
                              <div class="field-box form-group">
                                <label for="name" class="up_label">Username   </label>
                                <div class="vew_pss otp_btn">
                                  <input id="Username" type="text" class="" placeholder="Enter your Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
                                  <span class="btn_view btn-icon"> @ </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-6" >
                              <div class="field-box form-group">
                                <label for="name" class="up_label">Email or Phone Number  </label>
                                {/* <span>
                                  Your email for marketplace notifications
                                </span> */}
                                <div class="vew_pss otp_btn">
                                  <input id="Email" type="email" class="" placeholder="Enter your Email or Phone Number" value={emailId} onChange={(e) => setEmailId(e.target.value)} />
                                  <button type="btn" class="btn_view btn-icon"> <i class="ri-mail-line"></i> </button>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-12" >
                              <div class="field-box form-group">
                                <label for="name" class="up_label">Social Connections </label>
                                <span>Help collectors verify your account by connecting social accounts</span>
                                <div className="row g-4" >
                                  <div className="col-lg-6" >
                                    <div class="vew_pss otp_btn">
                                      <input id="facebook" type="text" class="" placeholder="Enter Social Account URL" value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} />
                                      <span class="btn_view btn-icon"><i class="ri-facebook-circle-fill ri-1x"></i> </span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6" >
                                    <div class="vew_pss otp_btn">
                                      <input id="twitter" type="text" class="" placeholder="Enter Social Account URL" value={twitterLink} onChange={(e) => setTwitterLink(e.target.value)} />
                                      <span class="btn_view btn-icon"><i class="ri-twitter-fill ri-1x"></i> </span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6" >
                                    <div class="vew_pss otp_btn">
                                      <input id="instagram" type="text" class="" placeholder="Enter Social Account URL" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                                      <span class="btn_view btn-icon"><i class="ri-instagram-fill ri-1x"></i> </span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6" >
                                    <div class="vew_pss otp_btn">
                                      <input id="twitter" type="text" class="" placeholder="Enter Social Account URL" value={socialLink} onChange={(e) => setSocialLink(e.target.value)} />
                                      <span class="btn_view btn-icon"><i class="ri-seedling-fill ri-1x"></i> </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6" >
                              <div class="field-box form-group">
                                <label for="name" class="up_label">Short bio  </label>
                                <textarea rows="4" placeholder="Write about yourself" value={shortBio} onChange={(e) => setShortBio(e.target.value)}></textarea>
                              </div>
                            </div>
                            <div className="col-lg-12" >
                              <button class="btn btn-gradient btn-border-gradient px-5 " type="button" onClick={() => handleUpdateProfile(firstName, lastName, userName, shortBio, emailId, facebookLink, twitterLink, instagram, socialLink)}><span class="d-block w-100 text-center">UPDATE PROFILE</span></button>
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

export default Settings;
