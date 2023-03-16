import React, { useRef, useEffect, useState, useContext } from "react";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import AuthService from "../../../api/services/AuthService";
import { ProfileContext } from "../../../context/ProfileProvider";
import { Link, useNavigate } from "react-router-dom";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";

const CreateCollection = () => {

    const [profileState, updateProfileState] = useContext(ProfileContext);
    const navigate = useNavigate();

    const handleLogOut = () => {
        updateProfileState({});
        localStorage.clear();
        navigate("/login");
        window.location.reload();
    }
    const [userDetails, setUserDetails] = useState([])

    const [categoryList, setCategoryList] = useState([])


    const handleuserProfile = async () => {
        await AuthService.getUserDetails().then(async result => {
            if (result.success) {
                try {
                    // alertSuccessMessage(result.message);
                    setUserDetails(result.data);
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                if (result.message === 'jwt expired') {
                    // alertErrorMessage('result.message');
                    handlerefreshToken();
                    handleuserProfile();
                } else {
                    // alertErrorMessage('result.message');
                    handleLogOut();
                }
                // console.log(result.message, 'result.message');
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

    const messagesEndRef = useRef(null)
    useEffect(() => {
        scrollTop();
        handleuserProfile();
        handleCategoryList();
    }, []);

    const scrollTop = () => {
        messagesEndRef?.current?.scrollIntoView(true)
    }

    const [logoImage, setLogoImage] = useState('');
    const [featuredImage, setFeaturedImage] = useState('');
    const [bannerImage, setBannerImage] = useState('');
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('art');
    const [walletNetwork, setWalletNetwork] = useState('');
    const [tokens, setTokens] = useState('BNB');
    const [tokenType, setTokenType] = useState('BNB');


    const handleResetInput = () => {       
        setName("");
        setUrl("");
        setDescription("");
        setCategory("");
        setWalletNetwork("");
        setTokens("");
        setTokenType("");
    }


    const handleChangeBannerImage = async (event) => {
        event.preventDefault();
        const fileUploaded = event.target.files[0];
        const imgata = URL.createObjectURL(fileUploaded);
        setBannerImage(imgata);
        handleUpdateBannerImage(fileUploaded);

    }

    const handleChangeLogoImage = async (event) => {
        event.preventDefault();
        const fileUploaded = event.target.files[0];
        const imgata = URL.createObjectURL(fileUploaded);
        setLogoImage(imgata);
        handleUpdateLogoImages(fileUploaded);
    }


    const handleChangeFeaturedImage = async (event) => {
        event.preventDefault();
        const fileUploaded = event.target.files[0];
        const imgata = URL.createObjectURL(fileUploaded);
        setFeaturedImage(imgata);
        handleUpdateFeaturedImage(fileUploaded)
    }





    const handleCreateCollection = async (name, urls, description, category, walletNetwork, tokenType, tokens) => {
        await AuthService.createCollection(logoImage, featuredImage, bannerImage, name, urls, description, category, walletNetwork, tokenType, tokens).then(async result => {
            if (result.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    alertSuccessMessage(result.message);
                    handleResetInput();
                    navigate("/my_collection");
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage(result.message);
            }
        });
    }


    const handleUpdateLogoImages = async (logoImage) => {
        var formData = new FormData();
        formData.append('file', logoImage);
        await AuthService.updateLogoImages(formData).then(async result => {
            if (result.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    alertSuccessMessage(result.message);
                    setLogoImage(result?.data);
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage(result.message);
            }
        });
    }


    const handleUpdateBannerImage = async (bannerImage) => {
        var formData = new FormData();
        formData.append('file', bannerImage);
        await AuthService.updateBannerImage(formData).then(async result => {
            if (result.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    alertSuccessMessage(result.message);
                    setBannerImage(result?.data);
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage(result.message);
            }
        });
    }

    const handleUpdateFeaturedImage = async (bannerImage) => {
        var formData = new FormData();
        formData.append('file', bannerImage);
        await AuthService.updateBannerImage(formData).then(async result => {
            if (result.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    alertSuccessMessage(result.message);
                    setFeaturedImage(result?.data);
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage(result.message);
            }
        });
    }


    const handleCategoryList = async () => {
        await AuthService.getCategoryList().then(async result => {
            if (result.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    // alertSuccessMessage(result.message);
                    setCategoryList(result?.data)
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage(result.message);
            }
        });
    }

    console.log(bannerImage, 'bannerImage');


    return (
        <>
            <div className="page_wrapper create_form" >
                <section className="inner-page-banner explore_banner_inner">
                    <div className="container">
                        <div className="inner_header_page inner_header_page_center justify-content-center" >
                            <div className="innertext-start  text-center">
                                <h1 className="title"> Create a Collection </h1>
                                <hr />
                                <p className="" >Submit details to create new collection </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="form_sec" >
                    <div className="container" >
                        <div className="row justify-content-center" >
                            <div className="col-xl-8" >
                                <form className="row" >
                                    <div className="col-lg-5" >
                                        <div className="form-group" >
                                            <label className="up_label" >Logo image <em className="text-danger">*</em></label>
                                            <span>Navigation image. 350x350 <br /> recommended.</span>
                                            <div className=" upload-area" >

                                                <div class="brows-file-wrapper file_wrapper_mini file-wrapper-circle">
                                                    <input name="logoImage" id="logoImage" type="file" class="inputfile" data-multiple-caption="{count} files selected" multiple onChange={handleChangeLogoImage} />
                                                    <label for="logoImage" title="No File Choosen">
                                                        <i class="ri-image-line"></i>
                                                        <span class="text-center">Choose a File</span>
                                                        <img src={`${ApiConfig.baseUrl + logoImage}`} />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-7" >
                                        <div className="form-group" >
                                            <label className="up_label" >Featured image <em className="text-danger">*</em></label>
                                            <span>Featuring image for you collection on the homepage or category page. 600x400 recommended</span>
                                            <div className=" upload-area" >
                                                <div class="brows-file-wrapper file_wrapper_mini ">
                                                    <input name="file" id="file" type="file" class="inputfile" data-multiple-caption="{count} files selected" multiple onChange={handleChangeFeaturedImage} />
                                                    <label for="file" title="No File Choosen">
                                                        <i class="ri-image-line"></i>
                                                        <span class="text-center">Choose a File</span>
                                                        <img src={`${ApiConfig.baseUrl + featuredImage}`} />

                                                        {/* <img src={featuredImage} /> */}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12" >
                                        <div className="form-group" >
                                            <label className="up_label" >Banner image<em className="text-danger">*</em></label>
                                            <span>This image will appear at the top of your collection page. 1400x350 recommended</span>
                                            <div className=" upload-area" >
                                                <div class="brows-file-wrapper ">
                                                    <input name="bannerImage" id="bannerImage" type="file" class="inputfile" data-multiple-caption="{count} files selected" multiple onChange={handleChangeBannerImage} />
                                                    <label for="bannerImage" title="No File Choosen">
                                                        <i class="ri-image-line"></i>
                                                        <span class="text-center">Choose a File</span>
                                                        <img src={`${ApiConfig.baseUrl + bannerImage}`} />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12" >
                                        <div class="field-box form-group">
                                            <label for="name" class="up_label">Name <em className="text-danger" >*</em> </label>
                                            <input id="name" type="text" placeholder="Enter your Collection name" value={name} onChange={(event) => setName(event.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-12" >
                                        <div class="field-box form-group">
                                            <label for="name" class="up_label">URL <em className="text-danger" >*</em> </label>
                                            <span>Enter your short URL</span>
                                            <input id="name" type="text" placeholder="Enter your Collection name" value={url} onChange={(event) => setUrl(event.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-12" >
                                        <div class="field-box form-group">
                                            <label for="name" class="up_label">Description <em className="text-danger" >*</em> </label>
                                            <span>Spread some words about your token collection</span>
                                            <textarea rows="4" placeholder="Write about your collection" value={description} onChange={(event) => setDescription(event.target.value)}></textarea>
                                        </div>
                                    </div>
                                    <div className="col-lg-12" >
                                        <div class="field-box form-group">
                                            <label for="name" class="up_label">Category <em className="text-danger" >*</em> </label>
                                            <span>Adding a category will help make your item discoverable</span>
                                            <select className="form-select" value={category} onChange={(event) => setCategory(event.target.value)}>
                                            {/* <option value='art'> Art </option> */}

                                                {categoryList.length > 0
                                                    ? categoryList.map((item) => (
                                                        <>
                                                            <option value={item?._id}> {item?.name} </option>
                                                        </>
                                                    ))

                                                    : null}
                                            </select>

                                        </div>
                                    </div>
                                    <div className="col-lg-12" >
                                        <div class="field-box form-group">
                                            <label for="name" class="up_label"> Select Wallet Network <em className="text-danger" >*</em> </label>
                                            <select className="form-select" value={walletNetwork} onChange={(event) => setWalletNetwork(event.target.value)}>
                                                <option value='ART'> ART </option>
                                                <option value='Doman Names'> Doman Names </option>
                                                <option value='Gaming '> Gaming </option>
                                                <option value='Memberships'> Memberships </option>
                                                <option value='Music'> Music </option>
                                                <option value='Photography'> Photography </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-lg-12" >
                                        <div class="field-box form-group">
                                            <label for="name" class="up_label"> Token Type <em className="text-danger" >*</em> </label>
                                            <select className="form-select" value={tokenType} onChange={(event) => setTokenType(event.target.value)}>
                                                {/* <option value='ART'> Ethereum </option> */}
                                                <option value='BNB'> BNB</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-lg-12" >
                                        <div class="field-box form-group">
                                            <label for="name" class="up_label"> Tokens <em className="text-danger" >*</em> </label>
                                            <span>These tokens can be used to buy and sell your items.</span>
                                            <select className="form-select" value={tokens} onChange={(event) => setTokens(event.target.value)}>
                                                <option value='BNB'> BNB </option>
                                    
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-12" >
                                        <button type="button" class="btn btn-gradient btn-border-gradient px-5 btn-block w-100" onClick={() => handleCreateCollection(name, url, description, category, walletNetwork, tokenType, tokens)}>
                                            <span class="d-block w-100 text-center">CREATE COLLECTION</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default CreateCollection