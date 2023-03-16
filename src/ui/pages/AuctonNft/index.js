
import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import { useAccount } from 'wagmi'
import contract from '../../../contract.json'
import Web3 from "web3";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import { $ } from "react-jquery-plugin";

const AuctonNft = () => {
    const [nftDetails, setnftDetails] = useState([]);
    const walletAddress = localStorage.getItem("wallet_address");
    const [nftDetailFiltered, setnftDetailFiltered] = useState();
    let myTokenAddress = '0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437'
    const token_address = '0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437';
    const [bidAmountInput, setBidAmountInput] = useState('');
    const [newTokenId, setNewTokenId] = useState([]);
    const [nftDetailFilteredSearch, setnftDetailFilteredSearch] = useState();

    const web3 = new Web3(window.ethereum)
    const nftContract = new web3.eth.Contract(contract.nftAbi, contract.nftAddress);
    const marketplace = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)

    useEffect(() => {
        nftSellsList(token_address);
    }, []);

    useEffect(() => {
        if (nftDetails) {
            getSellsList()
        }
    }, [nftDetails]);



    // "amount": 78,
    // "token_address": "0xAea99ef6883Bf422224912fdfC7B07d439DE6cf8",
    // "token_id": 0,

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
                console.log(i, 'NewDataR');
                LoaderHelper.loaderStatus(true);
                let tkId = parseInt(nftDetails[i].token_id)
                let ownerOfNft = await nftContract.methods.ownerOf(nftDetails[i].token_id).call()
                if (ownerOfNft === contract.marketplaceAddress) {
                    let auctionDetails = await marketplace.methods.nftContractAuctions(nftDetails[i].token_address, nftDetails[i].token_id).call()
                    // console.log(auctionDetails?.bidPeriod, 'auctionDetailsR');
                    if (auctionDetails.minPrice != 0 && auctionDetails.pack === false) {
                        let obj = {
                            metadata: JSON.parse(nftDetails[i].metadata),
                            token_id: nftDetails[i].token_id,
                            bidPeriod: auctionDetails.bidPeriod / 86400,
                            buyNowPrice: auctionDetails.buyNowPrice / 10 ** 18,
                            minPrice: auctionDetails.minPrice / 10 ** 18,
                            auctionEndPeriod: auctionDetails.auctionEndPeriod,
                            nftHighestBid: auctionDetails.nftHighestBid / 10 ** 18
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
        } catch (error) {
            console.log(error.message);
        }
    };


    let latestTime = Math.floor(new Date().getTime() / 1000.0)


    // console.log(1678965575096 - latestTime ,'latestTime');



    // console.log(nftDetailFiltered,'nftDetailFiltered');

    const handleModal = async (tokenid) => {
        setNewTokenId(tokenid)
        if (tokenid) {
            $("#make_offoer_modal").modal('show');
        }
    }

    const makeBid = async (tokenid) => {
        LoaderHelper.loaderStatus(true);
        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]
        let tokenId = parseInt(tokenid);
        var hexaDecimalToken = "0x" + (tokenId).toString(16);
        var weiAmtPrice = (1000000000000000000 * bidAmountInput);
        let bidAmount = "0x" + weiAmtPrice.toString(16); //hex format
        const tx = await marketplace.methods.makeBid(contract.nftAddress, tokenId).send({ from: account, value: bidAmount })
        if (tx?.status === true) {
            $("#make_offoer_modal").modal('hide');
            LoaderHelper.loaderStatus(false);
            handleMakeBidStatus(newTokenId)
            alertSuccessMessage('Successfully Send Make An Offer')
        } else {
            console.log('Something Went Wrong');
        }
    }

    const makeBidCentralized = async (tokenid) => {
        LoaderHelper.loaderStatus(true);
        const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
        const privateKeyOfwallet = '0x0e20a03cd80f0780a0c4cfe3d5260745b0a83c9ee90f2f7fc092cddf5c5d761e' //Private key of wallet goes here
        const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
        const contract_address = "0x6d7D7842F4256f7Bd4ece025A68D2CF964De6abE" // Auction contract address
        let tokenId = parseInt(tokenid); //convert to hex
        var weiAmtPrice = (1000000000000000000 * bidAmountInput);
        let bidAmount = "0x" + weiAmtPrice.toString(16); //hex format
        const tx = {
            from: address, // Wallet address
            to: contract_address, // Contract address of battle infinity
            gas: 1000000,
            value: bidAmount,
            data: await contract_interaction.methods.rent(tokenId, contract.nftAddress,).encodeABI()
        }
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
        const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        if (transactionReceipt?.status === true) {
            $("#make_offoer_modal").modal('hide');
            LoaderHelper.loaderStatus(false);
            alertSuccessMessage('Successfully Send Make An Offer')
            handleMakeBidStatus(newTokenId)
        } else {
            console.log('Something Went Wrong');
        }
    }

    const handleMakeBidStatus = async () => {
        await AuthService.sellStautsMakeBid(bidAmountInput, newTokenId, myTokenAddress).then(async result => {
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

    const withdrawAuction = async (tokenid) => {
        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]
        let tokenId = parseInt(tokenid);
        var hexaDecimalToken = "0x" + (tokenId).toString(16);

        const tx = await marketplace.methods.withdrawAuction(contract.nftAddress, tokenId).send({ from: account })
        console.log("Tx: ", tx);
        if (tx?.status === true) {
            $("#make_offoer_modal").modal('hide');
            alertSuccessMessage('Successfully withdraw Auction')
        } else {
            console.log('Something Went Wrong');
        }

    }



    const withdrawAuctionCentralized = async (tokenid) => {
        const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
        const privateKeyOfwallet = '0x0e20a03cd80f0780a0c4cfe3d5260745b0a83c9ee90f2f7fc092cddf5c5d761e' //Private key of wallet goes here
        const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
        const contract_address = "0x6d7D7842F4256f7Bd4ece025A68D2CF964De6abE" // Auction contract address
        let tokenId = parseInt(tokenid);  //convert to hex

        const tx = {
            from: address, // Wallet address
            to: contract_address, // Contract address of battle infinity
            gas: 1000000,

            data: await contract_interaction.methods.withdrawAuction(contract.nftAddress, tokenId).encodeABI()
        }
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
        const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    }


    const settleAuction = async (tokenid) => {
        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]
        let tokenId = parseInt(tokenid);
        var hexaDecimalToken = "0x" + (tokenId).toString(16);
        const tx = await marketplace.methods.settleAuction(contract.nftAddress, tokenId).send({ from: account })
        console.log("Tx:bid ", tx);
    }

    const settleAuctionCentralized = async (tokenid) => {
        const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
        const privateKeyOfwallet = '0x0e20a03cd80f0780a0c4cfe3d5260745b0a83c9ee90f2f7fc092cddf5c5d761e' //Private key of wallet goes here
        const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
        const contract_address = "0x6d7D7842F4256f7Bd4ece025A68D2CF964De6abE" // Auction contract address
        let tokenId = parseInt(tokenid);  //convert to hex

        const tx = {
            from: address, // Wallet address
            to: contract_address, // Contract address of battle infinity
            gas: 1000000,
            data: await contract_interaction.methods.rent(tokenId, contract.nftAddress).encodeABI()
        }
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
        const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    }



    const withdrawBid = async (tokenid) => {
        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]
        let tokenId = parseInt(tokenid);
        var hexaDecimalToken = "0x" + (tokenId).toString(16);

        const tx = await marketplace.methods.withdrawBid(contract.nftAddress, tokenId).send({ from: account })
        console.log("Tx: ", tx);
    }


    const withdrawBidCentralized = async (tokenid) => {
        const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
        const privateKeyOfwallet = '0x0e20a03cd80f0780a0c4cfe3d5260745b0a83c9ee90f2f7fc092cddf5c5d761e' //Private key of wallet goes here
        const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
        const contract_address = "0x6d7D7842F4256f7Bd4ece025A68D2CF964De6abE" // Auction contract address
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

                                        // nftDetailFiltered?.minPrice ?

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
                                                        <span className="biding-price d-flex-center  text-white">{item?.bidPeriod.toFixed(2)} Day</span>
                                                    </div>
                                                    {/* <hr /> */}
                                                    {/* <div className="action-wrapper d-flex-between border-0 pb-4">
                                                        <span className="biding-price d-flex-center  text-white">Buy Now Price</span>
                                                        <span className="biding-price d-flex-center  text-white">{item?.buyNowPrice.toFixed(2)}</span>
                                                    </div> */}
                                                    <hr />
                                                    <div className="action-wrapper d-flex-between border-0 pb-4">
                                                        <span className="biding-price d-flex-center  text-white">Minimum Price</span>
                                                        <span className="biding-price d-flex-center  text-white">{item?.minPrice}</span>
                                                    </div>
                                                    <hr />
                                                    <div className="action-wrapper d-flex-between border-0 pb-4">
                                                        <span className="biding-price d-flex-center  text-white">Auction End Period</span>
                                                        <span className="biding-price d-flex-center  text-white">{item?.auctionEndPeriod}</span>
                                                    </div>
                                                    <hr />
                                                    <div className="action-wrapper d-flex-between border-0 pb-4">
                                                        <span className="biding-price d-flex-center  text-white">Auction Highest Bid</span>
                                                        <span className="biding-price d-flex-center  text-white">{item?.nftHighestBid}</span>
                                                    </div>
                                                </div>

                                                <Link to="#" data-bs-toggle="modal" className="btn  btn-block btn-gradient w-100 text-center btn-small" onClick={() => handleModal(item?.token_id)}><span> Make an Offer</span>
                                                </Link>
                                            </div>
                                        </div>
                                        // : null

                                    )
                                }) : ""}
                        </div>
                    </div>
                </section>
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
                                {/* <span class="date align-self-center text-end">#5456564D56GS3</span> */}
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
                            {
                                walletAddress === '0xC1fEec289C4110A103F7A3F759cFA7a61d18a173' ?
                                    <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => makeBidCentralized(newTokenId)}><span>Make Bid</span></button>
                                    :
                                    <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => makeBid(newTokenId)}><span>Make Bid</span></button>
                            }

                            {
                                walletAddress === '0xC1fEec289C4110A103F7A3F759cFA7a61d18a173' ?
                                    <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => withdrawAuctionCentralized(newTokenId)}><span>Withdrawa</span></button>
                                    :
                                    <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => withdrawAuction(newTokenId)}><span>Withdrawa</span></button>
                            }

                            {/* {
                                walletAddress === '0xC1fEec289C4110A103F7A3F759cFA7a61d18a173' &&
                                    latestTime > nftDetailFiltered?.bidPeriod ?
                                    <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => settleAuctionCentralized(newTokenId)}><span>Settle Auction</span></button>
                                    :
                                    <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => settleAuction(newTokenId)}><span>Settle Auction</span></button>
                            }

                            {
                                walletAddress === '0xC1fEec289C4110A103F7A3F759cFA7a61d18a173' &&
                                    latestTime > nftDetailFiltered?.bidPeriod ?
                                    <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => withdrawBidCentralized(newTokenId)}><span>withdraw Bid</span></button>
                                    :
                                    <button type="button" class="btn btn-gradient btn-lg w-100 justify-content-center" onClick={() => withdrawBid(newTokenId)}><span>withdraw Bid</span></button>
                            } */}

                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default AuctonNft

