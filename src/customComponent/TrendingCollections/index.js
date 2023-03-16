import React, { useRef, useEffect, useState, useContext } from "react";

import { Link } from "react-router-dom";
import Slider from "react-slick";
import AuthService from "../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../customComponent/CustomAlertMessage";
import { ApiConfig } from "../../api/apiConfig/apiConfig";

const TrendingCollections = () => {

 
    const [collectionDataTrending, setCollectionDataTrending] = useState([]);


    var settingstwo = {
        adaptiveHeight: true,
        variableWidth: true,
        centerPadding: 0,
        slidesToShow: 1,
        slidesToScroll: 1,
        draggable: true,
        slidesToShow: 2,
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



    useEffect(() => {
        mycollections();
    }, []);

let dataLIMIT = +4

    const mycollections = async () => {
        await AuthService.mycollections1(dataLIMIT).then(async result => {
            if (result.success) {
                setCollectionDataTrending(result?.data?.trending.reverse());
                // alertSuccessMessage(result?.message);
            } else {
                // alertErrorMessage(result?.message);
            }
        });
    }

  

    const handleProceed = (id) => {
        window.location.replace(`collection_details?id=${id}`);
    };

    return (
        <>
            {/* < !--Start Popular Collection-- > */}
            <section className="section-bg-separation-2 ptb-120">
                <div className="container">
                    <div className="section-title">
                        <h2>Trending Collections</h2>
                    </div>
                    <div className="slider popular-collection-active slick-gutter-15 slick-arrow-between">
                        <Slider {...settingstwo}>

                            {collectionDataTrending.length > 0
                                ? collectionDataTrending.map((item) => (
                                    <>
                                        <div className="popular-collection-style-one border-gradient">
                                            <Link onClick={() => handleProceed(item?.id)}  >
                                                {item?.collection_details?.banner_image ? <img src="images/collection/tc_1.png" alt="popular collection" /> :
                                                    <div className="large-thumbnail ratio ratio-16x9"> <img src={`${ApiConfig.baseUrl + item?.collection_details?.banner_image}`} /></div>
                                                }
                                            </Link>
                                            <div className="content content-flex p-4">
                                                {!item?.collection_details?.logo ? <img src="images/popular/small/2.png" className="avatar avatar_72" alt="history" /> :
                                                    <Link to="#" className="avatar avatar_72" tabindex="0">
                                                        <img src={`${ApiConfig.baseUrl + item?.collection_details?.logo}`} className="img-fluid" />
                                                    </Link>
                                                }
                                                <div className="inner">
                                                    <h4 className="title ">
                                                        <Link className="d-flex align-items-center" onClick={() => handleProceed(item?.id)}>
                                                            {item?.collection_details?.name}
                                                            {/* <img src="images/verified.png" className="img-fluid verify_img" /> */}
                                                        </Link>
                                                    </h4>
                                                    <span><Link to="/profile" className="text-secondry">{item?.collection_details?.name}</Link></span>
                                                </div>
                                            </div>
                                        </div>
                                    </>

                                ))
                                : null}

                        </Slider>
                    </div>
                </div>
            </section>
            {/* <!-- Start Popular Collection --> */}



            {/* {collectionData.length > 0
                ? collectionData.map((item) => (

                    'cv'



                ))
                : null} */}


        </>
    )
}

export default TrendingCollections;