import React, { useRef, useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import { ProfileContext } from "../../../context/ProfileProvider";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";
import Select from 'react-select'

const StatsPage = () => {

    const messagesEndRef = useRef(null)
    const [collectionStateData, setCollectionStateData] = useState([]);
    const [favouriteDataList, setFavouriteDataList] = useState([])
    let dataLIMIT = +1000

    useEffect(() => {
        scrollTop();
        // handleuserProfile();
        handleCollectionStateData();
        handleFavourite();
    }, []);

    const scrollTop = () => {
        messagesEndRef?.current?.scrollIntoView(true)
    }

    const optionsTop = [
        { value: 'All category', label: 'All category' },
        { value: 'Art', label: 'Art' },
        { value: 'Collectibles', label: 'Collectibles' },
        { value: 'Domain Names', label: 'Domain Names' },
        { value: 'Music', label: 'Music' },
        { value: 'photography', label: 'Photography' },
    ]

    const optionsWatchList = [
        { value: 'All category', label: 'All category' },
        { value: 'Art', label: 'Art' },
        { value: 'Collectibles', label: 'Collectibles' },
        { value: 'Domain Names', label: 'Domain Names' },
        { value: 'Music', label: 'Music' },
        { value: 'photography', label: 'Photography' },
    ]

    const handleFavourite = async () => {
        await AuthService.getFavouriteData().then(async result => {
            if (result.success) {
                setFavouriteDataList(result?.data)
            } else {
                // alertErrorMessage(result?.message);
            }
        });
    }

    const handleCollectionStateData = async () => {
        await AuthService.mycollections1(dataLIMIT).then(async result => {
            if (result.success) {
                setCollectionStateData(result?.data)
                // alertSuccessMessage(result?.message);
            } else {
                alertErrorMessage(result?.message);
            }
        });
    }

    const handleAddFavourite = async (id, status) => {
        await AuthService.addFavouriteData(id, status).then(async result => {
            if (result.success) {
                // alertSuccessMessage(result?.message);
                handleFavourite();
            } else {
                // alertErrorMessage(result?.message);
            }
        });
    }

    return (
        <>
            <div className="page_wrapper" ref={messagesEndRef}>
                {/* <!-- page banner --> */}
                <section className="inner-page-banner">
                    <div className="container">
                        <div className="innertext-start">
                            <h1 className="title"> Collection Stats </h1>
                        </div>
                    </div>
                    {/* <!-- End .container --> */}
                </section>
                {/* <!-- page banner --> */}

                <section className="profile_data">
                    <div className="container">
                        <ul className="nav custom-pro-tabs mb-8">
                            <li>
                                <Link className="active btn btn-small btn-link" data-bs-toggle="tab" to="#on-Top">Top</Link>
                            </li>
                            <li>
                                <Link className="btn btn-small btn-link" data-bs-toggle="tab" to="#on-activity">Trending</Link>
                            </li>
                            <li>
                                <Link className="btn btn-small btn-link" data-bs-toggle="tab" to="#on-watchlist">Watchlist</Link>
                            </li>
                        </ul>

                        <div className="tab-content author-tabs-content" >
                            <div id="on-Top" className="tab-pane fade show active">
                                <div className="iterfsh filter_stats">
                                    <div className="filter-select-option border-gradient">
                                        <Select options={optionsTop} />
                                    </div>
                                    <div className="end">
                                        <div className="btn-group btn-group-mini border-gradient" role="group" aria-label="Basic radio toggle button group">
                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio125" autocomplete="off" checked="" />
                                            <label className="btn btn-outline-primary" for="btnradio125">25%</label>
                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio250" autocomplete="off" />
                                            <label className="btn btn-outline-primary" for="btnradio250">50%</label>
                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio375" autocomplete="off" />
                                            <label className="btn btn-outline-primary" for="btnradio375">75%</label>
                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio3100" autocomplete="off" />
                                            <label className="btn btn-outline-primary" for="btnradio3100">100%</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table text-white ">
                                        <thead>
                                            <tr>
                                                <th scope="col">Collection</th>
                                                <th scope="col">Price</th>
                                                <th scope="col">%Change</th>
                                                <th scope="col">Floor price</th>
                                                <th scope="col">Description</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {collectionStateData?.latest_traded?.data.length > 0
                                                ? collectionStateData?.latest_traded?.data.map((item, index) => (
                                                    <tr>
                                                        <td scope="row">
                                                            <div className="d-flex-center avatar-info item_info">
                                                                <span className="me-3" >{++index}</span>
                                                                <div className="thumb-wrapper">
                                                                    <Link to="#" className="thumb">
                                                                        <img src={`${ApiConfig.baseUrl + item?.nft_details?.file}`} alt="top sellter" className="" />
                                                                    </Link>
                                                                </div>
                                                                {/* <!-- End .thumb-wrapper --> */}
                                                                <div className="content">
                                                                    <p className="title mb-0 "><Link to="#">{item?.nft_details?.name}</Link></p>
                                                                </div>

                                                                {/* <!-- End .content --> */}
                                                            </div>
                                                        </td>
                                                        <td>{item?.nft_details?.price}</td>
                                                        <td><span className="text-danger" >0%</span></td>
                                                        <td>0.001</td>
                                                        <td>{item?.nft_details?.description}</td>
                                                    </tr>
                                                ))
                                                : null}

                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            <div id="on-activity" className="tab-pane fade">
                                <div className="iterfsh filter_stats">
                                    <div className="filter-select-option border-gradient">
                                        {/* <Select options={optionsTreding} /> */}
                                    </div>
                                    <div className="end">
                                        <div className="btn-group btn-group-mini border-gradient" role="group" aria-label="Basic radio toggle button group">
                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio125" autocomplete="off" checked="" />
                                            <label className="btn btn-outline-primary" for="btnradio125">25%</label>
                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio250" autocomplete="off" />
                                            <label className="btn btn-outline-primary" for="btnradio250">50%</label>
                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio375" autocomplete="off" />
                                            <label className="btn btn-outline-primary" for="btnradio375">75%</label>
                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio3100" autocomplete="off" />
                                            <label className="btn btn-outline-primary" for="btnradio3100">100%</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table text-white ">
                                        <thead>
                                            <tr>
                                                <th scope="col">Collection</th>
                                                <th scope="col">Network</th>
                                                <th scope="col">Token Type</th>
                                                <th scope="col">Url</th>
                                                <th scope="col">Description</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {collectionStateData?.trending?.length > 0
                                                ? collectionStateData?.trending?.map((item, index) => (
                                                    <tr>
                                                        <td scope="row">
                                                            <div className="d-flex-center avatar-info item_info">
                                                                <span className="me-3" >1</span>
                                                                <div className="thumb-wrapper">
                                                                    <Link to="#" className="thumb">
                                                                        <img src={`${ApiConfig.baseUrl + item?.collection_details?.banner_image}`} alt="top sellter" className="" />
                                                                    </Link>
                                                                </div>
                                                                {/* <!-- End .thumb-wrapper --> */}
                                                                <div className="content">
                                                                    <p className="title mb-0 ">
                                                                        <Link to="#">{item?.collection_details?.name}
                                                                            {/* <img src="images/verified.png" className="img-fluid verify_img" />
                                                                    */}</Link>
                                                                    </p>
                                                                </div>

                                                                {/* <!-- End .content --> */}
                                                            </div>
                                                        </td>
                                                        <td>{item?.collection_details?.network}</td>
                                                        <td><span className="text-danger" >{item?.collection_details?.token_type}</span></td>
                                                        <td>{item?.collection_details?.url}</td>
                                                        <td>{item?.collection_details?.description}</td>
                                                        {/* <td><Link className="btn-icon star-icon" ><i className="ri-star-fill"></i></Link></td> */}
                                                    </tr>
                                                ))
                                                : null}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            <div id="on-watchlist" className="tab-pane fade">

                                <div className="iterfsh filter_stats">
                                    <div className="filter-select-option border-gradient">
                                        <Select options={optionsWatchList} />
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table text-white ">
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
                                                            <button className="btn-icon star-icon" type="button" onClick={() => handleAddFavourite(item?.id, item?.favourites[0] ? false : true)}>
                                                                <i className={item?.favourites[0] ? "ri-star-fill" : "ri-star-line"} ></i>
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
                </section>
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
                            <h3 className="text-center mb-3">Your Bidding
                                Successfuly Added!</h3>
                            <p className="text-center mb-5">your bid <strong>(12ETH) </strong> has been listing
                                to our database</p>

                            <Link to="explore-filter-sidebar.html" className="btn btn-gradient btn-small w-100 justify-content-center">
                                <span>Watch
                                    Other Listings</span></Link>
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
                                data-bs-toggle="modal" data-bs-target="#popup_bid_success" aria-label="Close"><span>Place a
                                    bit</span></button>
                        </div>
                        {/* <!-- End .modal-footer --> */}
                    </div>
                    {/* <!-- End .modal-content --> */}
                </div>
            </div>
            {/* <!-- End Place a bit Modal --> */}
        </>
    )
}

export default StatsPage