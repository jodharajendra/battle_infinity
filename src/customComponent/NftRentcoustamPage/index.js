import React, { useState } from "react";
import { Link } from "react-router-dom";

const NftRentcoustamPage = () => {
    const [isAuth, setIsAuth] = useState('0')
    const handleLoadMore = () => {
        setIsAuth('1')
    }
    const handleLoadMoreCancel = () => {
        setIsAuth('0')
    }

    return (
        <section className="ptb-100 live-auction">
            <div className="container">
                <div className="section-title">
                    <h2>NFTs for Rent</h2>
                </div>
                <div className="row">
                    <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  mb-6">
                        <div className="explore-style-one explore-style-overlay border-gradient">
                            <div className="thumb">
                                <Link to="/nft_details"><img src="images/explore/13.jpg" alt="nft live auction thumbnail" /></Link>
                            </div>
                            <div className="content px-4">
                                <div className="d-flex-between align-items-center" >
                                    <div>
                                        <div className="header d-flex-between pt-4 pb-2">
                                            <h3 className="title"><Link to="/nft_details">God Watching</Link></h3>
                                        </div>
                                        <div className="product-owner d-flex-between">
                                            <span className="bid-owner text-secondry d-flex align-items-center"><Link to="collection_details">God’s world
                                                <img src="images/verified.png" className="img-fluid verify_img" /></Link></span>
                                        </div>
                                    </div>
                                    <span className="biding-price d-flex-center text-white">  #556 </span>
                                </div>
                                <hr />
                                <div className="action-wrapper d-flex-between border-0 pb-4">
                                    <span className="biding-price d-flex-center  text-white">$ 5.05/ day</span>
                                    <span className="biding-price d-flex-center  text-white">Max: 10 days</span>
                                </div>
                            </div>
                            <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit" className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Rent now </span> </Link>
                        </div>
                    </div>
                    <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  mb-6">
                        <div className="explore-style-one explore-style-overlay border-gradient">
                            <div className="thumb">
                                <Link to="nft_details"><img src="images/explore/13.jpg" alt="nft live auction thumbnail" /></Link>
                            </div>
                            <div className="content px-4">
                                <div className="d-flex-between align-items-center" >
                                    <div>
                                        <div className="header d-flex-between pt-4 pb-2">
                                            <h3 className="title"><Link to="/nft_details">God Watching</Link></h3>
                                        </div>
                                        <div className="product-owner d-flex-between">
                                            <span className="bid-owner text-secondry d-flex align-items-center"><Link to="collection_details">God’s world
                                                <img src="images/verified.png" className="img-fluid verify_img" /></Link></span>
                                        </div>
                                    </div>
                                    <span className="biding-price d-flex-center text-white">  #556 </span>
                                </div>
                                <hr />
                                <div className="action-wrapper d-flex-between border-0 pb-4">
                                    <span className="biding-price d-flex-center  text-white">$ 5.05/ day</span>
                                    <span className="biding-price d-flex-center  text-white">Max: 10 days</span>
                                </div>
                            </div>
                            <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit" className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Rent now </span> </Link>
                        </div>
                    </div>
                    <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  mb-6">
                        <div className="explore-style-one explore-style-overlay border-gradient">
                            <div className="thumb">
                                <Link to="nft_details"><img src="images/explore/13.jpg" alt="nft live auction thumbnail" /></Link>
                            </div>
                            <div className="content px-4">
                                <div className="d-flex-between align-items-center" >
                                    <div>
                                        <div className="header d-flex-between pt-4 pb-2">
                                            <h3 className="title"><Link to="/nft_details">God Watching</Link></h3>
                                        </div>
                                        <div className="product-owner d-flex-between">
                                            <span className="bid-owner text-secondry d-flex align-items-center"><Link to="collection_details">God’s world
                                                <img src="images/verified.png" className="img-fluid verify_img" /></Link></span>
                                        </div>
                                    </div>
                                    <span className="biding-price d-flex-center text-white">  #556 </span>
                                </div>
                                <hr />
                                <div className="action-wrapper d-flex-between border-0 pb-4">
                                    <span className="biding-price d-flex-center  text-white">$ 5.05/ day</span>
                                    <span className="biding-price d-flex-center  text-white">Max: 10 days</span>
                                </div>
                            </div>
                            <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit" className="btn  btn-block btn-gradient w-100 text-center btn-small">
                                <span> Rent now </span>
                            </Link>
                        </div>
                    </div>
                    <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  mb-6">
                        <div className="explore-style-one explore-style-overlay border-gradient">
                            <div className="thumb">
                                <Link to="nft_details"><img src="images/explore/13.jpg" alt="nft live auction thumbnail" /></Link>
                            </div>
                            <div className="content px-4">
                                <div className="d-flex-between align-items-center" >
                                    <div>
                                        <div className="header d-flex-between pt-4 pb-2">
                                            <h3 className="title"><Link to="/nft_details">God Watching</Link></h3>
                                        </div>
                                        <div className="product-owner d-flex-between">
                                            <span className="bid-owner text-secondry d-flex align-items-center"><Link to="collection_details">God’s world
                                                <img src="images/verified.png" className="img-fluid verify_img" /></Link></span>
                                        </div>
                                    </div>
                                    <span className="biding-price d-flex-center text-white">  #556 </span>
                                </div>
                                <hr />
                                <div className="action-wrapper d-flex-between border-0 pb-4">
                                    <span className="biding-price d-flex-center  text-white">$ 5.05/ day</span>
                                    <span className="biding-price d-flex-center  text-white">Max: 10 days</span>
                                </div>
                            </div>
                            <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit" className="btn  btn-block btn-gradient w-100 text-center btn-small">
                                <span> Rent now </span>
                            </Link>
                        </div>
                    </div>
                    {
                        isAuth === '0' ?
                            <div className="row">
                                <div className="col-12 text-center mt-4">
                                    <button type="button" className="btn btn-outline border-gradient px-6" onClick={handleLoadMore}>
                                        <span><i className="ri-loader-4-fill"></i> Load More</span>
                                    </button>
                                </div>
                            </div>
                            : ""
                    }

                    {
                        isAuth === '1' ?
                            <>
                                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  mb-6">
                                    <div className="explore-style-one explore-style-overlay border-gradient">
                                        <div className="thumb">
                                            <Link to="nft_details"><img src="images/explore/13.jpg" alt="nft live auction thumbnail" /></Link>
                                        </div>
                                        <div className="content px-4">
                                            <div className="d-flex-between align-items-center" >
                                                <div>
                                                    <div className="header d-flex-between pt-4 pb-2">
                                                        <h3 className="title"><Link to="/nft_details">God Watching</Link></h3>
                                                    </div>
                                                    <div className="product-owner d-flex-between">
                                                        <span className="bid-owner text-secondry d-flex align-items-center"><Link to="collection_details">God’s world
                                                            <img src="images/verified.png" className="img-fluid verify_img" /></Link></span>
                                                    </div>
                                                </div>
                                                <span className="biding-price d-flex-center text-white">  #556 </span>
                                            </div>
                                            <hr />
                                            <div className="action-wrapper d-flex-between border-0 pb-4">
                                                <span className="biding-price d-flex-center  text-white">$ 5.05/ day</span>
                                                <span className="biding-price d-flex-center  text-white">Max: 10 days</span>
                                            </div>
                                        </div>
                                        <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit" className="btn  btn-block btn-gradient w-100 text-center btn-small">
                                            <span> Rent now </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  mb-6">
                                    <div className="explore-style-one explore-style-overlay border-gradient">
                                        <div className="thumb">
                                            <Link to="nft_details"><img src="images/explore/13.jpg" alt="nft live auction thumbnail" /></Link>
                                        </div>
                                        <div className="content px-4">
                                            <div className="d-flex-between align-items-center" >
                                                <div>
                                                    <div className="header d-flex-between pt-4 pb-2">
                                                        <h3 className="title"><Link to="/nft_details">God Watching</Link></h3>
                                                    </div>
                                                    <div className="product-owner d-flex-between">
                                                        <span className="bid-owner text-secondry d-flex align-items-center"><Link to="collection_details">God’s world
                                                            <img src="images/verified.png" className="img-fluid verify_img" /></Link></span>
                                                    </div>
                                                </div>
                                                <span className="biding-price d-flex-center text-white">  #556 </span>
                                            </div>
                                            <hr />
                                            <div className="action-wrapper d-flex-between border-0 pb-4">
                                                <span className="biding-price d-flex-center  text-white">$ 5.05/ day</span>
                                                <span className="biding-price d-flex-center  text-white">Max: 10 days</span>
                                            </div>
                                        </div>
                                        <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit" className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Rent now </span> </Link>
                                        {/* <!-- End .content --> */}
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  mb-6">
                                    <div className="explore-style-one explore-style-overlay border-gradient">
                                        <div className="thumb">
                                            <Link to="nft_details"><img src="images/explore/13.jpg" alt="nft live auction thumbnail" /></Link>
                                        </div>
                                        <div className="content px-4">
                                            <div className="d-flex-between align-items-center" >
                                                <div>
                                                    <div className="header d-flex-between pt-4 pb-2">
                                                        <h3 className="title"><Link to="/nft_details">God Watching</Link></h3>
                                                    </div>
                                                    {/* <!-- End product-share-wrapper --> */}
                                                    <div className="product-owner d-flex-between">
                                                        <span className="bid-owner text-secondry d-flex align-items-center"><Link to="collection_details">God’s world
                                                            <img src="images/verified.png" className="img-fluid verify_img" /></Link></span>
                                                    </div>
                                                </div>
                                                <span className="biding-price d-flex-center text-white">  #556 </span>
                                            </div>
                                            <hr />
                                            {/* <!-- End .product-owner --> */}
                                            <div className="action-wrapper d-flex-between border-0 pb-4">
                                                <span className="biding-price d-flex-center  text-white">$ 5.05/ day</span>
                                                <span className="biding-price d-flex-center  text-white">Max: 10 days</span>
                                            </div>
                                        </div>
                                        <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit" className="btn  btn-block btn-gradient w-100 text-center btn-small">
                                            <span> Rent now </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  mb-6">
                                    <div className="explore-style-one explore-style-overlay border-gradient">
                                        <div className="thumb">
                                            <Link to="nft_details"><img src="images/explore/13.jpg" alt="nft live auction thumbnail" /></Link>
                                        </div>
                                        <div className="content px-4">
                                            <div className="d-flex-between align-items-center" >
                                                <div>
                                                    <div className="header d-flex-between pt-4 pb-2">
                                                        <h3 className="title"><Link to="/nft_details">God Watching</Link></h3>
                                                    </div>
                                                    <div className="product-owner d-flex-between">
                                                        <span className="bid-owner text-secondry d-flex align-items-center"><Link to="collection_details">God’s world
                                                            <img src="images/verified.png" className="img-fluid verify_img" /></Link></span>
                                                    </div>
                                                </div>
                                                <span className="biding-price d-flex-center text-white">  #556 </span>
                                            </div>
                                            <hr />
                                            <div className="action-wrapper d-flex-between border-0 pb-4">
                                                <span className="biding-price d-flex-center  text-white">$ 5.05/ day</span>
                                                <span className="biding-price d-flex-center  text-white">Max: 10 days</span>
                                            </div>
                                        </div>
                                        <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit" className="btn  btn-block btn-gradient w-100 text-center btn-small">
                                            <span> Rent now </span> </Link>
                                    </div>
                                </div>
                            </>
                            : ""
                    }
                </div>
            </div>
        </section>
    )
}

export default NftRentcoustamPage