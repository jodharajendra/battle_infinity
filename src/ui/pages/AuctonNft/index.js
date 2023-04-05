
import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import contract from '../../../contract.json'
import Web3 from "web3";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import { $ } from "react-jquery-plugin";

const AuctonNft = () => {

    const [userDetails, setUserDetails] = useState([])
    const [tokenType, setTokenType] = useState()
    const [password, setPassword] = useState('');
    const [centerlizedData, setCenterlizedData] = useState()
    const [dcryptPrivateKey, setDcryptPrivateKey] = useState()
    const [nweWithdrawalId, setNweWithdrawalId] = useState([])


    useEffect(() => {
        handleuserProfile();
    }, [])

    const handleuserProfile = async () => {
        await AuthService.getUserDetails().then(async result => {
            if (result?.success) {
                setUserDetails(result?.data?.wallet_address);
                setTokenType(result?.data?.type);
                if (result?.data?.type === 'centralized') {
                    handleCenterlizedWalletData();
                }
            }
        });
    }

    console.log(centerlizedData, 'centerlizedData');
    console.log(dcryptPrivateKey, 'dcryptPrivateKey');

    const [nftDetails, setnftDetails] = useState([]);
    const [nftDetailFiltered, setnftDetailFiltered] = useState();
    const token_address = '0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437';
    const [bidAmountInput, setBidAmountInput] = useState('');
    const [newTokenId, setNewTokenId] = useState([]);
    const [nftDetailFilteredSearch, setnftDetailFilteredSearch] = useState();

    let web3

    if (!window.ethereum) {
        web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/")
    } else {
        web3 = new Web3(window.ethereum)
    }

    const nftContract = new web3.eth.Contract(contract.nftAbi, contract.nftAddress);
    const marketplace = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)




    //   useEffect(() => {
    //     if (tokenType === 'centralized') {
    //         handleCenterlizedWalletData();
    //     }
    // }, [])

    const handleCenterlizedWalletData = async () => {
        await AuthService.getCenterlizedWalletData().then(async result => {
            if (result.success) {
                setCenterlizedData(result?.data)
            }
        });
    }

    const handleDecryptData = async () => {
        try {
            let dcrypt = await web3.eth.accounts.decrypt(centerlizedData?.wallet_data, password);
            setDcryptPrivateKey(dcrypt?.privateKey);
            if (dcrypt?.privateKey) {
                $("#enterpasswordmodal").modal('hide');
                $("#bidAnd_withdrawal_modal").modal('show');
            }
        } catch (error) {
            console.log(error, 'error:handleDecryptData');
            alertErrorMessage(error.message)
        }
    }

    useEffect(() => {
        nftSellsList(token_address);
    }, []);

    useEffect(() => {
        if (nftDetails) {
            getSellsList()
        }
    }, [nftDetails]);

    const nftSellsList = async (token_address) => {
        LoaderHelper.loaderStatus(true);
        await AuthService.nftSellsList(token_address).then(async result => {
            if (result.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    setnftDetails(result?.data?.result)
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage(result.message);
            }
        });
    }

    const handleSearch = (e) => {
        let serchItem = nftDetailFilteredSearch.filter((item) => {
            let metadata = item?.metaData
            return item?.token_id?.includes(e.target.value) || metadata?.name?.toLowerCase()?.includes(e.target.value)
        })
        setnftDetailFiltered(serchItem)
    }

    const getSellsList = async () => {
        let arr = [];
        try {
            for (let i = 0; i < nftDetails.length; i++) {
                LoaderHelper.loaderStatus(true);
                let tkId = parseInt(nftDetails[i].token_id)
                let ownerOfNft = await nftContract.methods.ownerOf(nftDetails[i].token_id).call()
                if (ownerOfNft === contract.marketplaceAddress) {
                    let auctionDetails = await marketplace.methods.nftContractAuctions(nftDetails[i].token_address, nftDetails[i].token_id).call()
                    console.log(auctionDetails, 'auctionDetails');
                    if (auctionDetails.minPrice != '0' && auctionDetails.pack === false) {

                        let newDate = new Date(parseInt(auctionDetails.bidPeriod)); // convert seconds to milliseconds
                        let newDate1 = new Date();

                        const diffInMilliseconds = Math.abs(newDate - newDate1); // calculate difference in milliseconds
                        let diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24)); // convert milliseconds to days
                        if (diffInDays < 1) {
                            diffInDays = "0";
                        }
                        let obj = {
                            metadata: JSON.parse(nftDetails[i].metadata),
                            token_id: nftDetails[i].token_id,
                            bidPeriod: diffInDays    /* / 354067200 */,
                            buyNowPrice: auctionDetails.buyNowPrice / 10 ** 18,
                            minPrice: auctionDetails.minPrice / 10 ** 18,
                            auctionEndPeriod: auctionDetails.auctionEndPeriod,
                            nftHighestBid: auctionDetails.nftHighestBid / 10 ** 18,
                            nftSeller: auctionDetails.nftSeller,
                        }
                        LoaderHelper.loaderStatus(false);
                        arr.push(obj)
                    }
                } else {
                    // console.log('in else');
                }
            }
            LoaderHelper.loaderStatus(false);
            setnftDetailFiltered(arr)
            setnftDetailFilteredSearch(arr)
        } catch (error) {
            alertErrorMessage(error.message)
            LoaderHelper.loaderStatus(false);
        }
    };

    // console.log(nftDetailFiltered, 'nftDetailFiltered');

    const handleModal = async (tokenid) => {
        setNewTokenId(tokenid)
        if (tokenType === 'centralized') {
            $("#enterpasswordmodal").modal('show');
        } else {
            $("#bidAnd_withdrawal_modal").modal('show');
        }
    }

    const handleDecryptDataHighestBid = async () => {
        try {
            let dcrypt = await web3.eth.accounts.decrypt(centerlizedData?.wallet_data, password);
            setDcryptPrivateKey(dcrypt?.privateKey);
            if (dcrypt?.privateKey) {
                $("#enterpasswordmodalHighest").modal('hide');
                $("#highestBid").modal('show');
            }
        } catch (error) {
            console.log(error, 'error:handleDecryptData');
            alertErrorMessage(error.message)
        }
    }




    const handleModalHighestBid = async (tokenid) => {
        setNewTokenId(tokenid)
        if (tokenType === 'centralized') {
            $("#enterpasswordmodalHighest").modal('show');
        } else {
            $("#highestBid").modal('show');
        }
    }

    const makeBid = async (tokenid) => {
        try {
            LoaderHelper.loaderStatus(true);
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenId = parseInt(tokenid);
            var weiAmtPrice = (1000000000000000000 * bidAmountInput);
            let bidAmount = "0x" + weiAmtPrice.toString(16); //hex format
            const tx = await marketplace.methods.makeBid(contract.nftAddress, tokenId).send({ from: account, value: bidAmount })
            if (tx?.status === true) {
                $("#make_offoer_modal").modal('hide');
                LoaderHelper.loaderStatus(false);
                handleMakeBidStatus(newTokenId)
                alertSuccessMessage('Successfully Send Make An Offer')
            }
        } catch (error) {
            alertErrorMessage(error?.message);
            LoaderHelper.loaderStatus(false);
        }
    }

    const makeBidCentralized = async (tokenid) => {

        try {
            LoaderHelper.loaderStatus(true);
            const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
            const privateKeyOfwallet = dcryptPrivateKey //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0x4b80Efd0087F255DAf1F4b43D99948b0e6356481" // Auction contract address
            let tokenId = parseInt(tokenid); //convert to hex
            var weiAmtPrice = (1000000000000000000 * bidAmountInput);
            let bidAmount = "0x" + weiAmtPrice.toString(16); //hex format
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                value: bidAmount,
                data: await contract_interaction.methods.makeBid(contract.nftAddress, tokenId).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            // console.log(transactionReceipt, 'transactionReceipt');
            if (transactionReceipt?.status === true) {
                $("#make_offer_centerlized").modal('hide');
                LoaderHelper.loaderStatus(false);
                alertSuccessMessage('Successfully Send Make An Offer')
                handleMakeBidStatus(newTokenId)
            }
        } catch (error) {
            console.log(error, ':Error_');
            alertErrorMessage('Transaction has been reverted by the EVM');
            LoaderHelper.loaderStatus(false);
        }

    }

    const handleMakeBidStatus = async () => {
        await AuthService.sellStautsMakeBid(bidAmountInput, newTokenId, token_address).then(async result => {
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


    const takeHighestBid = async (Id) => {
        try {
            LoaderHelper.loaderStatus(true);
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenId = parseInt(Id);
            var hexaDecimalToken = "0x" + (tokenId).toString(16);
            const tx = await marketplace.methods.takeHighestBid(contract.nftAddress, tokenId).send({ from: account })
            if (tx?.status === true) {
                LoaderHelper.loaderStatus(false);
                alertSuccessMessage('Successfully HighestBid');
                $("#highestBid").modal('hide');
            }
        } catch (error) {
            console.log(error, 'error:takeHighestBid');
            alertErrorMessage(error?.message);
            LoaderHelper.loaderStatus(false);
        }
    }


    const takeHighestBidCentralized = async (Id) => {
        try {
            LoaderHelper.loaderStatus(true);
            const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
            const privateKeyOfwallet = dcryptPrivateKey //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0x4b80Efd0087F255DAf1F4b43D99948b0e6356481" // Auction contract address
            let tokenId = parseInt(Id); //convert to hex
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                data: await contract_interaction.methods.takeHighestBid(contract.nftAddress, tokenId).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log(transactionReceipt, 'transactionReceipt');
            if (transactionReceipt?.status === true) {
                LoaderHelper.loaderStatus(false);
                alertSuccessMessage('Successfully HighestBid');
                $("#highestBid").modal('hide');
            }
        } catch (error) {
            console.log(error, 'error:takeHighestBid');
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }


    const settleAuction = async (tokenid) => {
        try {
            LoaderHelper.loaderStatus(true);
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenId = parseInt(tokenid);
            var hexaDecimalToken = "0x" + (tokenId).toString(16);
            const tx = await marketplace.methods.settleAuction(contract.nftAddress, tokenId).send({ from: account })
            if (tx?.status === true) {
                LoaderHelper.loaderStatus(false);
                alertSuccessMessage('Successfully Settle Auction');
                $("#highestBid").modal('hide');
            }
        } catch (error) {
            console.log(error, 'error:settleAuction');
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }

    const settleAuctionCentralized = async (tokenid) => {
        try {
            LoaderHelper.loaderStatus(true);
            const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
            const privateKeyOfwallet = dcryptPrivateKey //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0x4b80Efd0087F255DAf1F4b43D99948b0e6356481" // Auction contract address
            let tokenId = parseInt(tokenid);  //convert to hex
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                data: await contract_interaction.methods.rent(tokenId, contract.nftAddress).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            if (transactionReceipt?.status === true) {
                LoaderHelper.loaderStatus(false);
                alertSuccessMessage('Successfully Settle Auction');
                $("#highestBid").modal('hide');
            }
        } catch (error) {
            console.log(error, 'error:settleAuctionCentralized');
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error?.message)
        }
    }

    const withdrawAuction = async (tokenid) => {
        try {
            LoaderHelper.loaderStatus(true);
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenId = parseInt(tokenid);
            var hexaDecimalToken = "0x" + (tokenId).toString(16);
            const tx = await marketplace.methods.withdrawAuction(contract.nftAddress, tokenId).send({ from: account })
            if (tx?.status === true) {
                LoaderHelper.loaderStatus(false);
                $("#withdrawal_modal").modal('hide');
                alertSuccessMessage('Successfully withdraw Auction')
            }
        } catch (error) {
            alertErrorMessage(error?.message);
            LoaderHelper.loaderStatus(false);
        }
    }

    console.log(nweWithdrawalId, 'nweWithdrawalId');

    const handlewithdrawAuction = async (tokenID) => {
        try {
            $("#password_withdrawal_modal").modal('show');
            setNweWithdrawalId(tokenID)
        } catch (error) {
            console.log(error, 'error:handleDecryptData');
            alertErrorMessage(error.message)
        }
    }

    const handleDecryptDataWithdrwa = async () => {
        try {
            let dcrypt = await web3.eth.accounts.decrypt(centerlizedData?.wallet_data, password);
            setDcryptPrivateKey(dcrypt?.privateKey);
            if (dcrypt?.privateKey) {
                $("#password_withdrawal_modal").modal('hide');
                withdrawAuctionCentralized(dcrypt?.privateKey);
            }
        } catch (error) {
            console.log(error, 'error:handleDecryptData');
            alertErrorMessage(error.message)
        }
    }


    const withdrawAuctionCentralized = async (newDcryptPrivateKey) => {
        try {
            LoaderHelper.loaderStatus(true);
            const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
            const privateKeyOfwallet = newDcryptPrivateKey //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0x4b80Efd0087F255DAf1F4b43D99948b0e6356481" // Auction contract address
            let tokenId = parseInt(nweWithdrawalId);  //convert to hex
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                data: await contract_interaction.methods.withdrawAuction(contract.nftAddress, tokenId).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log(transactionReceipt, ':transactionReceipt');
            if (transactionReceipt?.status === true) {
                $("#withdrawal_modal").modal('hide');
                LoaderHelper.loaderStatus(false);
                alertSuccessMessage('Successfully withdraw Auction')
            }
        } catch (error) {
            console.log(error, 'error:transactionReceipt');
            alertErrorMessage('Transaction has been reverted by the EVM');
            LoaderHelper.loaderStatus(false);
        }
    }

    const withdrawBid = async (tokenid) => {
        try {
            LoaderHelper.loaderStatus(true);
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenId = parseInt(tokenid);
            var hexaDecimalToken = "0x" + (tokenId).toString(16);
            const tx = await marketplace.methods.withdrawBid(contract.nftAddress, tokenId).send({ from: account })
            if (tx?.status === true) {
                LoaderHelper.loaderStatus(false);
                $("#bidAnd_withdrawal_modal").modal('hide');
                LoaderHelper.loaderStatus(false);
                alertSuccessMessage('Successfully withdrawal Bid')
            }
        } catch (error) {
            console.log(error, 'error:transactionReceipt');
            alertErrorMessage('Transaction has been reverted');
            LoaderHelper.loaderStatus(false);
        }

    }

    const withdrawBidCentralized = async (tokenid) => {
        try {
            LoaderHelper.loaderStatus(true);
            const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
            const privateKeyOfwallet = dcryptPrivateKey //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0x4b80Efd0087F255DAf1F4b43D99948b0e6356481" // Auction contract address
            let tokenId = parseInt(tokenid)    //convert to hex
            var weiAmtPrice = (1000000000000000000 * bidAmountInput);
            let rentPrice = "0x" + weiAmtPrice.toString(16); //hex format
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                value: rentPrice,
                data: await contract_interaction.methods.withdrawBid(contract.nftAddress, tokenId).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            if (transactionReceipt?.status === true) {
                LoaderHelper.loaderStatus(false);
                $("#bidAnd_withdrawal_modal").modal('hide');
                alertSuccessMessage('Successfully withdrawal Bid')
            }
        } catch (error) {
            console.log(error, 'error:transactionReceipt');
            alertErrorMessage('Transaction has been reverted');
            LoaderHelper.loaderStatus(false);
        }
    }

    const hideModel = () => {
        $("#bidAnd_withdrawal_modal").modal('hide')
    }

    const filteredPricesNew = [];
    for (let i = 0; i < nftDetailFiltered?.length; i++) {
        if (nftDetailFiltered[i]?.nftSeller != userDetails) {
            filteredPricesNew.push(nftDetailFiltered[i]);
        }
    }


    const filteredPriceforBid = [];
    for (let i = 0; i < nftDetailFiltered?.length; i++) {
        if (nftDetailFiltered[i]?.nftHighestBid) {
            filteredPriceforBid.push(nftDetailFiltered[i]);
        }
    }


    return (
        <>
            <div className="page_wrapper"  >
                <section className="inner-page-banner explore_banner_inner">
                    <div className="container">
                        <div className="innertext-start">
                            <h1 className="title">NFT's for Auction's</h1>
                        </div>
                        <form action="#" className="mt-10">
                            <div className="filter-style-one common-filter d-flex-between profile_filter">
                                <div className="d-flex-center filter-left-cate">
                                    <div className="border-gradient search-bar">
                                        <input style={{ width: '100%' }} type="text" name="search" placeholder="Search by token id" id="search" onChange={(e) => { handleSearch(e) }} />
                                        <button className="search-btn" type="submit"> <i className="ri-search-line"></i> </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
                <section className="explore_view">
                    <div className="container">
                        <div className="row" >
                            {nftDetailFiltered ?
                                nftDetailFiltered.map((item, index) => {
                                    return (
                                        <div className="col-xxl-3 col-md-4 mb-6">
                                            <div className="explore-style-one explore-style-overlay border-gradient">
                                                <div className="thumb">
                                                    <div className="ratio ratio-1x1" >
                                                        <img src={item?.metadata?.image ? `${item?.metadata?.image}` : "images/explore/13.jpg"} alt="nft live auction thumbnail" />
                                                    </div>
                                                </div>
                                                <div className="content px-4">
                                                    <div className="d-flex-between align-items-center" >
                                                        <div>
                                                            <div className="header d-flex-between pt-4 pb-2">

                                                                <h3 className="title"><Link > Token Id : {item?.token_id}</Link></h3>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div className="action-wrapper d-flex-between border-0 pt-4">
                                                        <span className="biding-price d-flex-center  text-white">Bid Period{/* {item?.token_id} */}</span>
                                                        <span className="biding-price d-flex-center  text-white">{item?.bidPeriod} day</span>
                                                    </div>
                                                    <hr />
                                                    <div className="action-wrapper d-flex-between border-0 pb-4">
                                                        <span className="biding-price d-flex-center  text-white"> Minimum Price</span>
                                                        <span className="biding-price d-flex-center  text-white">{item?.minPrice}</span>
                                                    </div>
                                                    <hr />
                                                    <div className="action-wrapper d-flex-between border-0 pb-4">
                                                        <span className="biding-price d-flex-center  text-white">Price</span>
                                                        <span className="biding-price d-flex-center  text-white">{item?.buyNowPrice}</span>
                                                    </div>
                                                    <hr />
                                                    <div className="action-wrapper d-flex-between border-0 pb-4">
                                                        <span className="biding-price d-flex-center  text-white">Auction Highest Bid</span>
                                                        <span className="biding-price d-flex-center  text-white">{item?.nftHighestBid}</span>
                                                    </div>
                                                </div>
                                                {
                                                    item?.bidPeriod === 0 && item?.nftSeller === userDetails ?

                                                        <Link data-bs-toggle="modal" className="btn btn-block btn-gradient w-100 text-center btn-small" onClick={() => handleModalHighestBid(item?.token_id)}><span>Highest Bid</span>
                                                        </Link>

                                                        : item?.nftSeller === userDetails ?

                                                            <>
                                                                {
                                                                    tokenType === 'centralized' ?
                                                                        <button type="button" class="btn btn-block btn-gradient w-100 text-center btn-small" onClick={() => handlewithdrawAuction(item?.token_id)}><span>withdraw Auction</span></button>
                                                                        :
                                                                        <button type="button" class="btn btn-block btn-gradient w-100 text-center btn-small" onClick={() => withdrawAuction(item?.token_id)}><span>withdraw Auction</span></button>

                                                                }
                                                            </>
                                                            : item?.bidPeriod === 0 ? '' :
                                                                <Link className="btn  btn-block btn-gradient w-100 text-center btn-small" onClick={() => handleModal(item?.token_id)}><span> Make an Offer</span>
                                                                </Link>
                                                }

                                            </div>
                                        </div>
                                    )
                                }) : ""}
                        </div>
                    </div>
                </section>
            </div>



            <div class="modal fade" id="bidAnd_withdrawal_modal" tabindex="-1" aria-labelledby="make_offoer_modalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header no-border flex-column px-8">
                            <h3 class="modal-title" id="make_offoer_modalLabel">Make Bid And withdraw Bid</h3>
                            <button type="button" class="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close">
                                <i class="ri-close-fill"></i>
                            </button>
                        </div>
                        <div class="modal-body px-8 ">
                            <div class="single-item-history d-flex-center no-border">
                                <div class="content">
                                    <p class="text-white">Token ID:  {newTokenId}<br />
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer no-border px-5 pb-3">
                            <div className="container" >
                                <div className="row justify-content-center" >
                                    <div class="col-md-6" >
                                        {
                                            tokenType === 'centralized' ?
                                                <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" data-bs-toggle="modal" data-bs-target="#make_offer_centerlized" onClick={hideModel} ><span>MAKE BID</span></button>
                                                :
                                                <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" data-bs-toggle="modal" data-bs-target="#make_offoer_modal" onClick={hideModel}><span>MAKE BID</span></button>
                                        }
                                    </div>
                                    <div class="col-md-6" >
                                        {
                                            tokenType === 'centralized' ?
                                               /*  <>
                                                    {
                                                        filteredPriceforBid ? */
                                                            <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => withdrawBidCentralized(newTokenId)}><span>withdraw Bid</span></button>
                                                            /* :
                                                            ''
                                                    }
                                                </> */
                                                :
                                                <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => withdrawBid(newTokenId)}><span>withdraw Bid</span></button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="modal fade" id="make_offoer_modal" tabindex="-1" aria-labelledby="make_offoer_modalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header no-border flex-column px-8">
                            <h3 class="modal-title" id="make_offoer_modalLabel">Make an offer</h3>
                            <button type="button" class="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close">
                                <i class="ri-close-fill"></i>
                            </button>
                        </div>
                        <div class="modal-body px-8 ">
                            <div class="single-item-history d-flex-center no-border">
                                <div class="content">
                                    <p class="text-white">Token ID:  {newTokenId}<br />
                                    </p>
                                </div>
                            </div>
                            <hr />
                            <form action="#">
                                <div class="form-group">
                                    <label>Minimum Amount</label>
                                    <input type="text" class="form-control" placeholder="Enter Amount" aria-label="" aria-describedby="basic-addon2" value={bidAmountInput} onChange={(e) => setBidAmountInput(e.target.value)} />
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer no-border px-8 pb-5">
                            <div className="container" >
                                <div className="row justify-content-center" >
                                    <div class="col-md-12" >
                                        {
                                            tokenType === 'centralized' ?
                                                <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => makeBidCentralized(newTokenId)}><span>Make Bid</span></button>
                                                :
                                                <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => makeBid(newTokenId)}><span>Make Bid</span></button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="make_offer_centerlized" tabindex="-1" aria-labelledby="make_offer_centerlizedLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header no-border flex-column px-8">
                            <h3 class="modal-title" id="make_offoer_modalLabel">Make an offer</h3>
                            <button type="button" class="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close">
                                <i class="ri-close-fill"></i>
                            </button>
                        </div>
                        <div class="modal-body px-8 ">
                            <div class="single-item-history d-flex-center no-border">
                                <div class="content">
                                    <p class="text-white">Token ID:  {newTokenId}<br />
                                    </p>
                                </div>
                            </div>
                            <hr />
                            <form action="#">
                                <div class="form-group">
                                    <label>Minimum Amount</label>
                                    <input type="text" class="form-control" placeholder="Enter Amount" aria-label="" aria-describedby="basic-addon2" value={bidAmountInput} onChange={(e) => setBidAmountInput(e.target.value)} />
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer no-border px-8 pb-5">
                            <div className="container" >
                                <div className="row justify-content-center" >
                                    <div class="col-md-12" >
                                        <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => makeBidCentralized(newTokenId)}>
                                            <span>Make Bid</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
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

            {/* Highest Bid Modal Start */}

            <div class="modal fade" id="highestBid" tabindex="-1" aria-labelledby="highestBid" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header no-border flex-column px-8">
                            <h3 class="modal-title" id="make_offoer_modalLabel">Make an Bid</h3>
                            <button type="button" class="btn-custom-closer" data-bs-dismiss="modal" aria-label="Close">
                                <i class="ri-close-fill"></i>
                            </button>
                        </div>
                        <div class="modal-body px-8 ">
                            <div class="single-item-history d-flex-center no-border">
                                <div class="content">
                                    <p class="text-white">Token ID:  {newTokenId}<br />
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer no-border px-8 pb-5">
                            <div className="container" >
                                <div className="row justify-content-center" >
                                    <div class="col-md-6" >
                                        {
                                            tokenType === 'centralized' ?
                                                <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => takeHighestBidCentralized(newTokenId)}><span>Make Highest Bid</span></button>
                                                :
                                                <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => takeHighestBid(newTokenId)}><span>Make Highest Bid</span></button>
                                        }
                                    </div>
                                    <div class="col-md-6" >
                                        {
                                            tokenType === 'centralized' ?
                                                <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => settleAuctionCentralized(newTokenId)}><span>Settle Auction</span></button>
                                                :
                                                <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => settleAuction(newTokenId)}><span>Settle Auction</span></button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="enterpasswordmodalHighest" tabindex="-1" data-bs-backdrop="static" aria-labelledby="enterpasswordmodallabel" aria-hidden="true">
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
                                <button type="button" class="btn btn-gradient btn-border-gradient w-100 justify-content-center mb-4" onClick={() => handleDecryptDataHighestBid(password)}>
                                    <span>SAVE</span></button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Highest Bid Modal End */}



            <div className="modal fade" id="password_withdrawal_modal" tabindex="-1" data-bs-backdrop="static" aria-labelledby="enterpasswordmodallabel" aria-hidden="true">
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
                                <button type="button" class="btn btn-gradient btn-border-gradient w-100 justify-content-center mb-4" onClick={() => handleDecryptDataWithdrwa(password)}>
                                    <span>SAVE</span></button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AuctonNft

