import React from "react";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
const SearchPage = () => {
    const { state } = useLocation();

    return (
        <div className="page_wrapper settings_wrapper" >
            <div className="search_page" >
                <div className="container" >
                    <div className="row justify-content-center" >
                        <div className="col-lg-12 col-md-12" >
                            <div className="innertext-start">
                                <h3 className="title mb-3">Collection results : {state?.collections.length} Items</h3>
                            </div>
                            <div className="col-md-12" >
                                <div className="row" >
                                    {
                                        state?.collections.length > 0
                                            ? state?.collections.map((item) => (
                                                <div className="col-xxl-4 col-md-6 mb-6" >
                                                    <div className="popular-collection-style-one border-gradient">
                                                        <Link to={`collection_details?id=${item?._id}`}>
                                                            <div className="large-thumbnail ratio ratio-16x9">
                                                                <img src={`${ApiConfig.baseUrl + item?.banner_image}`} alt="collection" />
                                                            </div>
                                                        </Link>
                                                        <div className="content content-flex p-4">
                                                            <Link to={`collection_details?id=${item?._id}`} className="avatar avatar_72" tabindex="0">
                                                                <img src={`${ApiConfig.baseUrl + item?.logo}`} className="img-fluid" alt="history" />
                                                            </Link>
                                                            <div className="inner">
                                                                <h4 className="title ">
                                                                    <Link className="d-flex align-items-center" to={`collection_details?id=${item?._id}`}>
                                                                        {item?.name}
                                                                        <img src="images/verified.png" className="img-fluid verify_img" />
                                                                    </Link>
                                                                </h4>
                                                                <span><Link to={`collection_details?id=${item?._id}`} className="text-secondry" >{item?.category?.name}</Link></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                            : null}
                                </div>
                                <div className="innertext-start">
                                    <h3 className="title mb-3"> Popular Items</h3>
                                </div>
                                <div className="row" >
                                    {
                                        state?.nfts.length > 0
                                            ? state?.nfts.map((item) => (
                                                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  mb-6">
                                                    <div className="explore-style-one explore-style-overlay border-gradient">
                                                        <div className="thumb">
                                                            <div className="ratio ratio-1x1" >
                                                                <img src={`${ApiConfig.baseUrl + item?.file}`} alt="nft live auction thumbnail" />
                                                            </div>
                                                        </div>
                                                        <div className="content px-4">
                                                            <div className="d-flex-between align-items-center" >
                                                                <div>
                                                                    <div className="header d-flex-between pt-4 pb-2">
                                                                        <h3 className="title">
                                                                            {item?.name}
                                                                        </h3>
                                                                    </div>
                                                                </div>
                                                                <span className="biding-price d-flex-center text-white">{item?.token_id}</span>
                                                            </div>
                                                            <hr />
                                                            <div className="action-wrapper d-flex-between border-0 pb-4">
                                                                <span className="biding-price d-flex-center  text-white">{item?.price}</span>
                                                                <span className="biding-price d-flex-center  text-white">{item?.wallet_network}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                            : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchPage