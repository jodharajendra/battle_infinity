import React, { useEffect, useState, useContext, useRef } from "react";
import AuthService from "../../api/services/AuthService";
import { ApiConfig } from "../../api/apiConfig/apiConfig";
import { Link, useNavigate } from "react-router-dom";
import LoaderHelper from "../Loading/LoaderHelper";
import { alertErrorMessage } from "../../customComponent/CustomAlertMessage";


const LatestTraded = () => {
    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();


    useEffect(() => {
        mycollectionsNew();
    }, []);

    const [collectionDataLatest, setCollectionDataLatest] = useState([]);
    const [collectionLength, setCollectionLength] = useState([]);
    const [newNftDetailsData, setNewNftDetailsData] = useState([]);

    const [clicks, setClicks] = useState(4);

    const mycollectionsNew = async () => {
        // LoaderHelper.loaderStatus(true);
        await AuthService.mycollections1(clicks).then(async result => {
            if (result.success) {
                LoaderHelper.loaderStatus(false);
                setClicks(clicks + 4);
                setCollectionDataLatest(result?.data?.latest_traded?.data.reverse());
                setCollectionLength(result?.data?.latest_traded?.total);
            }
            else {
                LoaderHelper.loaderStatus(false);
            }
        });
    }



   


    const handleNftDetails = async (nftID) => {
        await AuthService.getNftDetails(nftID).then(async result => {
            if (result.success) {
                try {
                    setNewNftDetailsData(result?.data)
                    nextPageLatest(result?.data);
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }

    const nextPageLatest = (data) => {
        navigate('/latest_trade', { state: data });
      };


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
                                        <Link to="#">
                                            <div className="ratio ratio-1x1" >
                                                <img src={`${ApiConfig.baseUrl + item?.nft_details?.file}`} alt="nft live auction thumbnail" />
                                            </div>
                                        </Link>
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
                                    </div>
                                    <Link onClick={() => handleNftDetails(item?.nft_details?._id)} className="btn  btn-block btn-gradient w-100 text-center btn-small"><span>NFT Detail </span> </Link>
                                </div>
                            </div>
                        ))
                        : null}
                </div>
                {
                    collectionDataLatest.length > 0 ?

                        <>
                            {
                                collectionLength === collectionDataLatest.length ? '' :
                                    <div className="row">
                                        <div className="col-12 text-center mt-4">
                                            <Link to="#" className="btn btn-outline border-gradient px-8" onClick={mycollectionsNew}><span><i className="ri-loader-4-fill"></i> Load More</span></Link>
                                        </div>
                                    </div>
                            }
                        </>

                        :
                        ''
                }

            </div>
        </section>

    )
}

export default LatestTraded