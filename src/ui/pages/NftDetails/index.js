import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import ProfilePage from "../ProfilePage";
import Web3 from "web3";
import contract from '../../../contract.json'
import { useAccount } from 'wagmi'
import { ApiConfig } from "../../../api/apiConfig/apiConfig";
import { $ } from "react-jquery-plugin";
import { BarChart } from 'react-charts-d3';

const NftDetails = (props) => {

    let walletType = props?.userid[2]
    const walletAddress = localStorage.getItem("wallet_address");
    const [nftDetails, setnftDetails] = useState();
    const [metaData, setmetaData] = useState();
    const [bnbBalance, setBnbBalance] = useState([])
    const [RentAmount, setRentAmount] = useState('');
    const [userTime, setUserTime] = useState('');
    const [ownerPercent, setOwnerPercent] = useState('');
    const [minimumPrice, setMinimumPrice] = useState('');
    const [buyPrice, setBuyPrice] = useState('');
    const [bidPeriod, setBidPeriod] = useState('');
    const [reportReason, setReportReason] = useState('')
    const [description, setDescription] = useState('')
    const [favouriteDataList, setFavouriteDataList] = useState([])
    const { address, isConnecting, isDisconnected } = useAccount()
    const [sellAmount, setsellAmount] = useState('');
    const [userDetails, setUserDetails] = useState([])
    const [password, setPassword] = useState('');
    const [dcryptPrivateKey, setDcryptPrivateKey] = useState([])
    const [centerlizedData, setCenterlizedData] = useState([])
    const [buttonType, setbuttonType] = useState('');

    const [activeScreen, setActiveScreen] = useState('nftDetails');

    const handleScreenTan = () => {
        setActiveScreen('profilePage')
    }

    const navigate = useNavigate();

    let screenTab = props?.userid[1]
    let newTokenAddress = '0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437'

    let web3
    if (!window.ethereum) {
        web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/")
    } else {
        web3 = new Web3(window.ethereum)
    }
    const nftContract = new web3.eth.Contract(contract.nftAbi, contract.nftAddress);
    const marketplace = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
    const messagesEndRef = useRef(null)

    const scrollTop = () => {
        messagesEndRef?.current?.scrollIntoView(true)
    }

    const data = [
        { key: 'Group 1', values: [{ x: 'A', y: 23 }, { x: 'B', y: 8 }] },
        { key: 'Group 2', values: [{ x: 'A', y: 15 }, { x: 'B', y: 37 }] },
    ];

    useEffect(() => {
        scrollTop();
        handleNftDetails();
        handleFavouriteData();
        handleuserProfile();
    }, []);

    const handleLogOut = () => {
        localStorage.clear();
        navigate("/login");
        window.location.reload();
    }

    const handleuserProfile = async () => {
        await AuthService.getUserDetails().then(async result => {
            if (result.success) {
                setUserDetails(result?.data);
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
            } else {
                //  alertErrorMessage('Raj');
                handleLogOut();
            }
        });
    }


    const handleSellStatusSellNow = async () => {
        await AuthService.sellStautsSellNow(props?.userid[0]?.token_id, newTokenAddress, props?.userid[0]?.owner_id, sellAmount).then(async result => {
            if (result.success) {
                try {
                    // alertSuccessMessage('');
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                // alertErrorMessage(result.message);
            }
        });
    }

    const handleSellStatusAuctionNow = async () => {
        await AuthService.sellStautsAuctionNow(props?.userid[0]?.token_id, newTokenAddress, props?.userid[0]?.owner_id, buyPrice).then(async result => {
            if (result.success) {
                try {
                    // alertSuccessMessage('');
                } catch (error) {
                    // alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                // alertErrorMessage(result.message);
            }
        });
    }

    useEffect(() => {
        balanceNft();
    })

    const balanceNft = async () => {
        const accounts = await web3.eth.getAccounts()
        const Balance = await web3.eth.getBalance(accounts[0])
        const account = accounts[0]
        setBnbBalance(Balance / 10 ** 18)
        const tx = await nftContract.methods.totalSupply().call()
    }

    const approveNft = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenId = parseInt(props?.userid[0]?.token_id);
            var hexaDecimal = "0x" + (tokenId).toString(16);
            const approveTx = await nftContract.methods.approve(contract.marketplaceAddress, hexaDecimal).send({ from: account })
            if (approveTx?.status === true) {
                sellNft()
                $("#checkout_modal").modal('hide');
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }

    const sellNft = async () => {
        try {
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenId = parseInt(props?.userid[0]?.token_id);
            var hexaDecimalToken = "0x" + (tokenId).toString(16);
            const numberToHex = (_num) => {
                var inputAmt = _num;
                var weiAmt = (1000000000000000000 * inputAmt);
                var hexaDecimal = "0x" + weiAmt.toString(16);
                return hexaDecimal;
            }
            let buyNowPrice = numberToHex(sellAmount)
            const tx = await marketplace.methods.createSale(contract.nftAddress, hexaDecimalToken, buyNowPrice).send({ from: account })
            if (tx?.status === true) {
                LoaderHelper.loaderStatus(false);
                handleSellStatusSellNow();
                alertSuccessMessage('Sell Nft Successfully')
                setActiveScreen('profilePage')
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }

    useEffect(() => {
        if (props?.userid[2] === 'centralized') {
            handleCenterlizedWalletData();
        }
    }, [props?.userid[2]])

    const handleCenterlizedWalletData = async () => {
        await AuthService.getCenterlizedWalletData().then(async result => {
            if (result.success) {
                setCenterlizedData(result?.data)
            }
        });
    }


    const handlebuttonSellType = () => {
        setbuttonType('sell')
    }

    const handlebuttonRentType = () => {
        setbuttonType('rent')
    }

    const handlebuttonAuctionType = () => {
        setbuttonType('auction')
    }


    const handleDecryptData = async (password) => {
        try {
            let dcrypt = await web3.eth.accounts.decrypt(centerlizedData?.wallet_data, password);
            setDcryptPrivateKey(dcrypt?.privateKey);
            if (dcrypt?.privateKey) {
                $("#enterpasswordmodal").modal('hide');
                if (buttonType === 'sell') {
                    $("#checkout_modal").modal('show');
                } else if (buttonType === 'rent') {
                    $("#checkout_modal_Rent").modal('show');
                } else {
                    $("#Auction_Now_Model").modal('show');
                }
            }
        } catch (error) {
            alertErrorMessage(error.message)
        }
    }

    const handleNftDetails = async () => {
        await AuthService.nftDetails(props?.userid[0]?.token_id, newTokenAddress).then(async result => {
            if (result.success) {
                try {
                    setnftDetails(result?.data)
                    setmetaData(JSON.parse(result?.data?.metadata))
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                // alertErrorMessage(result.message);
            }
        });
    }

    const approveNftCentralized = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const privateKeyOfwallet = dcryptPrivateKey //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437" // NFt contract address
            let tokenId = parseInt(props?.userid[0]?.token_id);  //convert to hex
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                data: await nftContract.methods.approve(contract.marketplaceAddress, tokenId).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            if (transactionReceipt?.status) {
                sellNftCentralized()
                $("#checkout_modal").modal('hide');
            }
        } catch (error) {
            console.log(error, 'Error');
            LoaderHelper.loaderStatus(false);
            alertErrorMessage('Something Went Wrong')
        }
    }

    const sellNftCentralized = async () => {
        try {
            const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
            const privateKeyOfwallet = dcryptPrivateKey //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0x4b80Efd0087F255DAf1F4b43D99948b0e6356481" // Auction contract address
            let tokenId = parseInt(props?.userid[0]?.token_id); //convert to hex
            const numberToHex = (_num) => {
                var inputAmt = _num;
                var weiAmt = (1000000000000000000 * inputAmt);
                var hexaDecimal = "0x" + weiAmt.toString(16);
                return hexaDecimal;
            }
            let buyNowPrice = numberToHex(sellAmount)//convert to hex
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
                handleSellStatusSellNow();
                setActiveScreen('profilePage')
            }
        } catch (error) {
            console.log(error);
            LoaderHelper.loaderStatus(false);
            alertErrorMessage('Transaction has been reverted by the EVM')
        }
    }

    const handleSellStatusRent = async () => {
        await AuthService.sellStautsRent(props?.userid[0]?.token_id, newTokenAddress, props?.userid[0]?.owner_id, RentAmount).then(async result => {
            if (result.success) {
                try {
                    // alertSuccessMessage('');
                } catch (error) {
                    // alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                // alertErrorMessage(result.message);
            }
        });
    }

    const approveRentNft = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenId = parseInt(props?.userid[0]?.token_id);
            var hexaDecimal = "0x" + (tokenId).toString(16);
            const approveTx = await nftContract.methods.approve(contract.marketplaceAddress, hexaDecimal).send({ from: account })
            if (approveTx?.status) {
                putNftOnRent()
                $("#checkout_modal_Rent").modal('hide');
            }
        } catch (error) {
            console.log(error);
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }

    }

    const putNftOnRent = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenId = parseInt(props?.userid[0]?.token_id);
            var hexaDecimalToken = "0x" + (tokenId).toString(16);
            let newTime = userTime * 86400
            var time = "0x" + newTime.toString(16);//hex format
            var weiAmtPrice = (1000000000000000000 * RentAmount);
            var price = "0x" + weiAmtPrice.toString(16);//hex format
            var ownerPercents = "0x" + ownerPercent.toString(16);//hex format
            let autoRent = 'true'
            const tx = await marketplace.methods.putOnRent(time, price, ownerPercents, autoRent, tokenId, contract.nftAddress).send({ from: account })
            if (tx?.status === true) {
                LoaderHelper.loaderStatus(false);
                alertSuccessMessage('Successfully Rented');
                handleSellStatusRent();
                setActiveScreen('profilePage')
            }
        } catch (error) {
            console.log(error);
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }

    const approveNftCentralizedRent = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const privateKeyOfwallet = dcryptPrivateKey //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437" // NFt contract address
            let tokenId = parseInt(props?.userid[0]?.token_id);  //convert to hex
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                data: await nftContract.methods.approve(contract.marketplaceAddress, tokenId).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            if (transactionReceipt?.status) {
                putNftOnRentCentralized()
                $("#checkout_modal_Rent").modal('hide');
            }
        } catch (error) {
            console.log(error, 'Error');
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }

    }

    const putNftOnRentCentralized = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
            const privateKeyOfwallet = dcryptPrivateKey //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0x4b80Efd0087F255DAf1F4b43D99948b0e6356481" // Auction contract address
            let tokenId = parseInt(props?.userid[0]?.token_id);//convert to hex
            let newTime = userTime * 86400
            var time = "0x" + newTime.toString(16);//hex format
            var weiAmtPrice = (1000000000000000000 * RentAmount);
            var price = "0x" + weiAmtPrice.toString(16);//hex format
            var ownerPercents = "0x" + ownerPercent.toString(16);//hex format
            let autoRent = 'true'
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                data: await contract_interaction.methods.putOnRent(time, price, ownerPercents, autoRent, tokenId, contract.nftAddress).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            if (transactionReceipt?.status === true) {
                LoaderHelper.loaderStatus(false);
                handleSellStatusRent();
                alertSuccessMessage('Successfully Rented');
                setActiveScreen('profilePage')
            }
        } catch (error) {
            console.log(error, 'Error');
            LoaderHelper.loaderStatus(false);
            alertErrorMessage('MinPrice &gt; 80% of BuyNowPrice')
        }
    }

    const approveMakeanOffer = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenId = parseInt(props?.userid[0]?.token_id);
            var hexaDecimal = "0x" + (tokenId).toString(16);
            const approveTx = await nftContract.methods.approve(contract.marketplaceAddress, hexaDecimal).send({ from: account })
            if (approveTx?.status === true) {
                createAuction()
                $("#Auction_Now_Model").modal('hide');
            }
        } catch (error) {
            console.log(error);
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }

    const rajendra = new Date().getTime() + (bidPeriod * 86400000);
    
    const createAuction = async () => {
        try {
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenId = parseInt(props?.userid[0]?.token_id);
            var hexaDecimalToken = "0x" + (tokenId).toString(16);
            var weiAmtPrice = (1000000000000000000 * minimumPrice);
            let minPrice = "0x" + weiAmtPrice.toString(16); //hex format
            var weiAmtBuyPrice = (1000000000000000000 * buyPrice);
            let buyNowPrice = "0x" + weiAmtBuyPrice.toString(16); //hex format
            var bidPeriods = rajendra
            const tx = await marketplace.methods.createNewNftAuction(contract.nftAddress, tokenId, minPrice, buyNowPrice, bidPeriods).send({ from: account })
            if (tx?.status === true) {
                LoaderHelper.loaderStatus(false);
                alertSuccessMessage('Successfully Created Auction')
                handleSellStatusAuctionNow();
                setActiveScreen('profilePage')
            }
        } catch (error) {
            console.log(error);
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }

    const approveMakeanOfferCenterLized = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const privateKeyOfwallet = dcryptPrivateKey //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437" // NFt contract address
            let tokenId = parseInt(props?.userid[0]?.token_id);  //convert to hex
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                data: await nftContract.methods.approve(contract.marketplaceAddress, tokenId).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            if (transactionReceipt?.status) {
                createAuctionCentralized()
                $("#Auction_Now_Model").modal('hide');
            }
        } catch (error) {
            console.log(error);
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }

    const createAuctionCentralized = async () => {
        try {
            const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
            const privateKeyOfwallet = dcryptPrivateKey //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0x4b80Efd0087F255DAf1F4b43D99948b0e6356481" // Auction contract address
            let tokenId = parseInt(props?.userid[0]?.token_id);
            var hexaDecimalToken = "0x" + (tokenId).toString(16);
            var weiAmtPrice = (1000000000000000000 * minimumPrice);
            let minPrice = "0x" + weiAmtPrice.toString(16); //hex format
            var weiAmtBuyPrice = (1000000000000000000 * buyPrice);
            let buyNowPrice = "0x" + weiAmtBuyPrice.toString(16); //hex format
            // let newTime = bidPeriod  * 86400
            var bidPeriods = rajendra
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
                handleSellStatusAuctionNow();
                alertSuccessMessage('Successfully Auction');
                setActiveScreen('profilePage')
            }
        } catch (error) {
            console.log(error);
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }


    const handleCollectionDetailsReport = async (reportReason, description) => {
        await AuthService.nftDetailsReport(props?.userid[0]?._id, reportReason, description).then(async result => {
            if (result.success) {
                alertSuccessMessage('done')
                $("#reportmodal").modal('hide');
            }
        });
    }

    const handleFavouriteData = async () => {
        await AuthService.getFavouriteData().then(async result => {
            if (result.success) {
                setFavouriteDataList(result?.data)
            } else {
                // alertErrorMessage(result.message);
            }
        });
    }

    const handleAddFavourite = async (status) => {
        await AuthService.setFavouriteDataNft(props?.userid[0]?.id, status).then(async result => {
            if (result.success) {
                // alertSuccessMessage(result?.message);
            } else {
                alertErrorMessage(result?.message);
            }
        });
    }

    return (
        activeScreen === "nftDetails" ?
            <>
                <div class="page_wrapper" ref={messagesEndRef}>
                    <section class="product-details section-bg-separation-2 pt-125 pb-90">
                        <div class="container">
                            <div class="row">
                                <div class="col-xxl-5 col-lg-6 mb-3">
                                    <div class="custom-tab-content p-0 explore-style-one">
                                        <div class="thumb-header" >
                                            <button class="reaction-btn liked" onClick={() => handleAddFavourite()}>
                                                <span>12</span>
                                                <i class="ri-heart-line"></i>
                                            </button>
                                            <div className="d-flex align-items-center" >
                                                {/* <button class="reaction-btn total-watch left" data-bs-toggle="tooltip" data-bs-placement="top" title="Total Watch">
                                                    <img src="images/eth_white.svg" width="22" height="22" />
                                                </button> */}
                                                <button class="reaction-btn liked left ps-0" onClick={handleScreenTan}  >
                                                    <i class="ri-arrow-left-line ps-0 pe-2"></i>
                                                    <span>Back</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="thumb">
                                            <div className="ratio ratio-1x1" >
                                                <img src={`${ApiConfig.baseUrl + props?.userid[0]?.file}`} class="img-fluid" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xxl-7 col-lg-6 mb-6 mb-6">
                                    <div class="details-content">
                                        <div class="d-flex-between" >
                                            {/* <Link class=""> Back </Link> */}
                                            <Link class="" to="#" > {props?.userid[0]?.name}</Link>
                                            <div class="user_control m-0" >
                                                <ul class="nav">
                                                    <li class="dropdown">
                                                        <Link class="btn-icon" to="#" role="button" id="dropdownMenuLink1" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <i class="ri-share-fill"></i>
                                                        </Link>
                                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink1">
                                                            <li><Link class="dropdown-item" onClick={() => navigator.clipboard.writeText("https://appinopinfo.com")}><i class="ri-file-copy-fill me-2"></i> Copy Link</Link></li>
                                                            <li><Link class="dropdown-item" to="https://www.facebook.com/" target='_blank'><i class="ri-facebook-circle-fill me-2"></i>  Share on Facebook</Link></li>
                                                            <li><Link class="dropdown-item" to="https://twitter.com/i/flow/login" target='_blank'> <i class="ri-twitter-fill me-2"></i> Share On Twitter</Link></li>
                                                            <li><Link class="dropdown-item" to="https://web.whatsapp.com/" target='_blank'> <i class="ri-whatsapp-fill me-2"></i> Share On Whatsapp</Link></li>
                                                        </ul>
                                                    </li>
                                                    {/* <li class="dropdown">
                                                        <Link class="btn-icon" to="#" target="_blank" >
                                                            <i class="ri-fullscreen-fill"></i>
                                                        </Link>
                                                    </li> */}
                                                    <li class="dropdown">
                                                        <Link class="btn-icon" to="#" role="button" id="dropdownMenuLink2" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <i class="ri-more-fill"></i>
                                                        </Link>
                                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                                                            <li><Link class="dropdown-item" to="/update_profile"> <i class="ri-settings-3-line me-2"></i> Settings</Link></li>
                                                            <li><Link class="dropdown-item" to="#"> <i class="ri-list-check-2 me-2"></i> Featured items</Link></li>
                                                            <li><Link class="dropdown-item" to="" > <i class="ri-flag-fill me-2"></i> <span data-bs-toggle="modal" data-bs-target="#reportmodal"  >Report</span>  </Link></li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <h2 class="main_title mb-0">{props?.userid[0]?.token_id}</h2>
                                        <p class="subtitle">Owned by <Link to="#" >{props?.userid[0]?.name}</Link></p>
                                        <div class="view_count d-flex-center" > <i class="ri-eye-line me-2"></i> 0 View</div>
                                        <div class="custom-tab-content mt-7" >
                                            <div class="sale_counter">  </div>
                                            <div class="bid_price" >


                                                {props?.userid[0]?.sell_type === 'on_sell' || props?.userid[0]?.sell_type === 'on_rent' || props?.userid[0]?.sell_type === 'on_auction' ?
                                                    <>
                                                        <div class="row gx-2" >
                                                            <div class="col-md-4" >
                                                                <Link data-bs-toggle="modal" class="btn  btn-lg btn-gradient w-100 justify-content-center disabled  btn-border-gradient">
                                                                    {
                                                                        props?.userid[0]?.sell_type === 'on_sell' ? <span> ON SELL </span> : <span> SELL NOW </span>
                                                                    }
                                                                </Link>
                                                            </div>
                                                            <div class="col-md-4" >
                                                                <Link data-bs-toggle="modal" class="btn  btn-lg btn-gradient w-100 justify-content-center disabled btn-border-gradient">
                                                                    {
                                                                        props?.userid[0]?.sell_type === 'on_rent' ? <span> ON RENT </span> : <span> RENT NOW </span>
                                                                    }
                                                                </Link>
                                                            </div>
                                                            <div class="col-md-4" >
                                                                <Link data-bs-toggle="modal" class="btn  btn-lg btn-gradient w-100 disabled justify-content-center  btn-border-gradient" >
                                                                    {
                                                                        props?.userid[0]?.sell_type === 'on_auction' ? <span> ON Auction </span> : <span> AUCTION NOW </span>
                                                                    }
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </>
                                                    :
                                                    <div class="row gx-2" >
                                                        <div class="col-md-4" >
                                                            {

                                                                walletType === 'centralized' ?
                                                                    <Link data-bs-toggle="modal" data-bs-target="#enterpasswordmodal" to="#" class="btn  btn-lg btn-gradient w-100 justify-content-center mt-6 btn-border-gradient" onClick={handlebuttonSellType}>
                                                                        <span> Sell now </span>
                                                                    </Link>
                                                                    :
                                                                    <Link data-bs-toggle="modal" data-bs-target="#checkout_modal" to="#" class="btn  btn-lg btn-gradient w-100 justify-content-center mt-6 btn-border-gradient">
                                                                        <span> Sell now </span>
                                                                    </Link>

                                                            }
                                                        </div>
                                                        <div class="col-md-4" >
                                                            {
                                                                walletType === 'centralized' ?
                                                                    <Link data-bs-toggle="modal" data-bs-target="#enterpasswordmodal" to="#" class="btn  btn-lg btn-gradient w-100 justify-content-center mt-6 btn-border-gradient" onClick={handlebuttonRentType}>
                                                                        <span> Rent now </span>
                                                                    </Link>
                                                                    :
                                                                    <Link data-bs-toggle="modal" data-bs-target="#checkout_modal_Rent" to="#" class="btn  btn-lg btn-gradient w-100 justify-content-center mt-6 btn-border-gradient">
                                                                        <span> Rent now </span>
                                                                    </Link>
                                                            }
                                                        </div>
                                                        <div class="col-md-4" >
                                                            {
                                                                walletType === 'centralized' ?
                                                                    <Link data-bs-toggle="modal" data-bs-target="#enterpasswordmodal" to="#" class="btn  btn-lg btn-gradient w-100 justify-content-center mt-6 btn-border-gradient" onClick={handlebuttonAuctionType}>
                                                                        <span> Auction now </span>
                                                                    </Link>
                                                                    :
                                                                    <Link data-bs-toggle="modal" data-bs-target="#Auction_Now_Model" to="#" class="btn  btn-lg btn-gradient w-100 justify-content-center mt-6 btn-border-gradient">
                                                                        <span> Auction now </span>
                                                                    </Link>
                                                            }
                                                        </div>
                                                    </div>

                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row" >
                                <div class="col-xxl-5 col-lg-6" >
                                    <div class="list_card border-gradient mb-6 p-0  no-shadow" >
                                        <div class="list-header d-flex-between" >
                                            <p class="mb-0  d-flex-center"><i class="ri-file-list-line me-3"></i> Description</p>
                                        </div>
                                        <div class="list-body border-top" >
                                            <p class="mb-0">By <strong><Link to="#" > {props?.userid[0]?.name} </Link></strong></p>
                                            <p class="mb-0" >{metaData?.description}</p>
                                        </div>
                                        <div class="accordion" id="accordionnft_details">
                                            <div class="accordion-item">
                                                <p class="accordion-header" id="Properties">
                                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                        <i class="ri-bookmark-fill me-3"></i> Properties
                                                    </button>
                                                </p>
                                                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="Properties" data-bs-parent="#accordionnft_details">
                                                    <div class="accordion-body py-5px px-0">
                                                        <div class="sc_sec" >
                                                            {metaData?.attributes?.map((data) => {
                                                                return (
                                                                    <Link to="#" class="sc_card border-gradient" >
                                                                        <div class="sc_body" >
                                                                            <div class="sc_sub" >{data?.trait_type}</div>
                                                                            <p class="sc_title" >{data?.value}</p>
                                                                        </div>
                                                                    </Link>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="accordion-item">
                                                <p class="accordion-header" id="About_acc">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                        <i class="ri-list-check-2 me-3"></i> About {userDetails?.username}
                                                    </button>
                                                </p>
                                                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="About_acc" data-bs-parent="#accordionnft_details">
                                                    <div class="accordion-body">
                                                        <strong>{userDetails?.profile_description}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="accordion-item">
                                                <p class="accordion-header" id="DetailsAcc">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                        <i class="ri-list-unordered me-3"></i> Details
                                                    </button>
                                                </p>
                                                <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="DetailsAcc" data-bs-parent="#accordionnft_details">
                                                    <div class="accordion-body">
                                                        <ul class="sc_list" >
                                                            <li>Token address <span><Link to="#" >{nftDetails?.token_address}</Link></span></li>
                                                            <li>Token ID <span><Link to="#" >{nftDetails?.token_id}</Link></span></li>
                                                            <li>Token Standard <span>{nftDetails?.contract_type}</span></li>
                                                            <li>Token Type <span>{walletType}</span></li>
                                                            <li>Creator Fee <span>0%</span></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xxl-7 col-lg-6" >
                                    <div class="list_card border-gradient mb-6 p-0  no-shadow" >
                                        <div class="accordion" id="accordionnft_ph_history">
                                            <div class="accordion-item">
                                                <p class="accordion-header" id="ph_history">
                                                    <button class="accordion-button no-border" type="button" data-bs-toggle="collapse" data-bs-target="#ph_historyOne" aria-expanded="true" aria-controls="ph_historyOne">
                                                        <i class="ri-bookmark-fill me-3"></i> Price History
                                                    </button>
                                                </p>
                                                <div id="ph_historyOne" class="accordion-collapse collapse show" aria-labelledby="ph_history" data-bs-parent="#accordionnft_ph_history">
                                                    <div class="accordion-body p-0">
                                                        <div class="py-5 text-center">
                                                            <BarChart data={data} />

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12" >
                                    <div class="list_card border-gradient p-0  no-shadow" >
                                        <div class="accordion" id="accordionnft_ph_Activity">
                                            <div class="accordion-item">
                                                <p class="accordion-header" id="ph_Activity">
                                                    <button class="accordion-button no-border" type="button" data-bs-toggle="collapse" data-bs-target="#ph_ActivityOne" aria-expanded="true" aria-controls="ph_ActivityOne">
                                                        <i class="ri-arrow-up-down-line me-3"></i>  Item Activity
                                                    </button>
                                                </p>
                                                <div id="ph_ActivityOne" class="accordion-collapse collapse show" aria-labelledby="ph_Activity" data-bs-parent="#accordionnft_ph_Listings">
                                                    <div class="accordion-body p-0 px-3">
                                                        <div class="py-4 px-2" >
                                                            <div class="iterfsh pb-0">
                                                                <div class="itfrsh_start">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="table-responsive">
                                                            <table class="table text-white table-mini ">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col">Collection</th>
                                                                        <th scope="col">Volume</th>
                                                                        <th scope="col">%Change</th>
                                                                        <th scope="col">Floor price</th>
                                                                        <th scope="col">Sales</th>
                                                                        <th scope="col"></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {favouriteDataList.length > 0
                                                                        ? favouriteDataList.map((item, index) => (
                                                                            <tr>
                                                                                <td scope="row">
                                                                                    <div className="d-flex-center avatar-info item_info">
                                                                                        <span className="me-3" >{++index}</span>
                                                                                        <div className="thumb-wrapper">
                                                                                            <Link to="#" className="thumb">
                                                                                                <img src={`${ApiConfig.baseUrl + item?.logo}`} alt="top sellter" className="" />
                                                                                            </Link>
                                                                                        </div>
                                                                                        {/* <!-- End .thumb-wrapper --> */}
                                                                                        <div className="content">
                                                                                            <p className="title mb-0 "><Link to="#">{item?.name}
                                                                                                {/* <img src="images/verified.png" className="img-fluid verify_img" /> */}
                                                                                            </Link>
                                                                                            </p>
                                                                                        </div>

                                                                                        {/* <!-- End .content --> */}
                                                                                    </div>
                                                                                </td>
                                                                                <td>0</td>
                                                                                <td><span className="text-danger" >0%</span></td>
                                                                                <td>0 ETH</td>
                                                                                <td>0</td>
                                                                                <td>
                                                                                    <button className="btn-icon star-icon" type="button"/*  onClick={() => handleFavourite(item)} */>
                                                                                        {/* <i className={item?.favourites[0] ? "ri-star-fill" : "ri-star-line"} ></i> */}
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                        : null}
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
                    </section>
                    {/* <section class="ptb-100 live-auction more_collection">
                        <div class="container">
                            <div class="section-title">
                                <h2>More from this collection</h2>
                            </div>
                            <div class="row">
                                <div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6  mb-6">
                                    <div class="explore-style-one explore-style-overlay border-gradient">
                                        <div class="thumb">
                                            <Link to="/product_details"><img src="images/explore/13.jpg" alt="nft live auction thumbnail" /></Link>
                                        </div>
                                        <div class="content px-4">
                                            <div class="d-flex-between align-items-center" >
                                                <div>
                                                    <div class="header d-flex-between pt-4 pb-2">
                                                        <h3 class="title"><Link to="/product_details">God Watching</Link></h3>

                                                    </div>
                                                    <div class="product-owner d-flex-between">
                                                        <span class="bid-owner text-secondry d-flex align-items-center">
                                                            <Link to="author-profile.html">God’s world
                                                                <img src="images/verified.png" class="img-fluid verify_img" />
                                                            </Link>
                                                        </span>
                                                    </div>
                                                </div>
                                                <span class="biding-price d-flex-center text-white">  #556 </span>
                                            </div>
                                            <hr />
                                            <div class="action-wrapper d-flex-between border-0 pb-4">
                                                <span class="biding-price d-flex-center  text-white">$ 5.05/ day</span>
                                                <span class="biding-price d-flex-center  text-white">Max: 10 days</span>
                                            </div>
                                        </div>
                                        <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit" class="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Sell Now </span> </Link>
                                    </div>
                                </div>
                                <div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6  mb-6">
                                    <div class="explore-style-one explore-style-overlay border-gradient">
                                        <div class="thumb">
                                            <Link to="/product_details"><img src="images/explore/13.jpg" alt="nft live auction thumbnail" /></Link>
                                        </div>
                                        <div class="content px-4">
                                            <div class="d-flex-between align-items-center" >
                                                <div>
                                                    <div class="header d-flex-between pt-4 pb-2">
                                                        <h3 class="title"><Link to="/product_details">God Watching</Link></h3>
                                                    </div>
                                                    <div class="product-owner d-flex-between">
                                                        <span class="bid-owner text-secondry d-flex align-items-center"><Link to="author-profile.html">God’s world
                                                            <img src="images/verified.png" class="img-fluid verify_img" /></Link></span>
                                                    </div>
                                                </div>
                                                <span class="biding-price d-flex-center text-white">  #556 </span>
                                            </div>
                                            <hr />
                                            <div class="action-wrapper d-flex-between border-0 pb-4">
                                                <span class="biding-price d-flex-center  text-white">$ 5.05/ day</span>
                                                <span class="biding-price d-flex-center  text-white">Max: 10 days</span>
                                            </div>
                                        </div>
                                        <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit" class="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Sell Now </span> </Link>
                                    </div>
                                </div>
                                <div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6  mb-6">
                                    <div class="explore-style-one explore-style-overlay border-gradient">
                                        <div class="thumb">
                                            <Link to="/product_details"><img src="images/explore/13.jpg" alt="nft live auction thumbnail" /></Link>
                                        </div>
                                        <div class="content px-4">
                                            <div class="d-flex-between align-items-center" >
                                                <div>
                                                    <div class="header d-flex-between pt-4 pb-2">
                                                        <h3 class="title"><Link to="/product_details">God Watching</Link></h3>
                                                    </div>
                                                    <div class="product-owner d-flex-between">
                                                        <span class="bid-owner text-secondry d-flex align-items-center"><Link to="author-profile.html">God’s world
                                                            <img src="images/verified.png" class="img-fluid verify_img" /></Link></span>
                                                    </div>
                                                </div>
                                                <span class="biding-price d-flex-center text-white">  #556 </span>
                                            </div>
                                            <hr />
                                            <div class="action-wrapper d-flex-between border-0 pb-4">
                                                <span class="biding-price d-flex-center  text-white">$ 5.05/ day</span>
                                                <span class="biding-price d-flex-center  text-white">Max: 10 days</span>
                                            </div>
                                        </div>
                                        <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit" class="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Sell Now </span> </Link>
                                    </div>
                                </div>
                                <div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6  mb-6">
                                    <div class="explore-style-one explore-style-overlay border-gradient">
                                        <div class="thumb">
                                            <Link to="/product_details"><img src="images/explore/13.jpg" alt="nft live auction thumbnail" /></Link>
                                        </div>
                                        <div class="content px-4">
                                            <div class="d-flex-between align-items-center" >
                                                <div>
                                                    <div class="header d-flex-between pt-4 pb-2">
                                                        <h3 class="title"><Link to="/product_details">God Watching</Link></h3>
                                                    </div>
                                                    <div class="product-owner d-flex-between">
                                                        <span class="bid-owner text-secondry d-flex align-items-center"><Link to="author-profile.html">God’s world
                                                            <img src="images/verified.png" class="img-fluid verify_img" /></Link></span>
                                                    </div>
                                                </div>
                                                <span class="biding-price d-flex-center text-white">  #556 </span>
                                            </div>
                                            <hr />
                                            <div class="action-wrapper d-flex-between border-0 pb-4">
                                                <span class="biding-price d-flex-center  text-white">$ 5.05/ day</span>
                                                <span class="biding-price d-flex-center  text-white">Max: 10 days</span>
                                            </div>
                                        </div>
                                        <Link to="#" data-bs-toggle="modal" data-bs-target="#placeBit" class="btn  btn-block btn-gradient w-100 text-center btn-small "><span> Sell Now </span> </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section> */}
                </div>

                {/* < !--Place a bit Modal Sell-- > */}
                <div class="modal fade" id="checkout_modal" tabindex="-1" data-bs-backdrop="static" aria-labelledby="checkout_modalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header no-border flex-column px-8">
                                <h3 class="modal-title" id="checkout_modalLabel">Checkout Sell</h3>
                                <button type="button" class="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close"><i
                                    class="ri-close-fill"></i></button>
                            </div>
                            <div class="modal-body px-8 ">
                                <div class="single-item-history d-flex-center no-border">
                                    <Link to="#" class="avatar">
                                        <img src={`${ApiConfig.baseUrl + props?.userid[0]?.file}`} class="img-fluid" />
                                    </Link>
                                    <div class="content">
                                        <p class="text-white"> You are about to Sell an <Link class="text-white" to="#"> {props?.userid[0]?.name}</Link>
                                            <br />
                                            <small>{props?.userid[0]?.token_id}</small>
                                        </p>
                                    </div>
                                </div>
                                <form action="#">
                                    <div class="list_card border-gradient no-shadow mb-4" >
                                        <div class="avatar-info-wrapper d-flex-between check_info ">
                                            <div class="d-flex-center avatar-info">
                                                <div class="thumb-wrapper">
                                                    <Link to="#" class="thumb no-border">
                                                        <img src="images/eth_bg.png" alt="top sellter" />
                                                    </Link>
                                                </div>
                                                <div class="content">
                                                    <h4 class="title pb-1 ">
                                                        <Link className="max_txt" to="#"> {address ? address : walletAddress}</Link>
                                                    </h4>
                                                </div>
                                            </div>
                                            {/* <span class="cc_status connect">Highest Bid</span> */}
                                        </div>
                                    </div>

                                    <ul class="bidding-list p-0">
                                        <li> <span class="d-flex-center" >Balance</span> <strong>{bnbBalance} BNB</strong></li><hr />
                                        {/* <li><span>Royalty</span> <strong>Full (7.5%) 0.0447</strong></li> */}
                                    </ul>

                                </form>
                                <div class="form-group mt-4">
                                    <input type="number" id="bit" placeholder="Enter Amount" value={sellAmount} onChange={(e) => { setsellAmount(e.target.value) }} />
                                    {
                                        sellAmount ?
                                            sellAmount <= 0 ?
                                                <span className="mt-3" style={{ color: 'red' }}>Please Enter Price Greater Then 0</span>
                                                :
                                                null
                                            :
                                            null
                                    }
                                </div>
                            </div>
                            {
                                walletType === 'centralized' ?
                                    <div class="modal-footer no-border px-8 pb-5">
                                        <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center"
                                            onClick={() => approveNftCentralized()} disabled={sellAmount <= 0} ><span>Sell Now</span></button>
                                    </div>
                                    :
                                    <div class="modal-footer no-border px-8 pb-5">
                                        <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center"
                                            onClick={() => approveNft()} disabled={sellAmount <= 0}><span>Sell Now</span></button>
                                    </div>
                            }
                        </div>
                    </div>
                </div>

                {/* rent now model */}
                <div class="modal fade" id="checkout_modal_Rent" tabindex="-1" data-bs-backdrop="static" aria-labelledby="checkout_modalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header no-border flex-column px-8">
                                <h3 class="modal-title" id="checkout_modalLabel">Checkout Rent</h3>
                                <button type="button" class="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close"><i
                                    class="ri-close-fill"></i></button>
                            </div>
                            <div class="modal-body px-8 ">
                                <div class="single-item-history d-flex-center no-border">
                                    <Link to="#" class="avatar">
                                        <img src={`${ApiConfig.baseUrl + props?.userid[0]?.file}`} />
                                    </Link>
                                    <div class="content">
                                        <p class="text-white"> You are about to Rent an <Link class="text-white" to="#">{props?.userid[0]?.token_id}</Link>
                                            <br />
                                            <small>from <Link class="text-white" to="#" > {props?.userid[0]?.name}</Link> </small>
                                        </p>
                                    </div>
                                </div>
                                <form action="#">
                                    <div class="list_card border-gradient no-shadow mb-4" >
                                        <div class="avatar-info-wrapper d-flex-between check_info ">
                                            <div class="d-flex-center avatar-info">
                                                <div class="thumb-wrapper">
                                                    <Link to="#" class="thumb no-border">
                                                        <img src="images/eth_bg.png" alt="top sellter" />
                                                    </Link>
                                                </div>
                                                <div class="content">
                                                    <h4 class="title pb-1 ">
                                                        <Link className="max_txt" to="#">
                                                            {!address ? walletAddress : address}
                                                        </Link>
                                                    </h4>
                                                    {/* <span class="owner">BNB</span> */}
                                                </div>
                                            </div>
                                            {/* <span class="cc_status connect" >Highest Bid</span> */}
                                        </div>
                                    </div>
                                    <ul class="bidding-list p-0">
                                        <li> <span class="d-flex-center" >Balance</span> <strong>{bnbBalance} BNB</strong></li><hr />
                                    </ul>
                                </form>
                                <div class="form-group mt-4">
                                    <input type="number" id="bit" placeholder="Enter Amount" value={RentAmount} onChange={(e) => setRentAmount(e.target.value)} />

                                    {
                                        RentAmount ?
                                            RentAmount <= 0 ?
                                                <span className="text-danger mt-2">Please Enter Amount Greater Then 0</span>
                                                :
                                                null
                                            :
                                            null
                                    }
                                </div>
                                <div class="form-group mt-4">
                                    {/* {userTime < 1 ? alertErrorMessage('Minimum Rent period is one day') : null} */}
                                    <input type="number" id="bit" placeholder="Enter Time period in days" value={userTime} onChange={(e) => setUserTime(e.target.value)} />
                                </div>
                                <div class="form-group mt-4">
                                    <input type="number" id="bit" placeholder="Enter Owner Percent" value={ownerPercent} onChange={(e) => setOwnerPercent(e.target.value)} />
                                </div>
                            </div>
                            <div class="modal-footer no-border px-8 pb-5">
                                {
                                    walletType === 'centralized' ?

                                        <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => approveNftCentralizedRent()} disabled={RentAmount <= 0 || !userTime}><span>Rent now</span></button>
                                        :
                                        <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => approveRentNft()} disabled={RentAmount <= 0}><span>Rent now</span></button>
                                }
                            </div>
                        </div>
                    </div>
                </div>


                {/* Auction model */}
                <div class="modal fade" id="Auction_Now_Model" tabindex="-1" data-bs-backdrop="static" aria-labelledby="make_offoer_modalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header no-border flex-column px-8">
                                <h3 class="modal-title" id="make_offoer_modalLabel">Make an offer</h3>
                                <button type="button" class="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close"><i
                                    class="ri-close-fill"></i></button>
                            </div>
                            <div class="modal-body px-8 ">
                                <div class="single-item-history d-flex-center no-border">
                                    <Link to="#" class="avatar">
                                        <img src={`${ApiConfig.baseUrl + props?.userid[0]?.file}`} />
                                    </Link>
                                    <div class="content">
                                        <p class="text-white"><b>{props?.userid[0]?.name}</b> {props?.userid[0]?.token_id}<br />
                                            {/* <small>{props?.userid[0]?.name}</small> */}
                                        </p>
                                    </div>
                                    {/* <span class="date align-self-center text-end">0.000255 ETH <br /> <small>$1,091.98</small></span> */}
                                </div>
                                <form action="#">
                                    <div class="list_card border-gradient no-shadow mb-4" >
                                        <ul class="bidding-list p-0">

                                            <li><span>Address</span> <strong className="ps-0 max_txt" >{!address ? walletAddress : address}</strong></li>

                                            <li> <span class="d-flex-center" ><i class="ri-wallet-fill me-2">
                                            </i> Balance</span> <strong>{bnbBalance}</strong></li>
                                        </ul>
                                    </div>
                                    <div class="form-group input-group">
                                        <input type="number" class="form-control" placeholder="Minimum Price" aria-label="Recipient's username" aria-describedby="basic-addon2" value={minimumPrice} onChange={(e) => setMinimumPrice(e.target.value)} />

                                    </div>
                                    <div class="form-group input-group mt-2">
                                        <input type="number" class="form-control" placeholder="Buy Now Price" aria-label="Recipient's username" aria-describedby="basic-addon2" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
                                    </div>
                                    {
                                        buyPrice && minimumPrice ?
                                            buyPrice <= minimumPrice ?
                                                <span className="mt-2" style={{ color: 'red' }}>Please Enter Price Greater Then Minimum Price </span>
                                                :
                                                null
                                            :
                                            null
                                    }
                                    <div class="form-group">
                                        {/* <label>Duration</label> */}
                                        <div class="row gx-2 mt-2" >
                                            <div class="col-12" >
                                                {/* {bidPeriod < 1 ? alertErrorMessage('Minimum Rent period is one day') : null} */}
                                                <input type="number" class="form-control" placeholder="Bid Period" aria-label="Recipient's username" aria-describedby="basic-addon2" value={bidPeriod} onChange={(e) => setBidPeriod(e.target.value)} />
                                                <span class="mt-2">Minimum Bid period is one day</span>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer no-border px-8 pb-5">
                                <div className="container" >
                                    <div className="row justify-content-center" >
                                        <div class="col-md-12" >
                                            {
                                                walletType === 'centralized' ?
                                                    <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => approveMakeanOfferCenterLized()} disabled={buyPrice <= minimumPrice || !bidPeriod}>
                                                        <span>Auction</span>
                                                    </button>
                                                    :
                                                    <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => approveMakeanOffer()} disabled={buyPrice <= minimumPrice || !bidPeriod}>
                                                        <span>Auction</span>
                                                    </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Report model */}
                <div class="modal fade" id="reportmodal" tabindex="-1" data-bs-backdrop="static" aria-labelledby="reportmodalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header no-border flex-column px-8">
                                <h3 class="modal-title" id="reportmodalLabel"> Report </h3>
                                <button type="button" class="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close"><i
                                    class="ri-close-fill"></i></button>
                            </div>
                            <div class="modal-body px-8 ">
                                <form action="#">
                                    <div class="form-group mb-2">
                                        <label>Reason</label>
                                        <input type="text" class="form-control" placeholder="Enter Reason" aria-label="Recipient's usernameReason" aria-describedby="basic-addon2" value={reportReason} onChange={(e) => setReportReason(e.target.value)} />
                                    </div>
                                    <div class="form-group mb-2">
                                        <label>Description</label>
                                        <textarea className=" " rows="5" placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer no-border px-8 pb-5">
                                <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => (handleCollectionDetailsReport(reportReason, description))}><span>Submit</span></button>
                            </div>
                        </div>
                    </div>
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
            : <ProfilePage />
    )
}

export default NftDetails