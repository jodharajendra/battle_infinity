import React, { useRef, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Select from 'react-select'
import Web3 from "web3";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";

import contract from '../../../contract.json'

const BundleList = () => {
    const messagesEndRef = useRef(null)
    const web3 = new Web3(window.ethereum)
    const nftContract = new web3.eth.Contract(contract.nftAbi, contract.nftAddress);
    const marketplace = new web3.eth.Contract(contract.bundleAbi, contract.bundleAddress)

    const token_address = '0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437';
    const [nftDetails, setnftDetails] = useState([]);
    const [nftDetailFiltered, setnftDetailFiltered] = useState();
    const [nftDetailFilteredSearch, setnftDetailFilteredSearch] = useState();

    const [tokenIdPack, setTokenIdPack] = useState([]);
    const walletAddress = localStorage.getItem("wallet_address");


    useEffect(() => {
        nftSellsList(token_address);
    }, []);

    const nftSellsList = async (token_address) => {
        LoaderHelper.loaderStatus(true);
        await AuthService.nftSellsList(token_address).then(async result => {
            if (result.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    LoaderHelper.loaderStatus(false);
                    setnftDetails(result?.data?.result)
                } catch (error) {
                    LoaderHelper.loaderStatus(false);
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage(result.message);
                if (result.message === 'Unauthorized Request!') {
                    Navigate('/login')
                } else {

                }
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

    useEffect(() => {
        if (nftDetails) {
            getSellsList()
        }
    }, [nftDetails]);


    const getSellsList = async () => {
        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]
        let arr = [];
        try {
            for (let i = 0; i < nftDetails.length; i++) {
                LoaderHelper.loaderStatus(true);
                let tkId = parseInt(nftDetails[i].token_id)
                let ownerOfNft = await nftContract.methods.ownerOf(nftDetails[i].token_id).call()
                if (ownerOfNft === contract.bundleAddress) {
                    let sellDetails = await marketplace.methods.nftContractAuctions(nftDetails[i].token_address, nftDetails[i].token_id).call()
                    console.log(sellDetails, 'sellDetails');
                    // if (sellDetails?.pack === true) {
                    //     tokenIDPack(sellDetails);
                    // }
                    if (sellDetails.minPrice === '0') {

                        let obj = {
                            token_address: nftDetails[i].token_address,
                            metaData: JSON.parse(nftDetails[i].metadata),
                            token_id: nftDetails[i].token_id,
                            nftSeller: sellDetails.nftSeller,
                            nftHighestBidder: sellDetails.nftHighestBidder / 10 ** 18,
                            nftHighestBid: sellDetails.nftHighestBid / 10 ** 18,
                            minPrice: sellDetails.minPrice / 10 ** 18,
                            buyNowPrice: sellDetails.buyNowPrice / 10 ** 18,
                            bidPeriod: sellDetails.bidPeriod,
                            auctionEndPeriod: sellDetails.auctionEndPeriod
                        }
                        LoaderHelper.loaderStatus(false);
                        arr.push(obj)
                    }
                } else {
                    // console.log(' in else');
                }
            }
            LoaderHelper.loaderStatus(false);
            setnftDetailFiltered(arr)
            setnftDetailFilteredSearch(arr)
            tokenIDPack(arr);
        } catch (error) {
            // console.log(error.message);
        }
    };

    // console.log(nftDetailFiltered, 'nftDetailFiltered[0]?.token_idR');
    console.log(nftDetailFiltered, 'nftDetailFiltered[0]?.token_id');

    const tokenIDPack = async (detailPAck) => {


        let arryaId = []
        let tokenIdsNew = detailPAck; //convert to hex
        for (let i = 0; i < tokenIdsNew.length; i++) {
            var hexaDecimalToken = tokenIdsNew[i].token_id;
            arryaId.push(hexaDecimalToken)
        }


         console.log(detailPAck,'detailPAck');

         console.log(arryaId,'arryaId');

        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]
        let tokenIds = detailPAck[1]?.token_id
        // console.log(tokenIds, 'tokenIdPackJJ');
        const tx = await marketplace.methods.tokensInPack(contract.nftAddress, tokenIds).call({ from: account })
        // console.log(tx, "tokenIDPack:RAJENDRA ");
        setTokenIdPack(tx);
    }


    console.log(tokenIdPack, 'tokenIdPack');

    const buyPack = async (buyPrice) => {
        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]
        let tokenIds = tokenIdPack
        console.log(tokenIds, 'tokenIdstokenIdsbuyPack');
        const numberToHex = (_num) => {
            var inputAmt = _num;
            var weiAmt = (1000000000000000000 * inputAmt);
            var hexaDecimal = "0x" + weiAmt.toString(16);
            return hexaDecimal;
        }
        let buyNowPrice = numberToHex(buyPrice)
        const tx = await marketplace.methods.buyPack(contract.nftAddress, tokenIds).send({ from: account, value: buyNowPrice })
        console.log("Tx: ", tx);
        if (tx?.status === true) {
            alertSuccessMessage('Successfully Buy Pack')
            getSellsList();
        }
    }


    const buyPackCentralized = async (buyPrice) => {
        LoaderHelper.loaderStatus(true);
        const privateKeyOfwallet = '0x0e20a03cd80f0780a0c4cfe3d5260745b0a83c9ee90f2f7fc092cddf5c5d761e' //Private key of wallet goes here
        const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
        const contract_address = "0x6d7D7842F4256f7Bd4ece025A68D2CF964De6abE" // NFt contract address
        let arryaId = tokenIdPack
        const numberToHex = (_num) => {
            var inputAmt = _num;
            var weiAmt = (1000000000000000000 * inputAmt);
            var hexaDecimal = "0x" + weiAmt.toString(16);
            return hexaDecimal;
        }
        let buyNowPrice = numberToHex(buyPrice)
        const tx = {
            from: address, // Wallet address
            to: contract_address, // Contract address of battle infinity
            gas: 1000000,
            value: buyNowPrice,
            data: await marketplace.methods.buyPack(contract.nftAddress, arryaId).encodeABI()
        }
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
        const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(transactionReceipt, 'transactionReceipt');
        if (transactionReceipt?.status) {
            alertSuccessMessage('Successfully Buy Pack');
        }
    }


    return (
        <>
            <div className="page_wrapper" ref={messagesEndRef}>
                <section className="inner-page-banner rent_inner_banner">
                    <div className="container">
                        <div className="innertext-start">
                            <h1 className="title" > NFTs for Bundle </h1>
                        </div>
                    </div>
                </section>
                <section className="profile_data">
                    <div className="container">
                        <div className="tab-content author-tabs-content" >
                            <div id="on-Top" className="tab-pane fade show active">
                                <form action="#" className="mb-8">
                                    <div className="filter-style-one common-filter d-flex-between profile_filter">
                                        <div className="d-flex-center filter-left-cate">
                                            {/* <div className="filter-select-option border-gradient">
                                                <Select options={optionsCategory} />
                                            </div> */}
                                            <div className="border-gradient search-bar">
                                                <input type="text" name="search" placeholder="Search by name or token id" id="search" onChange={(e) => { handleSearch(e) }} />
                                                <button className="search-btn" type="submit"> <i className="ri-search-line"></i> </button>
                                            </div>
                                        </div>
                                        <div className="d-flex-center filter-right-cate grid-view-tabs">
                                        </div>
                                    </div>
                                </form>
                                <div className="row">
                                    {nftDetailFiltered ?
                                        nftDetailFiltered.map((item, index) => {
                                            return (
                                                <>
                                                    {
                                                        tokenIdPack.length > 0 ?

                                                            <div class="col-xxl-4 col-md-6 mb-6">
                                                                <div class=" border-gradient bundle_card">
                                                                    <div class="product-collection-box">
                                                                        <Link to="/nft_details" className="ratio ratio-1x1" >
                                                                            <img src={item?.metaData?.image ? `${item?.metaData?.image}` : "images/explore/13.jpg"} alt="nft thumbnail" />
                                                                        </Link>
                                                                    </div>
                                                                    <div class="product-collection-footer d-flex align-items-center justify-content-between">
                                                                        <div class="product-collection-info">
                                                                            <span class="product-collection-name"><Link >{item?.metaData?.name}</Link></span>
                                                                            <span class="product-collection-stock">{tokenIdPack.length} Items</span>
                                                                        </div>
                                                                        <span className="h5 text-white" >  {item?.buyNowPrice.toFixed(5)} </span>
                                                                    </div>
                                                                    {
                                                                        walletAddress === '0xC1fEec289C4110A103F7A3F759cFA7a61d18a173' ?
                                                                            <button type="button" onClick={() => buyPackCentralized(item?.buyNowPrice)} className="btn  btn-block btn-border-gradient mt-2 btn-gradient w-100 text-center btn-small">
                                                                                <span> Buy Pack </span>
                                                                            </button>
                                                                            :
                                                                            <button type="button" onClick={() => buyPack(item?.buyNowPrice)} className="btn  btn-block btn-border-gradient mt-2 btn-gradient w-100 text-center btn-small">
                                                                                <span> Buy Pack </span>
                                                                            </button>
                                                                    }
                                                                </div>
                                                            </div>
                                                            : ''
                                                    }
                                                </>
                                            )
                                        }) : ""}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div >
        </>
    )
}

export default BundleList