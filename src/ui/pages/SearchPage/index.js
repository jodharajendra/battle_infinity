import React, { useEffect, useRef, useState } from "react";

import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";
import { useLocation } from 'react-router-dom';

import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
const SearchPage = () => {

    const { state } = useLocation();

    // console.log(state, 'state');



    var settingstwo = {
        // adaptiveHeight: true,
        // variableWidth: true,
        // centerPadding: 0,
        // slidesToShow: 3,
        // slidesToScroll: 1,
        // draggable: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1399,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: false,
                },
            },
        ],
    };




    return (
        <>
            <div className="page_wrapper settings_wrapper" >
                <div className="search_page" >
                    <div className="container" >
                        <div className="row justify-content-center" >
                            <div className="col-lg-12 col-md-12" >

                                <div className="innertext-start">
                                    <h3 className="title mb-3">Collection results : {state?.collections.length} Items</h3>
                                </div>

                                <div className="col-md-12" >
                                    <div className="slider popular-collection-active slick-gutter-15 slick-arrow-between">
                                        {/* <Slider {...settingstwo}> */}
                                        {
                                            state?.collections.length > 0
                                                ? state?.collections.map((item) => (
                                                    <div className="col-xxl-4 col-md-6 mb-6" >
                                                        <div className="popular-collection-style-one border-gradient">
                                                            <Link to="/collection_details">
                                                                <div className="large-thumbnail ratio-16x9"> <img src={`${ApiConfig.baseUrl + item?.banner_image}`} alt="popular collection" /></div>
                                                            </Link>
                                                            <div className="content content-flex p-4">
                                                                <Link to="/profile" className="avatar avatar_72" tabindex="0">
                                                                    <img src={`${ApiConfig.baseUrl + item?.logo}`} className="img-fluid" alt="history" />
                                                                </Link>
                                                                <div className="inner">
                                                                    <h4 className="title ">
                                                                        <Link className="d-flex align-items-center" to="/collection_details">
                                                                            {item?.name}
                                                                            <img src="images/verified.png" className="img-fluid verify_img" />
                                                                        </Link>
                                                                    </h4>
                                                                    <span><Link to="/profile" className="text-secondry" >{item?.category?.name}</Link></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                                : null}
                                        {/* </Slider> */}
                                    </div>

                                    <div className="row" >
                                        {
                                            state?.nfts.length > 0
                                                ? state?.nfts.map((item) => (
                                                    <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  mb-6">
                                                        <div className="explore-style-one explore-style-overlay border-gradient">
                                                            <div className="thumb">
                                                                <Link to="nft_details"><img src={`${ApiConfig.baseUrl + item?.file}`} alt="nft live auction thumbnail" /></Link>
                                                            </div>
                                                            <div className="content px-4">
                                                                <div className="d-flex-between align-items-center" >
                                                                    <div>
                                                                        <div className="header d-flex-between pt-4 pb-2">
                                                                            <h3 className="title"><Link to="/nft_details">{item?.name}</Link></h3>
                                                                        </div>
                                                                        <div className="product-owner d-flex-between">
                                                                            <span className="bid-owner text-secondry d-flex align-items-center">
                                                                                <Link to="collection_details">{/* {item?.sell_type} */}
                                                                                    {/* <img src="images/verified.png" className="img-fluid verify_img" /> */}
                                                                                </Link></span>
                                                                        </div>
                                                                    </div>
                                                                    <span className="biding-price d-flex-center text-white"> {/*  #556 */} </span>
                                                                </div>
                                                                <hr />
                                                                <div className="action-wrapper d-flex-between border-0 pb-4">
                                                                    <span className="biding-price d-flex-center  text-white">{item?.price}</span>
                                                                    <span className="biding-price d-flex-center  text-white">{item?.wallet_network}</span>
                                                                </div>
                                                            </div>
                                                            {/* <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit" className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Rent now </span> </Link> */}
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
        </>
    )
}

export default SearchPage