import React, { useRef, useEffect, useState, useContext } from "react";
import { ProfileContext } from "../../../context/ProfileProvider";

import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import Select from 'react-select';
import { Link, useParams, useNavigate } from "react-router-dom";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";
import moment from "moment";
import { BarChart } from 'react-charts-d3';
import { $ } from "react-jquery-plugin";
import AfterCollectionNftDetails from "../AfterCollectionNftDetails";

const CollectionDetails = () => {
    const TokenAddress = localStorage.getItem("accessToken");

    // console.log(TokenAddress, 'TokenAddress');

    const navigate = useNavigate();
    const [activityData, setActivityData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [activeScreen, setActiveScreen] = useState('collectionPage');
    let userId = window.location.href.split('=')[1]
    const messagesEndRef = useRef(null)

    const [profileState, updateProfileState] = useContext(ProfileContext);
    const [reportReason, setReportReason] = useState('')
    const [description, setDescription] = useState('')
    const [collectionDetails, setCollectionDetails] = useState()
    const [collectionDetailsNew, setCollectionDetailsNew] = useState([])
    const [collectednftSearch, setCollectedNftSearch] = useState();
    const [salesEvent, setSalesEvent] = useState('on_sell');
    const [rentEvent, setRentEvent] = useState('on_rented');
    const [buyEvent, setBuyEvent] = useState('on_buy');
    const [offerEvent, setOfferEvent] = useState('true');
    const [collectionEventId, setCollctionEventId] = useState('');
    const [minimumPrize, setMinimumPrize] = useState('');
    const [maxPrize, setMaxPrize] = useState('');
    const [allItemQuantity, setAllItemQuantity] = useState('');
    const [onSingleQuantity, setOnSingleQuantity] = useState('');
    const [bundleQuantity, setVundleQuantity] = useState('');
    const [categoryArt, setCategoryArt] = useState('');
    const [CategoryCollectibles, setCategoryCollectibles] = useState('');
    const [categoryDomainNames, setCategoryDomainNames] = useState('');
    const [categoryMusic, setCategoryMusic] = useState('');
    const [categoryPhotography, setCategoryPhotography] = useState('');
    const [categorySports, setCategorySports] = useState('');
    const [CurrencyIbat, setCurrencyIbat] = useState('');
    const [CurrencyBnb, setCurrencyBnb] = useState('');

    const optionTimes = [
        { value: 'Last 24 hours', label: 'Last 24 hours' },
        { value: 'Latest', label: 'Latest' },
        { value: 'Old', label: 'Old' }
    ]

    useEffect(() => {
        scrollTop();
    }, []);

    const scrollTop = () => {
        messagesEndRef?.current?.scrollIntoView(true)
    }

    useEffect(() => {
        handleCollectionDetails(userId)
    }, []);


    const handleCollectionDetails = async (userId) => {
        await AuthService.getCollectionDetails(userId).then(async result => {
            if (result.success) {
                setCollectionDetails(result?.data);
                setCollectedNftSearch(result?.data)
            }
        });
    }

    const handleCollectionDetailsReport = async (reportReason, description) => {
        await AuthService.getCollectionDetailsReport(collectionDetails?._id, reportReason, description).then(async result => {
            if (result.success) {
                alertSuccessMessage(result?.message)
                $("#reportmodal").modal('hide');
            } else {
                alertErrorMessage(result?.message)
            }
        });
    }

    useEffect(() => {
        handleActivityLOgs();
    }, []);

    const handleActivityLOgs = async (salesEvent, rentEvent, buyEvent, offerEvent, collectionEventId) => {
        await AuthService.getActivityDetails(salesEvent, rentEvent, buyEvent, offerEvent, collectionEventId).then(async result => {
            if (result.success) {
                setActivityData(result?.data)
            }
        });
    }


    const data = [
        { key: 'Group 1', values: [{ x: 'A', y: 23 }, { x: 'B', y: 8 }] },
        { key: 'Group 2', values: [{ x: 'A', y: 15 }, { x: 'B', y: 37 }] },
    ];

    const handleResetFilterData = () => {
        setMinimumPrize('');
        setMaxPrize('');
        setAllItemQuantity('');
        setOnSingleQuantity('');
        setVundleQuantity('');
        setCategoryArt('');
        setCategoryCollectibles('');
        setCategoryDomainNames('');
        setCategoryMusic('');
        setCategoryPhotography('');
        setCategorySports('');
        setCurrencyIbat('');
        setCurrencyBnb('');
        setSalesEvent('');
        setRentEvent('');
        setBuyEvent('');
        setOfferEvent('');

    }

    const handelCollectedFilter = async (minimumPrize, maxPrize, allItemQuantity, onSingleQuantity, bundleQuantity, CategoryCollectibles, categoryArt, categoryDomainNames, categoryMusic, categoryPhotography, categorySports, CurrencyIbat, CurrencyBnb, salesEvent, rentEvent, buyEvent, offerEvent, collectionEventId) => {
        await AuthService.getCollectedFilter(minimumPrize, maxPrize, allItemQuantity, onSingleQuantity, bundleQuantity, CategoryCollectibles, categoryArt, categoryDomainNames, categoryMusic, categoryPhotography, categorySports, CurrencyIbat, CurrencyBnb, salesEvent, rentEvent, buyEvent, offerEvent, collectionEventId).then(async result => {
            if (result.success) {
                try {
                    setActivityData(result?.data)
                    alertSuccessMessage(result?.message);
                    handleResetFilterData()
                } catch (error) {
                    // alertErrorMessage(result.message);
                }
            } else {
                // alertErrorMessage(result.message);
            }
        });
    }

    const handleAddFavourite = async (userId, status) => {
        await AuthService.setFavouriteDataNft(userId, status).then(async result => {
            if (result.success) {
                alertSuccessMessage(result?.message);
                handleCollectionDetails(userId);
            } else {
                alertErrorMessage(result?.message);
            }
        });
    }

    const handleError = async (data) => {
        alertErrorMessage('Please Login First');
    }

    const handleNftDetails = async (data) => {
        setUserData(data);
        setActiveScreen('nftDetails');
    }

    return (

        activeScreen === 'collectionPage' ?
            <>
                <div className="page_wrapper" ref={messagesEndRef}>
                    <section className="profile_sec">
                        <div className="bg-cover">
                            {
                                !collectionDetails?.banner_image ?
                                    <img src="images/bg/bg-1.jpg" />
                                    :
                                    <img src={`${ApiConfig.baseUrl + collectionDetails?.banner_image}`} className="img-fluid" />
                            }
                        </div>
                        <div className="container">
                            {
                                !collectionDetails?.logo ?
                                    <img src="images/avatar/user_lg.jpg" className="user_img" />
                                    :
                                    <img src={`${ApiConfig.baseUrl + collectionDetails?.logo}`} className="user_img" />

                            }
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="user_data">
                                        <h2>{collectionDetails?.name}</h2>
                                        <p className="user_exps">
                                            <span>Items {collectionDetails?.nfts?.length}</span> <em></em>
                                            <span>Created {moment(collectionDetails?.createdAt).format("MMM Do YY")}</span><em></em>
                                        </p>

                                        <p className="mb-0">
                                            {collectionDetails?.description} <span className="btn_link show_more collapsed"
                                                data-bs-toggle="collapse" to="#about_text" role="button" aria-expanded="false"
                                                aria-controls="about_text">{/* See more */} </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6 text-end">
                                    <div className="user_control">
                                        <ul className="user_social nav">
                                            <li>
                                                <Link className="btn-icon" to="https://www.instagram.com/accounts/login/" target='_blank'>
                                                    <i className="ri-instagram-line"></i>
                                                </Link>
                                            </li>
                                            {/* <li>
                                            <Link className="btn-icon" to="#">
                                                <i className="ri-global-line"></i>
                                            </Link>
                                        </li> */}
                                            <li>
                                                <Link className="btn-icon" to="https://www.facebook.com/" target='_blank'>
                                                    <i className="ri-facebook-line"></i>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="btn-icon" to="https://twitter.com/i/flow/login" target='_blank'>
                                                    <i className="ri-twitter-fill"></i>
                                                </Link>
                                            </li>
                                        </ul>
                                        <span className="divider"></span>
                                        <ul className="nav">
                                            <li>
                                                <Link className="btn-icon" onClick={() => handleAddFavourite(userId)}>
                                                    {
                                                        collectionDetails?.favourites[0] ?
                                                            <i className="ri-star-fill"></i>
                                                            :
                                                            <i className="ri-star-line"></i>

                                                    }
                                                </Link>
                                            </li>
                                            <li className="dropdown">
                                                <Link className="btn-icon" to="#" role="button" id="dropdownMenuLink1" data-bs-toggle="dropdown"
                                                    aria-expanded="false">
                                                    <i className="ri-share-fill"></i>
                                                </Link>
                                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink1">
                                                    <li><Link className="dropdown-item" onClick={() => navigator.clipboard.writeText("https://appinopinfo.com")}><i className="ri-file-copy-fill me-2"></i> Copy Link</Link></li>
                                                    <li><Link className="dropdown-item" to="https://www.facebook.com/" target='_blank'><i className="ri-facebook-circle-fill me-2"></i> Share on Facebook</Link></li>
                                                    <li><Link className="dropdown-item" to="https://twitter.com/i/flow/login" target='_blank'> <i className="ri-twitter-fill me-2"></i> Share On Twitter</Link>
                                                    </li>
                                                    <li><Link className="dropdown-item" to="https://web.whatsapp.com/" target='_blank'> <i className="ri-whatsapp-fill me-2"></i> Share On Whatsapp</Link>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li className="dropdown">
                                                <Link className="btn-icon" to="#" role="button" id="dropdownMenuLink2" data-bs-toggle="dropdown"
                                                    aria-expanded="false">
                                                    <i className="ri-more-fill"></i>
                                                </Link>
                                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                                                    <li><Link className="dropdown-item" data-bs-toggle="modal" data-bs-target="#reportmodal"  > <i className="ri-flag-fill me-2"></i> Report</Link></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* <!-- End .container --> */}
                    </section>
                    {/* <!-- page banner --> */}

                    <section className="profile_data">
                        <div className="container">

                            <ul className="nav custom-pro-tabs mb-8">
                                <li>
                                    <Link className="active btn btn-small btn-link" data-bs-toggle="tab" to="#on-items">Items</Link>
                                </li>
                                <li>
                                    <Link className="btn btn-small btn-link" data-bs-toggle="tab" to="#on-activity">Activity</Link>
                                </li>
                            </ul>

                            <div className="tab-content author-tabs-content">
                                <div id="on-items" className="tab-pane fade show active">

                                    <form action="#" className="mt-10">
                                        <div className="filter-style-one common-filter d-flex-between profile_filter">
                                            {/* <div className="d-flex-center filter-left-cate profile_filter_left">
                                                <button className="btn-icon-lg btn-icon me-2 side_toggle" id="side_toggle" type="button">
                                                    <i className="ri-filter-3-line"></i>
                                                </button>
                                                <div className="border-gradient search-bar">
                                                    <input type="text" name="search" placeholder="Search by Name" id="search" onChange={(e) => { handleSearch(e) }} />

                                                    <button className="search-btn" type="button"> <i className="ri-search-line"></i> </button>
                                                </div>

                                            </div> */}
                                        </div>
                                    </form>

                                    <div className="main_panel mt-10 ">
                                        <div className="sidepanel">
                                            <div className="filter_header">
                                                <h5>Filter</h5>
                                                <span id="side_close" className="btn-icon side_close"> <i className="ri-close-line"></i> </span>
                                            </div>
                                            <div className="filter-wrapper">

                                                <div className="filter-custom-item">
                                                    <h4 className="accordion-button" data-bs-toggle="collapse" data-bs-target="#status">
                                                        Status
                                                    </h4>
                                                    <div id="status" className="collapse show">
                                                        <div className="filter-item-list">
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="Sales-now" >
                                                                    Sales
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="Sales-now" value={salesEvent} onChange={(e) => setSalesEvent(e.target.value)} />
                                                            </div>
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="on-Floor">
                                                                    Rent
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="on-Floor" /* checked */ value={rentEvent} onChange={(e) => setRentEvent(e.target.value)} />
                                                            </div>
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="has-Listings">
                                                                    Buy
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="has-Listings" value={buyEvent} onChange={(e) => setBuyEvent(e.target.value)} />
                                                            </div>
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="has-Offers">
                                                                    Offers
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="has-Offers" value={offerEvent} onChange={(e) => setOfferEvent(e.target.value)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="filter-custom-item">
                                                    <h4 className="accordion-button" data-bs-toggle="collapse" data-bs-target="#categories">
                                                        Price
                                                    </h4>
                                                    <div id="categories" className="collapse show  my-3">
                                                        <form className="row gx-2">
                                                            <div className="col-6">
                                                                <div className="border-gradient">
                                                                    <input type="number" className="form-control" placeholder="Min.." name="" value={minimumPrize} onChange={(e) => setMinimumPrize(e.target.value)} />
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="border-gradient">
                                                                    <input type="number" className="form-control" placeholder="Max.." name="" value={maxPrize} onChange={(e) => setMaxPrize(e.target.value)} />
                                                                </div>
                                                            </div>
                                                            {/* </div> */}

                                                            <div className="col-md-12">
                                                                <button className="btn btn-gradient btn-border-gradient  w-100 btn-block mt-3" type="button" onClick={() => (handelCollectedFilter(minimumPrize, maxPrize, allItemQuantity, onSingleQuantity, bundleQuantity, CategoryCollectibles, categoryArt, categoryDomainNames, categoryMusic, categoryPhotography, categorySports, CurrencyIbat, CurrencyBnb, salesEvent, rentEvent, buyEvent, offerEvent, userId))}>
                                                                    <span className="d-block w-100 text-center">APPLY</span>
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>

                                                <div className="filter-custom-item">
                                                    <h4 className="accordion-button" data-bs-toggle="collapse" data-bs-target="#Quantity_acc">
                                                        Quantity
                                                    </h4>
                                                    <div id="Quantity_acc" className="collapse show">
                                                        <div className="filter-item-list">
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="on-all">
                                                                    All items
                                                                </label>
                                                                <input className="form-check-input" type="radio" name="Quantity" id="on-all" value={allItemQuantity} onChange={(e) => setAllItemQuantity(e.target.value)} />
                                                            </div>
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="on-Single">
                                                                    Single items
                                                                </label>
                                                                <input className="form-check-input" type="radio" name="Quantity" id="on-Single" value={onSingleQuantity} onChange={(e) => setOnSingleQuantity(e.target.value)} />
                                                            </div>
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="has-Bundles">
                                                                    Bundles
                                                                </label>
                                                                <input className="form-check-input" type="radio" name="Quantity" id="has-Bundles" value={bundleQuantity} onChange={(e) => setVundleQuantity(e.target.value)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="filter-custom-item">
                                                    <h4 className="accordion-button" data-bs-toggle="collapse" data-bs-target="#Currency_acc">
                                                        Currency
                                                    </h4>
                                                    <div id="Currency_acc" className="collapse show">
                                                        <div className="filter-item-list">
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="buy-ETH">
                                                                    IBAT
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="buy-ETH" value={CurrencyIbat} onChange={(e) => setCurrencyIbat(e.target.value)} />
                                                            </div>
                                                            {/* <!-- End .form-check --> */}
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="on-WETH">
                                                                    BNB
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="on-WETH" value={CurrencyBnb} onChange={(e) => setCurrencyBnb(e.target.value)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                        <div className="side_main_panel">
                                            <div className="iterfsh">
                                                {
                                                    collectionDetails?.nfts?.length > 0 ?
                                                        <Link to="#" className="">  <i className="ri-refresh-line me-2"></i> Updated 18m ago </Link>
                                                        : ''
                                                }
                                                <h5>{collectionDetails?.nfts?.length} Items</h5>
                                            </div>
                                            <div className="tab-content author-tabs-content">

                                                <div id="view-grid" className="tab-pane fade show active">
                                                    <section className="explore_view">

                                                        <div className="itemas_view grid-container">

                                                            {!collectionDetailsNew.length > 0 ?
                                                                collectionDetails?.nfts?.map((data) =>

                                                                    <div className="grid_iteam">
                                                                        <div className="explore-style-one explore-style-overlay border-gradient">
                                                                            <div className="thumb">
                                                                                <div className="ratio ratio-1x1" >
                                                                                    <img src={`${ApiConfig.baseUrl + data?.file}`} alt="nft live auction thumbnail" />
                                                                                </div>
                                                                            </div>
                                                                            {/* <!-- End .thumb --> */}
                                                                            <div className="content px-4">
                                                                                <div className="d-flex-between align-items-center pt-4">
                                                                                    <div>
                                                                                        <div className="header d-flex-between">
                                                                                            <h3 className="title">

                                                                                                {!TokenAddress ?
                                                                                                    <Link onClick={() => handleError(data)}>
                                                                                                        {data?.name}
                                                                                                    </Link>
                                                                                                    :
                                                                                                    <Link onClick={() => handleNftDetails(data)}>
                                                                                                        {data?.name}
                                                                                                    </Link>
                                                                                                }

                                                                                            </h3>
                                                                                        </div>
                                                                                    </div>
                                                                                    <span className="biding-price d-flex-center text-white"> {data?.token_id} </span>
                                                                                </div>
                                                                                <hr />
                                                                                {/* <!-- End .product-owner --> */}
                                                                                <div className="action-wrapper d-flex-between border-0 pb-4">
                                                                                    <span className="biding-price d-flex-center  text-white">Asking Price</span>
                                                                                    <span className="biding-price d-flex-center  text-white">{data?.price}</span>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                ) : null
                                                            }
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div id="on-activity" className="tab-pane fade">
                                    <form action="#" className="mt-10">
                                        <div className="filter-style-one common-filter d-flex-between profile_filter">
                                            <div className="d-flex-center filter-left-cate">
                                                <button className="btn-icon-lg btn-icon me-2 side_toggle" id="side_toggle" type="button">
                                                    <i className="ri-filter-3-line"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="main_panel mt-10 ">
                                        <div className="sidepanel">
                                            <div className="filter_header">
                                                <h5>Filter</h5>
                                                <span id="side_close" className="btn-icon side_close"> <i className="ri-close-line"></i> </span>
                                            </div>
                                            <div className="filter-wrapper">
                                                <div className="filter-custom-item">
                                                    <h4 className="accordion-button" data-bs-toggle="collapse" data-bs-target="#status">
                                                        Event Type
                                                    </h4>
                                                    <div id="status" className="collapse show">
                                                        <div className="filter-item-list">
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="Sales-now" >
                                                                    Sales
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="Sales-now" value={salesEvent} onChange={(e) => setSalesEvent(e.target.value)} />
                                                            </div>
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="on-Floor">
                                                                    Rent
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="on-Floor" checked value={rentEvent} onChange={(e) => setRentEvent(e.target.value)} />
                                                            </div>
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="has-Listings">
                                                                    Buy
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="has-Listings" value={buyEvent} onChange={(e) => setBuyEvent(e.target.value)} />
                                                            </div>
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="has-Offers">
                                                                    Offers
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="has-Offers" value={offerEvent} onChange={(e) => setOfferEvent(e.target.value)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="filter-custom-item">
                                                    <h4 className="accordion-button" data-bs-toggle="collapse" data-bs-target="#Collection_acc">
                                                        Collection
                                                    </h4>
                                                    <div id="Collection_acc" className="collapse show">
                                                        <div className="filter-item-list">
                                                            {
                                                                activityData?.collections?.length > 0
                                                                    ? activityData?.collections.map((item) => (
                                                                        <div className="form-check">
                                                                            <label className="form-check-label" for="on-thumb1">
                                                                                <div className="coll_list">
                                                                                    <div className="d-flex-center avatar-info item_info">
                                                                                        <div className="thumb-wrapper">
                                                                                            <span className="thumb thumb_mini">
                                                                                                <img src={`${ApiConfig.baseUrl + item?.logo}`} />
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="content">
                                                                                            <p className="title mb-0">{item?.name}
                                                                                                {/* <img src="images/verified.png" className="img-fluid verify_img" /> */}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </label>
                                                                            {/* <span>9,998</span> */}
                                                                            <input className="form-check-input" type="checkbox" id="on-thumb1" value={collectionEventId} onChange={() => setCollctionEventId(item?._id)} onClick={() => (handleActivityLOgs(salesEvent, rentEvent, buyEvent, offerEvent, collectionEventId))} />
                                                                        </div>
                                                                    ))
                                                                    : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="side_main_panel">
                                            <div className="list_card border-gradient mb-4">
                                                <div className="list-header position-relative">
                                                    <div className="py-5 text-center">
                                                        <BarChart data={data} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="list_card py-0 border-gradient">
                                                <div className="table-responsive position-relative">
                                                    <table className="table text-white ">
                                                        <thead className="text-uppercase">
                                                            <tr className="text-gragient font_passo">
                                                                <th scope="col"> Event </th>
                                                                <th scope="col"> Item </th>
                                                                <th scope="col"><div className="text-end">Price</div> </th>
                                                                <th scope="col"><div className="text-center">Quantity</div></th>
                                                                <th scope="col"><div className="text-center">From</div> </th>
                                                                <th scope="col"><div className="text-center">To</div> </th>
                                                                <th scope="col"><div className="text-end">time</div></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                activityData?.activities?.length > 0
                                                                    ? activityData?.activities.map((item) => (
                                                                        <tr>
                                                                            <td>
                                                                                <Link to="#" className="d-flex-center">
                                                                                    <i className="ri-shopping-cart-fill me-2"></i>
                                                                                    {item?.event}
                                                                                </Link>
                                                                            </td>
                                                                            <td>
                                                                                <div className="d-flex-center avatar-info item_info">
                                                                                    <div className="thumb-wrapper">
                                                                                        <Link to="#" className="thumb">
                                                                                            <img src={`${ApiConfig.baseUrl + item?.item_details?.file}`} alt="top sellter" />
                                                                                        </Link>
                                                                                    </div>
                                                                                    <div className="content">
                                                                                        <p className="title mb-0  pb-1"><Link to="#">{item?.transferred_from?.username}</Link></p>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <p className="mb-0 text-end">{item?.item_details?.price} <br /> <small>${item?.item_details?.price_in_dollars}</small></p>
                                                                            </td>
                                                                            <td>
                                                                                <p className="title mb-0  pb-1 text-center"><Link to="#">{item?.quantity}</Link></p>
                                                                            </td>
                                                                            <td>
                                                                                <p className="mb-0 text-center">1</p>
                                                                            </td>
                                                                            <td>
                                                                                <p className="mb-0 text-center">47515</p>
                                                                            </td>
                                                                            <td>
                                                                                <p className="mb-0 text-end">{item?.createdAt}</p>
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
                    </section >
                </div>

                <div class="modal fade" id="make_offoer_modal" tabindex="-1" aria-labelledby="make_offoer_modalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header no-border flex-column px-8">
                                <h3 class="modal-title" id="make_offoer_modalLabel">Make an offer</h3>
                                <button type="button" class="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close"><i
                                    class="ri-close-fill"></i></button>
                            </div>
                            <div class="modal-body px-8 ">
                                <div class="single-item-history d-flex-center no-border">
                                    <Link to="#" class="avatar">
                                        <img src="images/popular/small/4.png" alt="history" />
                                    </Link>
                                    <div class="content">
                                        <p class="text-white">Exclusive Samurai Club #24472<br />
                                            <small>Exclusive Samurai Club</small>
                                        </p>
                                    </div>
                                    <span class="date align-self-center text-end">0.000255 ETH <br /> <small>$1,091.98</small></span>
                                </div>
                                <form action="#">
                                    <div class="list_card border-gradient no-shadow mb-4" >
                                        <ul class="bidding-list p-0">
                                            <li> <span class="d-flex-center" ><i class="ri-wallet-fill me-2"></i> Balance</span> <strong>12,00 ETH</strong></li>
                                            <li><span>Floor price</span> <strong>70 ETH</strong></li>
                                            <li><span>Best offer</span> <strong>12,70 ETH</strong></li>
                                        </ul>
                                    </div>
                                    <div class="form-group input-group">
                                        <input type="text" class="form-control" placeholder="Price" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                        <div className="filter-select-option">
                                            <Select />
                                        </div>
                                    </div>
                                    <div class="d-flex-between mt-1" >
                                        <small class="fw-normal" ></small>
                                        <small class="fw-normal text-white" >Total offer amount: 0 ETH</small>
                                    </div>
                                    <div class="form-group">
                                        <label>Duration</label>
                                        <div class="row gx-2" >
                                            <div class="col-4" >
                                                <input type="text" class="form-control" placeholder="Price" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                            </div>
                                            <div class="col-8" >
                                                <input type="date" class="form-control" placeholder="Price" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer no-border px-8 pb-5">
                                <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" data-bs-dismiss="modal"
                                    data-bs-toggle="modal" data-bs-target="#popup_bid_success" aria-label="Close"><span>Make An offer</span></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="reportmodal" tabindex="-1" aria-labelledby="reportmodalLabel" aria-hidden="true">
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
            :
            <AfterCollectionNftDetails userid={[userData, activeScreen]} />

    )
}

export default CollectionDetails