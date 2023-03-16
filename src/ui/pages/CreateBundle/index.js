import React, { useRef, useEffect, useState, useContext } from "react";
import { Link, useNavigate, generatePath } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import { ProfileContext } from "../../../context/ProfileProvider";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";
import Web3 from "web3";
// import contract from "./contract.json";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import contract from '../../../contract.json'


const CreateBundle = () => {
    const web3 = new Web3(window.ethereum)
    const [tokenId, setTokenId] = useState('')
    const bundleContract = new web3.eth.Contract(contract.bundleAbi, contract.bundleAddress);
    const bundleMarketContract = new web3.eth.Contract(contract.bundleMarketAbi, contract.nftAddress);
    const messagesEndRef = useRef(null)
    let marketplaceAddress = "0x6d7D7842F4256f7Bd4ece025A68D2CF964De6abE"
    const walletAddress = localStorage.getItem("wallet_address");


    useEffect(() => {
        scrollTop();
        handleuserProfile();
        handleSetLimitCreated();
    }, []);

    const scrollTop = () => {
        messagesEndRef?.current?.scrollIntoView(true)
    }
    const [createdNftData, setCreatedNftData] = useState([]);
    const [emailId, setEmailId] = useState("");
    const [bundlePrice, setBundlePrice] = useState('');
    const [bundleName, setBundleName] = useState('');
    const [profileState, updateProfileState] = useContext(ProfileContext);
    const navigate = useNavigate();

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
                    setEmailId(result?.data?.email_or_phone);
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
        nft_object: [],
    });

    const [usertokenID, setUsertokenID] = useState({
        nft_object2: [],
    });

    console.log(userinfo?.nft_object, " : arr token id");

    const handleChange = (selectedRow) => {
        // Destructuring
        //let rj = userinfo?.nft_object?.findIndex(selectedRow);

        //console.log(rj,'RAJED');
        const { nft_object } = userinfo;

        const { nft_object2 } = usertokenID;

        let myRj = nft_object.filter((e) => e !== { id: selectedRow?.token_id, file: selectedRow?.file });
        console.log(myRj, 'myRj');
        // Case 1 : The user checks the box
        if (selectedRow) {
            setUserInfo({
                nft_object: [...nft_object, { id: selectedRow?.token_id, file: selectedRow?.file }],
            });

            setUsertokenID({
                nft_object2: [...nft_object2, selectedRow?.token_id],
            });
        }

        // Case 2  : The user unchecks the box
        else {
            console.log(userinfo, 'nft_object');
            setUserInfo({
                nft_object: nft_object.filter((e) => e !== { id: selectedRow?.token_id, file: selectedRow?.file }),
            });

        }
    };

    // console.log(userinfo, 'userinfo');



    const handleCreateBundle = async (bundleName, bundlePrice, userinfoLength, Objectuserinfo) => {
        await AuthService.createBundle(bundleName, bundlePrice, userinfoLength, Objectuserinfo).then(async result => {
            if (result.success) {
                try {
                    // alertSuccessMessage(result?.message)
                    createBundleMetamask();
                } catch (error) {
                    alertErrorMessage(result.message);
                }
            } else {
                alertErrorMessage(result.message);
            }
        });
    }

    const createBundleMetamask = async () => {
        LoaderHelper.loaderStatus(true);
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0]
        let boolienValue = true

        console.log(boolienValue, 'boolienValue');
        let data = await bundleMarketContract.methods.setApprovalForAll(marketplaceAddress, boolienValue,).send({ from: account })
        console.log(data, 'dataTx');
        // setTokenId(web3.utils.hexToNumber(data?.events?.Transfer?.raw?.topics[3]))
        if (data?.status) {
            createSalePack();
        } else {
            alertErrorMessage('Something Went Wrong')
        }
    }

    const createSalePack = async () => {
        alertSuccessMessage('createSalePack')
        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]
        let arryaId = []
        let tokenIds = usertokenID?.nft_object2; //convert to hex
        for (let i = 0; i < tokenIds.length; i++) {
            var hexaDecimalToken = tokenIds[i];
            arryaId.push(hexaDecimalToken)
        }
        const numberToHex = (_num) => {
            var inputAmt = _num;
            var weiAmt = (1000000000000000000 * inputAmt);
            var hexaDecimal = "0x" + weiAmt.toString(16);
            return hexaDecimal;
        }
        let buyNowPrice = numberToHex(bundlePrice)
        const tx = await bundleContract.methods.createSaleForPack(contract.nftAddress, arryaId, buyNowPrice).send({ from: account })
        if (tx) {
            alertSuccessMessage('Successfully Update createSalePack')
            LoaderHelper.loaderStatus(false);
        }
    }



    const approveCentralised = async () => {
        LoaderHelper.loaderStatus(true);
        const privateKeyOfwallet = '0x0e20a03cd80f0780a0c4cfe3d5260745b0a83c9ee90f2f7fc092cddf5c5d761e' //Private key of wallet goes here
        const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
        const contract_address = "0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437" // NFt contract address
        const tx = {
            from: address, // Wallet address
            to: contract_address, // Contract address of battle infinity
            gas: 1000000,
            data: await bundleMarketContract.methods.setApprovalForAll(marketplaceAddress, true).encodeABI()
        }
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
        const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        if (transactionReceipt?.status) {
            createPackCentralised();
        } else {
            alertErrorMessage('Something Went Wrong')
        }
    }


    const createPackCentralised = async () => {
        alert('createPackCentralised')
        LoaderHelper.loaderStatus(true);
        const privateKeyOfwallet = '0x0e20a03cd80f0780a0c4cfe3d5260745b0a83c9ee90f2f7fc092cddf5c5d761e' //Private key of wallet goes here
        const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
        const contract_address = "0x6d7D7842F4256f7Bd4ece025A68D2CF964De6abE"
        let arryaId = []
        let tokenIds = usertokenID?.nft_object2; //convert to hex
        for (let i = 0; i < tokenIds.length; i++) {
            var hexaDecimalToken = tokenIds[i];
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
            data: await bundleContract.methods.createSaleForPack(contract.nftAddress, arryaId, buyNowPrice).encodeABI()
        }
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
        const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        if (transactionReceipt?.status === true) {
            LoaderHelper.loaderStatus(false);
            alertSuccessMessage('Successfully Update createSalePack')
        }
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
                                            <input type="text" placeholder="Enter Bundle Price" value={bundlePrice} onChange={(e) => setBundlePrice(e.target.value)} />
                                        </div>
                                        <div className="bun_nft_list" >
                                            <div class="iterfsh pt-0">
                                                <h5> Select NFT's</h5></div>
                                            <div className="row_th" >
                                                <div className="row align-items-center">
                                                    <div className="col-md-4" >
                                                        <div className=" mb-0 h6"> Item </div>
                                                    </div>
                                                    <div className="col-md-4" >
                                                        <div className=" mb-0 h6"> Collection Name </div>
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
                                                            <input class="form-check-input" type="checkbox" id="flexCheckDefault" onChange={() => handleChange(item)} />
                                                            <label class="form-check-label" for="flexCheckDefault">
                                                                <div className="row align-items-center" >
                                                                    <div className="col-md-4" >
                                                                        <a href="#" className="cll_name" >
                                                                            <img src="https://i.seadn.io/gcs/files/284fbeb9767db70a90fb2d3a9e1f095c.png?auto=format&w=384" width="40" height="40" alt="" />
                                                                            <div className=" mb-0 h5" >{item?.name}</div>
                                                                        </a>
                                                                    </div>
                                                                    <div className="col-md-4" >
                                                                        <div className="cll_name" >
                                                                            <div className=" mb-0 h6" >NFT Name</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2" >
                                                                        <div className=" mb-0 h6" >12ETH</div>
                                                                    </div>
                                                                    <div className="col-md-2" >
                                                                        <div className=" mb-0 h6" > 21-12-2022 </div>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </div>

                                                    ))
                                                    : null}
                                        </div>
                                        <div class="form-group">
                                            <button type="button" class="btn btn-gradient btn-border-gradient px-5 btn-block w-100">
                                                <span class="d-block w-100 text-center">CREATE BUNDLE</span>
                                            </button>
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
                                                                    <img src={`${ApiConfig.baseUrl + item?.file}`} alt="" />
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
                                            walletAddress === '0xC1fEec289C4110A103F7A3F759cFA7a61d18a173' ?


                                                <button type="button" class="btn btn-gradient btn-border-gradient px-5 mt-4  btn-block w-100"
                                                    onClick={() => approveCentralised()}>
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
        </>
    )
}

export default CreateBundle