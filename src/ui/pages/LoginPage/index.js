import React, { useState, useContext, useRef, useEffect } from "react";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import AuthService from "../../../api/services/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { ProfileContext } from "../../../context/ProfileProvider";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi'
import { $ } from "react-jquery-plugin";
// import GoogleLogin from 'react-google-login';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import jwt from 'jwt-decode'
{/* <script src="https://apis.google.com/js/platform.js" async defer></script> */}

const LoginPage = () => {

    const [userDetails, setUserDetails] = useState([]);
    const [profileState, updateProfileState] = useContext(ProfileContext);
    const { address } = useAccount()
    const [showEye, setShowEye] = useState(false);
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [updateWalletAddressFalse, setUpdateWalletAddressFalse] = useState([]);
    const emailID = localStorage.getItem("email_or_phone");
    const first_Name = localStorage.getItem("first_name");
    const last_Name = localStorage.getItem("last_name");
    const navigate = useNavigate();
    const [signId, setSignId] = useState("");
    const [password, setPassword] = useState("");
    const messagesEndRef = useRef(null)

    const handleGoogleResponse = (response) => {
        let details = jwt(response.credential)
        setUserDetails(details)
    };

    // console.log(userDetails, 'userDetails');

    useEffect(() => {
        if (address) {
            handleMetamaskConnection();
        }
    }, [address])

    useEffect(() => {
        if (userDetails?.email) {
            handlegoogleLogin();
        }
    }, [userDetails])


    const handleLogin = async (signId, password) => {
        LoaderHelper.loaderStatus(true);
        await AuthService.login(signId, password).then(async result => {
            if (result.success) {
                LoaderHelper.loaderStatus(false);
                alertSuccessMessage(result.message)
                updateProfileState(result.data);
                localStorage.setItem("accessToken", result.data.accessToken);
                localStorage.setItem("refreshToken", result.data.refreshToken);
                localStorage.setItem("userName", result.data.username);
                localStorage.setItem("email_or_phone", result.data.email_or_phone);
                localStorage.setItem("wallet_address", result.data.wallet_address);
                navigate("/profile");
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage(result.message);
            }
        });
    }

    const showPassword = () => {
        let pass = document.querySelector('input[name="password"]');
        let icon = document.querySelector("#showpassword");
        if (pass.type === "password") {
            icon.classList.add("show");
            setShowEye(true)
            pass.type = "text";
        } else {
            icon.classList.remove("show");
            pass.type = "password";
            setShowEye(false)
        }
    }


    useEffect(() => {
        scrollTop();
    }, []);

    const scrollTop = () => {
        messagesEndRef?.current?.scrollIntoView(true)
    }

    const handleMetamaskLogin = async (firstName, lastName, email) => {
        await AuthService.loginWithMetamask(firstName, lastName, email, address).then(async result => {
            if (result.success) {
                try {
                    alertSuccessMessage(result.message);
                    $("#add_info_b_login").modal('hide');
                    updateProfileState(result.data);
                    localStorage.setItem("accessToken", result.data.accessToken);
                    localStorage.setItem("refreshToken", result.data.refreshToken);
                    localStorage.setItem("userName", result.data.username);
                    localStorage.setItem("email_or_phone", result.data.email_or_phone);
                    localStorage.setItem("wallet_address", result.data.wallet_address);
                    navigate("/profile");
                } catch (error) {
                    // alertErrorMessage(error);
                    // console.log('error', `${error}`);
                }
            } else {
                // alertErrorMessage(result.message);
            }
        });
    }

    const handleMetamaskLoginAuto = async () => {
        await AuthService.loginWithMetamask(first_Name, last_Name, emailID, address).then(async result => {
            if (result.success) {
                try {
                    alertSuccessMessage(result.message);
                    $("#add_info_b_login").modal('hide');
                    updateProfileState(result.data);
                    localStorage.setItem("accessToken", result.data.accessToken);
                    localStorage.setItem("refreshToken", result.data.refreshToken);
                    localStorage.setItem("userName", result.data.username);
                    localStorage.setItem("email_or_phone", result.data.email_or_phone);
                    localStorage.setItem("wallet_address", result.data.wallet_address);
                    navigate("/profile");
                } catch (error) {
                    // alertErrorMessage(error);
                    // console.log('error', `${error}`);
                }
            } else {
                // alertErrorMessage(result.message);
            }
        });
    }

    const handleMetamaskConnection = async () => {
        await AuthService.updateMeatmaskAdderess(address).then(async result => {
            if (result.success) {
                try {
                    handleMetamaskLoginAuto(first_Name, last_Name, emailID, address);
                } catch (error) {
                    console.log('error', `${error}`);
                }
            } else {
                let showModal = localStorage.getItem('isShowModel');
                $("#add_info_b_login").modal('show');
                if (showModal === 'true') {
                    $("#add_info_b_login").modal('show');
                }
                setUpdateWalletAddressFalse(result?.message)
                localStorage.setItem("isShowModel", 'true');
            }
        });
    }




    const handlegoogleLogin = async () => {
        await AuthService.loginWithgoogle(userDetails?.aud, userDetails?.email, userDetails?.given_name, userDetails?.family_name).then(async result => {
            if (result.success) {
                try {
                    alertSuccessMessage(result.message);
                    updateProfileState(result.data);
                    localStorage.setItem("accessToken", result.data.accessToken);
                    localStorage.setItem("refreshToken", result.data.refreshToken);
                    localStorage.setItem("userName", result.data.username);
                    localStorage.setItem("email_or_phone", result.data.email_or_phone);
                    localStorage.setItem("wallet_address", result.data.wallet_address);
                    navigate("/profile");
                } catch (error) {
                    // alertErrorMessage(error);
                    // console.log('error', `${error}`);
                }
            } else {
                // alertErrorMessage(result.message);
            }
        });
    }

    return (
        <>
            <div className="login_wrapper">
                <div class="container">
                    <div class=" signup-wrapper p-0 border-gradient">
                        <div className="bg-primary  p-3 " >
                            <div class="row align-items-center gutter-0">
                                <div class="col-xl-6 col-lg-12 d-xl-block d-none">
                                    <div className="login_img" >
                                        <img src="images/login_img.png" class="w-100 img-fluid" alt="singin" />
                                        <div>
                                            <h3>
                                                Discover largest NFT <br /> marketplace
                                            </h3>
                                            <p>Buy, Sell and Rent NFT’S</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-6 col-lg-12">
                                    <div class="signup-content signin-content">
                                        <div class="sign-in_tab false">
                                            <h2 class="mb-2">Log In</h2>
                                            <p>Enter username and password to continue</p>

                                            <form action="#">
                                                <div class="row">
                                                    <div class="col-12 mb-4">
                                                        <div class="field-box">
                                                            <label for="Code" class="form-label">Email or Mobile Number</label>
                                                            <input className="form-control" id="text" type="text" placeholder="Enter Email or Mobile Number" value={signId} onChange={(e) => setSignId(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div class="col-md-12 mb-4">
                                                        <div class="field-box">
                                                            <label for="password" class="form-label">Password</label>
                                                            <div className="vew_pss" >
                                                                <input className="form-control" name="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                                <button className="btn_view btn-icon" type="button" id="showpassword" onClick={() => showPassword()}>
                                                                    {
                                                                        showEye === true ?
                                                                            <i class="ri-eye-line"></i>
                                                                            :
                                                                            <i class="ri-eye-close-line"></i>
                                                                    }
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-12 mb-4">
                                                        <div class="field-box text-end"><Link className=" text-white" to="/forgotpassword"> Forgot Password? </Link></div>
                                                    </div>
                                                    <div class="col-md-12">
                                                        <div class="field-box">
                                                            <button class="btn btn-gradient btn-border-gradient mt-3 font_russo  w-100 justify-content-center" type="button" onClick={() => handleLogin(signId, password)}>
                                                                <span>LOGIN</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="or_bar">
                                                    <span>Or Login With</span>
                                                </div>
                                                <div className="row gx-2" >
                                                    <div className="col-6" >
                                                        <button class="btn btn-border-gradient font_russo btn-block  w-100 text-uppercase" type="button">
                                                            <span><ConnectButton showBalance={false} /></span>
                                                        </button>
                                                    </div>
                                                    <div className="col-6" >
                                                        <div class="btn btn-border-gradient font_russo btn_transperant  btn-block w-100  text-uppercase" >
                                                            <GoogleOAuthProvider
                                                                clientId="513223757939-6pgfkdk7n7il42e2tpbhlotc7p471pma.apps.googleusercontent.com"
                                                            >
                                                                <GoogleLogin
                                                                    buttonText="Google"
                                                                    onSuccess={handleGoogleResponse}
                                                                    onFailure={handleGoogleResponse}
                                                                    cookiePolicy={'single_host_origin'}
                                                                    isSignedIn={true}
                                                                    https={true}
                                                                />
                                                            </GoogleOAuthProvider>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row justify-content-center text-center mt-4 text-white">
                                                    <div class="col-lg-12">Don't have an account? <Link class="color-primary " to="/signup">Register</Link></div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="add_info_b_login" tabindex="-1" aria-labelledby="add_info_b_loginLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header no-border flex-column px-8">
                            <h3 class="modal-title" id="add_info_b_loginLabel"> Update Profile </h3>
                            <button type="button" class="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close"><i
                                class="ri-close-fill"></i></button>
                        </div>
                        <div class="modal-body px-8 ">
                            <form action="#">
                                <div class="form-group mb-3">
                                    <label> First Name </label>
                                    <input type="text" class="form-control" placeholder="Enter First Name" aria-label="f-name" aria-describedby="basic-addon2" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div class="form-group mb-3">
                                    <label> Last Name</label>
                                    <input type="text" class="form-control" placeholder="Enter Last Name" aria-label="l-name" aria-describedby="basic-addon2" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                                <div class="form-group mb-3">
                                    <label> Email Address</label>
                                    <input type="email" class="form-control" placeholder="Enter Email" aria-label="name" aria-describedby="basic-addon2" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer no-border px-8 pb-5">
                            <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => handleMetamaskLogin(firstName, lastName, email)}><span>Save</span></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;