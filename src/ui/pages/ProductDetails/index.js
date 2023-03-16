import React from "react";
import { Link } from "react-router-dom";
import Select from 'react-select'


const ProductDetails = () => {

    const options = [
        { value: 'Sales', label: 'Sales' },
        { value: 'treding', label: 'Listings' },
        { value: 'Offers', label: 'Offers' },
        { value: 'Collectionoffers', label: 'Collection offers' },
        { value: 'Transfers', label: 'Transfers' },
    ]

    const optionCoins = [
        { value: 'ETH', label: 'ETH' },
        { value: 'USDT', label: 'USDT' },
        { value: 'ERC', label: 'ERC' },
        { value: 'BTC', label: 'BTC' },
    ]


    return (
        <>
            <div className="page_wrapper">
                {/* <!-- Start Product Details Area --> */}
                <section className="product-details section-bg-separation-2 pt-125 pb-90">
                    <div className="container">
                        <div className="row">
                            <div className="col-xxl-5 col-lg-6 mb-6">
                                <div className="custom-tab-content p-0 explore-style-one">
                                    <div className="thumb-header">
                                        <button className="reaction-btn liked"><span>12</span><i className="ri-heart-line"></i></button>
                                        <button className="reaction-btn total-watch left" data-bs-toggle="tooltip" data-bs-placement="top"
                                            title="Total Watch"><img src="images/eth_white.svg" width="22" height="22" /></button>
                                    </div>
                                    <div className="thumb">
                                        <img className="img-fluid" src="images/explore/single.jpg" alt="prodcut" />

                                        {/* <!-- </div> --> */}
                                        {/* <!-- End .count-down --> */}

                                        {/* <!-- End .reaction-count --> */}
                                    </div>
                                    {/* <!-- End .thumb --> */}
                                </div>
                                {/* <!-- End .explore-style-one --> */}
                            </div>
                            {/* <!-- End col --> */}

                            <div className="col-xxl-7 col-lg-6 mb-6 mb-6">
                                <div className="details-content">
                                    <div className="d-flex-between">
                                        <Link className="" to="#"> Samurai</Link>
                                        <div className="user_control m-0">
                                            <ul className="nav">
                                                <li className="dropdown">
                                                    <Link className="btn-icon" to="#" role="button" id="dropdownMenuLink1" data-bs-toggle="dropdown"
                                                        aria-expanded="false">
                                                        <i className="ri-share-fill"></i>
                                                    </Link>
                                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink1">
                                                        <li><Link className="dropdown-item" to="#"><i className="ri-file-copy-fill me-2"></i> Copy Link</Link></li>
                                                        <li><Link className="dropdown-item" to="#"><i className="ri-facebook-circle-fill me-2"></i> Share on
                                                            Facebook</Link></li>
                                                        <li><Link className="dropdown-item" to="#"> <i className="ri-twitter-fill me-2"></i> Share On Twitter</Link>
                                                        </li>
                                                        <li><Link className="dropdown-item" to="#"> <i className="ri-whatsapp-fill me-2"></i> Share On
                                                            Whatsapp</Link></li>
                                                    </ul>
                                                </li>
                                                <li className="dropdown">
                                                    <Link className="btn-icon" to="#" role="button" id="dropdownMenuLink2" data-bs-toggle="dropdown"
                                                        aria-expanded="false">
                                                        <i className="ri-more-fill"></i>
                                                    </Link>
                                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                                                        <li><Link className="dropdown-item" to="#"> <i className="ri-settings-3-line me-2"></i> Settings</Link></li>
                                                        <li><Link className="dropdown-item" to="#"> <i className="ri-list-check-2 me-2"></i> Featured items</Link>
                                                        </li>
                                                        <li><Link className="dropdown-item" to="#"> <i className="ri-flag-fill me-2"></i> Report</Link></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    {/* <!-- End .avatar-info-wrapper --> */}
                                    <h2 className="main_title mb-0">#24472</h2>
                                    <p className="subtitle">Owned by <Link to="#">eew..#fe</Link> </p>
                                    <div className="view_count d-flex-center"> <i className="ri-eye-line me-2"></i> 356k View</div>
                                    <div className="custom-tab-content mt-7">
                                        <div className="sale_counter">
                                            <p className="m-0">Sale ends November 18, 2022 at 6:27 Pm</p>
                                            <div id="timer">
                                                <div className="dts me-3" id="days"></div>
                                                <div className="dts me-3" id="hours"></div>
                                                <div className="dts me-3" id="minutes"></div>
                                                <div className="dts" id="seconds"></div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="bid_price">
                                            <div className="row gx-0 align-items-center">
                                                <div className="col-sm-5">
                                                    <p className="mb-1">Current Bid</p>
                                                    <h3 className="">0.008 ETH <sub>$9.78</sub></h3>
                                                </div>
                                                <div className="col-sm-7">
                                                    <div className="bid-card border-gradient box-shadow">
                                                        <p className="mb-1">Current Bid</p>
                                                        <h3 className="">0.008 ETH <sub>$9.78</sub></h3>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <Link data-bs-toggle="modal" data-bs-target="#placeBit" to="#"
                                                        className="btn  btn-lg btn-gradient w-100 justify-content-center mt-6 "> <span> make a bid
                                                        </span></Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- End col --> */}
                        </div>
                        {/* <!-- ENd .row --> */}
                        <div className="row">
                            <div className="col-xxl-5 col-lg-6">
                                <div className="list_card border-gradient mb-6 p-0  no-shadow">
                                    <div className="list-header d-flex-between">
                                        <p className="mb-0  d-flex-center"><i className="ri-file-list-line me-3"></i> Description</p>
                                    </div>
                                    <div className="list-body border-top">
                                        <p className="mb-0">By <strong><Link to="#"> TheMonkeyFaceMan </Link></strong></p>
                                        <p className="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                                            has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                                            galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                                            but also the leap into electronic typesetting, remaining essentially unchanged</p>
                                    </div>
                                    <div className="accordion" id="accordionnft_details">
                                        <div className="accordion-item">
                                            <p className="accordion-header" id="Properties">
                                                <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                                    data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    <i className="ri-bookmark-fill me-3"></i> Properties
                                                </button>
                                            </p>
                                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="Properties"
                                                data-bs-parent="#accordionnft_details">
                                                <div className="accordion-body py-5px px-0">
                                                    <div className="sc_sec">
                                                        <Link to="#" className="sc_card border-gradient">
                                                            <div className="sc_body">
                                                                <div className="sc_sub">SAMURAI EYES</div>
                                                                <p className="sc_title">Orange</p>
                                                                <span className="sc_footer">6% have this trait</span>
                                                            </div>
                                                        </Link>
                                                        <Link to="#" className="sc_card border-gradient">
                                                            <div className="sc_body">
                                                                <div className="sc_sub">SAMURAI EYES</div>
                                                                <p className="sc_title">Orange</p>
                                                                <span className="sc_footer">6% have this trait</span>
                                                            </div>
                                                        </Link>
                                                        <Link to="#" className="sc_card border-gradient">
                                                            <div className="sc_body">
                                                                <div className="sc_sub">SAMURAI EYES</div>
                                                                <p className="sc_title">Orange</p>
                                                                <span className="sc_footer">6% have this trait</span>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                    <div className="sc_sec">
                                                        <Link to="#" className="sc_card border-gradient">
                                                            <div className="sc_body">
                                                                <div className="sc_sub">SAMURAI EYES</div>
                                                                <p className="sc_title">Orange</p>
                                                                <span className="sc_footer">6% have this trait</span>
                                                            </div>
                                                        </Link>
                                                        <Link to="#" className="sc_card border-gradient">
                                                            <div className="sc_body">
                                                                <div className="sc_sub">SAMURAI EYES</div>
                                                                <p className="sc_title">Orange</p>
                                                                <span className="sc_footer">6% have this trait</span>
                                                            </div>
                                                        </Link>
                                                        <Link to="#" className="sc_card border-gradient">
                                                            <div className="sc_body">
                                                                <div className="sc_sub">SAMURAI EYES</div>
                                                                <p className="sc_title">Orange</p>
                                                                <span className="sc_footer">6% have this trait</span>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                    <div className="sc_sec">
                                                        <Link to="#" className="sc_card border-gradient">
                                                            <div className="sc_body">
                                                                <div className="sc_sub">SAMURAI EYES</div>
                                                                <p className="sc_title">Orange</p>
                                                                <span className="sc_footer">6% have this trait</span>
                                                            </div>
                                                        </Link>
                                                        <Link to="#" className="sc_card border-gradient">
                                                            <div className="sc_body">
                                                                <div className="sc_sub">SAMURAI EYES</div>
                                                                <p className="sc_title">Orange</p>
                                                                <span className="sc_footer">6% have this trait</span>
                                                            </div>
                                                        </Link>
                                                        <Link to="#" className="sc_card border-gradient">
                                                            <div className="sc_body">
                                                                <div className="sc_sub">SAMURAI EYES</div>
                                                                <p className="sc_title">Orange</p>
                                                                <span className="sc_footer">6% have this trait</span>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <p className="accordion-header" id="About_acc">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                    data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                    <i className="ri-list-check-2 me-3"></i> About Samurai Club
                                                </button>
                                            </p>
                                            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="About_acc"
                                                data-bs-parent="#accordionnft_details">
                                                <div className="accordion-body">
                                                    <strong>This is the second item's accordion body.</strong> It is hidden by default, until the
                                                    collapse plugin adds the appropriate classNamees that we use to style each element. These classNamees
                                                    control the overall appearance, as well as the showing and hiding via CSS transitions. You can
                                                    modify any of this with custom CSS or overriding our default variables. It's also worth noting
                                                    that just about any HTML can go within the <code>.accordion-body</code>, though the transition
                                                    does limit overflow.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <p className="accordion-header" id="DetailsAcc">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                    data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                    <i className="ri-list-unordered me-3"></i> Details
                                                </button>
                                            </p>
                                            <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="DetailsAcc"
                                                data-bs-parent="#accordionnft_details">
                                                <div className="accordion-body">
                                                    <ul className="sc_list">
                                                        <li>Contract address <span><Link to="#">0xjhgdjh...5645d1d</Link></span></li>
                                                        <li>Token ID <span><Link to="#">485484848...</Link></span></li>
                                                        <li>Token Standard <span>THG-556</span></li>
                                                        <li>Chain <span>BSC</span></li>
                                                        <li>Metadata <span>centralized</span></li>
                                                        <li>Creator Fee <span>2%</span></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-7 col-lg-6">
                                <div className="list_card border-gradient mb-6 p-0  no-shadow">
                                    <div className="accordion" id="accordionnft_ph_history">
                                        <div className="accordion-item">
                                            <p className="accordion-header" id="ph_history">
                                                <button className="accordion-button no-border" type="button" data-bs-toggle="collapse"
                                                    data-bs-target="#ph_historyOne" aria-expanded="true" aria-controls="ph_historyOne">
                                                    <i className="ri-bookmark-fill me-3"></i> Price History
                                                </button>
                                            </p>
                                            <div id="ph_historyOne" className="accordion-collapse collapse show" aria-labelledby="ph_history"
                                                data-bs-parent="#accordionnft_ph_history">
                                                <div className="accordion-body p-0">
                                                    <div className="py-5 text-center">
                                                        Chart is here..
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="list_card border-gradient mb-6 p-0  no-shadow">
                                    <div className="accordion" id="accordionnft_ph_Listings">
                                        <div className="accordion-item">
                                            <p className="accordion-header" id="ph_Listings">
                                                <button className="accordion-button no-border" type="button" data-bs-toggle="collapse"
                                                    data-bs-target="#ph_ListingsOne" aria-expanded="true" aria-controls="ph_ListingsOne">
                                                    <i className="ri-price-tag-3-fill me-3"></i> Listings
                                                </button>
                                            </p>
                                            <div id="ph_ListingsOne" className="accordion-collapse collapse show" aria-labelledby="ph_Listings"
                                                data-bs-parent="#accordionnft_ph_Listings">
                                                <div className="accordion-body p-0 px-3">
                                                    <div className="table-responsive">
                                                        <table className="table text-white table-mini ">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Price</th>
                                                                    <th scope="col">USD price</th>
                                                                    <th scope="col">Expiration</th>
                                                                    <th scope="col">from</th>
                                                                    <th scope="col"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>0.008 ETH</td>
                                                                    <td>$9.78</td>
                                                                    <td>about 23 hours</td>
                                                                    <td>eew..#fe</td>
                                                                    <td><button className="btn btn-gradient btn-theme px-4"> BUY </button></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="list_card border-gradient p-0  no-shadow">
                                    <div className="accordion" id="accordionnft_ph_Activity">
                                        <div className="accordion-item">
                                            <p className="accordion-header" id="ph_Activity">
                                                <button className="accordion-button no-border" type="button" data-bs-toggle="collapse"
                                                    data-bs-target="#ph_ActivityOne" aria-expanded="true" aria-controls="ph_ActivityOne">
                                                    <i className="ri-arrow-up-down-line me-3"></i> Item Activity
                                                </button>
                                            </p>
                                            <div id="ph_ActivityOne" className="accordion-collapse collapse show" aria-labelledby="ph_Activity"
                                                data-bs-parent="#accordionnft_ph_Listings">
                                                <div className="accordion-body p-0 px-3">
                                                    <div className="py-4 px-2">
                                                        <div className="filter-select-option border-gradient">
                                                            <Select options={options} className="w-100" />


                                                        </div>
                                                        <div className="iterfsh pb-0">
                                                            <div className="itfrsh_start">
                                                                <Link className="btn-sm btn-outline border-gradient me-2">
                                                                    <span>Sales <i className="ri-close-line ms-1 pe-0"></i></span>
                                                                </Link>
                                                                <Link to="#" className="text-white"> Clear all </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="table-responsive">
                                                        <table className="table text-white table-mini ">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Event</th>
                                                                    <th scope="col">Price</th>
                                                                    <th scope="col">From</th>
                                                                    <th scope="col">To</th>
                                                                    <th scope="col">Date</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <Link to="#" className="d-flex-center">
                                                                            <i className="ri-shopping-cart-fill me-2"></i>
                                                                            Sale
                                                                        </Link>
                                                                    </td>
                                                                    <td>2.500 ETH</td>
                                                                    <td><Link to="#">F044F5</Link></td>
                                                                    <td><Link to="#">F044F5</Link></td>
                                                                    <td>38 minutes ago</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <Link to="#" className="d-flex-center">
                                                                            <i className="ri-shopping-cart-fill me-2"></i>
                                                                            Minted
                                                                        </Link>
                                                                    </td>
                                                                    <td>2.500 ETH</td>
                                                                    <td><Link to="#">F044F5</Link></td>
                                                                    <td><Link to="#">F044F5</Link></td>
                                                                    <td>38 minutes ago</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <Link to="#" className="d-flex-center">
                                                                            <i className="ri-shopping-cart-fill me-2"></i>
                                                                            List
                                                                        </Link>
                                                                    </td>
                                                                    <td>2.500 ETH</td>
                                                                    <td><Link to="#">F044F5</Link></td>
                                                                    <td><Link to="#">F044F5</Link></td>
                                                                    <td>38 minutes ago</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- End .container --> */}
                </section>

                {/* <!-- Start Live Auction --> */}
                <section className="ptb-100 live-auction">
                    <div className="container">
                        <div className="section-title">
                            <h2>More from this collection</h2>
                        </div>
                        {/* <!-- End .section-title --> */}
                        <div className="row">
                            <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6  mb-6">
                                <div className="explore-style-one explore-style-overlay border-gradient">
                                    <div className="thumb">
                                        <Link to="product-details.html"><img src="images/explore/13.jpg" alt="nft live auction thumbnail" /></Link>

                                        {/* <!-- End .count-down --> */}

                                        {/* <!-- End .reaction-count --> */}
                                    </div>
                                    {/* <!-- End .thumb --> */}
                                    <div className="content px-4">
                                        <div className="d-flex-between align-items-center">
                                            <div>
                                                <div className="header d-flex-between pt-4 pb-2">
                                                    <h3 className="title"><Link to="product-details.html">God Watching</Link></h3>

                                                </div>
                                                {/* <!-- End product-share-wrapper --> */}
                                                <div className="product-owner d-flex-between">
                                                    <span className="bid-owner text-secondry d-flex align-items-center"><Link
                                                        to="author-profile.html">God’s world
                                                        <img src="images/verified.png" className="img-fluid verify_img" /></Link></span>
                                                </div>
                                            </div>
                                            <span className="biding-price d-flex-center text-white"> #556 </span>
                                        </div>
                                        <hr />
                                        {/* <!-- End .product-owner --> */}
                                        <div className="action-wrapper d-flex-between border-0 pb-4">
                                            <span className="biding-price d-flex-center  text-white">$ 5.05/ day</span>
                                            <span className="biding-price d-flex-center  text-white">Max: 10 days</span>
                                        </div>

                                        {/* <!-- action-wrapper --> */}
                                    </div>
                                    <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit"
                                        className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Rent now </span> </Link>
                                    {/* <!-- End .content --> */}
                                </div>
                            </div>
                            {/* <!-- End .col --> */}
                            <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6  mb-6">
                                <div className="explore-style-one explore-style-overlay border-gradient">
                                    <div className="thumb">
                                        <Link to="product-details.html"><img src="images/explore/13.jpg" alt="nft live auction thumbnail" /></Link>

                                        {/* <!-- End .count-down --> */}

                                        {/* <!-- End .reaction-count --> */}
                                    </div>
                                    {/* <!-- End .thumb --> */}
                                    <div className="content px-4">
                                        <div className="d-flex-between align-items-center">
                                            <div>
                                                <div className="header d-flex-between pt-4 pb-2">
                                                    <h3 className="title"><Link to="product-details.html">God Watching</Link></h3>

                                                </div>
                                                {/* <!-- End product-share-wrapper --> */}
                                                <div className="product-owner d-flex-between">
                                                    <span className="bid-owner text-secondry d-flex align-items-center"><Link
                                                        to="author-profile.html">God’s world
                                                        <img src="images/verified.png" className="img-fluid verify_img" /></Link></span>
                                                </div>
                                            </div>
                                            <span className="biding-price d-flex-center text-white"> #556 </span>
                                        </div>
                                        <hr />
                                        {/* <!-- End .product-owner --> */}
                                        <div className="action-wrapper d-flex-between border-0 pb-4">
                                            <span className="biding-price d-flex-center  text-white">$ 5.05/ day</span>
                                            <span className="biding-price d-flex-center  text-white">Max: 10 days</span>
                                        </div>

                                        {/* <!-- action-wrapper --> */}
                                    </div>
                                    <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit"
                                        className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Rent now </span> </Link>
                                    {/* <!-- End .content --> */}
                                </div>
                            </div>
                            {/* <!-- End .col --> */}
                            <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6  mb-6">
                                <div className="explore-style-one explore-style-overlay border-gradient">
                                    <div className="thumb">
                                        <Link to="product-details.html"><img src="images/explore/13.jpg" alt="nft live auction thumbnail" /></Link>

                                        {/* <!-- End .count-down --> */}

                                        {/* <!-- End .reaction-count --> */}
                                    </div>
                                    {/* <!-- End .thumb --> */}
                                    <div className="content px-4">
                                        <div className="d-flex-between align-items-center">
                                            <div>
                                                <div className="header d-flex-between pt-4 pb-2">
                                                    <h3 className="title"><Link to="product-details.html">God Watching</Link></h3>

                                                </div>
                                                {/* <!-- End product-share-wrapper --> */}
                                                <div className="product-owner d-flex-between">
                                                    <span className="bid-owner text-secondry d-flex align-items-center"><Link
                                                        to="author-profile.html">God’s world
                                                        <img src="images/verified.png" className="img-fluid verify_img" /></Link></span>
                                                </div>
                                            </div>
                                            <span className="biding-price d-flex-center text-white"> #556 </span>
                                        </div>
                                        <hr />
                                        {/* <!-- End .product-owner --> */}
                                        <div className="action-wrapper d-flex-between border-0 pb-4">
                                            <span className="biding-price d-flex-center  text-white">$ 5.05/ day</span>
                                            <span className="biding-price d-flex-center  text-white">Max: 10 days</span>
                                        </div>

                                        {/* <!-- action-wrapper --> */}
                                    </div>
                                    <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit"
                                        className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Rent now </span> </Link>
                                    {/* <!-- End .content --> */}
                                </div>
                            </div>
                            {/* <!-- End .col --> */}
                            <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6  mb-6">
                                <div className="explore-style-one explore-style-overlay border-gradient">
                                    <div className="thumb">
                                        <Link to="product-details.html"><img src="images/explore/13.jpg" alt="nft live auction thumbnail" /></Link>

                                        {/* <!-- End .count-down --> */}

                                        {/* <!-- End .reaction-count --> */}
                                    </div>
                                    {/* <!-- End .thumb --> */}
                                    <div className="content px-4">
                                        <div className="d-flex-between align-items-center">
                                            <div>
                                                <div className="header d-flex-between pt-4 pb-2">
                                                    <h3 className="title"><Link to="product-details.html">God Watching</Link></h3>

                                                </div>
                                                {/* <!-- End product-share-wrapper --> */}
                                                <div className="product-owner d-flex-between">
                                                    <span className="bid-owner text-secondry d-flex align-items-center"><Link
                                                        to="author-profile.html">God’s world
                                                        <img src="images/verified.png" className="img-fluid verify_img" /></Link></span>
                                                </div>
                                            </div>
                                            <span className="biding-price d-flex-center text-white"> #556 </span>
                                        </div>
                                        <hr />
                                        {/* <!-- End .product-owner --> */}
                                        <div className="action-wrapper d-flex-between border-0 pb-4">
                                            <span className="biding-price d-flex-center  text-white">$ 5.05/ day</span>
                                            <span className="biding-price d-flex-center  text-white">Max: 10 days</span>
                                        </div>

                                        {/* <!-- action-wrapper --> */}
                                    </div>
                                    <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit"
                                        className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Rent now </span> </Link>
                                    {/* <!-- End .content --> */}
                                </div>
                            </div>

                        </div>
                        {/* <!-- End .row --> */}
                    </div>
                    {/* <!-- End .container --> */}

                </section>
                {/* <!-- End Live Auction --> */}



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
                                        {/* <!-- end avatar --> */}
                                        <div className="content">
                                            <p>Bid accepted <span className="color-primary fw-500">12
                                                ETH</span> by <Link className="text-white" to="Profile.html">Zakson</Link></p>
                                            <span className="date">03/01/2022, 10:25</span>
                                        </div>
                                    </div>
                                    {/* <!-- End .single-item-history --> */}

                                    <div className="single-item-history d-flex-center">
                                        <Link to="#" className="avatar">
                                            <img src="images/popular/small/2.png" alt="history" />
                                            <i className="ri-check-line"></i>
                                        </Link>
                                        {/* <!-- end avatar --> */}
                                        <div className="content">
                                            <p>Bid accepted <span className="color-primary fw-500">15
                                                ETH</span> by <Link className="text-white" to="Profile.html">Smith</Link></p>
                                            <span className="date">02/01/2022, 10:55</span>
                                        </div>
                                    </div>
                                    {/* <!-- End .single-item-history --> */}

                                    <div className="single-item-history d-flex-center">
                                        <Link to="#" className="avatar">
                                            <img src="images/popular/small/3.png" alt="history" />
                                            <i className="ri-check-line"></i>
                                        </Link>
                                        {/* <!-- end avatar --> */}
                                        <div className="content">
                                            <p>Bid accepted <span className="color-primary fw-500">13
                                                ETH</span> by <Link className="text-white" to="Profile.html">Rion</Link></p>
                                            <span className="date">05/01/2022, 10:34</span>
                                        </div>
                                    </div>
                                    {/* <!-- End .single-item-history --> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End Bit History popup --> */}

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

                                <Link to="explore-filter-sidebar.html" className="btn btn-gradient btn-small w-100 justify-content-center">
                                    <span>Watch
                                        Other Listings</span></Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End Bit success popup --> */}

                {/* <!-- Place a bit Modal --> */}
                <div className="modal fade" id="placeBit" tabindex="-1" aria-labelledby="placeBitLaebl" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header no-border flex-column px-8">
                                <h3 className="modal-title" id="placeBitLaebl">Place a Bid</h3>
                                <button type="button" className="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close"><i
                                    className="ri-close-fill"></i></button>
                            </div>
                            {/* <!-- End modal-header --> */}
                            <div className="modal-body px-8 ">
                                <div className="single-item-history d-flex-center no-border">
                                    <Link to="#" className="avatar">
                                        <img src="images/popular/small/4.png" alt="history" />
                                    </Link>
                                    {/* <!-- end avatar --> */}
                                    <div className="content">
                                        <p className="text-white">Exclusive Samurai Club #24472 <br /> <Link className="text-white"
                                            to="Profile.html"><small>Exclusive Samurai Club</small></Link></p>
                                    </div>
                                    <span className="date align-self-center text-end">0.000255 ETH <br /> <small>$1,091.98</small></span>
                                </div>




                                <form action="#">

                                    {/* <!-- End .form-group --> */}


                                    {/* <!-- End .form-group --> */}
                                    <div className="list_card border-gradient no-shadow mb-4">
                                        <ul className="bidding-list p-0">
                                            <li> <span className="d-flex-center"><i className="ri-wallet-fill me-2"></i> You must bid at least:</span>
                                                <strong>12,00 ETH</strong></li>
                                            <li><span>Floor price</span> <strong>70 ETH</strong></li>
                                            <li><span>Best offer</span> <strong>12,70 ETH</strong></li>
                                        </ul>
                                    </div>
                                    <div className="form-group input-group">
                                        <input type="text" className="form-control" placeholder="Recipient's username"
                                            aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                        <Select options={optionCoins} />

                                    </div>
                                    <div className="d-flex-between mt-1">
                                        <small className="fw-normal">$1,091.98 Total</small>
                                        <small className="fw-normal">Total offer amount: 0.000255 ETH</small>
                                    </div>

                                </form>
                            </div>
                            {/* <!-- End modal-body --> */}
                            <div className="modal-footer no-border px-8 pb-5">
                                <button type="button" className="btn btn-gradient btn-lg w-100 justify-content-center" data-bs-dismiss="modal"
                                    data-bs-toggle="modal" data-bs-target="#popup_bid_success" aria-label="Close"><span>Place a
                                        bit</span></button>
                            </div>
                            {/* <!-- End .modal-footer --> */}
                        </div>
                        {/* <!-- End .modal-content --> */}
                    </div>
                </div>
                {/* <!-- End Place a bit Modal --> */}

            </div>
        </>
    )


}

export default ProductDetails