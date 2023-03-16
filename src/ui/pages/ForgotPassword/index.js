import React, { useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import { Link, useNavigate } from "react-router-dom";
import OtpButton from "../../../customComponent/OtpButton";
import { validateEmail } from "../../../utils/Validation";
const ForgotPassword = () => {

    const navigate = useNavigate();

    const [signId, setSignId] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [cNewPassword, setCNewPassword] = useState("");
    const [showEye, setShowEye] = useState(false);
    const [showEye2, setShowEye2] = useState('0');
    const [hideButton, setHideButton] = useState('0');


    const resetEditInput = () => {
        setSignId("");
        setOtp("");
        setNewPassword("");
        setCNewPassword("");
    }

    const handleForgotPassword = async (signId, otp, newPassword, cNewPassword) => {
        await AuthService.forgotPassword(signId, otp, newPassword, cNewPassword).then(async result => {
            if (result.success) {
                try {
                    alertSuccessMessage(result.message);
                    resetEditInput();
                    navigate("/login");
                } catch (error) {
                    alertErrorMessage(error);
                    // console.log('error', `${error}`);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }

    const handleGetCode = async (signId) => {
        await AuthService.getCode(signId).then(async result => {
            //console.log(result, 'loginD');
            if (result.message === "OTP sent successfully.") {
                try {
                    alertSuccessMessage(result.message);
                    setHideButton('1')
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }


    const handleGetCoderesend = async (signId) => {
        await AuthService.getCoderesend(signId).then(async result => {
            //console.log(result, 'loginD');
            if (result.message === "OTP sent successfully.") {
                try {
                    alertSuccessMessage(result.message);
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }

    const showPassword = () => {
        let pass = document.querySelector('input[name="newPassword"]');
        let icon = document.querySelector("#newpassword");
        // console.log(pass.type);
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


    const showConfirmPassword = () => {
        let pass = document.querySelector('input[name="cNewPassword"]');
        let icon = document.querySelector("#cNewPassword");
        // console.log(pass.type);
        if (pass.type === "password") {
            icon.classList.add("show");
            pass.type = "text";
            setShowEye2('1')
        } else {
            icon.classList.remove("show");
            pass.type = "password";
            setShowEye2('0')
        }
    }

    return (
        <>
            <div className="login_wrapper" >
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
                                            <h2 class="mb-2">Forgot Password</h2>
                                            {/* <p>Enter your Email or Mobile number  to forgot your password </p> */}
                                            <form action="#">
                                                <div class="row">
                                                    <div class="col-12 mb-4">
                                                        <div class="field-box">
                                                            <label for="Code" class="form-label">Email or Mobile Number</label>
                                                            <div className="vew_pss otp_btn" >
                                                                <input className="form-control" id="text" type="text" placeholder="Enter Email" value={signId} onChange={(e) => setSignId(e.target.value)} />
                                                                {
                                                                    hideButton === '0' ?

                                                                        <OtpButton onClick={() => handleGetCode(signId)}>GET OTP </OtpButton>
                                                                        :
                                                                        <button className="btn_view btn-icon" type="button" onClick={() => handleGetCoderesend(signId)}>Resend</button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-12 mb-4">
                                                        <div class="field-box">
                                                            <label for="Code" class="form-label">Enter OTP</label>
                                                            <input className="form-control" id="text" type="text" placeholder="Enter OTP" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div class="col-md-12 mb-4">
                                                        <div class="field-box">
                                                            <label for="password" class="form-label">New Password</label>
                                                            <div className="vew_pss" >
                                                                <input className="form-control" name="newPassword" type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                                                <button className="btn_view btn-icon" id="newpassword" type="button" onClick={showPassword}>
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
                                                        <div class="field-box">
                                                            <label for="password" class="form-label">Confirm Password</label>
                                                            <div className="vew_pss" >
                                                                <input className="form-control" type="password" name="cNewPassword" placeholder="Password" value={cNewPassword} onChange={(e) => setCNewPassword(e.target.value)} />
                                                                <button className="btn_view btn-icon" id="cNewPassword" type="button" onClick={showConfirmPassword}>
                                                                    {
                                                                        showEye2 === '1' ?

                                                                            <i class="ri-eye-line"></i>
                                                                            :
                                                                            <i class="ri-eye-close-line"></i>
                                                                    }
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-12 mb-4">
                                                        <div class="field-box">
                                                            <button class="btn btn-gradient btn-border-gradient mt-3 font_russo  w-100 justify-content-center" type="button" onClick={() => handleForgotPassword(signId, otp, newPassword, cNewPassword)}>
                                                                <span>FORGOT PASSWORD</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row justify-content-center text-center mt-4 text-white">
                                                    <div class="col-lg-12">Already have an account? <Link class="color-primary " to="/login">Login</Link></div>
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
        </>
    );
}

export default ForgotPassword;