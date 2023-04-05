import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";
import { $ } from "react-jquery-plugin";
import { BarChart } from 'react-charts-d3';

const NewNftDetalsLanding = () => {

    const { state } = useLocation();

    const messagesEndRef = useRef(null)
    const [userDetails, setUserDetails] = useState([])

    const data = [
        { key: 'Group 1', values: [{ x: 'A', y: 23 }, { x: 'B', y: 8 }] },
        { key: 'Group 2', values: [{ x: 'A', y: 15 }, { x: 'B', y: 37 }] },
    ];

    const navigate = useNavigate();

    const scrollTop = () => {
        messagesEndRef?.current?.scrollIntoView(true)
    }

    useEffect(() => {
        scrollTop();
        // handleuserProfile();
    }, []);

    const handleLogOut = () => {
        localStorage.clear();
        navigate("/login");
        window.location.reload();
    }

    const handleuserProfile = async () => {
        await AuthService.getUserDetails().then(async result => {
            if (result.success) {
                setUserDetails(result?.data);
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
            } else {
                //  alertErrorMessage('Raj');
                handleLogOut();
            }
        });
    }

    // setmetaData(JSON?.parse(state?.metadata[0]))

console.log(userDetails,'userDetails');

    return (

        <div class="page_wrapper" ref={messagesEndRef}> 
            <section class="product-details section-bg-separation-2 pt-125 pb-90">
                <div class="container">
                    <div class="row">
                        <div class="col-xxl-5 col-lg-6 mb-3">
                            <div class="custom-tab-content p-0 explore-style-one">
                                <div class="thumb">
                                    <div style={{ height: '350px' }} >
                                        <img src={`${ApiConfig.baseUrl + state?.file}`} style={{ height: '300px' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xxl-7 col-lg-6 mb-6 mb-6">
                            <div class="details-content">
                                <div class="d-flex-between" >
                                    {/* <Link to='/'> Back </Link> */}
                                    {state?.name}
                                    <div class="user_control m-0" >
                                        <ul class="nav">
                                            <li class="dropdown">
                                                <Link class="btn-icon" to="#" role="button" id="dropdownMenuLink1" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i class="ri-share-fill"></i>
                                                </Link>
                                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink1">
                                                    <li><Link class="dropdown-item" onClick={() => navigator.clipboard.writeText("https://appinopinfo.com")}><i class="ri-file-copy-fill me-2"></i> Copy Link</Link></li>
                                                    <li><Link class="dropdown-item" to="https://www.facebook.com/" target='_blank'><i class="ri-facebook-circle-fill me-2"></i>  Share on Facebook</Link></li>
                                                    <li><Link class="dropdown-item" to="https://twitter.com/i/flow/login" target='_blank'> <i class="ri-twitter-fill me-2"></i> Share On Twitter</Link></li>
                                                    <li><Link class="dropdown-item" to="https://web.whatsapp.com/" target='_blank'> <i class="ri-whatsapp-fill me-2"></i> Share On Whatsapp</Link></li>
                                                </ul>
                                            </li>
                                            <li class="dropdown">
                                                <Link class="btn-icon" to="#" role="button" id="dropdownMenuLink2" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i class="ri-more-fill"></i>
                                                </Link>
                                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                                                    <li><Link class="dropdown-item" to="/update_profile"> <i class="ri-settings-3-line me-2"></i> Settings</Link></li>

                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <h2 class="main_title mb-0">{state?.token_id}</h2>
                                <p class="subtitle">Owneds by{state?.name} </p>
                                <div class="view_count d-flex-center" > <i class="ri-eye-line me-2"></i> 0 View</div>
                            </div>
                        </div>
                    </div>
                    <div class="row" >
                        <div class="col-xxl-5 col-lg-6" >
                            <div class="list_card border-gradient mb-6 p-0  no-shadow" >
                                <div class="list-header d-flex-between" >
                                    <p class="mb-0  d-flex-center"><i class="ri-file-list-line me-3"></i> Description</p>
                                </div>
                                <div class="list-body border-top" >
                                    <p class="mb-0">By <strong> {state?.name}</strong></p>
                                    {/* <p class="mb-0" >{metaData?.description}</p> */}
                                </div>
                                <div class="accordion" id="accordionnft_details">
                                    <div class="accordion-item">
                                        <p class="accordion-header" id="Properties">
                                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                <i class="ri-bookmark-fill me-3"></i> Properties
                                            </button>
                                        </p>
                                        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="Properties" data-bs-parent="#accordionnft_details">
                                            <div class="accordion-body py-5px px-0">
                                                <div class="sc_sec" >
                                                    {/* {JSON.parse(state?.metaData)?.map((data) => {
                                                        return (
                                                            <Link to="#" class="sc_card border-gradient" >
                                                                <div class="sc_body" >
                                                                    <div class="sc_sub" >{data?.trait_type}</div>
                                                                    <p class="sc_title" >{data?.value}</p>
                                                                </div>
                                                            </Link>
                                                        )
                                                    })} */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="accordion-item">
                                        <p class="accordion-header" id="About_acc">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                <i class="ri-list-check-2 me-3"></i> About {userDetails?.username}
                                            </button>
                                        </p>
                                        <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="About_acc" data-bs-parent="#accordionnft_details">
                                            <div class="accordion-body">
                                                <strong> is the second item's accordion body.</strong>{userDetails?.profile_description}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="accordion-item">
                                        <p class="accordion-header" id="DetailsAcc">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                <i class="ri-list-unordered me-3"></i> Details
                                            </button>
                                        </p>
                                        <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="DetailsAcc" data-bs-parent="#accordionnft_details">
                                            <div class="accordion-body">
                                                <ul class="sc_list" >
                                                    <li>Wallet address <span><Link to="#" >{userDetails?.wallet_address}</Link></span></li>
                                                    <li>Username <span>{userDetails?.username}</span></li>
                                                    <li>status <span>{userDetails?.status}</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xxl-7 col-lg-6" >
                            <div class="list_card border-gradient mb-6 p-0  no-shadow" >
                                <div class="accordion" id="accordionnft_ph_history">
                                    <div class="accordion-item">
                                        <p class="accordion-header" id="ph_history">
                                            <button class="accordion-button no-border" type="button" data-bs-toggle="collapse" data-bs-target="#ph_historyOne" aria-expanded="true" aria-controls="ph_historyOne">
                                                <i class="ri-bookmark-fill me-3"></i> Price History
                                            </button>
                                        </p>
                                        <div id="ph_historyOne" class="accordion-collapse collapse show" aria-labelledby="ph_history" data-bs-parent="#accordionnft_ph_history">
                                            <div class="accordion-body p-0">
                                                <div class="py-5 text-center">
                                                    <BarChart data={data} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>


    )
}

export default NewNftDetalsLanding