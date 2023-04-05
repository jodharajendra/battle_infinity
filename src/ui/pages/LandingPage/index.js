import React, { useEffect, useState, useContext, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Select from 'react-select'
import TrendingCollections from "../../../customComponent/TrendingCollections";
import LatestTraded from "../../../customComponent/LatestTraded";
import "jquery-nice-select";
import { $ } from "react-jquery-plugin";
import { useAccount } from 'wagmi'
import { ProfileContext } from "../../../context/ProfileProvider";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";
const LandingPage = () => {

  const [profileState, updateProfileState] = useContext(ProfileContext);
  const navigate = useNavigate();

  const options = [
    { value: 'Last 24 hours', label: 'Last 24 hours' },
    { value: '1 Day ago', label: '1 Day ago' },
    { value: '2 Day ago', label: '2 Day ago' },
    { value: 'Last Week', label: 'Last Week' },
    { value: 'Last Month', label: 'Last Month' }
  ]
  const optionsTwo = [
    { value: 'View Ranking', label: 'View Ranking' },
    { value: 'View Ranking', label: 'View Ranking' },
    { value: 'View Ranking', label: 'View Ranking' }
  ]

  var settings = {
    dots: false,
    fade: true,
  };

  const handleLogOut = () => {
    updateProfileState({});
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  }
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollTop()
  }, []);

  const scrollTop = () => {
    messagesEndRef?.current?.scrollIntoView(true)
  }


  useEffect(() => {
    mycollections();
  }, []);

  const mycollections = async () => {
    await AuthService.mycollections1().then(async result => {
      if (result.success) {
        // setCollectionData(result?.data?.reverse())
      }
    });
  }

  const handleuserProfile = async () => {
    await AuthService.getUserDetails().then(async result => {
      if (result.success) {
        if (!result?.data?.wallet_address) {
          $("#yesnoalertmodal").modal('show');
        }
        try {
          // setFavouriteDataWallet(result?.data?.wallet_address)
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
        handleLogOut();
      }
    });
  }

  useEffect(() => {
    mycollectionsNew();
  }, []);

  const [collectionDataPopular, setCollectionDataPopular] = useState([]);
  const [collectionDataTrending, setCollectionDataTrending] = useState([]);

  let dataLIMIT = +1000

  const mycollectionsNew = async () => {
    await AuthService.mycollections1(dataLIMIT).then(async result => {
      if (result.success) {
        setCollectionDataPopular(result?.data?.popular);
        setCollectionDataTrending(result?.data?.trending);
      }
    });
  }

  // const handleCollectionDetail = async (_id) => {
  //   window.location.replace(`collection_details?id=${_id}`);
  // }


  return (
    <div>
      <section className="hero-banner-style hero-banner-style-2  bg-3 bg-image top-section-gap " ref={messagesEndRef}>
        <div className="hero-banner_inner">
          <div className="container">
            <div className="banner-content text-center">
              <h1 className="mb-6 title">
                <img className="shape shape-6 rotate-360" src="images/shape/6.png" alt="shape" />
                <img className="shape shape-6a " src="images/shape/6a.png" alt="shape" />
                Sell, buy, discover <br /> and collect <em className="spc_txt" >NFT  <img className="shape shape-6b " src="images/shape/6b.svg" alt="shape" /> </em>
              </h1>
            </div>


            <Slider className="slider main_slider slick-arrow-between" {...settings}>              
                  <div className="main_img_slide" >
                    <img src="images/banners/banner_1.png" className="img-fluid hero_b_img" />
                    <div className="nft-item-card" >
                      <div className="single-item-history d-flex-center ">
                        <div className="avatar">                         
                              <img src="images/popular/small/2.png" />                              
                        </div>
                        <div className="content">
                          <h3>Test Collection</h3>
                          <p>Spread Some Words about your token Collection ...</p>
                          <Link to='/explore_collections' className="btn btn-outline btn-white" ><span>CHECK COLLECTION</span></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="main_img_slide" >
                    <img src="images/banners/banner_1.png" className="img-fluid hero_b_img" />
                    <div className="nft-item-card" >
                      <div className="single-item-history d-flex-center ">
                        <div className="avatar">                         
                              <img src="images/popular/small/5.png" />                              
                        </div>
                        <div className="content">
                          <h3>Battle Infinity</h3>
                          <p>Expole Collection ...</p>
                          <Link to='/explore_collections' className="btn btn-outline btn-white" ><span>CHECK COLLECTION</span></Link>
                        </div>
                      </div>
                    </div>
                  </div>
              
            </Slider>

            {/* <Slider className="slider main_slider slick-arrow-between" {...settings}>
              {collectionDataTrending.length > 0
                ? collectionDataTrending.map((item, index) => (
                  <div className="main_img_slide" >

                    <img src="images/banners/banner_1.png" className="img-fluid hero_b_img" />
                    <div className="nft-item-card" >
                      <div className="single-item-history d-flex-center ">
                        <div className="avatar">
                          {
                            !item?.collection_details?.logo ?
                              <img src="images/popular/small/2.png" />
                              :
                              <img src={`${ApiConfig.baseUrl + item?.collection_details?.logo}`} />
                          }
                        </div>
                        <div className="content">
                          <h3>{item?.collection_details?.name}</h3>
                          <p>{item?.collection_details?.description}...</p>
                          <Link to={`collection_details?id=${item?.collection_details?._id}`} className="btn btn-outline btn-white" ><span>CHECK COLLECTION</span></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                : null}
            </Slider> */}

          </div>
        </div>
      </section>

      <TrendingCollections />

      <section className="pt-120 pb-90 masonary-wrapper-activation p_collection">
        <div className="container">
          <div className="section-title section-title-flex">
            <h2>Popular Collection</h2>
          </div>
          <div className="row" >
            {collectionDataPopular.length > 0
              ? collectionDataPopular.map((item, index) => (
                <div className="col-lg-4 col-md-6" >
                  <div className="top-seller-style-two d-flex-between pc_list">
                    <div className="d-flex-center">
                      <span className="me-3 sr_no" >{++index}</span>
                      <div className="thumb-wrapper">
                        <Link to={`collection_details?id=${item?._id}`} className="thumb">
                          <img src={`${ApiConfig.baseUrl + item?.logo}`} alt="top sellter" />
                        </Link>
                      </div>
                      <div className="content">
                        <h4 className="title pb-1"><Link to={`collection_details?id=${item?._id}`}>{item?.name}</Link></h4>
                        <span className="price text-white"> <span>Floor Price :</span> <img src="images/eth.png" /> <span>0</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
              : null}
          </div>
        </div>
      </section>

      <LatestTraded />

    </div>
  );
}

export default LandingPage;