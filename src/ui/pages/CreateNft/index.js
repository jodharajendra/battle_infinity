import React, { useEffect, useState, useContext, useRef } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import { ProfileContext } from "../../../context/ProfileProvider";
import { Link, useNavigate } from "react-router-dom";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import contract from '../../../contract.json'
import Web3 from "web3";
import { $ } from "react-jquery-plugin";

const CreateNft = () => {

    let web3
    if (!window.ethereum) {
        web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/")
    } else {
        web3 = new Web3(window.ethereum)
    }
    const contract_interaction = new web3.eth.Contract(contract.nftAbi, contract.nftAddress);
    const marketplace = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)

    const navigate = useNavigate();
    let limit = '1000'
    const messagesEndRef = useRef(null)
    let newTokenAddress = '0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437'

    const [password, setPassword] = useState('');
    const [centerlizedData, setCenterlizedData] = useState([])
    const [dcryptPrivateKey, setDcryptPrivateKey] = useState([])
    const [profileState, updateProfileState] = useContext(ProfileContext);
    const [userDetails, setUserDetails] = useState([])
    const [walletAddress, setWalletAddress] = useState([])
    const [uploadIfpsData, setuploadIfpsData] = useState([])
    const [collectionData, setCollectionData] = useState([]);
    const [collectedUserType, setCollectedUserType] = useState([]);
    const [tokenId, setTokenId] = useState('')
    const [fixedPrice, setFixedPrice] = useState('fixed_price');
    const [checkboxButton, setCheckboxButton] = useState('false');
    const [bannerImage, setBannerImage] = useState('');
    const [royalties, setRoyalties] = useState("");
    const [description, setDescription] = useState("");
    const [collection, setCollection] = useState("");
    const [collectionName, setCollectionName] = useState("");
    const [totalExpirationDate, setTotalExpirationDate] = useState("2");
    const [expirationDate, setExpirationDate] = useState("3");
    const [startingDate, setStartingDate] = useState("");
    const [minimumBid, setMinimumBid] = useState("");
    const [price, setPrice] = useState("");
    const [walletNetwork, setWalletNetwork] = useState('Art');
    const [featuredImage, setFeaturedImage] = useState('');
    const [PropertiesData, setPropertiesData] = useState([{
        trait_type: "",
        value: "",
    }])

    const scrollTop = () => {
        messagesEndRef?.current?.scrollIntoView(true)
    }

    const handleLogOut = () => {
        updateProfileState({});
        localStorage.clear();
        navigate("/login");
        window.location.reload();
    }

    const handleUploadImage = async (event) => {
        event.preventDefault();
        const fileUploaded = event.target.files[0];
        const imgata = URL.createObjectURL(fileUploaded);
        setBannerImage(imgata);
        handleUploadNftImage(fileUploaded)
    }

    const handleCheck = (index, e, selected) => {
        let temp = [...PropertiesData];
        temp[index][selected] = e.target.value;
        setPropertiesData(temp);
    }

    const handleNewRow = () => {
        setPropertiesData([...PropertiesData, {
            trait_type: "",
            value: "",
        }])
    }

    function handleRemoveSelectedRows(details) {
        const newRows = [...PropertiesData];
        newRows.splice(details, 1);
        setPropertiesData(newRows);
    }

    const handleFixedPrice = () => {
        setFixedPrice('fixed_price')
    }

    const handleTimeAuction = () => {
        setFixedPrice('timed_auction')
    }

    const handleOncheck = () => {
        if (checkboxButton === 'false') {
            setCheckboxButton('true')
        } else {
            setCheckboxButton('false')
        }
    }

    const handleResetInput = () => {
        setBannerImage("");
        setRoyalties("");
        setDescription("");
        setCollection("");
        setCollectionName("");
        setTotalExpirationDate("");
        setExpirationDate("");
        setStartingDate("");
        setMinimumBid("");
        setPrice("");
        setWalletNetwork("");
        setFeaturedImage("");
        setPropertiesData("");
        setCollectionData("");
    }

    useEffect(() => {
        scrollTop()
        handleuserProfile();
        mycollections();
        setCheckboxButton('false');
    }, []);

    const mycollections = async () => {
        await AuthService.mycollections2(limit).then(async result => {
            if (result.success) {
                setCollectionData(result?.data?.data.reverse())
            } else {
                alertErrorMessage(result?.message);
            }
        });
    }

    const handleuserProfile = async () => {
        await AuthService.getUserDetails().then(async result => {
            if (result.success) {
                try {
                    setUserDetails(result.data);
                    setWalletAddress(result.data?.wallet_address)
                    setCollectedUserType(result?.data?.type)
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

    const handleUploadNftImage = async (bannerImage) => {
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

    useEffect(() => {
        if (collectedUserType === 'centralized') {
            handleCenterlizedWalletData();
        }
    }, [collectedUserType])

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
            setDcryptPrivateKey(dcrypt?.privateKey);
            if (dcrypt?.privateKey) {
                $("#enterpasswordmodal").modal('hide');
                handleuploadIFPS(description, PropertiesData, collectionName, dcrypt?.privateKey)
            }
        } catch (error) {
            console.log(error, 'error:handleDecryptData');
            alertErrorMessage(error.message)
        }
    }

    const handleuploadIFPS = async (description, PropertiesData, collectionName, privateKeyNew) => {
        LoaderHelper.loaderStatus(true);
        await AuthService.addIfpsDetails(description, PropertiesData, collectionName, featuredImage).then(async result => {
            if (result.success) {
                LoaderHelper.loaderStatus(false);
                // alertSuccessMessage(result?.message);
                setuploadIfpsData(result?.data);
                if (collectedUserType === 'decentralized') {
                    createNft(result?.data);
                } else {
                    handleCreateCentralized(privateKeyNew, result?.data);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage(result?.message);
            }
        });
    }

    const createNft = async (uploadIfpsData) => {
        try {
            LoaderHelper.loaderStatus(true);
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0]
            let metadata = uploadIfpsData
            let data = await contract_interaction.methods.mintCreator(account, metadata,).send({ from: account }, (err, transactionHash) => {
            })
            setTokenId(web3.utils.hexToNumber(data?.events?.Transfer?.raw?.topics[3]))
            if (data?.status) {
                handleCreateNft(walletNetwork, price, minimumBid, startingDate, expirationDate, totalExpirationDate, collectionName, collection, description, royalties, PropertiesData, fixedPrice, checkboxButton, walletAddress, featuredImage, web3.utils.hexToNumber(data?.events?.Transfer?.raw?.topics[3]), uploadIfpsData)
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }

    const handleCreateCentralized = async (privateKeyNew, uploadIfpsData) => {
        try {
            LoaderHelper.loaderStatus(true);
            const privateKeyOfwallet = privateKeyNew //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437" // Contract address we wish to interact with goes here        
            const tokenurl = uploadIfpsData // URL of metadata
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                data: await contract_interaction.methods.mintCreator(address, tokenurl).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            if (transactionReceipt?.status) {
                handleCreateNft(walletNetwork, price, minimumBid, startingDate, expirationDate, totalExpirationDate, collectionName, collection, description, royalties, PropertiesData, fixedPrice, checkboxButton, walletAddress, featuredImage, web3.utils.hexToNumber(transactionReceipt?.logs[0]?.topics[3]), uploadIfpsData, privateKeyNew)
            }
        } catch (error) {
            console.log(error, 'error');
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }


    const handleCreateNft = async (walletNetwork, price, minimumBid, startingDate, expirationDate, totalExpirationDate, collectionName, collection, description, royalties, PropertiesData, fixedPrice, checkboxButton, walletAddress, featuredImage, tokenId, uploadIfpsData, privateKeyNew) => {
        await AuthService.createNft(walletNetwork, price, minimumBid, startingDate, expirationDate, totalExpirationDate, collectionName, collection, description, royalties, PropertiesData, fixedPrice, checkboxButton, walletAddress, featuredImage, contract?.address, tokenId, uploadIfpsData).then(async result => {
            if (result.success) {
                try {
                    LoaderHelper.loaderStatus(false);
                    alertSuccessMessage(result.message);
                    handleResetInput();
                    mycollections();
                    navigate('/profile')
                    if (result?.data?.token_id && checkboxButton === 'true' && fixedPrice === 'fixed_price' && price) {
                        if (collectedUserType === 'centralized') {
                            approveNftCentralized(result?.data?.token_id, privateKeyNew)
                        } else {
                            approveNft(result?.data?.token_id)
                        }
                    } else if (result?.data?.token_id && checkboxButton === 'true' && fixedPrice === 'timed_auction' && price && minimumBid) {
                        if (collectedUserType === 'centralized') {
                            approveMakeanOfferCenterLized(result?.data?.token_id, privateKeyNew);
                        } else {
                            approveMakeanOffer(result?.data?.token_id);
                        }
                    }
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                if (result.message === "jwt expired") {
                    navigate("/login");
                }
                LoaderHelper.loaderStatus(false);
                alertErrorMessage(result.message);
            }
        });
    }

    const handleSellStatusSellNow = async (tokenid) => {
        await AuthService.sellStautsSellNow(tokenid, newTokenAddress, userDetails?._id, price).then(async result => {
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

    const handleSellStatusAuctionNow = async (tokenid) => {
        await AuthService.sellStautsAuctionNow(tokenid, newTokenAddress, userDetails?._id, price).then(async result => {
            if (result.success) {
                try {
                    handleuserProfile();
                } catch (error) {
                    // alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                // alertErrorMessage(result.message);
            }
        });
    }

    const approveNft = async (tokenid) => {
        try {
            LoaderHelper.loaderStatus(true);
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenId = parseInt(tokenid);
            var hexaDecimal = "0x" + (tokenId).toString(16);
            const approveTx = await contract_interaction.methods.approve(contract.marketplaceAddress, hexaDecimal).send({ from: account })
            if (approveTx?.status === true) {
                sellNft(tokenid)
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }

    const sellNft = async (tokenid) => {
        try {
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenId = parseInt(tokenid);
            var hexaDecimalToken = "0x" + (tokenId).toString(16);
            const numberToHex = (_num) => {
                var inputAmt = _num;
                var weiAmt = (1000000000000000000 * inputAmt);
                var hexaDecimal = "0x" + weiAmt.toString(16);
                return hexaDecimal;
            }
            let buyNowPrice = numberToHex(price)
            const tx = await marketplace.methods.createSale(contract.nftAddress, hexaDecimalToken, buyNowPrice).send({ from: account })
            if (tx?.status === true) {
                LoaderHelper.loaderStatus(false);
                alertSuccessMessage('Sell Nft Successfully')
                handleSellStatusSellNow(tokenid);
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            // alertErrorMessage(error?.message)
        }
    }


    const approveNftCentralized = async (tokenid, privateKeyNew) => {
        try {
            LoaderHelper.loaderStatus(true);
            const privateKeyOfwallet = privateKeyNew //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437" // NFt contract address
            let tokenId = parseInt(tokenid);  //convert to hex
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                data: await contract_interaction.methods.approve(contract.marketplaceAddress, tokenId).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            if (transactionReceipt?.status) {
                sellNftCentralized(tokenid, privateKeyNew)
            }
        } catch (error) {
            console.log(error, 'alertErrorMessage');
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }

    const sellNftCentralized = async (tokenid, privateKeyNew) => {
        try {
            const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
            const privateKeyOfwallet = privateKeyNew //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0x4b80Efd0087F255DAf1F4b43D99948b0e6356481" // Auction contract address
            let tokenId = parseInt(tokenid); //convert to hex
            const numberToHex = (_num) => {
                var inputAmt = _num;
                var weiAmt = (1000000000000000000 * inputAmt);
                var hexaDecimal = "0x" + weiAmt.toString(16);
                return hexaDecimal;
            }
            let buyNowPrice = numberToHex(price)//convert to hex
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                data: await contract_interaction.methods.createSale(contract.nftAddress, tokenId, buyNowPrice).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            if (transactionReceipt?.status === true) {
                LoaderHelper.loaderStatus(false);
                alertSuccessMessage('Sell Nft Successfully')
                handleSellStatusSellNow(tokenid);
            }
        } catch (error) {
            console.log(error.message);
            LoaderHelper.loaderStatus(false);
            alertErrorMessage('Transaction has been reverted by the EVM')
        }
    }


    const approveMakeanOffer = async (tokenid) => {
        try {
            LoaderHelper.loaderStatus(true);
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenId = parseInt(tokenid);
            var hexaDecimal = "0x" + (tokenId).toString(16);
            const approveTx = await contract_interaction.methods.approve(contract.marketplaceAddress, hexaDecimal).send({ from: account })
            if (approveTx?.status === true) {
                createAuction(tokenid)
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }

    const bidTimeCoustam = new Date().getTime() + (startingDate * 86400000);


    const createAuction = async (tokenid) => {
        try {
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenId = parseInt(tokenid);

            var weiAmtPrice = (1000000000000000000 * minimumBid);
            let minPrice = "0x" + weiAmtPrice.toString(16); //hex format

            var weiAmtBuyPrice = (1000000000000000000 * price);
            let buyNowPrice = "0x" + weiAmtBuyPrice.toString(16); //hex format

            var bidPeriods = bidTimeCoustam
            const tx = await marketplace.methods.createNewNftAuction(contract.nftAddress, tokenId, minPrice, buyNowPrice, bidPeriods).send({ from: account })
            if (tx?.status === true) {
                LoaderHelper.loaderStatus(false);
                alertSuccessMessage('Successfully Created Auction')
                handleSellStatusAuctionNow(tokenid);
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage('MinPrice &gt; 80% of BuyNowPrice');
        }
    }


    const approveMakeanOfferCenterLized = async (tokenid, privateKeyNew) => {
        try {
            LoaderHelper.loaderStatus(true);
            const privateKeyOfwallet = privateKeyNew //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437" // NFt contract address
            let tokenId = parseInt(tokenid);  //convert to hex
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                data: await contract_interaction.methods.approve(contract.marketplaceAddress, tokenId).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            if (transactionReceipt?.status) {
                createAuctionCentralized(tokenid, privateKeyNew)
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }

    const createAuctionCentralized = async (tokenid, privateKeyNew) => {
        try {
            const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
            const privateKeyOfwallet = privateKeyNew //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0x4b80Efd0087F255DAf1F4b43D99948b0e6356481" // Auction contract address
            let tokenId = parseInt(tokenid);
            var weiAmtPrice = (1000000000000000000 * minimumBid);
            let minPrice = "0x" + weiAmtPrice.toString(16); //hex format
            var weiAmtBuyPrice = (1000000000000000000 * price);
            let buyNowPrice = "0x" + weiAmtBuyPrice.toString(16); //hex format
            var bidPeriods = bidTimeCoustam
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                data: await contract_interaction.methods.createNewNftAuction(contract.nftAddress, tokenId, minPrice, buyNowPrice, bidPeriods).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            if (transactionReceipt?.status === true) {
                LoaderHelper.loaderStatus(false);
                alertSuccessMessage('Successfully Create Auction');
                handleSellStatusAuctionNow(tokenid);
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage('MinPrice &gt; 80% of BuyNowPrice');
        }
    }

    return (
        <>
            <div className="page_wrapper create_form" ref={messagesEndRef} >
                <section className="inner-page-banner explore_banner_inner">
                    <div className="container">
                        <div className="inner_header_page inner_header_page_center justify-content-center" >
                            <div className="innertext-start  text-center">
                                <h1 className="title">Create New NFT</h1>
                                {/* <button type="button" onClick={runApp} >ttyuadsgdhsad</button> */}
                                <hr />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="form_sec" >
                    <div className="container" >
                        <div className="row justify-content-center" >
                            <div className="col-xl-8" >
                                <div className="main_panel nft_c_bar" >
                                    <div className="nft_main_bar side_main_panel" >
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
                                        <div className="form-group" >
                                            <label className="up_label" >
                                                Upload File<em className="text-danger">*</em>
                                            </label>
                                            <div className=" upload-area" >
                                                <div class="brows-file-wrapper file_wrapper_mini ">
                                                    <input name="file" id="file" type="file" class="inputfile" data-multiple-caption="{count} files selected" multiple onChange={handleUploadImage} />
                                                    <label for="file" title="No File Choosen">
                                                        <i class="ri-image-line"></i>
                                                        <span class="text-center">Choose a File</span>
                                                    </label>
                                                </div>
                                                {
                                                    !bannerImage ?
                                                        <span className="text-danger mt-2" >Upload Image For Create Nft</span>
                                                        :
                                                        null
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group" >
                                            <div className="d-flex justify-content-between" >
                                                <div>
                                                    <label className="up_label" >
                                                        Put on marketplace
                                                    </label>
                                                    <span>
                                                        Enter price to allow users instantly purchase your NFT
                                                    </span>
                                                </div>

                                                <label class="switch">
                                                    <input type="checkbox" onClick={handleOncheck} />
                                                    <span class="slider"></span>
                                                </label>
                                            </div>
                                            {
                                                checkboxButton === 'true' ?
                                                    <>
                                                        <ul class="nav nav-tabs pom_tabs" id="myTab" role="tablist">
                                                            <li class="nav-item" role="presentation" onClick={handleFixedPrice}>
                                                                <button class="nav-link pom_links active" id="fixed_price-tab" data-bs-toggle="tab" data-bs-target="#fixed_price" type="button" role="tab" aria-controls="fixed_price" aria-selected="true" >
                                                                    <div><i class="ri-price-tag-3-line"></i>
                                                                        <span > Fixed price  </span>  </div>
                                                                </button>
                                                            </li>
                                                            <li class="nav-item" role="presentation" onClick={handleTimeAuction}>
                                                                <button class="nav-link pom_links" id="timed_auction-tab" data-bs-toggle="tab" data-bs-target="#timed_auction" type="button" role="tab" aria-controls="timed_auction" aria-selected="true" >
                                                                    <div>
                                                                        <i class="ri-timer-line"></i>
                                                                        Timed auction
                                                                    </div>
                                                                </button>
                                                            </li>
                                                        </ul>

                                                        <div class="tab-content pom_tab_content " id="myTabContent">
                                                            <div class="tab-pane show active" id="fixed_price" role="tabpanel" aria-labelledby="fixed_price-tab">
                                                                <div class="field-box form-group">
                                                                    <label for="name" class="up_label">Your Price </label>
                                                                    <input type="text" placeholder="Enter your Price" value={price} onChange={(event) => setPrice(event.target.value)} />
                                                                </div>
                                                            </div>
                                                            <div class="tab-pane" id="timed_auction" role="tabpanel" aria-labelledby="timed_auction-tab">
                                                                <div class="field-box form-group">
                                                                    <label for="name" class="up_label">Minimum bid </label>
                                                                    <div className="vew_pss otp_btn" >
                                                                        <input id="name" type="text" className="" placeholder="Enter your Price" value={minimumBid} onChange={(event) => setMinimumBid(event.target.value)} />
                                                                        <span className="btn_view btn-icon"> ETH </span>
                                                                    </div>
                                                                </div>
                                                                <div class="field-box form-group">
                                                                    <label for="name" class="up_label">Your Price </label>
                                                                    <input type="text" placeholder="Enter your Price" value={price} onChange={(event) => setPrice(event.target.value)} />
                                                                    {
                                                                        price && minimumBid ?
                                                                            price <= minimumBid ?
                                                                                <span className="text-danger mt-2">Please Enter Price Greater Then Minimum bid </span>
                                                                                :
                                                                                null
                                                                            :
                                                                            null
                                                                    }
                                                                </div>
                                                                <div className="row" >
                                                                    <div className="col-12" >
                                                                        <div class="field-box form-group">
                                                                            <label for="name" class="up_label">Auction Period </label>
                                                                            <input id="name" type="number" className="" placeholder="Enter Auction Period Day" value={startingDate} onChange={(event) => setStartingDate(event.target.value)} />

                                                                            {
                                                                                !startingDate ?
                                                                                    <span className="text-danger mt-2" >Enter Minimum 1 Day For Create Auction</span>
                                                                                    :
                                                                                    null
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    {/* <div className="col-6" >
                                                                        <div class="field-box form-group">
                                                                            <label for="name" class="up_label"> Expiration Date </label>
                                                                            <input id="name" type="date" className="" placeholder="Enter your Price" value={expirationDate} onChange={(event) => setExpirationDate(event.target.value)} />
                                                                        </div>
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="field-box form-group">
                                                            <label for="name" class="up_label">Date of expiration<em className="text-danger" >*</em> </label>
                                                            <select className="form-select" value={totalExpirationDate} onChange={(event) => setTotalExpirationDate(event.target.value)}>
                                                                <option value="2"> 2 Months </option>
                                                                <option value="3"> 3 Months</option>
                                                                <option value="4"> 4 Months</option>
                                                                <option value="5"> 5 Months</option>
                                                                <option value="6"> 6 Months</option>
                                                                <option value="7"> 7 Months </option>
                                                            </select>
                                                        </div>
                                                    </>
                                                    :
                                                    ""
                                            }
                                        </div>
                                        <div class="field-box form-group">
                                            <label for="name" class="up_label">Choose Collection <em className="text-danger" >*</em> </label>
                                            <div className="cc_grid" >
                                                <Link to="/new_collection" className="cc_card" >
                                                    <div class="cc_card-body active">
                                                        <div>
                                                            <i class="ri-add-circle-fill"></i>
                                                            <div class="content_head">Create New</div>
                                                        </div>
                                                    </div>
                                                </Link>
                                                {collectionData.length > 0 ?
                                                    collectionData.map(item =>
                                                        <label className="cc_card" >
                                                            <input type="radio" name="bitcoin" class="card-input-element d-none" id="cc_1" value={collection} onChange={() => setCollection(item?._id)} />
                                                            <div class="cc_card-body">
                                                                <div>
                                                                    <img src={`${ApiConfig.baseUrl + item?.logo}`} class="img-fluid cc_card_img" />
                                                                    <div class="content_head">{item?.name}</div>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    ) : null}
                                            </div>
                                            {
                                                !collection ?
                                                    <span className="text-danger mt-2" >Please Choose Collection For Create Nft</span>
                                                    :
                                                    null
                                            }
                                        </div>

                                        <div class="field-box form-group">
                                            <div className="add_pls" >
                                                <div className="pls_text" >
                                                    <label for="name" class="up_label">Properties</label>
                                                    <span className="mb-0">Textual traits that show up as rectangles</span>
                                                </div>
                                                <button className="btn btn-icon  " data-bs-toggle="modal" data-bs-target="#add_pp" >
                                                    <i class="ri-add-line pe-0"></i>
                                                </button>
                                            </div>
                                            <div id="prop_grid" className="cc_grid cc_grid_mini mt-2" >
                                                {PropertiesData.length > 0 ?
                                                    PropertiesData.map(item =>
                                                        <label className="cc_card cc_card_mini" >
                                                            <div class="cc_card-body">
                                                                <div>
                                                                    <span className="text-primary" >{item?.trait_type}</span>
                                                                    <div class="content_head">{item?.value}</div>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    ) : null}
                                            </div>
                                            <hr />
                                        </div>
                                        <div class="field-box form-group">
                                            <label for="name" class="up_label">Name <em className="text-danger" >*</em> </label>
                                            <input id="name" type="text" placeholder="Enter your NFT name" value={collectionName} onChange={(event) => setCollectionName(event.target.value)} />
                                            {
                                                !collectionName ?
                                                    <span className="text-danger mt-2">Please Enter collection Name for Create Nft </span>
                                                    :
                                                    null

                                            }
                                        </div>
                                        <div class="field-box form-group">
                                            <label for="name" class="up_label">Description <em className="text-danger" >*</em> </label>
                                            <span>Spread some words about your token collection</span>
                                            <textarea rows="4" placeholder="Write about your collection" value={description} onChange={(event) => setDescription(event.target.value)}></textarea>
                                            {
                                                !description ?
                                                    <span className="text-danger mt-2">Please Enter Description for Create Nft </span>
                                                    :
                                                    null
                                            }
                                        </div>
                                        <div class="field-box form-group">
                                            <label for="name" class="up_label">Royalties <em className="text-danger" >*</em> </label>
                                            <span> <small>Suggested: 0%, 10%, 20%, 30%. Max. is 50%</small></span>
                                            <div class="vew_pss otp_btn">
                                                <input type="number" class="" placeholder="Enter your Royalties" value={royalties} onChange={(event) => setRoyalties(event.target.value)} /><span class="btn_view btn-icon"> % </span>
                                                {
                                                    !royalties ?
                                                        <span className="text-danger mt-2">Please Enter Royalties for Create Nft </span>
                                                        :
                                                        null
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group" >
                                            {
                                                collectedUserType === 'centralized' ?
                                                    <button type="button" class="btn btn-gradient btn-border-gradient px-5 btn-block w-100" data-bs-toggle="modal" data-bs-target="#enterpasswordmodal" disabled={!collection}> <span class="d-block w-100 text-center">CREATE NFT</span></button>
                                                    :
                                                    <button type="button" class="btn btn-gradient btn-border-gradient px-5 btn-block w-100" onClick={() => handleuploadIFPS(description, PropertiesData, collectionName)} disabled={!collection || !collectionName || !featuredImage || !description || !royalties}> <span class="d-block w-100 text-center">CREATE NFT</span></button>
                                            }

                                        </div>
                                    </div>
                                    <div className="sidepanel sidepanel_right sidepanel_fixed" >
                                        <label className="up_label">Preview</label>
                                        <div className="explore-style-one explore-style-overlay border-gradient">
                                            <div className="thumb">
                                                <Link to="#" className="ratio ratio-1x1">
                                                    {bannerImage ?
                                                        <img src={bannerImage} style={{ height: '100%' }} />
                                                        :
                                                        <img src='images/explore/13.jpg' alt="nft live auction thumbnail" />
                                                    }
                                                </Link>
                                            </div>
                                            <div className="content px-4">
                                                <div className="d-flex-between align-items-center">
                                                    <div>
                                                        <div className="header d-flex-between pt-4 pb-2">
                                                            <h3 className="title"><Link to="product-details.html">Name : {collectionName}</Link></h3>
                                                        </div>

                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="action-wrapper d-flex-between border-0 pb-4">
                                                    <span className="biding-price d-flex-center  text-white"> Price: {price ? price : 'Not For Sale'}</span>
                                                    <span className="biding-price d-flex-center  text-white">Max: {totalExpirationDate}</span>
                                                </div>
                                            </div>
                                            {/* prev_date */}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div class="modal fade" id="add_pp" tabindex="-1" aria-labelledby="add_ppLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header no-border flex-column px-8">
                            <h3 class="modal-title" id="add_ppLabel">Add Properties</h3>
                            <button type="button" class="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close"><i
                                class="ri-close-fill"></i></button>
                        </div>
                        <div class="modal-body px-8 ">
                            <div class="row gx-2 align-items-end" >
                                <div class="col-5" >
                                    <div class="form-group">
                                        <label>Type</label>
                                    </div>
                                </div>
                                <div class="col-7" >
                                    <div class="form-group">
                                        <label>Name</label>
                                    </div>
                                </div>
                            </div>
                            <form /* onSubmit={handleSubmit} */>
                                {
                                    PropertiesData.length > 0
                                        ? PropertiesData.map((details, index) => (
                                            <div id="add_property" className="property_item" key={index}>
                                                <div class="row gx-2 align-items-end" >
                                                    <div class="col-5" >
                                                        <div class="form-group">
                                                            <div className="d-flex align-items-center" >
                                                                <button type="button" className="btn btn-icon me-2 btn-gradient" onClick={() => handleRemoveSelectedRows(index)} ><i class="ri-close-line"></i></button>
                                                                <input type="text" class="form-control" placeholder="Property" aria-label="Recipient's username" aria-describedby="basic-addon2" name="name" value={details?.trait_type} onChange={(e) => handleCheck(index, e, 'trait_type')} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-7" >
                                                        <div class="form-group">
                                                            <input type="text" class="form-control" placeholder="Value" aria-label="Recipient's username" aria-describedby="basic-addon2" name="value" value={details?.value} onChange={(e) => handleCheck(index, e, 'value')} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                            </div>
                                        ))
                                        : null}

                                < div className="" >
                                    <button className="btn btn-gradient btn-border-gradient mt-4" type="button" onClick={handleNewRow}>
                                        Add More
                                    </button>
                                </div>
                                <hr />

                                <div class="modal-footer no-border px-8 pb-5">
                                    <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" data-bs-dismiss="modal"
                                        data-bs-toggle="modal" data-bs-target="#popup_bid_success" aria-label="Close" ><span>Save</span></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >


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

export default CreateNft