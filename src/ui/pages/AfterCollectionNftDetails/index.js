import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";
import { $ } from "react-jquery-plugin";
import { BarChart } from 'react-charts-d3';
import CollectionDetails from "../CollectionDetails";

const AfterCollectionNftDetails = (props) => {

    let walletType = props?.userid[2]
    const [nftDetails, setnftDetails] = useState();
    const [metaData, setmetaData] = useState();
    const [reportReason, setReportReason] = useState('')
    const [description, setDescription] = useState('')
    const [favouriteDataList, setFavouriteDataList] = useState([])
    let screenTab = props?.userid[1]
    let newTokenAddress = '0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437'
    const messagesEndRef = useRef(null)
    const scrollTop = () => {
        messagesEndRef?.current?.scrollIntoView(true)
    }
    const data = [
        { key: 'Group 1', values: [{ x: 'A', y: 23 }, { x: 'B', y: 8 }] },
        { key: 'Group 2', values: [{ x: 'A', y: 15 }, { x: 'B', y: 37 }] },
    ];

    useEffect(() => {
        scrollTop();
        handleNftDetails();
        handleFavouriteData();
    }, []);

    const handleNftDetails = async () => {
        await AuthService.nftDetails(props?.userid[0]?.token_id, newTokenAddress).then(async result => {
            if (result.success) {
                try {
                    setnftDetails(result?.data)
                    setmetaData(JSON.parse(result?.data?.metadata))
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                // alertErrorMessage(result.message);
            }
        });
    }

    const handleCollectionDetailsReport = async (reportReason, description) => {
        await AuthService.nftDetailsReport(props?.userid[0]?._id, reportReason, description).then(async result => {
            if (result.success) {
                alertSuccessMessage('done')
                $("#reportmodal").modal('hide');
            }
        });
    }

    const handleFavouriteData = async () => {
        await AuthService.getFavouriteData().then(async result => {
            if (result.success) {
                try {
                    // alertSuccessMessage(result?.message)
                    setFavouriteDataList(result?.data)
                } catch (error) {
                    // alertErrorMessage(result.message);
                }
            } else {
                // alertErrorMessage(result.message);
            }
        });
    }

    const handleAddFavourite = async (status) => {
        await AuthService.setFavouriteDataNft(props?.userid[0]?.id, status).then(async result => {
            if (result.success) {
                // alertSuccessMessage(result?.message);
            } else {
                alertErrorMessage(result?.message);
            }
        });
    }

    return (
        screenTab === "nftDetails" ?
            <>
                <div class="page_wrapper" ref={messagesEndRef}>
                    <section class="product-details section-bg-separation-2 pt-125 pb-90">
                        <div class="container">
                            <div class="row">
                                <div class="col-xxl-5 col-lg-6 mb-3">
                                    <div class="custom-tab-content p-0 explore-style-one">
                                        <div class="thumb-header" >
                                            {/* <button class="reaction-btn liked" onClick={() => handleAddFavourite()}>
                                                <span>12</span>
                                                <i class="ri-heart-line"></i>
                                            </button> */}
                                            {/* <button class="reaction-btn total-watch left" data-bs-toggle="tooltip" data-bs-placement="top" title="Total Watch">
                                                <img src="images/eth_white.svg" width="22" height="22" />
                                            </button> */}
                                        </div>
                                        <div class="thumb">
                                            <div style={{ height: '350px' }} >
                                                <img src={`${ApiConfig.baseUrl + props?.userid[0]?.file}`}  style={{ height: '300px' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xxl-7 col-lg-6 mb-6 mb-6">
                                    <div class="details-content">
                                        <div class="d-flex-between" >
                                            {/* <Link class=""> Back </Link> */}
                                            <Link class="" to="#" > {props?.userid[0]?.name}</Link>
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
                                                            <li><Link class="dropdown-item" to="#"> <i class="ri-list-check-2 me-2"></i> Featured items</Link></li>
                                                            <li><Link class="dropdown-item" to="" > <i class="ri-flag-fill me-2"></i> <span data-bs-toggle="modal" data-bs-target="#reportmodal"  >Report</span>  </Link></li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <h2 class="main_title mb-0">{props?.userid[0]?.token_id}</h2>
                                        <p class="subtitle">Owneds by <Link to="#" >{props?.userid[0]?.name}</Link></p>
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
                                            <p class="mb-0">By <strong><Link to="#" >  {props?.userid[0]?.name} </Link></strong></p>
                                            <p class="mb-0" >{metaData?.description}</p>
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
                                                            {metaData?.attributes?.map((data) => {
                                                                return (
                                                                    <Link to="#" class="sc_card border-gradient" >
                                                                        <div class="sc_body" >
                                                                            <div class="sc_sub" >{data?.trait_type}</div>
                                                                            <p class="sc_title" >{data?.value}</p>
                                                                        </div>
                                                                    </Link>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="accordion-item">
                                                <p class="accordion-header" id="About_acc">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                        <i class="ri-list-check-2 me-3"></i> About Samurai Club
                                                    </button>
                                                </p>
                                                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="About_acc" data-bs-parent="#accordionnft_details">
                                                    <div class="accordion-body">
                                                        <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
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
                                                            <li>Token address <span><Link to="#" >{nftDetails?.token_address}</Link></span></li>
                                                            <li>Token ID <span><Link to="#" >{nftDetails?.token_id
                                                            }</Link></span></li>
                                                            <li>Token Standard <span>{nftDetails?.contract_type}</span></li>
                                                            <li>Metadata <span>{walletType}</span></li>
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
                                <div class="col-lg-12" >
                                    <div class="list_card border-gradient p-0  no-shadow" >
                                        <div class="accordion" id="accordionnft_ph_Activity">
                                            <div class="accordion-item">
                                                <p class="accordion-header" id="ph_Activity">
                                                    <button class="accordion-button no-border" type="button" data-bs-toggle="collapse" data-bs-target="#ph_ActivityOne" aria-expanded="true" aria-controls="ph_ActivityOne">
                                                        <i class="ri-arrow-up-down-line me-3"></i>  Item Activity
                                                    </button>
                                                </p>
                                                <div id="ph_ActivityOne" class="accordion-collapse collapse show" aria-labelledby="ph_Activity" data-bs-parent="#accordionnft_ph_Listings">
                                                    <div class="accordion-body p-0 px-3">
                                                        <div class="py-4 px-2" >
                                                            <div class="iterfsh pb-0">
                                                                <div class="itfrsh_start">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="table-responsive">
                                                            <table class="table text-white table-mini ">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col">Collection</th>
                                                                        <th scope="col">Volume</th>
                                                                        <th scope="col">%Change</th>
                                                                        <th scope="col">Floor price</th>
                                                                        <th scope="col">Sales</th>
                                                                        <th scope="col"></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {favouriteDataList.length > 0
                                                                        ? favouriteDataList.map((item, index) => (
                                                                            <tr>
                                                                                <td scope="row">
                                                                                    <div className="d-flex-center avatar-info item_info">
                                                                                        <span className="me-3" >{++index}</span>
                                                                                        <div className="thumb-wrapper">
                                                                                            <Link to="#" className="thumb">
                                                                                                <img src={`${ApiConfig.baseUrl + item?.logo}`} alt="top sellter" className="" />
                                                                                            </Link>
                                                                                        </div>
                                                                                        {/* <!-- End .thumb-wrapper --> */}
                                                                                        <div className="content">
                                                                                            <p className="title mb-0 "><Link to="#">{item?.name}
                                                                                                {/* <img src="images/verified.png" className="img-fluid verify_img" /> */}
                                                                                            </Link>
                                                                                            </p>
                                                                                        </div>

                                                                                        {/* <!-- End .content --> */}
                                                                                    </div>
                                                                                </td>
                                                                                <td>0</td>
                                                                                <td><span className="text-danger" >0%</span></td>
                                                                                <td>0 ETH</td>
                                                                                <td>0</td>
                                                                                <td>
                                                                                    <button className="btn-icon star-icon" type="button"/*  onClick={() => handleFavourite(item)} */>
                                                                                        {/* <i className={item?.favourites[0] ? "ri-star-fill" : "ri-star-line"} ></i> */}
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                        : null}
                                                                </tbody>
                                                            </table>
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

                {/* Report model */}
                <div class="modal fade" id="reportmodal" tabindex="-1" data-bs-backdrop="static" aria-labelledby="reportmodalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header no-border flex-column px-8">
                                <h3 class="modal-title" id="reportmodalLabel"> Report </h3>
                                <button type="button" class="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close"><i
                                    class="ri-close-fill"></i></button>
                            </div>
                            <div class="modal-body px-8 ">
                                <form action="#">
                                    <div class="form-group mb-2">
                                        <label>Reason</label>
                                        <input type="text" class="form-control" placeholder="Enter Reason" aria-label="Recipient's usernameReason" aria-describedby="basic-addon2" value={reportReason} onChange={(e) => setReportReason(e.target.value)} />
                                    </div>
                                    <div class="form-group mb-2">
                                        <label>Description</label>
                                        <textarea className=" " rows="5" placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer no-border px-8 pb-5">
                                <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => (handleCollectionDetailsReport(reportReason, description))}><span>Submit</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            : <CollectionDetails />
    )
}

export default AfterCollectionNftDetails