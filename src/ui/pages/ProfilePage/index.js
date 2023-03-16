import React, { useEffect, useState, useContext, useRef } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import Select from 'react-select';
import moment from "moment"
import { useAccount } from 'wagmi'
import { ProfileContext } from "../../../context/ProfileProvider";
import { Link, useNavigate } from "react-router-dom";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";
import { $ } from "react-jquery-plugin";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NftDetails from "../NftDetails";
import Web3 from "web3";
import { BarChart } from 'react-charts-d3';
const ProfilePage = () => {
    const web3 = new Web3(window.ethereum)
    const [profileState, updateProfileState] = useContext(ProfileContext);
    const walletAddress = localStorage.getItem("wallet_address");
    const handleLogOut = () => {
        updateProfileState({});
        localStorage.clear();
        navigate("/login");
        window.location.reload();
    }
    const [profileWallet, setProfileWallet] = useState([]);

    const { address, isConnecting, isDisconnected } = useAccount()
    const [userDetails, setUserDetails] = useState([])
    const [collectedNftList, setCollectedNftList] = useState([])
    const [favouriteDataWallet, setFavouriteDataWallet] = useState([])
    const [createdNftData, setCreatedNftData] = useState([])
    const [favouriteDataList, setFavouriteDataList] = useState([])
    const scrollTop = () => {
        messagesEndRef?.current?.scrollIntoView(true)
    }
    const [userData, setUserData] = useState([]);
    const [createdNftSearch, setCreatedNftSearch] = useState();
    const [activeScreen, setActiveScreen] = useState('profilePage');
    const [collectednftSearch, setCollectedNftSearch] = useState();
    const [collectedNftListNew, setCollectedNftListNew] = useState();
    const [activityData, setActivityData] = useState([]);
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
    const [salesEvent, setSalesEvent] = useState('on_sell');
    const [rentEvent, setRentEvent] = useState('');
    const [buyEvent, setBuyEvent] = useState('on_buy');
    const [offerEvent, setOfferEvent] = useState('true');
    const [collectionEventId, setCollctionEventId] = useState([]);
    const [createdNftListNew, setCreatedNftListNew] = useState([]);
    const messagesEndRef = useRef(null)
    const navigate = useNavigate();

    const linkFollow = (item) => {
        setUserData(item);
        setActiveScreen('nftDetails');
    };

    useEffect(() => {
        if (address) {
            $("#yesnoalertmodal").modal('hide');
            handleWalletAddress();
        }
    }, [address])

    useEffect(() => {
        if (favouriteDataWallet === '') {
            $("#yesnoalertmodal").modal('show');
        } else {
            handleuserProfile();
        }
    }, [])

    useEffect(() => {
        handleAllCreatedNft();
        handleCollectedList();

    }, [])

    function hideMenu() {
        let tab = document.getElementById("main_panel_sec1");
        let tab2 = document.getElementById("main_panel_sec2");
        let tab3 = document.getElementById("main_panel_sec3");
        tab.classList.remove("show_panel");
        tab2.classList.remove("show_panel");
        tab3.classList.remove("show_panel");
    }

    function showMenu() {
        let tab = document.getElementById("main_panel_sec1");
        let tab2 = document.getElementById("main_panel_sec2");
        let tab3 = document.getElementById("main_panel_sec3");
        tab.classList.add("show_panel");
        tab2.classList.add("show_panel");
        tab3.classList.add("show_panel");
    }

    const handleuserProfile = async () => {
        await AuthService.getUserDetails().then(async result => {
            if (result.success) {
                if (!result?.data?.wallet_address) {
                    $("#yesnoalertmodal").modal('show');
                }
                try {
                    setUserDetails(result.data);
                    setFavouriteDataWallet(result?.data?.wallet_address);
                    setProfileWallet(result?.data?.wallet_address)
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

    const handleWalletAddress = async () => {
        await AuthService.sendWalletAddress(address).then(async result => {
            if (result.success) {
                try {
                    //  alertSuccessMessage(result.message);
                    $("#yesnoalertmodal").modal('hide');
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }

    const handleSearch = (e) => {
        let serchItem = collectednftSearch.filter((item) => {
            return item?.name?.includes(e.target.value) || item?.token_id?.toLowerCase()?.includes(e.target.value)
        })
        setCollectedNftList(serchItem)
    }

    const handleSearchManual = (e) => {
        let serchItem = collectednftSearch.filter((item) => {
            return item?.name?.includes(e.target.value) || item?.token_id?.toLowerCase()?.includes(e.target.value)
        })
        setCollectedNftListNew(serchItem)
    }

    const handleSearchManualCreated = (e) => {
        let serchItem = createdNftSearch.filter((item) => {
            return item?.name?.includes(e.target.value) || item?.token_id?.toLowerCase()?.includes(e.target.value)
        })
        setCreatedNftListNew(serchItem)
    }

    const handleCollectedList = async () => {
        await AuthService.getCollectedNft(address).then(async result => {
            if (result.success) {
                try {
                    setCollectedNftSearch(result?.data?.data.reverse())
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }

    const handleSearchCreated = (e) => {
        let serchItem = createdNftSearch.filter((item) => {
            return item?.name?.includes(e.target.value) || item?.token_id?.toLowerCase()?.includes(e.target.value)
        })
        setCreatedNftData(serchItem)
    }

    const handleAllCreatedNft = async () => {
        await AuthService.getCreatedNftData().then(async result => {
            if (result.success) {
                try {
                    setCreatedNftSearch(result?.data?.data);
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }

    const handleWalletAddressCoustom = async () => {
        await AuthService.sendWalletAddressCoustom().then(async result => {
            if (result.success) {
                try {
                    $("#yesnoalertmodal").modal('hide');
                    handleuserProfile();
                    window.location.reload();
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }
    useEffect(() => {
        scrollTop();
        handleActivityLOgs();
        handleFavouriteData();
    }, []);

    const handleActivityLOgs = async (salesEvent, rentEvent, buyEvent, offerEvent, collectionEventId) => {
        await AuthService.getActivityDetails(salesEvent, rentEvent, buyEvent, offerEvent, collectionEventId).then(async result => {
            if (result.success) {
                try {
                    setActivityData(result?.data)
                    // alertSuccessMessage(result.message);
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
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
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }

    let limit = '1000'
    useEffect(() => {
        handleSetLimitCreated();
        handleSetLimitCollected();
    }, []);

    const handleSetLimitCreated = async () => {
        await AuthService.getLimitCreated(limit).then(async result => {
            if (result.success) {
                try {
                    setCreatedNftData(result?.data?.data?.reverse())
                    setCreatedNftSearch(result?.data?.data);

                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }

    const handleSetLimitCollected = async () => {
        await AuthService.getLimitCollected(limit).then(async result => {
            if (result.success) {
                try {
                    setCollectedNftList(result?.data?.data?.reverse());
                    setCollectedNftSearch(result?.data?.data)

                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
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
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }


    const handelCreatedFilter = async (minimumPrize, maxPrize, allItemQuantity, onSingleQuantity, bundleQuantity, CategoryCollectibles, categoryArt, categoryDomainNames, categoryMusic, categoryPhotography, categorySports, CurrencyIbat, CurrencyBnb, salesEvent, rentEvent, buyEvent, offerEvent, collectionEventId) => {
        await AuthService.getCreatedFilter(minimumPrize, maxPrize, allItemQuantity, onSingleQuantity, bundleQuantity, CategoryCollectibles, categoryArt, categoryDomainNames, categoryMusic, categoryPhotography, categorySports, CurrencyIbat, CurrencyBnb, salesEvent, rentEvent, buyEvent, offerEvent, collectionEventId).then(async result => {
            if (result.success) {
                try {
                    setActivityData(result?.data)
                    alertSuccessMessage(result?.message);
                    handleResetFilterData()
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }

    const handleErrorMessageforId = () => {
        alertErrorMessage('Please Select Collection ID');
    }

    const handelCollectedFilterStatus = async (salesEvent) => {
        await AuthService.getCollectedFilterSalesEvent(salesEvent).then(async result => {
            if (result.success) {
                try {
                    setActivityData(result?.data)
                    alertSuccessMessage(result?.message);
                    handleResetFilterData()
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }

    const handelCollectedFilterRent = async () => {
        await AuthService.getCollectedFilterRentEvent().then(async result => {
            if (result.success) {
                try {
                    setActivityData(result?.data)
                    alertSuccessMessage(result?.message);
                    handleResetFilterData()
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }

    const handelCollectedFilterbuy = async () => {
        await AuthService.getCollectedFilterBuyEvent().then(async result => {
            if (result.success) {
                try {
                    setActivityData(result?.data)
                    alertSuccessMessage(result?.message);
                    handleResetFilterData()
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }


    const handelCollectedFilterOffer = async () => {
        await AuthService.getCollectedFilterOfferEvent().then(async result => {
            if (result.success) {
                try {
                    setActivityData(result?.data)
                    alertSuccessMessage(result?.message);
                    handleResetFilterData()
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }


    const handelCollectedFilterPrice = async (minimumPrize, maxPrize) => {
        await AuthService.getCollectedFilterPrice(minimumPrize, maxPrize).then(async result => {
            if (result.success) {
                try {
                    setActivityData(result?.data)
                    alertSuccessMessage(result?.message);
                    handleResetFilterData()
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }

    return (
        activeScreen === 'profilePage' ?
            <>
                <div className="page_wrapper" ref={messagesEndRef}>
                    {/* <!-- page banner --> */}
                    <section className="profile_sec my_account_sec">
                        <div className="bg-cover">
                            {
                                userDetails?.cover_photo ?
                                    <img src={`${ApiConfig.baseUrl + userDetails?.cover_photo}`} className="" />
                                    :
                                    <img src="images/bg/bg-10.jpg" />
                            }
                        </div>
                        <div className="container">
                            {
                                userDetails?.logo ?
                                    <img src={`${ApiConfig.baseUrl + userDetails?.logo}`} className="user_img" />
                                    :
                                    <img src="images/avatar/user_lg.jpg" className="user_img" />
                            }

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="user_data">
                                        <h2>{userDetails?.username}</h2>
                                        <p className="user_exps">
                                            {
                                                walletAddress === '0xC1fEec289C4110A103F7A3F759cFA7a61d18a173' || profileWallet === '0xC1fEec289C4110A103F7A3F759cFA7a61d18a173' ? '0xC1fEec289C4110A103F7A3F759cFA7a61d18a173'
                                                    :

                                                    <span>{address}</span>

                                            }
                                            <em></em>
                                            <span>Joined {moment(userDetails?.createdAt).format('lll')}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="profile_data">
                        <div className="container">
                            <ul className="nav custom-pro-tabs mb-8">
                                <li>
                                    <Link className="active btn btn-small btn-link" data-bs-toggle="tab" to="#on-collected">Collected</Link>
                                </li>
                                <li>
                                    <Link className="btn btn-small btn-link" data-bs-toggle="tab" to="#on-created">Created</Link>
                                </li>
                                <li>
                                    <Link className="btn btn-small btn-link" data-bs-toggle="tab" to="#on-activity">Activity</Link>
                                </li>

                                <li>
                                    {/* <Link className="btn btn-small btn-link" data-bs-toggle="tab" to="#auctionList">Auctions's</Link> */}
                                </li>
                                <li>
                                    <Link className="btn btn-small btn-link" data-bs-toggle="tab" to="#favouriteList">Favourite Data</Link>
                                </li>
                            </ul>

                            <div className="tab-content author-tabs-content">
                                <div id="on-collected" className="tab-pane fade show active">
                                    <form action="#" className="mt-10">
                                        <div className="filter-style-one common-filter d-flex-between profile_filter">
                                            <div className="d-flex-center filter-left-cate">
                                                <button className="btn-icon-lg btn-icon me-2 side_toggle" id="side_toggle" type="button" onClick={() => showMenu()}>
                                                    <i className="ri-filter-3-line"></i>
                                                </button>
                                                <div className="border-gradient search-bar" style={{ maxWidth: 'fit-content' }}>
                                                    <input type="text" name="search" placeholder="Search by name or attribute" id="search" onChange={(e) => { handleSearch(e) }} />
                                                    <button className="search-btn" type="button"> <i className="ri-search-line"></i> </button>
                                                </div>
                                                {/* <div className="filter-select-option border-gradient">
                                                    <Select options={optionsTop} />
                                                </div> */}
                                            </div>
                                            {/* <!-- End .left filer --> */}

                                            <div className="d-flex-center filter-right-cate grid-view-tabs">
                                                <ul className="nav icon-tabs">
                                                    <li>
                                                        <Link className="btn active" data-bs-toggle="tab" to="#view-grid"><i className="ri-grid-fill"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link className="btn" data-bs-toggle="tab" to="#view-list"><i className="ri-layout-2-fill"></i></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </form>

                                    <div id="main_panel_sec1" className="main_panel mt-10 ">
                                        <div className="sidepanel">
                                            <div className="filter_header">
                                                <h5>Filter</h5>
                                                <button type="button" id="side_close_one" className="btn-icon side_close" onClick={() => hideMenu()}>
                                                    <i className="ri-close-line" ></i>
                                                </button>
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
                                                                <input className="form-check-input" type="checkbox" id="Sales-now" value={salesEvent} onChange={(e) => setSalesEvent(e.target.value)} onClick={() => handelCollectedFilterStatus(salesEvent)} />
                                                            </div>
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="on-Floor">
                                                                    Rent
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="on-Floor" /* checked */ onChange={(e) => setRentEvent(e.target.value)} onClick={() => handelCollectedFilterRent(rentEvent)} />
                                                            </div>
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="has-Listings">
                                                                    Buy
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="has-Listings" value={buyEvent} onChange={(e) => setBuyEvent(e.target.value)} onClick={() => handelCollectedFilterbuy(buyEvent)} />
                                                            </div>
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="has-Offers">
                                                                    Offers
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="has-Offers" value={offerEvent} onChange={(e) => setOfferEvent(e.target.value)} onClick={() => handelCollectedFilterOffer(offerEvent)} />
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
                                                                <button className="btn btn-gradient btn-border-gradient  w-100 btn-block mt-3" type="button" onClick={() => handelCollectedFilterPrice(minimumPrize, maxPrize)} >
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
                                                    <h4 className="accordion-button" data-bs-toggle="collapse" data-bs-target="#Collection_acc">
                                                        Collection
                                                    </h4>
                                                    <div id="Collection_acc" className="collapse show">
                                                        <div className="filter-item-list">
                                                            <div className="border-gradient search-bar mb-4">
                                                                <input type="text" name="search" placeholder="Search collection" id="search" onChange={(e) => { handleSearchManual(e) }} />
                                                                <button className="search-btn" type="button"> <i className="ri-search-line"></i> </button>
                                                            </div>
                                                            {
                                                                collectedNftListNew?.length > 0
                                                                    ? collectedNftListNew.map((item) => (
                                                                        <div className="form-check">
                                                                            <label className="form-check-label" for="on-thumb1">
                                                                                <div className="coll_list">
                                                                                    <div className="d-flex-center avatar-info item_info">
                                                                                        <div className="thumb-wrapper">
                                                                                            <span className="thumb thumb_mini">
                                                                                                <img src={`${ApiConfig.baseUrl + item?.file}`} alt="top sellter" />
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="content">
                                                                                            <p className="title mb-0">{item?.name}
                                                                                                {/* <img src="images/verified.png" className="img-fluid verify_img" />  */}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </label>
                                                                            <span>{item?.token_id}</span>
                                                                            <input className="form-check-input" type="checkbox" id="on-thumb1" value={collectionEventId} onChange={() => setCollctionEventId(item?._id)} onClick={() => (handelCollectedFilter(minimumPrize, maxPrize, allItemQuantity, onSingleQuantity, bundleQuantity, CategoryCollectibles, categoryArt, categoryDomainNames, categoryMusic, categoryPhotography, categorySports, CurrencyIbat, CurrencyBnb, salesEvent, rentEvent, buyEvent, offerEvent, item?._id))} />
                                                                        </div>
                                                                    ))
                                                                    : null}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="filter-custom-item">
                                                    <h4 className="accordion-button" data-bs-toggle="collapse" data-bs-target="#Category_acc">
                                                        Category
                                                    </h4>
                                                    <div id="Category_acc" className="collapse show">
                                                        <div className="filter-item-list">
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="buy-ETH">
                                                                    Art
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="buy-ETH" value={categoryArt} onChange={(e) => setCategoryArt(e.target.value)} />
                                                            </div>
                                                            {/* <!-- End .form-check --> */}
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="on-WETH">
                                                                    Collectibles
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="on-WETH" value={CategoryCollectibles} onChange={(e) => setCategoryCollectibles(e.target.value)} />
                                                            </div>
                                                            {/* <!-- End .form-check --> */}
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="has-IBAT">
                                                                    Domain Names
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="has-IBAT" value={categoryDomainNames} onChange={(e) => setCategoryDomainNames(e.target.value)} />
                                                            </div>
                                                            {/* <!-- End .form-check --> */}
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="has-IBAT">
                                                                    Music
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="has-IBAT" value={categoryMusic} onChange={(e) => setCategoryMusic(e.target.value)} />
                                                            </div>
                                                            {/* <!-- End .form-check --> */}
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="has-IBAT">
                                                                    Photography
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="has-IBAT" value={categoryPhotography} onChange={(e) => setCategoryPhotography(e.target.value)} />
                                                            </div>
                                                            {/* <!-- End .form-check --> */}
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="has-IBAT">
                                                                    Sports
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="has-IBAT" value={categorySports} onChange={(e) => setCategorySports(e.target.value)} />
                                                            </div>
                                                            {/* <!-- End .form-check --> */}
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
                                                <Link to="#" className=""> {/* <i className="ri-refresh-line me-2"></i> */}  </Link>
                                                <h5>{collectedNftList?.length} Items</h5>
                                            </div>
                                            <div className="tab-content author-tabs-content">
                                                <div id="view-grid" className="tab-pane fade show active">
                                                    <section className="explore_view">
                                                        <div className="itemas_view grid-container">
                                                            {/*  Collected Item Start */}
                                                            {collectedNftList.length > 0
                                                                ? collectedNftList.map((item) => (
                                                                    <div className="grid_iteam">
                                                                        <div className="explore-style-one explore-style-overlay border-gradient">
                                                                            <div className="thumb">
                                                                                <Link /* to="/nft_details" */ onClick={() => linkFollow(item)} className="ratio ratio-1x1" >
                                                                                    <img src={`${ApiConfig.baseUrl + item?.file}`} alt="nft live auction thumbnail" />
                                                                                    {/* <img src={JSON.parse(item?.own_by_address[0]?.metadata).image} alt="nft live auction thumbnail" /> */}
                                                                                    {/* {console.log(JSON.parse(item?.own_by_address[0]?.metadata))} */}
                                                                                </Link>
                                                                            </div>
                                                                            {/* <!-- End .thumb --> */}
                                                                            <div className="content px-4">
                                                                                <div className="d-flex-between align-items-center pt-4">
                                                                                    <div>
                                                                                        <div className="header d-flex-between">
                                                                                            <h3 className="title"><Link onClick={() => linkFollow(item)}>{item?.name}</Link></h3>
                                                                                        </div>
                                                                                    </div>
                                                                                    <span className="biding-price d-flex-center text-white"> {item?.token_id} </span>
                                                                                </div>
                                                                                <hr />
                                                                                {/* <!-- End .product-owner --> */}
                                                                                <div className="action-wrapper d-flex-between border-0 pb-4">
                                                                                    <span className="biding-price d-flex-center  text-white">Asking Price</span>
                                                                                    <span className="biding-price d-flex-center  text-white">{item?.price}</span>
                                                                                </div>
                                                                            </div>
                                                                            <Link to="#" onClick={() => linkFollow(item)} className="btn  btn-block btn-gradient w-100 text-center btn-small">
                                                                                <span>Details</span>
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                                : null}
                                                        </div>
                                                    </section>
                                                </div>
                                                {/*  Collected Item End*/}
                                                <div id="view-list" className="tab-pane fade">
                                                    <section className="explore_view">
                                                        <div className="itemas_view grid-container grid-view-two">
                                                            {collectedNftList.length > 0
                                                                ? collectedNftList.map((item) => (
                                                                    <div className="grid_iteam">
                                                                        <div className="explore-style-one explore-style-overlay border-gradient">
                                                                            <div className="thumb">
                                                                                <Link onClick={() => linkFollow(item)}>
                                                                                    <img src={`${ApiConfig.baseUrl + item?.file}`} alt="nft live auction thumbnail" />
                                                                                </Link>
                                                                            </div>
                                                                            <div className="content px-4">
                                                                                <div className="d-flex-between align-items-center pt-4">
                                                                                    <div>
                                                                                        <div className="header d-flex-between">
                                                                                            <h3 className="title"><Link onClick={() => linkFollow(item)}>{item?.name}</Link></h3>
                                                                                        </div>
                                                                                    </div>
                                                                                    <span className="biding-price d-flex-center text-white"> {item?.token_id} </span>
                                                                                </div>
                                                                                <hr />
                                                                                <div className="action-wrapper d-flex-between border-0 pb-4">
                                                                                    <span className="biding-price d-flex-center  text-white">Asking Price</span>
                                                                                    <span className="biding-price d-flex-center  text-white">{item?.price}</span>
                                                                                </div>
                                                                            </div>
                                                                            {
                                                                                item?.sell_type === 'on_sell' ?

                                                                                    <button className="btn  btn-block btn-gradient w-100 text-center btn-small">
                                                                                        <span>On Sell</span>
                                                                                    </button>
                                                                                    :
                                                                                    <Link className="btn  btn-block btn-gradient w-100 text-center btn-small" onClick={() => linkFollow(item)}><span> Sell Now </span>
                                                                                    </Link>
                                                                            }

                                                                        </div>
                                                                    </div>

                                                                ))
                                                                : null}
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id="on-created" className="tab-pane fade">
                                    <form action="#" className="mt-10">
                                        <div className="filter-style-one common-filter d-flex-between profile_filter">
                                            <div className="d-flex-center filter-left-cate">
                                                <button className="btn-icon-lg btn-icon me-2 side_toggle" id="side_toggle" type="button" onClick={() => showMenu()}>
                                                    <i className="ri-filter-3-line"></i>
                                                </button>
                                                <div className="border-gradient search-bar" style={{ maxWidth: 'fit-content' }}>
                                                    <input type="text" name="search" placeholder="Search by name or attribute" id="search" onChange={(e) => { handleSearchCreated(e) }} />
                                                    <button className="search-btn" type="button"> <i className="ri-search-line"></i> </button>
                                                </div>
                                            </div>
                                            <div className="d-flex-center filter-right-cate grid-view-tabs">
                                                <ul className="nav icon-tabs">
                                                    <li>
                                                        <Link className="btn active" data-bs-toggle="tab" to="#view-grid"><i className="ri-grid-fill"></i></Link>
                                                    </li>
                                                    <li>
                                                        <Link className="btn" data-bs-toggle="tab" to="#view-list"><i className="ri-layout-2-fill"></i></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </form>
                                    <div id="main_panel_sec2" className="main_panel mt-10">
                                        <div className="sidepanel">
                                            <div className="filter_header">
                                                <h5>Filter</h5>
                                                <span id="side_close" className="btn-icon side_close" onClick={() => hideMenu()}> <i className="ri-close-line"></i> </span>
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
                                                                <button className="btn btn-gradient btn-border-gradient  w-100 btn-block mt-3" type="button" onClick={handleErrorMessageforId}>
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
                                                    <h4 className="accordion-button" data-bs-toggle="collapse" data-bs-target="#Collection_acc">
                                                        Collection
                                                    </h4>
                                                    <div id="Collection_acc" className="collapse show">
                                                        <div className="filter-item-list">
                                                            <div className="border-gradient search-bar mb-4">
                                                                <input type="text" name="search" placeholder="Search collection" id="search" onChange={(e) => { handleSearchManualCreated(e) }} />
                                                                <button className="search-btn" type="button"> <i className="ri-search-line"></i> </button>
                                                            </div>
                                                            {
                                                                createdNftListNew?.length > 0
                                                                    ? createdNftListNew.map((item) => (
                                                                        <div className="form-check">
                                                                            <label className="form-check-label" for="on-thumb1">
                                                                                <div className="coll_list">
                                                                                    <div className="d-flex-center avatar-info item_info">
                                                                                        <div className="thumb-wrapper">
                                                                                            <span className="thumb thumb_mini">
                                                                                                <img src={`${ApiConfig.baseUrl + item?.file}`} alt="top sellter" />
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="content">
                                                                                            <p className="title mb-0">{item?.name}
                                                                                                {/* <img src="images/verified.png" className="img-fluid verify_img" />  */}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </label>
                                                                            <span>{item?.token_id}</span>
                                                                            <input className="form-check-input" type="checkbox" id="on-thumb1" value={collectionEventId} onChange={() => setCollctionEventId(item?._id)} onClick={() => (handelCreatedFilter(minimumPrize, maxPrize, allItemQuantity, onSingleQuantity, bundleQuantity, CategoryCollectibles, categoryArt, categoryDomainNames, categoryMusic, categoryPhotography, categorySports, CurrencyIbat, CurrencyBnb, salesEvent, rentEvent, buyEvent, offerEvent, collectionEventId))} />
                                                                        </div>
                                                                    ))
                                                                    : null}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="filter-custom-item">
                                                    <h4 className="accordion-button" data-bs-toggle="collapse" data-bs-target="#Category_acc">
                                                        Category
                                                    </h4>
                                                    <div id="Category_acc" className="collapse show">
                                                        <div className="filter-item-list">
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="buy-ETH">
                                                                    Art
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="buy-ETH" value={categoryArt} onChange={(e) => setCategoryArt(e.target.value)} />
                                                            </div>
                                                            {/* <!-- End .form-check --> */}
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="on-WETH">
                                                                    Collectibles
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="on-WETH" value={CategoryCollectibles} onChange={(e) => setCategoryCollectibles(e.target.value)} />
                                                            </div>
                                                            {/* <!-- End .form-check --> */}
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="has-IBAT">
                                                                    Domain Names
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="has-IBAT" value={categoryDomainNames} onChange={(e) => setCategoryDomainNames(e.target.value)} />
                                                            </div>
                                                            {/* <!-- End .form-check --> */}
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="has-IBAT">
                                                                    Music
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="has-IBAT" value={categoryMusic} onChange={(e) => setCategoryMusic(e.target.value)} />
                                                            </div>
                                                            {/* <!-- End .form-check --> */}
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="has-IBAT">
                                                                    Photography
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="has-IBAT" value={categoryPhotography} onChange={(e) => setCategoryPhotography(e.target.value)} />
                                                            </div>
                                                            {/* <!-- End .form-check --> */}
                                                            <div className="form-check">
                                                                <label className="form-check-label" for="has-IBAT">
                                                                    Sports
                                                                </label>
                                                                <input className="form-check-input" type="checkbox" id="has-IBAT" value={categorySports} onChange={(e) => setCategorySports(e.target.value)} />
                                                            </div>
                                                            {/* <!-- End .form-check --> */}
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

                                        {/* Created Data List */}
                                        <div className="side_main_panel">

                                            <div className="iterfsh profile_iterfsh">
                                                <Link to="#" className=""> {/*  <i className="ri-refresh-line me-2"></i> Updated 18m ago */} </Link>
                                                <h5>{createdNftData.length} Items</h5>
                                            </div>
                                            <div className="tab-content author-tabs-content">
                                                <div id="view-grid" className="tab-pane fade show active">
                                                    <section className="explore_view">
                                                        <div className="itemas_view grid-container">
                                                            {/* created Data */}

                                                            {
                                                                createdNftData.length > 0
                                                                    ? createdNftData.map((item) => (
                                                                        <>

                                                                            <div className="grid_iteam">
                                                                                <div className="explore-style-one explore-style-overlay border-gradient">
                                                                                    <div className="thumb">
                                                                                        <Link tonClick={() => linkFollow(item)} className="ratio ratio-1x1" >

                                                                                            {
                                                                                                !item?.file ?
                                                                                                    <img src="images/explore/13.jpg" alt="nft live auction thumbnail" />
                                                                                                    :
                                                                                                    <img src={`${ApiConfig.baseUrl + item?.file}`} className="" />

                                                                                            }


                                                                                        </Link>

                                                                                        {/* <!-- End .count-down --> */}

                                                                                        {/* <!-- End .reaction-count --> */}
                                                                                    </div>
                                                                                    {/* <!-- End .thumb --> */}
                                                                                    <div className="content px-4">
                                                                                        <div className="d-flex-between align-items-center pt-4">
                                                                                            <div>
                                                                                                <div className="header d-flex-between">
                                                                                                    <h3 className="title"><Link onClick={() => linkFollow(item)}>{item?.name}</Link></h3>
                                                                                                </div>
                                                                                            </div>
                                                                                            <span className="biding-price d-flex-center text-white"> {item?.token_id} </span>
                                                                                        </div>
                                                                                        <hr />
                                                                                        {/* <!-- End .product-owner --> */}
                                                                                        <div className="action-wrapper d-flex-between border-0 pb-4">
                                                                                            <span className="biding-price d-flex-center  text-white">Asking Price</span>
                                                                                            <span className="biding-price d-flex-center  text-white">{item?.price}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <Link className="btn  btn-block btn-gradient w-100 text-center btn-small" onClick={() => linkFollow(item)}
                                                                                    ><span> Drtails</span>
                                                                                    </Link>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ))
                                                                    : null}
                                                        </div>
                                                    </section>
                                                </div>
                                                <div id="view-list" className="tab-pane fade">
                                                    <section className="explore_view">
                                                        <div className="itemas_view grid-container grid-view-two">
                                                            <div className="grid_iteam">
                                                                <div className="explore-style-one explore-style-overlay border-gradient">
                                                                    <div className="thumb">
                                                                        <Link to="/nft_details"><img src="images/explore/13.jpg"
                                                                            alt="nft live auction thumbnail" /></Link>
                                                                    </div>
                                                                    <div className="content px-4">
                                                                        <div className="d-flex-between align-items-center pt-4">
                                                                            <div>
                                                                                <div className="header d-flex-between">
                                                                                    <h3 className="title"><Link to="/nft_details">God Watching</Link></h3>
                                                                                </div>
                                                                            </div>
                                                                            <span className="biding-price d-flex-center text-white"> #556 </span>
                                                                        </div>
                                                                        <hr />
                                                                        <div className="action-wrapper d-flex-between border-0 pb-4">
                                                                            <span className="biding-price d-flex-center  text-white">Asking Price</span>
                                                                            <span className="biding-price d-flex-center  text-white">$ 2.055</span>
                                                                        </div>
                                                                    </div>
                                                                    <Link onClick={() => linkFollow()} className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Sell Now </span> </Link>
                                                                </div>
                                                            </div>
                                                            <div className="grid_iteam">
                                                                <div className="explore-style-one explore-style-overlay border-gradient">
                                                                    <div className="thumb">
                                                                        <Link to="/nft_details"><img src="images/explore/13.jpg"
                                                                            alt="nft live auction thumbnail" /></Link>
                                                                    </div>
                                                                    <div className="content px-4">
                                                                        <div className="d-flex-between align-items-center pt-4">
                                                                            <div>
                                                                                <div className="header d-flex-between">
                                                                                    <h3 className="title"><Link to="/nft_details">God Watching</Link></h3>
                                                                                </div>
                                                                            </div>
                                                                            <span className="biding-price d-flex-center text-white"> #556 </span>
                                                                        </div>
                                                                        <hr />
                                                                        <div className="action-wrapper d-flex-between border-0 pb-4">
                                                                            <span className="biding-price d-flex-center  text-white">Asking Price</span>
                                                                            <span className="biding-price d-flex-center  text-white">$ 2.055</span>
                                                                        </div>
                                                                    </div>
                                                                    <Link onClick={() => linkFollow()} className="btn  btn-block btn-gradient w-100 text-center btn-small" >
                                                                        <span> Sell Now </span>
                                                                    </Link>
                                                                    {/* <!-- End .content --> */}
                                                                </div>
                                                            </div>
                                                            <div className="grid_iteam">
                                                                <div className="explore-style-one explore-style-overlay border-gradient">
                                                                    <div className="thumb">
                                                                        <Link to="/nft_details"><img src="images/explore/13.jpg"
                                                                            alt="nft live auction thumbnail" /></Link>

                                                                        {/* <!-- End .count-down --> */}

                                                                        {/* <!-- End .reaction-count --> */}
                                                                    </div>
                                                                    {/* <!-- End .thumb --> */}
                                                                    <div className="content px-4">
                                                                        <div className="d-flex-between align-items-center pt-4">
                                                                            <div>
                                                                                <div className="header d-flex-between">
                                                                                    <h3 className="title"><Link to="/nft_details">God Watching</Link></h3>
                                                                                </div>
                                                                            </div>
                                                                            <span className="biding-price d-flex-center text-white"> #556 </span>
                                                                        </div>
                                                                        <hr />
                                                                        {/* <!-- End .product-owner --> */}
                                                                        <div className="action-wrapper d-flex-between border-0 pb-4">
                                                                            <span className="biding-price d-flex-center  text-white">Asking Price</span>
                                                                            <span className="biding-price d-flex-center  text-white">$ 2.055</span>
                                                                        </div>

                                                                        {/* <!-- action-wrapper --> */}
                                                                    </div>
                                                                    <Link to="#"
                                                                        onClick={() => linkFollow()}
                                                                        // data-bs-toggle="modal" data-bs-target="#checkout_modal"
                                                                        className="btn  btn-block btn-gradient w-100 text-center btn-small"
                                                                    ><span> Sell Now </span>
                                                                    </Link>
                                                                    {/* <!-- End .content --> */}
                                                                </div>
                                                            </div>
                                                            <div className="grid_iteam">
                                                                <div className="explore-style-one explore-style-overlay border-gradient">
                                                                    <div className="thumb">
                                                                        <Link to="/nft_details"><img src="images/explore/13.jpg"
                                                                            alt="nft live auction thumbnail" /></Link>

                                                                        {/* <!-- End .count-down --> */}

                                                                        {/* <!-- End .reaction-count --> */}
                                                                    </div>
                                                                    {/* <!-- End .thumb --> */}
                                                                    <div className="content px-4">
                                                                        <div className="d-flex-between align-items-center pt-4">
                                                                            <div>
                                                                                <div className="header d-flex-between">
                                                                                    <h3 className="title"><Link to="/nft_details">God Watching</Link></h3>
                                                                                </div>
                                                                            </div>
                                                                            <span className="biding-price d-flex-center text-white"> #556 </span>
                                                                        </div>
                                                                        <hr />
                                                                        {/* <!-- End .product-owner --> */}
                                                                        <div className="action-wrapper d-flex-between border-0 pb-4">
                                                                            <span className="biding-price d-flex-center  text-white">Asking Price</span>
                                                                            <span className="biding-price d-flex-center  text-white">$ 2.055</span>
                                                                        </div>

                                                                        {/* <!-- action-wrapper --> */}
                                                                    </div>
                                                                    <Link to="#"
                                                                        onClick={() => linkFollow()}
                                                                        // data-bs-toggle="modal" data-bs-target="#checkout_modal"
                                                                        className="btn  btn-block btn-gradient w-100 text-center btn-small"
                                                                    ><span> Sell Now </span>
                                                                    </Link>
                                                                    {/* <!-- End .content --> */}
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </section>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* activity tab */}
                                <div id="on-activity" className="tab-pane fade">
                                    <form action="#" className="mt-10">
                                        <div className="filter-style-one common-filter d-flex-between profile_filter">
                                            <div className="d-flex-center filter-left-cate">
                                                <button className="btn-icon-lg btn-icon me-2 side_toggle" id="side_toggle" type="button" onClick={() => showMenu()}>
                                                    <i className="ri-filter-3-line"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                    <div id="main_panel_sec3" className="main_panel mt-10 ">
                                        <div className="sidepanel">
                                            <div className="filter_header">
                                                <h5>Filter</h5>
                                                <span id="side_close" className="btn-icon side_close" onClick={() => hideMenu()}> <i className="ri-close-line"></i> </span>
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
                                            {/* <div className="iterfsh profile_iterfsh">
                                                <div className="itfrsh_start">
                                                    <Link className="btn-sm btn-outline border-gradient me-2">
                                                        <span>Sales <i className="ri-close-line ms-1 pe-0"></i></span>
                                                    </Link>
                                                    <Link to="#" className="text-white"> Clear all </Link>
                                                </div>
                                                <div className="filter-select-option border-gradient">
                                                    <Select options={optionsActivity} />
                                                </div>
                                            </div> */}
                                            <div className="list_card border-gradient mb-4">
                                                <div className="list-header position-relative">
                                                    <div className="py-5 text-center">
                                                        {/* <LineChart data={data} /> */}

                                                        <BarChart data={data} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="list_card py-0 border-gradient">
                                                <div className="table-responsive position-relative">
                                                    <table className="table text-white ">
                                                        <thead className="text-uppercase">
                                                            <tr className="font_passo text-gragient">
                                                                <th scope="col">Event</th>
                                                                <th scope="col"> Item</th>
                                                                <th scope="col"> <div className="text-end">Price</div> </th>
                                                                <th scope="col"> <div className="text-center">Quantity</div>
                                                                </th><th scope="col">  <div className="text-center">From</div>  </th>
                                                                <th scope="col"> <div className="text-center">To</div>
                                                                </th><th scope="col"><div className="text-end">time</div></th>
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
                                                                                    {/* <!-- End .thumb-wrapper --> */}
                                                                                    <div className="content">
                                                                                        <p className="title mb-0  pb-1"><Link to="#">{item?.transferred_from?.username}</Link></p>
                                                                                    </div>

                                                                                    {/* <!-- End .content --> */}
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <p className="mb-0 text-end">{item?.item_details?.price}<br /> <small>${item?.item_details?.price_in_dollars}</small></p>
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

                                {/* favouriteList */}
                                <div id="favouriteList" className="tab-pane fade">
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
                    </section>
                </div>
                <div className="modal fade" id="yesnoalertmodal" tabindex="-1" data-bs-backdrop="static" aria-labelledby="yesnoalertmodallabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header no-border flex-column px-8">
                                <h3 className="modal-title" id="yesnoalertmodallabel"> Already you have a decentralized wallet? </h3>
                                <button type="button" className="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close"><i
                                    className="ri-close-fill"></i></button>
                            </div>
                            <div className="modal-footer no-border px-8 pb-5">
                                <div className="d-flex align-items-center w-100 justify-content-center" >
                                    <div className="btn  btn-gradient btn-border-gradient connect_wallet_btn w-100 me-3" >
                                        <ConnectButton showBalance={false} />
                                    </div>
                                    <button type="button" className="btn btn-gradient w-100 btn-block  btn-border-gradient justify-content-center w-100" onClick={handleWalletAddressCoustom}>
                                        <span>NO</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            :
            <NftDetails userid={[userData, activeScreen]} />
    )
}

export default ProfilePage