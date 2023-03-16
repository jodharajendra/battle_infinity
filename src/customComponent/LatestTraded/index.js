import React, { useEffect, useState, useContext, useRef } from "react";
import AuthService from "../../api/services/AuthService";
import { ApiConfig } from "../../api/apiConfig/apiConfig";
import { Link } from "react-router-dom";

const LatestTraded = () => {
    useEffect(() => {
        mycollectionsNew();
    }, []);

    const [collectionDataLatest, setCollectionDataLatest] = useState([]);
    const [collectionDataPopular, setCollectionDataPopular] = useState([]);

    let dataLIMIT = +4

    const mycollectionsNew = async () => {
        await AuthService.mycollections1(dataLIMIT).then(async result => {
            if (result.success) {
                setCollectionDataLatest(result?.data?.latest_traded?.data.reverse());
                setCollectionDataPopular(result?.data?.popular.reverse());
                // alertSuccessMessage(result?.message);
            } else {
                // alertErrorMessage(result?.message);
            }
        });
    }
    let dataLIMITNew = +8

    const mycollectionsLoadMore = async () => {
        await AuthService.mycollections1(dataLIMITNew).then(async result => {
            if (result.success) {
                setCollectionDataLatest(result?.data?.latest_traded?.data.reverse());
                setCollectionDataPopular(result?.data?.popular.reverse());
                // alertSuccessMessage(result?.message);
            } else {
                // alertErrorMessage(result?.message);
            }
        });
    }

    return (

        <section className="ptb-100 live-auction">
            <div className="container">
                <div className="section-title">
                    <h2>Latest Traded Items</h2>
                </div>
                <div className="row">
                    {collectionDataLatest.length > 0
                        ? collectionDataLatest.map((item, index) => (
                            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  mb-6">
                                <div className="explore-style-one explore-style-overlay border-gradient">
                                    <div className="thumb">
                                        <Link to="#"><img src={`${ApiConfig.baseUrl + item?.nft_details?.file}`} alt="nft live auction thumbnail" /></Link>
                                    </div>
                                    <div className="content px-4">
                                        <div className="d-flex-between align-items-center" >
                                            <div>
                                                <div className="header d-flex-between pt-4 pb-2">
                                                    <h3 className="title"><Link to="#">{item?.nft_details?.name}</Link></h3>
                                                </div>
                                                <div className="product-owner d-flex-between">
                                                    <span className="bid-owner text-secondry d-flex align-items-center">
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="biding-price d-flex-center text-white">{item?.nft_details?.price} </span>
                                        </div>
                                        <hr />
                                    </div>
                                    <Link to="/profile" className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Rent now </span> </Link>
                                </div>
                            </div>
                        ))
                        : null}
                </div>
                <div className="row">
                    <div className="col-12 text-center mt-4">
                        <Link to="#" className="btn btn-outline border-gradient px-8" onClick={mycollectionsLoadMore}><span><i className="ri-loader-4-fill"></i> Load More</span></Link>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default LatestTraded