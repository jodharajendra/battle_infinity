import React, { useRef, useEffect, useState, useContext } from "react";
import { Link, useNavigate, generatePath } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import { ProfileContext } from "../../../context/ProfileProvider";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";

const MyCollection = () => {
    const messagesEndRef = useRef(null)

    useEffect(() => {
        scrollTop();
        handleuserProfile();
        handleSetLimitMyCollection();
    }, []);

    const scrollTop = () => {
        messagesEndRef?.current?.scrollIntoView(true)
    }
    const [collectionData, setCollectionData] = useState([]);
    const [emailId, setEmailId] = useState("");
    const [limitMyCollection, setLimitMyCollection] = useState(3);
    const [exploreLength, setExploreLength] = useState([]);
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
                    setEmailId(result?.data?.email_or_phone);
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


    const handleSetLimitMyCollection = async () => {
        await AuthService.mycollections2(limitMyCollection).then(async result => {
            if (result.success) {
                try {
                    // console.log(result, 'resultRj');
                    setCollectionData(result?.data?.data.reverse())
                    setExploreLength(result?.data?.filter?.count)
                    setLimitMyCollection(limitMyCollection + 3);
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }

    return (
        <>
            <div className="page_wrapper" ref={messagesEndRef}>
                {/* <!-- page banner --> */}
                <section className="inner-page-banner explore_banner_inner">
                    <div className="container">
                        <div className="inner_header_page" >
                            <div className="innertext-start">
                                <h1 className="title">Explore Collections</h1>
                                <p className="" >Create and manage collections of unique NFTs to share and sell.</p>
                            </div>
                            <Link to="/new_collection" class="btn btn-gradient btn-border-gradient px-5"><span class="d-block w-100 text-center">Create A Collection</span></Link>
                        </div>
                    </div>
                    {/* <!-- End .container --> */}
                </section>
                {/* <!-- page banner --> */}
                <div className="tab-content author-tabs-content" >
                    <div id="view-grid" className="tab-pane fade show active">
                        <section className="explore_view" >
                            <div className="container" >
                                <div className="row" >
                                    {collectionData.length > 0
                                        ? collectionData.map((item) => (
                                            <div className="col-xxl-4 col-md-6 mb-6" >
                                                <div className="popular-collection-style-one border-gradient">
                                                    <Link to={`collection_details?id=${item?.id}`} >
                                                        {!item?.banner_image ? <img src="images/collection/tc_1.png" alt="popular collection" /> :
                                                            <div className="large-thumbnail ratio ratio-16x9"> <img src={`${ApiConfig.baseUrl + item?.banner_image}`} /></div>
                                                        }
                                                    </Link>
                                                    <div className="content content-flex p-4">
                                                        {!item?.logo ? <img src="images/popular/small/2.png" className="avatar avatar_72" alt="history" /> :
                                                            <Link to={`collection_details?id=${item?.id}`} className="avatar avatar_72" tabindex="0">
                                                                <img src={`${ApiConfig.baseUrl + item?.logo}`} className="img-fluid" />
                                                            </Link>
                                                        }
                                                        <div className="inner">
                                                            <h4 className="title ">
                                                                <Link className="d-flex align-items-center" to={`collection_details?id=${item?.id}`}>{item?.name}
                                                                    <img src="images/verified.png" className="img-fluid verify_img" />
                                                                </Link>
                                                            </h4>
                                                            <span className="d-flex align-items-center text-white" > <small>Category</small>  <strong className="ms-2" > {item?.category?.name}</strong> </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        : null}
                                </div>
                                {
                                    collectionData.length > 0 ?
                                        <>
                                            {
                                                exploreLength === collectionData.length ? '' :
                                                    <div className="row">
                                                        <div className="col-12 text-center mt-4">
                                                            <button type="button" className="btn btn-outline border-gradient px-6" onClick={handleSetLimitMyCollection}>
                                                                <span><i className="ri-loader-4-fill"></i> Load More</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                            }
                                        </>
                                        :
                                        ''
                                }
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* <!-- Bit History popup --> */}
            <div className="modal fade popup" id="bid_history" tabindex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content bid-success-content">
                        <button type="button" className="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close">
                            <i className="ri-close-fill"></i>
                        </button>
                        <div className="modal-body pa-8">
                            <h3 className=" mb-4">History</h3>
                            <div className="custom-history">
                                <div className="single-item-history d-flex-center">
                                    <Link to="#" className="avatar">
                                        <img src="images/popular/small/1.png" alt="history" />
                                        <i className="ri-check-line"></i>
                                    </Link>
                                    {/* <!-- end avatar --> */}
                                    <div className="content">
                                        <p>Bid accepted <span className="color-primary fw-500">12
                                            ETH</span> by <Link className="text-white" to="/Profile">Zakson</Link></p>
                                        <span className="date">03/01/2022, 10:25</span>
                                    </div>
                                </div>
                                {/* <!-- End .single-item-history --> */}

                                <div className="single-item-history d-flex-center">
                                    <Link to="#" className="avatar">
                                        <img src="images/popular/small/2.png" alt="history" />
                                        <i className="ri-check-line"></i>
                                    </Link>
                                    {/* <!-- end avatar --> */}
                                    <div className="content">
                                        <p>Bid accepted <span className="color-primary fw-500">15
                                            ETH</span> by <Link className="text-white" to="/Profile">Smith</Link></p>
                                        <span className="date">02/01/2022, 10:55</span>
                                    </div>
                                </div>
                                {/* <!-- End .single-item-history --> */}

                                <div className="single-item-history d-flex-center">
                                    <Link to="#" className="avatar">
                                        <img src="images/popular/small/3.png" alt="history" />
                                        <i className="ri-check-line"></i>
                                    </Link>
                                    {/* <!-- end avatar --> */}
                                    <div className="content">
                                        <p>Bid accepted <span className="color-primary fw-500">13
                                            ETH</span> by <Link className="text-white" to="/Profile">Rion</Link></p>
                                        <span className="date">05/01/2022, 10:34</span>
                                    </div>
                                </div>
                                {/* <!-- End .single-item-history --> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- End Bit History popup --> */}

            {/* <!-- Bit success popup --> */}
            <div className="modal fade popup" id="popup_bid_success" tabindex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content bid-success-content">
                        <button type="button" className="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close">
                            <i className="ri-close-fill"></i>
                        </button>
                        <div className="modal-body pa-8">
                            <h3 className="text-center mb-3">Your Bidding Successfuly Added!</h3>
                            <p className="text-center mb-5">your bid <strong>(12ETH) </strong> has been listing to our database</p>
                            <Link to="/explore-filter-sidebar" className="btn btn-gradient btn-small w-100 justify-content-center">
                                <span>Watch Other Listings</span></Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- End Bit success popup --> */}

            {/* <!-- Place a bit Modal --> */}
            <div className="modal fade" id="placeBit" tabindex="-1" aria-labelledby="placeBitLaebl" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header flex-column px-8">
                            <h3 className="modal-title" id="placeBitLaebl">Place a Bid</h3>
                            <button type="button" className="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close"><i
                                className="ri-close-fill"></i></button>
                        </div>
                        {/* <!-- End modal-header --> */}
                        <div className="modal-body px-8 py-5">
                            <form action="#">
                                <div className="form-group mb-4">
                                    <label for="bit">You must bid at least 13 ETH</label>
                                    <input type="text" id="bit" placeholder="00.00ETH" />
                                </div>
                                {/* <!-- End .form-group --> */}

                                <div className="form-group">
                                    <label for="quantity">Enter quantity. <span className="color-primary fw-500">5 available</span></label>
                                    <input type="number" id="quantity" placeholder="1" />
                                </div>
                                {/* <!-- End .form-group --> */}

                                <ul className="bidding-list">
                                    <li>You must bid at least: <strong>12,00 ETH</strong></li>
                                    <li>Service Cost: <strong>70 ETH</strong></li>
                                    <li>Total bid amount: <strong>12,70 ETH</strong></li>
                                </ul>
                            </form>
                        </div>
                        {/* <!-- End modal-body --> */}
                        <div className="modal-footer px-8">
                            <button type="button" className="btn btn-gradient btn-small w-100 justify-content-center" data-bs-dismiss="modal"
                                data-bs-toggle="modal" data-bs-target="#popup_bid_success" aria-label="Close">
                                <span>Place a bit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyCollection