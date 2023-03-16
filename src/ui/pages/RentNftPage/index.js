
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import { useAccount } from 'wagmi'
import contract from '../../../contract.json'
import Web3 from "web3";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";

const RentNftPage = () => {
    const [nftDetails, setnftDetails] = useState([]);
    const walletAddress = localStorage.getItem("wallet_address");
    const [nftDetailFiltered, setnftDetailFiltered] = useState();
    let myTokenAddress = '0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437'
    const token_address = '0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437';
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


    console.log(nftDetails, 'nftDetails');

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
                    let sellDetails = await marketplace.methods.rents(nftDetails[i].token_id).call()
                    let obj = {
                        metadata: JSON.parse(nftDetails[i].metadata),
                        token_id: nftDetails[i].token_id,
                        rentEndTime: sellDetails.rentEndTime / 86400,
                        ownerPercent: sellDetails.ownerPercent,
                        rentPrice: sellDetails.rentPrice / 10 ** 18,
                        rentedAt: sellDetails.rentedAt
                    }
                    LoaderHelper.loaderStatus(false);
                    arr.push(obj)
                } else {
                    // console.log(' in else');
                }
            }
            LoaderHelper.loaderStatus(false);
            setnftDetailFiltered(arr)
            setnftDetailFilteredSearch(arr)
        } catch (error) {
            // console.log(error.message);
        }
    };

    const rentNft = async (tokenid, priceNew) => {
        LoaderHelper.loaderStatus(true);
        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]
        let tokenId = parseInt(tokenid);
        var hexaDecimalToken = "0x" + (tokenId).toString(16);
        var weiAmtPrice = (1000000000000000000 * priceNew);
        var price = "0x" + weiAmtPrice.toString(16);//hex format
        const tx = await marketplace.methods.rent(tokenId, contract.nftAddress).send({ from: account, value: price })
        if (tx?.status) {
            handleSellStatus()
            getSellsList();
            alertSuccessMessage('Successfully Rented')
            LoaderHelper.loaderStatus(false);
        }
    }

    const rentNftCentralized = async (tokenid, priceNew) => {
        LoaderHelper.loaderStatus(true);
        const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
        const privateKeyOfwallet = '0x0e20a03cd80f0780a0c4cfe3d5260745b0a83c9ee90f2f7fc092cddf5c5d761e' //Private key of wallet goes here
        const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
        const contract_address = "0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437" // Auction contract address
        let tokenId = parseInt(tokenid)  //convert to hex
        var weiAmtPrice = (1000000000000000000 * priceNew);
        var rentPrice = "0x" + weiAmtPrice.toString(16);//convert to hex
        const tx = {
            from: address, // Wallet address
            to: contract_address, // Contract address of battle infinity
            gas: 1000000,
            value: rentPrice,
            data: await contract_interaction.methods.rent(tokenId, contract.nftAddress).encodeABI()
        }
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
        const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        if (transactionReceipt?.status === true) {
            LoaderHelper.loaderStatus(false);
            alertSuccessMessage('Successfully Rented');
            handleSellStatus();
            getSellsList();
        } else {
            alertErrorMessage('No')
        }
    }


    const handleSellStatus = async (tokenid, priceNew) => {
        await AuthService.sellStautsRented(tokenid, priceNew, myTokenAddress).then(async result => {
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
    // console.log(nftDetailFiltered,'nftDetailFiltered');

    return (
        <>
            <div className="page_wrapper"  >
                <section className="inner-page-banner explore_banner_inner">
                    <div className="container">
                        <div className="innertext-start">
                            <h1 className="title">NFT's for Rent</h1>
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
                                    let price;
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
                                                        <span className="biding-price d-flex-center  text-white">Owner Percent </span>
                                                        <span className="biding-price d-flex-center  text-white">{item?.ownerPercent}</span>
                                                    </div>
                                                    <hr />
                                                    <div className="action-wrapper d-flex-between border-0 pb-4">
                                                        <span className="biding-price d-flex-center  text-white">Rent Price</span>
                                                        <span className="biding-price d-flex-center  text-white">{item?.rentPrice}</span>
                                                    </div>
                                                    <hr />
                                                    <div className="action-wrapper d-flex-between border-0 pb-4">
                                                        <span className="biding-price d-flex-center  text-white">Rent EndTime</span>
                                                        <span className="biding-price d-flex-center  text-white">{item?.rentEndTime.toFixed(2)} Day</span>
                                                    </div>
                                                </div>

                                                {item?.rentedAt != '0' ?
                                                    <Link to="#" className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Rented</span>
                                                    </Link>

                                                    : walletAddress === '0xC1fEec289C4110A103F7A3F759cFA7a61d18a173' ?
                                                        <Link to="#" onClick={() => rentNftCentralized(item?.token_id, item?.rentPrice)} className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Rent Now</span>
                                                        </Link>
                                                        :
                                                        <Link to="#" onClick={() => rentNft(item?.token_id, item?.rentPrice)} className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Rent Now</span>
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
        </>
    )
}

export default RentNftPage

