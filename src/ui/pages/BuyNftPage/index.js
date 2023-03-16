import React, { useRef, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Select from 'react-select'
import Web3 from "web3";
import { ApiConfig } from "../../../api/apiConfig/apiConfig";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import contract from '../../../contract.json'

const BuyNftPage = () => {
    const walletAddress = localStorage.getItem("wallet_address");
    const messagesEndRef = useRef(null)
    const web3 = new Web3(window.ethereum)
    const nftContract = new web3.eth.Contract(contract.nftAbi, contract.nftAddress);
    const marketplace = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
    const token_address = '0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437';
    const [array, setArray] = useState([]);
    const [array2, setArray2] = useState([]);
    const [nftDetails, setnftDetails] = useState([]);
    const [nftDetailFiltered, setnftDetailFiltered] = useState();
    const [nftDetailFilteredSearch, setnftDetailFilteredSearch] = useState();

    const handleSellStatus = async (tokenid) => {
        await AuthService.sellStautsBuy(tokenid, token_address).then(async result => {
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

    const uniqueArr = Array.from(new Set(array2.map(item => item.id))).map(id => {
        return array2.find(item => item.id === id);
    });

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
                    // alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                // alertErrorMessage(result.message);
                if (result.message === 'jwt expired') {
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
        let arr = [];
        try {
            for (let i = 0; i < nftDetails.length; i++) {
                LoaderHelper.loaderStatus(true);
                let ownerOfNft = await nftContract.methods.ownerOf(nftDetails[i].token_id).call()
                console.log(ownerOfNft, 'ownerOfNft');
                if (ownerOfNft === contract.marketplaceAddress) {
                    let sellDetails = await marketplace.methods.nftContractAuctions(nftDetails[i].token_address, nftDetails[i].token_id).call()
                    console.log(sellDetails, 'sellDetailsRaj');
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
                        console.log(arr, 'Rajendra');
                    }
                } else {
                    console.log(' in else');
                }
            }
            LoaderHelper.loaderStatus(false);
            setnftDetailFiltered(arr)
            setnftDetailFilteredSearch(arr)
        } catch (error) {
            console.log(error.message);
        }
    };

    console.log(nftDetailFiltered, 'nftDetailFiltered');


    const buyNft = async (id, price) => {
        LoaderHelper.loaderStatus(true);
        let bnbValue = (price * 10 ** 18)
        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]
        let tokenIdNew = parseInt(id);
        var hexaDecimalToken = "0x" + (tokenIdNew).toString(16);
        const tx = await marketplace.methods.buyNow(contract.nftAddress, hexaDecimalToken).send({ from: account, value: bnbValue })
        if (tx?.status === true) {
            LoaderHelper.loaderStatus(false);
            alertSuccessMessage('Successfully Buy Nft');
            handleSellStatus();
            getSellsList();
        } else {
            console.log('error');
            LoaderHelper.loaderStatus(true);
        }
    };

    const buyNftCentralized = async (id, price) => {
        console.log(id, price, 'dfdfdf');
        LoaderHelper.loaderStatus(true);
        var weiAmt = (10 ** 18 * price);
        let buyNowPrice = (price * 10 ** 18)
        const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
        const privateKeyOfwallet = '0x0e20a03cd80f0780a0c4cfe3d5260745b0a83c9ee90f2f7fc092cddf5c5d761e' //Private key of wallet goes here
        const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
        const contract_address = "0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437" // Auction contract address
        let tokenIdNew = parseInt(id); //convert to hex
        var hexaDecimalToken = "0x" + (tokenIdNew).toString(16);
        const tx = {
            from: address, // Wallet address
            to: contract_address, // Contract address of battle infinity
            value: buyNowPrice,
            gas: 1000000,
            data: await contract_interaction.methods.buyNow(contract.nftAddress, hexaDecimalToken).encodeABI()
        }
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
        const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        if (transactionReceipt?.status === true) {
            LoaderHelper.loaderStatus(false);
            alertSuccessMessage('Successfully Buy Nft');
            handleSellStatus()
        } else {
            // console.log('error');
        }
    }

    const scrollTop = () => {
        messagesEndRef?.current?.scrollIntoView(true)
    }

    return (
        <>
            <div className="page_wrapper" ref={messagesEndRef}>
                <section className="inner-page-banner rent_inner_banner">
                    <div className="container">
                        <div className="innertext-start">
                            <h1 className="title" > NFT's for Buy </h1>
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
                                    {nftDetailFiltered ? nftDetailFiltered.map((item, index) => {
                                        let price;
                                        return (
                                            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  mb-6">
                                                <div className="explore-style-one explore-style-overlay border-gradient">
                                                    <div className="thumb">
                                                        <Link to="/nft_details">
                                                            <img src={item?.metaData?.image ? `${item?.metaData?.image}` : "images/explore/13.jpg"} alt="nft thumbnail" />
                                                        </Link>
                                                    </div>
                                                    <div className="content px-4">
                                                        <div className="d-flex-between align-items-center" >
                                                            <div>
                                                                <div className="header d-flex-between pt-4 pb-2">
                                                                    <h3 className="title"><Link >{item?.metaData?.name}</Link></h3>
                                                                </div>
                                                                <div className="product-owner d-flex-between">
                                                                    <span className="bid-owner text-secondry d-flex align-items-center">
                                                                        <Link>{item?.name} {/* <img src="images/verified.png" className="img-fluid verify_img" /> */}</Link></span>
                                                                </div>
                                                            </div>
                                                            <span className="biding-price d-flex-center text-white"> {item?.token_id}</span>
                                                        </div>
                                                        <hr />
                                                        <div className="action-wrapper d-flex flex-column justify-content-start border-0 pb-4">
                                                            <small className="biding-price d-flex-center  text-white">Price : {item?.buyNowPrice.toFixed(5)}
                                                            </small>
                                                            <small className="biding-price d-flex-center  text-white">Highest Bid : {item?.nftHighestBidder}
                                                            </small>
                                                        </div>
                                                    </div>
                                                    {
                                                        walletAddress === '0xC1fEec289C4110A103F7A3F759cFA7a61d18a173' ?
                                                            <button type="button" onClick={() => buyNftCentralized(item?.token_id, item?.buyNowPrice)}
                                                                className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Buy now </span> </button>
                                                            :
                                                            <button type="button" onClick={() => buyNft(item?.token_id, item?.buyNowPrice)}
                                                                className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Buy now </span> </button>
                                                    }

                                                </div>
                                            </div>
                                        )
                                    }) : ""}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </>
    )
}

export default BuyNftPage