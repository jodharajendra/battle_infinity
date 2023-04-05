import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";


const ExplorePage = () => {

    const messagesEndRef = useRef(null)
    const [collectionData, setCollectionData] = useState([]);
    const [collectedSearchData, setCollectedSearchData] = useState();


    const handleSearch = (e) => {
        let serchItem = collectedSearchData.filter((item) => {
            return item?.name.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setCollectionData(serchItem)
    }

    const handleCollectionData = async () => {
        await AuthService.getCollectionData().then(async result => {
            if (result.success) {
                // setCollectionData(result?.data?.data.reverse());
                // setCollectedSearchData(result?.data?.data);
            } else {
                alertErrorMessage(result?.message);
            }
        });
    }

    const [limitExplore, setLimitExplore] = useState(6);

    const [exploreLength, setExploreLength] = useState([]);


    useEffect(() => {
        handleSetLimitExplore();
    }, []);


    const handleSetLimitExplore = async () => {
        await AuthService.getLimitExplorecollected(limitExplore).then(async result => {
            if (result.success) {
                try {
                    // console.log(result, 'resultRJ');
                    // alertSuccessMessage(result?.message)
                    setCollectionData(result?.data?.data);
                    setCollectedSearchData(result?.data?.data);
                    setExploreLength(result?.data?.filter?.count);
                    setLimitExplore(limitExplore + 3);
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }

    useEffect(() => {
        scrollTop()
        handleCollectionData()
    }, []);
    // console.log(collectionData, 'collectionData');

    const scrollTop = () => {
        messagesEndRef?.current?.scrollIntoView(true)
    }

    return (
        <>
            <div className="page_wrapper" ref={messagesEndRef}>
                {/* <!-- page banner --> */}
                <section className="inner-page-banner explore_banner_inner">
                    <div className="container">
                        <div className="innertext-start">
                            <h1 className="title">Explore Collections</h1>
                        </div>
                        <form action="#" className="mt-10">
                            <div className="filter-style-one common-filter d-flex-between explore_filter">
                                <div className="d-flex-center filter-left-cate">
                                    <input style={{ width: '100%' }} type="search" name="search" placeholder="Search by Name" id="search" onChange={(e) => { handleSearch(e) }} />
                                </div>
                                <div className="d-flex-center filter-right-cate">
                                    <ul className="nav icon-tabs">
                                        <li>
                                            <Link className="btn active" data-bs-toggle="tab" to="#view-grid"><i className="ri-layout-grid-fill"></i></Link>
                                        </li>
                                        <li>
                                            <Link className="btn" data-bs-toggle="tab" to="#view-list"><i className="ri-list-check-2"></i></Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
                <div className="tab-content author-tabs-content" >
                    <div id="view-grid" className="tab-pane fade show active">
                        <section className="explore_view" >
                            <div className="container" >
                                <div className="row" >
                                    {collectionData.length > 0
                                        ? collectionData.map((item) => (
                                            <div className="col-xxl-4 col-md-6 mb-6" >
                                                <div className="popular-collection-style-one border-gradient" >
                                                    <Link to={`collection_details?id=${item?._id}`}>
                                                        {!item?.banner_image ? <img src="images/collection/tc_1.png" alt="popular collection" /> :
                                                            <div className="large-thumbnail ratio ratio-16x9"> <img src={`${ApiConfig.baseUrl + item?.banner_image}`} /></div>
                                                        }
                                                    </Link>
                                                    <div className="content content-flex p-4">
                                                        {!item?.logo ? <img src="images/popular/small/2.png" className="avatar avatar_72" alt="history" /> :
                                                            <Link to={`collection_details?id=${item?._id}`} className="avatar avatar_72" tabindex="0">
                                                                <img src={`${ApiConfig.baseUrl + item?.logo}`} className="img-fluid" />
                                                            </Link>
                                                        }
                                                        <div className="inner">
                                                            <h4 className="title ">
                                                                <Link className="d-flex align-items-center" to={`collection_details?id=${item?._id}`}>
                                                                    {item?.name}
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
                                                            <button type="button" className="btn btn-outline border-gradient px-6" onClick={handleSetLimitExplore}>
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
                                                        <div className="text-center" >Name</div>
                                                    </th>
                                                    <th scope="col">
                                                        <div className="text-center" >Token Type</div>
                                                    </th>
                                                    <th scope="col">
                                                        <div className="text-center" >Highest</div>
                                                    </th>
                                                    <th scope="col">
                                                        <div className="text-center" >Network</div>
                                                    </th>
                                                    <th scope="col">
                                                        <div className="text-end" >Created</div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {collectionData.length > 0
                                                    ? collectionData.map((item) => (
                                                        <tr>
                                                            <td>
                                                                <div className="d-flex-center avatar-info item_info">
                                                                    <div className="thumb-wrapper">
                                                                        <Link to={`collection_details?id=${item?._id}`}  className="thumb">
                                                                            <img src={`${ApiConfig.baseUrl + item?.banner_image}`} alt="top sellter" />
                                                                        </Link>
                                                                    </div>
                                                                    <div className="content">
                                                                        <p className="title mb-0  pb-1"><Link to={`collection_details?id=${item?._id}`} >{item?.token_id}</Link></p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <p className="mb-0 text-center" > <Link to={`collection_details?id=${item?._id}`} >{item?.name}</Link></p>
                                                            </td>
                                                            <td>
                                                                <p className="title mb-0  pb-1 text-center"><Link to={`collection_details?id=${item?._id}`} >{item?.token_type}</Link></p>
                                                            </td>
                                                            <td>
                                                                <p className="mb-0 text-center" >1</p>
                                                            </td>
                                                            <td>
                                                                <p className="mb-0 text-center" >{item?.network}</p>
                                                            </td>
                                                            <td>
                                                                <p className="mb-0 text-end" >{item?.createdAt}</p>
                                                            </td>
                                                        </tr>
                                                    ))
                                                    : null}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {
                                    collectionData.length > 0 ?
                                        <>
                                            {
                                                exploreLength === collectionData.length ? '' :
                                                    <div className="row">
                                                        <div className="col-12 text-center mt-4">
                                                            <button type="button" className="btn btn-outline border-gradient px-6" onClick={handleSetLimitExplore}>
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
                                    <div className="content">
                                        <p>Bid accepted <span className="color-primary fw-500">12
                                            ETH</span> by <Link className="text-white" to="/Profile">Zakson</Link></p>
                                        <span className="date">03/01/2022, 10:25</span>
                                    </div>
                                </div>
                                <div className="single-item-history d-flex-center">
                                    <Link to="#" className="avatar">
                                        <img src="images/popular/small/2.png" alt="history" />
                                        <i className="ri-check-line"></i>
                                    </Link>
                                    <div className="content">
                                        <p>Bid accepted <span className="color-primary fw-500">15
                                            ETH</span> by <Link className="text-white" to="/Profile">Smith</Link></p>
                                        <span className="date">02/01/2022, 10:55</span>
                                    </div>
                                </div>
                                <div className="single-item-history d-flex-center">
                                    <Link to="#" className="avatar">
                                        <img src="images/popular/small/3.png" alt="history" />
                                        <i className="ri-check-line"></i>
                                    </Link>
                                    <div className="content">
                                        <p>Bid accepted <span className="color-primary fw-500">13
                                            ETH</span> by <Link className="text-white" to="/Profile">Rion</Link></p>
                                        <span className="date">05/01/2022, 10:34</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

                            <Link to="/explore-filter-sidebar" className="btn btn-gradient btn-small w-100 justify-content-center">
                                <span>Watch
                                    Other Listings</span></Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Place a bit Modal --> */}
            <div className="modal fade" id="placeBit" tabindex="-1" aria-labelledby="placeBitLaebl" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header flex-column px-8">
                            <h3 className="modal-title" id="placeBitLaebl">Place a Bid</h3>
                            <button type="button" className="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close"><i
                                className="ri-close-fill"></i></button>
                        </div>
                        <div className="modal-body px-8 py-5">
                            <form action="#">
                                <div className="form-group mb-4">
                                    <label for="bit">You must bid at least 13 ETH</label>
                                    <input type="text" id="bit" placeholder="00.00ETH" />
                                </div>
                                <div className="form-group">
                                    <label for="quantity">Enter quantity. <span className="color-primary fw-500">5 available</span></label>
                                    <input type="number" id="quantity" placeholder="1" />
                                </div>
                                <ul className="bidding-list">
                                    <li>You must bid at least: <strong>12,00 ETH</strong></li>
                                    <li>Service Cost: <strong>70 ETH</strong></li>
                                    <li>Total bid amount: <strong>12,70 ETH</strong></li>
                                </ul>
                            </form>
                        </div>
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

export default ExplorePage