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
        // handleCollectionData();
        handleuserProfile();
        mycollections();
    }, []);

    const scrollTop = () => {
        messagesEndRef?.current?.scrollIntoView(true)
    }

    const [collectionData, setCollectionData] = useState([]);
    const [emailId, setEmailId] = useState("");
    const [propertyId, setPropertyId] = useState([]);


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

    const mycollections = async () => {
        await AuthService.mycollections1().then(async result => {
            if (result.success) {
                // setCollectionData(result?.data?.data.reverse())
                // alertSuccessMessage(result?.message);
            } else {
                // alertErrorMessage(result?.message);

            }
        });
    }


    const handleProceed = (id) => {
        window.location.replace(`collection_details?id=${id}`);
    };


    let limit = '1000'


  useEffect(() => {
        handleSetLimitCreated();
    }, []);



    const handleSetLimitCreated= async () => {
        await AuthService.mycollections2(limit).then(async result => {
            if (result.success) {
                try {
                    // alertSuccessMessage(result?.message)
                    setCollectionData(result?.data?.data.reverse())
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
                                                    <Link onClick={() => handleProceed(item?.id)}  >
                                                        {!item?.banner_image ? <img src="images/collection/tc_1.png" alt="popular collection" /> :
                                                            <div className="large-thumbnail ratio ratio-16x9"> <img src={`${ApiConfig.baseUrl + item?.banner_image}`} /></div>
                                                        }
                                                    </Link>
                                                    <div className="content content-flex p-4">
                                                        {!item?.logo ? <img src="images/popular/small/2.png" className="avatar avatar_72" alt="history" /> :
                                                            <Link to="/profile" className="avatar avatar_72" tabindex="0">
                                                                <img src={`${ApiConfig.baseUrl + item?.logo}`} className="img-fluid" />
                                                            </Link>
                                                        }
                                                        <div className="inner">
                                                            <h4 className="title ">
                                                                <Link className="d-flex align-items-center" onClick={() => handleProceed(item?.id)}>{item?.name}
                                                                    {/* <img src="images/verified.png" className="img-fluid verify_img" /> */}
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
                            </div>
                        </section>
                    </div>
                    <div id="view-list" className="tab-pane fade">
                        <section className="explore_view" >
                            <div className="container" >
                                <div className="list_card border-gradient">
                                    <div className="table-responsive position-relative" >
                                        <table className="table text-white " >
                                            <thead className="text-uppercase" >
                                                <tr className="text-gragient font_passo" >
                                                    <th scope="col">
                                                        Collection
                                                    </th>
                                                    <th scope="col">
                                                        <div className="text-center" >volume</div>
                                                    </th>
                                                    <th scope="col">
                                                        <div className="text-center" >lowest</div>
                                                    </th>
                                                    <th scope="col">
                                                        <div className="text-center" >highest</div>
                                                    </th>
                                                    <th scope="col">
                                                        <div className="text-center" >listed</div>
                                                    </th>
                                                    <th scope="col">
                                                        <div className="text-end" >supply</div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="d-flex-center avatar-info item_info">
                                                            <div className="thumb-wrapper">
                                                                <Link to="#" className="thumb">
                                                                    <img src="images/top-seller/1.png" alt="top sellter" />
                                                                </Link>
                                                            </div>
                                                            {/* <!-- End .thumb-wrapper --> */}
                                                            <div className="content">
                                                                <p className="title mb-0  pb-1"><Link to="#">ORI#365</Link></p>
                                                            </div>

                                                            {/* <!-- End .content --> */}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 text-center" >2.500 ETH <br /> <small>$3,656.0</small></p>
                                                    </td>
                                                    <td>
                                                        <p className="title mb-0  pb-1 text-center"><Link to="#">ORI#365</Link></p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 text-center" >1</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 text-center" >47515</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 text-end" >24235235</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="d-flex-center avatar-info item_info">
                                                            <div className="thumb-wrapper">
                                                                <Link to="#" className="thumb">
                                                                    <img src="images/top-seller/1.png" alt="top sellter" />
                                                                </Link>
                                                            </div>
                                                            {/* <!-- End .thumb-wrapper --> */}
                                                            <div className="content">
                                                                <p className="title mb-0  pb-1"><Link to="#">ORI#365</Link></p>
                                                            </div>

                                                            {/* <!-- End .content --> */}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 text-center" >2.500 ETH <br /> <small>$3,656.0</small></p>
                                                    </td>
                                                    <td>
                                                        <p className="title mb-0  pb-1 text-center"><Link to="#">ORI#365</Link></p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 text-center" >1</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 text-center" >47515</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 text-end" >24235235</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="d-flex-center avatar-info item_info">
                                                            <div className="thumb-wrapper">
                                                                <Link to="#" className="thumb">
                                                                    <img src="images/top-seller/1.png" alt="top sellter" />
                                                                </Link>
                                                            </div>
                                                            {/* <!-- End .thumb-wrapper --> */}
                                                            <div className="content">
                                                                <p className="title mb-0  pb-1"><Link to="#">ORI#365</Link></p>
                                                            </div>

                                                            {/* <!-- End .content --> */}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 text-center" >2.500 ETH <br /> <small>$3,656.0</small></p>
                                                    </td>
                                                    <td>
                                                        <p className="title mb-0  pb-1 text-center"><Link to="#">ORI#365</Link></p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 text-center" >1</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 text-center" >47515</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 text-end" >24235235</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
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