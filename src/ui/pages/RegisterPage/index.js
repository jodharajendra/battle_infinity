import React, { useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import { Link, useNavigate } from "react-router-dom";
import GoogleLogin from 'react-google-login';

const RegisterPage = () => {

    const handleGoogleResponse = (response) => {
        console.log(response);
    };

    const navigate = useNavigate();
    const [signId, setSignId] = useState("");
    const [userName, setUserName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [checkButton, setCheckButton] = useState("one");


    console.log(checkButton, 'checkButton');

    const resetEditInput = () => {
        setSignId("");
        setPassword("");
        setUserName("");
        setFirstName("");
        setLastName("");
    }

    const handleRegister = async (signId, userName, firstName, lastName, password, checkButton) => {
        if (checkButton === 'one') {
            alertErrorMessage('Please Select Checkbox')
        } else {
            await AuthService.register(signId, userName, firstName, lastName, password).then(async result => {
                if (result.message === "Registration successful.") {
                    try {
                        // alertSuccessMessage(result.message);
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

    }

    const showPassword = () => {
        let pass = document.querySelector('input[name="password"]');
        let icon = document.querySelector("#showpassword");
        // console.log(pass.type);
        if (pass.type === "password") {
            icon.classList.add("show");
            pass.type = "text";
        } else {
            icon.classList.remove("show");
            pass.type = "password";
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
                                            <h2 class="mb-2">Register</h2>
                                            <p>Enter your details to Register</p>

                                            <form action="#">
                                                <div class="row">
                                                    <div class="col-12 mb-4">
                                                        <div class="field-box">
                                                            <label for="Code" class="form-label">Email or Mobile Number</label>
                                                            <input className="form-control" id="text" type="text" placeholder="Enter Email" name="signId" value={signId} onChange={(e) => setSignId(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div class="col-12 mb-4">
                                                        <div class="field-box">
                                                            <label for="Code" class="form-label">Username</label>
                                                            <input className="form-control" id="username" type="text" placeholder="Enter Username" name="userName" value={userName} onChange={(e) => setUserName(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div class="col-12 mb-4">
                                                        <div class="field-box">
                                                            <label for="Code" class="form-label">First Name</label>
                                                            <input className="form-control" id="f-name" type="text" placeholder="First Name" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div class="col-12 mb-4">
                                                        <div class="field-box">
                                                            <label for="Code" class="form-label">Last Name</label>
                                                            <input className="form-control" id="l-name" type="text" placeholder="Last Name" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div class="col-md-12 mb-4">
                                                        <div class="field-box">
                                                            <label for="password" class="form-label">Password</label>
                                                            <div className="vew_pss" >
                                                                <input className="form-control" type="password" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                                <button className="btn_view btn-icon" id="showpassword" type="button" onClick={() => showPassword()}>
                                                                    <i class="ri-eye-line"></i>
                                                                    {/* <i class="ri-eye-close-line"></i> */}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 mb-4 " >
                                                        <div class="form-check policy_check">
                                                            <input class="form-check-input" type="checkbox" id="flexCheckDefault" name="checkButton" value={checkButton} onClick={()=>setCheckButton('two')} />
                                                            <label class="form-check-label" for="flexCheckDefault">I have read and agree to Battle Infinity Terms of Service and Privacy Policy.</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-12">
                                                        <div class="field-box">
                                                            <button class="btn btn-gradient btn-border-gradient mt-3 font_russo  w-100 justify-content-center" type="button" onClick={() => handleRegister(signId, userName, firstName, lastName, password, checkButton)}>
                                                                <span>REGISTER</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="or_bar" >
                                                    <span>Or Register With</span>
                                                </div>
                                                {/* <div className="row gx-2" >
                                                    <div className="col-6" >
                                                        <button class="btn btn-border-gradient font_russo btn-block  w-100 text-uppercase" type="button">
                                                            <span>CONNECT WALLET</span>
                                                        </button>
                                                    </div>
                                                    <div className="col-6" >
                                                        <div 
                                                            class="btn btn-border-gradient font_russo btn_transperant  btn-block w-100  text-uppercase" >

                                                            <GoogleLogin
                                                            clientId="AIzaSyDTVt-jj0sTVp6l9GsgepTKPluQ-HaMAmo"
                                                            buttonText=" Google"
                                                            onSuccess={handleGoogleResponse}
                                                            onFailure={handleGoogleResponse}
                                                            cookiePolicy={'single_host_origin'}
                                                            />
                                                        </div>

                                                       
                                                    </div>

                                                </div> */}
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

export default RegisterPage;