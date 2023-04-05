import React, { useRef, useEffect, useState, useContext } from "react";
import { Link, useNavigate, generatePath } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import { ProfileContext } from "../../../context/ProfileProvider";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";
import Web3 from "web3";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import contract from '../../../contract.json'
import { $ } from "react-jquery-plugin";
import moment from "moment";
const CreateBundle = (props) => {

    let newTokenAddress = '0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437'

    const [userDetailstoId, setUserDetailstoId] = useState([])

    const [userDetails, setUserDetails] = useState([])
    const [tokenType, setTokenType] = useState([])
    const [bundleNameNew, setBundleNameNew] = useState('');
    const [bundlePriceNew, setBundlePriceNew] = useState('');
    const [bundleuserinfoLength, setBundleuserinfoLength] = useState('');
    const [bundleObjectuserinfo, setBundleObjectuserinfo] = useState('');
    const [password, setPassword] = useState('');
    const [centerlizedData, setCenterlizedData] = useState([])
    const [createdNftData, setCreatedNftData] = useState([]);
    const [bundlePrice, setBundlePrice] = useState('');
    const [bundleName, setBundleName] = useState('');
    const [profileState, updateProfileState] = useContext(ProfileContext);
    const navigate = useNavigate();

    let web3
    if (!window.ethereum) {
        web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/")
    } else {
        web3 = new Web3(window.ethereum)
    }

    const nftContract = new web3.eth.Contract(contract.nftAbi, contract.nftAddress);
    const marketContract = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress);
    const messagesEndRef = useRef(null)

    useEffect(() => {
        scrollTop();
        handleuserProfile();
        handleSetLimitCreated();
    }, []);

    const scrollTop = () => {
        messagesEndRef?.current?.scrollIntoView(true)
    }


    const handleLogOut = () => {
        updateProfileState({});
        localStorage.clear();
        navigate("/login");
        window.location.reload();
    }


    const handleuserProfile = async () => {
        await AuthService.getUserDetails().then(async result => {
            if (result.success) {
                try {
                    setUserDetailstoId(result.data);
                    setUserDetails(result?.data?.wallet_address);
                    setTokenType(result?.data?.type);
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

    let limit = '1000'

    const handleSetLimitCreated = async () => {
        await AuthService.getLimitCreated(limit).then(async result => {
            if (result.success) {
                try {
                    // alertSuccessMessage(result?.message)
                    setCreatedNftData(result?.data?.data?.reverse())
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }


    const [userinfo, setUserInfo] = useState({
        nft_object: []
    });



    const handleChange = (e, selectedRow) => {

        const { nft_object } = userinfo;

        if (e.target.checked) {
            setUserInfo({
                nft_object: [...nft_object, { id: selectedRow?.token_id, file: selectedRow?.file }],
            });
        } else {
            let arr = userinfo?.nft_object
            let nft_object = arr.filter((data) => {
                return data?.id !== selectedRow?.token_id
            })
            setUserInfo({
                nft_object: nft_object,
            });
        }
    };

    const handleCreateBundle = async (bundleName, bundlePrice, userinfoLength, Objectuserinfo) => {
        await AuthService.createBundle(bundleName, bundlePrice, userinfoLength, Objectuserinfo).then(async result => {
            if (result.success) {
                try {
                    createBundleMetamask();
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }


    const handleCreateBundlecentralized = async (privateKey) => {
        await AuthService.createBundle(bundleNameNew, bundlePriceNew, bundleuserinfoLength, bundleObjectuserinfo).then(async result => {
            if (result.success) {
                try {
                    approveCentralised(privateKey);
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }

    const handleCreateBundleNew = async (bundleName, bundlePrice, userinfoLength, Objectuserinfo) => {
        setBundleNameNew(bundleName)
        setBundlePriceNew(bundlePrice)
        setBundleuserinfoLength(userinfoLength)
        setBundleObjectuserinfo(Objectuserinfo)

        if (!bundleName) {
            alertErrorMessage('Please Enter BundleName')
        } else if (!bundlePrice) {
            alertErrorMessage('Please Enter BundlePrice')
        } else if (!userinfoLength) {
            alertErrorMessage('Please Enter BundleImage')
        } else {
            $("#enterpasswordmodal").modal('show');
        }
    }



    useEffect(() => {
        if (tokenType === 'centralized') {
            handleCenterlizedWalletData();
        }
    }, [])

    const handleCenterlizedWalletData = async () => {
        await AuthService.getCenterlizedWalletData().then(async result => {
            if (result.success) {
                setCenterlizedData(result?.data)
            }
        });
    }

    const handleDecryptData = async (password) => {
        try {
            let dcrypt = await web3.eth.accounts.decrypt(centerlizedData?.wallet_data, password);
            if (dcrypt?.privateKey) {
                $("#enterpasswordmodal").modal('hide');
                handleCreateBundlecentralized(dcrypt?.privateKey)
            }
        } catch (error) {
            console.log(error, 'error:handleDecryptData');
            alertErrorMessage(error.message)
        }
    }


    const createBundleMetamask = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0]
            let boolienValue = true
            let data = await nftContract.methods.setApprovalForAll(contract.marketplaceAddress, boolienValue,).send({ from: account })
            if (data?.status) {
                createSalePack();
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }

    const createSalePack = async () => {
        try {
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let arryaId = []
            let tokenIds = userinfo?.nft_object; //convert to hex
            for (let i = 0; i < tokenIds.length; i++) {
                var hexaDecimalToken = tokenIds[i].id;
                arryaId.push(hexaDecimalToken)
            }
            const numberToHex = (_num) => {
                var inputAmt = _num;
                var weiAmt = (1000000000000000000 * inputAmt);
                var hexaDecimal = "0x" + weiAmt.toString(16);
                return hexaDecimal;
            }
            let buyNowPrice = numberToHex(bundlePrice)
            const tx = await marketContract.methods.createSaleForPack(contract.nftAddress, arryaId, buyNowPrice).send({ from: account })
            if (tx) {
                alertSuccessMessage('Successfully Update createSalePack')
                LoaderHelper.loaderStatus(false);
                handleSellStatusSellNow(arryaId,)
                navigate('/profile')
            }
        } catch (error) {
            console.log(error, ':ERROR');
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }



    const approveCentralised = async (privateKey) => {
        try {
            LoaderHelper.loaderStatus(true);
            const privateKeyOfwallet = privateKey //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437" // NFt contract address
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                data: await nftContract.methods.setApprovalForAll(contract.marketplaceAddress, true).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            if (transactionReceipt?.status) {
                createPackCentralised(privateKey);
            }
        } catch (error) {
            console.log(error, 'Error');
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }


    const createPackCentralised = async (privateKey) => {
        try {
            LoaderHelper.loaderStatus(true);
            const privateKeyOfwallet = privateKey //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0x4b80Efd0087F255DAf1F4b43D99948b0e6356481"
            let arryaId = []

            let tokenIds = userinfo?.nft_object; //convert to hex
            for (let i = 0; i < tokenIds.length; i++) {
                var hexaDecimalToken = tokenIds[i].id;
                arryaId.push(hexaDecimalToken)
            }

            const numberToHex = (_num) => {
                var inputAmt = _num;
                var weiAmt = (1000000000000000000 * inputAmt);
                var hexaDecimal = "0x" + weiAmt.toString(16);
                return hexaDecimal;
            }
            let buyNowPrice = numberToHex(bundlePrice)
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                data: await marketContract.methods.createSaleForPack(contract.nftAddress, arryaId, buyNowPrice).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            if (transactionReceipt?.status === true) {
                LoaderHelper.loaderStatus(false);
                alertSuccessMessage('Successfully Update createSalePack')
                navigate('/profile')
            }
        } catch (error) {
            console.log(error, 'error:error');
            LoaderHelper.loaderStatus(false);
            alertErrorMessage('something Went Wrong')
        }
    }

    // console.log(createdNftData,'createdNftData');


    // const filteredNftData = [];

    // for (let i = 0; i < createdNftData?.length; i++) {
    //     if (createdNftData[i]?.nftSeller) {
    //         filteredNftData.push(createdNftData[i]);
    //     }
    // }


    const handleSellStatusSellNow = async (arryaId) => {
        console.log(arryaId,'arryaId');
        await AuthService.statusonBundle(arryaId, newTokenAddress, userDetailstoId?._id, bundlePrice).then(async result => {
            if (result.success) {
                try {
                    handleuserProfile();
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                // alertErrorMessage(result.message);
            }
        });
    }

    return (
        <>
            <div className="page_wrapper create_form">
                <section class="inner-page-banner explore_banner_inner">
                    <div class="container">
                        <div class="inner_header_page inner_header_page_center justify-content-center">
                            <div class="innertext-start  text-center">
                                <h1 class="title">Create New Bundle</h1>
                                <hr />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="form_sec" >
                    <div className="container" >
                        <div className="row justify-content-center" >
                            <div className="col-xl-10" >
                                <div className="main_panel nft_c_bar" >
                                    <div className="nft_main_bar side_main_panel" >
                                        <div class="field-box form-group">
                                            <label for="name" class="up_label"> Bundle Name <em className="text-danger" >*</em> </label>
                                            <input id="Bundle_name" type="text" placeholder="Enter Bundle Name" value={bundleName} onChange={(e) => setBundleName(e.target.value)} />
                                        </div>
                                        <div class="field-box form-group">
                                            <label for="name" class="up_label"> Bundle Price <em className="text-danger" >*</em> </label>
                                            <input type="number" placeholder="Enter Bundle Price" value={bundlePrice} onChange={(e) => setBundlePrice(e.target.value)} />
                                        </div>
                                        <div className="bun_nft_list" >
                                            <div class="iterfsh pt-0">
                                                <h5> Select NFT's</h5></div>
                                            <div className="row_th" >
                                                <div className="row align-items-center">
                                                    <div className="col-md-2" >
                                                        <div className=" mb-0 h6"> Item </div>
                                                    </div>
                                                    <div className="col-md-4" >
                                                        <div className=" mb-0 h6"> Name </div>
                                                    </div>
                                                    <div className="col-md-2" >
                                                        <div className=" mb-0 h6">Price</div>
                                                    </div>
                                                    <div className="col-md-2 text-end" >
                                                        <div className=" mb-0 h6">Date  </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                createdNftData.length > 0
                                                    ? createdNftData.map((item) => (
                                                        <div class="form-check bun_nft_list_check">
                                                            <input class="form-check-input" type="checkbox" id="flexCheckDefault" onChange={(e) => handleChange(e, item)} />
                                                            <label class="form-check-label" for="flexCheckDefault">
                                                                <div className="row align-items-center" >
                                                                    <div className="col-md-2" >
                                                                        <a href="#" className="cll_name" >
                                                                            <img src={`${ApiConfig.baseUrl + item?.file}`} width="40" height="40" />
                                                                            {/* <div className=" mb-0 h5" >{item?.name}</div> */}
                                                                        </a>
                                                                    </div>
                                                                    <div className="col-md-4" >
                                                                        <div className="cll_name" >
                                                                            <div className=" mb-0 h6" >{item?.name}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2" >
                                                                        <div className=" mb-0 h6" >{item?.price}</div>
                                                                    </div>
                                                                    <div className="col-md-4" >
                                                                        <div className=" mb-0 h6" > {moment(item?.createdAt).format('MMMM Do YYYY, h a')} </div>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </div>

                                                    ))
                                                    : null}
                                        </div>
                                    </div>
                                    <div className="sidepanel sidepanel_right sidepanel_fixed" >
                                        <label className="up_label">Preview</label>
                                        <div class=" border-gradient bundle_card">
                                            <div class="product-collection-box">
                                                {
                                                    userinfo?.nft_object?.length > 0
                                                        ? userinfo?.nft_object?.map((item) => (
                                                            <>
                                                                <a href="#">
                                                                    <div className="ratio ratio-1x1" >
                                                                        <img src={`${ApiConfig.baseUrl + item?.file}`} alt="" />
                                                                    </div>
                                                                </a>
                                                            </>
                                                        ))
                                                        : null}
                                            </div>
                                            <div class="product-collection-footer d-flex align-items-center justify-content-between">
                                                <div class="product-collection-info">
                                                    <span class="product-collection-name">Name: {bundleName}</span>
                                                    <span class="product-collection-stock">{userinfo?.nft_object?.length} Items</span>
                                                </div>
                                                {/* <a href="explore-product.html" class="boxed-btn btn-gradient">View All</a> */}
                                                <span className="h5 text-white" >{bundlePrice}</span>
                                            </div>
                                        </div>
                                        {
                                            tokenType === 'centralized' ?
                                                <button type="button" class="btn btn-gradient btn-border-gradient px-5 mt-4  btn-block w-100" onClick={() => handleCreateBundleNew(bundleName, bundlePrice, userinfo?.nft_object?.length, userinfo?.nft_object)}>
                                                    <span class="d-block w-100 text-center">CREATE BUNDLE</span>
                                                </button>
                                                :
                                                <button type="button" class="btn btn-gradient btn-border-gradient px-5 mt-4  btn-block w-100" onClick={() => handleCreateBundle(bundleName, bundlePrice, userinfo?.nft_object?.length, userinfo?.nft_object)}>
                                                    <span class="d-block w-100 text-center">CREATE BUNDLE</span>
                                                </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>


            <div className="modal fade" id="enterpasswordmodal" tabindex="-1" data-bs-backdrop="static" aria-labelledby="enterpasswordmodallabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header no-border flex-column px-8">
                            <h3 className="modal-title" id="enterpasswordmodallabel"> Enter Your Password </h3>
                            <button type="button" className="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close"><i
                                className="ri-close-fill"></i></button>
                        </div>
                        <div className="modal-body" >
                            <form className=" px-4" >
                                <hr />
                                <div class="form-group mb-5 mt-5">
                                    <label> Password </label>
                                    <input type="password" class="form-control" placeholder="Enter Your Password" aria-label="f-name" aria-describedby="basic-addon2" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <button type="button" class="btn btn-gradient btn-border-gradient w-100 justify-content-center mb-4" onClick={() => handleDecryptData(password)}>
                                    <span>SAVE</span></button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default CreateBundle