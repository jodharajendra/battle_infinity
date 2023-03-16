import React, { useEffect, useState, useContext, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Select from 'react-select'
import NftRentcoustamPage from "../../../customComponent/NftRentcoustamPage";
import TrendingCollections from "../../../customComponent/TrendingCollections";
import LatestTraded from "../../../customComponent/LatestTraded";
import "jquery-nice-select";
import { $ } from "react-jquery-plugin";
import { useAccount } from 'wagmi'
import { ProfileContext } from "../../../context/ProfileProvider";
import { Link, useNavigate } from "react-router-dom";

import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";

const LandingPage = () => {
  const [profileState, updateProfileState] = useContext(ProfileContext);
  const navigate = useNavigate();

  const [collectionStateData, setCollectionStateData] = useState([]);
  const { address, isConnecting, isDisconnected } = useAccount()
  const [userDetails, setUserDetails] = useState([])
  const [collectedNftList, setCollectedNftList] = useState([])
  const [favouriteDataWallet, setFavouriteDataWallet] = useState([])
  const [createdNftData, setCreatedNftData] = useState([])

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
    // infinite: true,
    // speed: 500,
    // slidesToShow: 1,
    // slidesToScroll: 1
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

  const [collectionData, setCollectionData] = useState([]);


  useEffect(() => {
    mycollections();
  }, []);



  const mycollections = async () => {
    await AuthService.mycollections1().then(async result => {
      if (result.success) {
        setCollectionData(result?.data?.reverse())
        // alertSuccessMessage(result?.message);
      } else {
        // alertErrorMessage(result?.message);
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
          setUserDetails(result.data);
          setFavouriteDataWallet(result?.data?.wallet_address)
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


  useEffect(() => {
    mycollectionsNew();
}, []);

const [collectionDataPopular, setCollectionDataPopular] = useState([]);

let dataLIMIT = +4

const mycollectionsNew = async () => {
    await AuthService.mycollections1(dataLIMIT).then(async result => {
        if (result.success) {
            setCollectionDataPopular(result?.data?.popular.reverse());
            // alertSuccessMessage(result?.message);
        } else {
            // alertErrorMessage(result?.message);
        }
    });
}

  return (
    <>

      {/* < !--Start banner area-- > */}
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
                {/* <!-- slide --> */}
                <div className="nft-item-card" >
                  <div className="single-item-history d-flex-center ">
                    <Link to="/profile" className="avatar">
                      <img src="images/popular/small/2.png" alt="history" />
                    </Link>
                    {/* <!-- end avatar --> */}
                    <div className="content">
                      <h3>Night City</h3>
                      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industr...</p>
                      <Link to="#" className="btn btn-outline btn-white" ><span>CHECK COLLECTION</span></Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- slide --> */}
              <div className="main_img_slide" >
                <img src="images/banners/banner_1.png" className="img-fluid hero_b_img" />
                <div className="nft-item-card" >
                  <div className="single-item-history d-flex-center ">
                    <Link to="/profile" className="avatar">
                      <img src="images/popular/small/3.png" alt="history" />
                    </Link>
                    {/* <!-- end avatar --> */}
                    <div className="content">
                      <h3>Night City</h3>
                      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industr...</p>
                      <Link to="#" className="btn btn-outline btn-white" ><span>CHECK COLLECTION</span></Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- slide --> */}
              <div className="main_img_slide" >
                <img src="images/banners/banner_1.png" className="img-fluid hero_b_img" />
                <div className="nft-item-card" >
                  <div className="single-item-history d-flex-center ">
                    <Link to="/profile" className="avatar">
                      <img src="images/popular/small/4.png" alt="history" />
                    </Link>
                    {/* <!-- end avatar --> */}
                    <div className="content">
                      <h3>Night City</h3>
                      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industr...</p>
                      <Link to="#" className="btn btn-outline btn-white" ><span>CHECK COLLECTION</span></Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- slide --> */}
              <div className="main_img_slide" >
                <img src="images/banners/banner_1.png" className="img-fluid hero_b_img" />
                <div className="nft-item-card" >
                  <div className="single-item-history d-flex-center ">
                    <Link to="/profile" className="avatar">
                      <img src="images/popular/small/5.png" alt="history" />
                    </Link>
                    {/* <!-- end avatar --> */}
                    <div className="content">
                      <h3>Night City</h3>
                      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industr...</p>
                      <Link to="#" className="btn btn-outline btn-white" ><span>CHECK COLLECTION</span></Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- slide --> */}
              <div className="main_img_slide" >
                <img src="images/banners/banner_1.png" className="img-fluid hero_b_img" />
                <div className="nft-item-card" >
                  <div className="single-item-history d-flex-center ">
                    <Link to="/profile" className="avatar">
                      <img src="images/popular/small/6.png" alt="history" />
                    </Link>
                    {/* <!-- end avatar --> */}
                    <div className="content">
                      <h3>Night City</h3>
                      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industr...</p>
                      <Link to="#" className="btn btn-outline btn-white" ><span>CHECK COLLECTION</span></Link>
                    </div>
                  </div>
                </div>
              </div>
            </Slider>

          </div>
        </div>
      </section>
      {/* <!--End banner area-- > */}





      <TrendingCollections />



      {/* <NftRentcoustamPage /> */}


      {/* < !--Start Explore-- > */}
      <section className="pt-120 pb-90 masonary-wrapper-activation p_collection">
        <div className="container">
          <div className="section-title section-title-flex">
            <h2>Popular Collection</h2>
            {/* <div className="flex_filter" >
              <div className="filter-select-option border-gradient">
                <Select options={options} />
              </div>
              <div className="filter-select-option ms-2 border-gradient">
                <Select options={optionsTwo} />
              </div>
            </div> */}
          </div>
          <div className="row" >
            {collectionDataPopular.length > 0
              ? collectionDataPopular.map((item, index) => (
                <div className="col-lg-4 col-md-6" >
                  <div className="top-seller-style-two d-flex-between pc_list">
                    <div className="d-flex-center">
                      <span className="me-3 sr_no" >{++index}</span>
                      <div className="thumb-wrapper">
                        <Link to="#" className="thumb">
                          <img src={`${ApiConfig.baseUrl + item?.logo}`} alt="top sellter" />
                        </Link>
                      </div>
                      {/* <!-- End .thumb-wrapper --> */}

                      {/* <!-- End .thumb -->/ */}
                      <div className="content">
                        <h4 className="title pb-1"><Link to="#">{item?.name}</Link></h4>
                        <span className="price text-white"> <span>Floor Price :</span> <img src="images/eth.png" /> <span>0.32</span></span>
                      </div>
                      {/* <!-- End .content -->/ */}
                    </div>
                    {/* <!-- End .d-flex-center --> */}
                    <div className="pc_prices text-end" >
                      {/* <div className="text-success fw-500 mb-2" >+67.80%</div> */}
                      <span className="price text-white"> <span>Vol.</span> <img src="images/eth.png" /> <span>365.3</span></span>
                    </div>
                  </div>
                </div>
              ))
              : null}
          </div>


        </div>
      </section>
      {/* <!-- End .section-title --> */}

      {/* Popular Collection Start */}



      {/* Popular Collection End */}




      {/* < !--Start Live Auction-- > */}
      <LatestTraded />


      {/* <!-- Place a bit Modal --> */}
      <div class="modal fade" id="placeBit" tabindex="-1" aria-labelledby="make_offoer_modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header no-border flex-column px-8">
              <h3 class="modal-title" id="make_offoer_modalLabel">Make an offer</h3>
              <button type="button" class="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close"><i
                class="ri-close-fill"></i></button>
            </div>
            {/* <!-- End modal-header --> */}
            <div class="modal-body px-8 ">
              <div class="single-item-history d-flex-center no-border">
                <Link to="#" class="avatar">
                  <img src="images/popular/small/4.png" alt="history" />
                </Link>
                {/* <!-- end avatar --> */}
                <div class="content">
                  <p class="text-white">Exclusive Samurai Club #24472<br />
                    <small>Exclusive Samurai Club</small>
                  </p>
                </div>
                <span class="date align-self-center text-end">0.000255 ETH <br /> <small>$1,091.98</small></span>
              </div>




              <form action="#">

                {/* <!-- End .form-group --> */}


                {/* <!-- End .form-group --> */}
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
            {/* <!-- End modal-body --> */}
            <div class="modal-footer no-border px-8 pb-5">
              <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" data-bs-dismiss="modal"
                data-bs-toggle="modal" data-bs-target="#popup_bid_success" aria-label="Close"><span>Make An offer</span></button>
            </div>
            {/* <!-- End .modal-footer --> */}
          </div>
          {/* <!-- End .modal-content --> */}
        </div>
      </div>
      {/* <!-- End Place a bit Modal --> */}
    </>

  );
}

export default LandingPage;