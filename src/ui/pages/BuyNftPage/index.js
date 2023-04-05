import React, { useRef, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Web3 from "web3";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import contract from '../../../contract.json'
import { $ } from "react-jquery-plugin";

const BuyNftPage = () => {

    const [userDetails, setUserDetails] = useState([])
    const [tokenType, setTokenType] = useState([])

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

    function alertSuccessMessageonSell() {
        $("#successmessageonsell").modal('show');
    }

    const [password, setPassword] = useState('');
    const [centerlizedData, setCenterlizedData] = useState([])
    const [userId, setUserId] = useState('')
    const [userPrice, setUserPrice] = useState('')

    const messagesEndRef = useRef(null)
    let web3
    if (!window.ethereum) {
        web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/")
    } else {
        web3 = new Web3(window.ethereum)
    }
    const nftContract = new web3.eth.Contract(contract.nftAbi, contract.nftAddress);
    const marketplace = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
    const token_address = '0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437';
    const [array2, setArray2] = useState([]);
    const [nftDetails, setnftDetails] = useState([]);
    const [nftDetailFiltered, setnftDetailFiltered] = useState();
    const [nftDetailFilteredSearch, setnftDetailFilteredSearch] = useState();

    const handleSellStatus = async (tokenid) => {
        LoaderHelper.loaderStatus(false);
        await AuthService.sellStautsBuy(tokenid, token_address).then(async result => {
            if (result.success) {
                LoaderHelper.loaderStatus(false);
            }
        });
    }
    const uniqueArr = Array.from(new Set(array2.map(item => item.id))).map(id => {
        return array2.find(item => item.id === id);
    });

    useEffect(() => {
        nftSellsList(token_address);
    }, []);

    const nftSellsList = async () => {
        LoaderHelper.loaderStatus(true);
        await AuthService.nftSellsList(token_address).then(async result => {
            if (result.success) {
                LoaderHelper.loaderStatus(false);
                setnftDetails(result?.data?.result)
            } else {
                LoaderHelper.loaderStatus(false);
                if (result.message === 'jwt expired') {
                    Navigate('/login')
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
        $("#successmessageonsell").modal('hide');
        let arr = [];
        try {
            for (let i = 0; i < nftDetails.length; i++) {
                LoaderHelper.loaderStatus(true);
                let ownerOfNft = await nftContract.methods.ownerOf(nftDetails[i].token_id).call()
                if (ownerOfNft === contract.marketplaceAddress) {
                    let sellDetails = await marketplace.methods.nftContractAuctions(nftDetails[i].token_address, nftDetails[i].token_id).call()
                    let sellDetailsNew = await marketplace.methods.rents(nftDetails[i].token_id).call()
                    if (sellDetails.minPrice === '0' && sellDetailsNew.autoRent === false) {
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
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(error.message);
        }
    };

    const buyNft = async (id, price) => {
        try {
            LoaderHelper.loaderStatus(true);
            let bnbValue = (price * 10 ** 18)
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenIdNew = parseInt(id);
            var hexaDecimalToken = "0x" + (tokenIdNew).toString(16);
            const tx = await marketplace.methods.buyNow(contract.nftAddress, hexaDecimalToken).send({ from: account, value: bnbValue })
            if (tx?.status === true) {
                LoaderHelper.loaderStatus(false);
                alertSuccessMessageonSell();
                handleSellStatus(id);
            }
        } catch (error) {
            // console.log(error,'error');
            alertErrorMessage(error?.message)
            LoaderHelper.loaderStatus(false);
        }
    };



    // useEffect(() => {
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

    const handleDecryptData = async (password) => {
        try {
            let dcrypt = await web3.eth.accounts.decrypt(centerlizedData?.wallet_data, password);
            if (dcrypt?.privateKey) {
                $("#enterpasswordmodal").modal('hide');
                buyNftCentralized(dcrypt?.privateKey)
            }
        } catch (error) {
            // console.log(error, 'error:handleDecryptData');
            alertErrorMessage(error.message)
        }
    }


    const handleGetValue = (id, price) => {
        $("#enterpasswordmodal").modal('show');
        setUserId(id)
        setUserPrice(price)

        // buyNftCentralized()
    }


    const buyNftCentralized = async (privateKey) => {
        try {
            LoaderHelper.loaderStatus(true);
            let buyNowPrice = (userPrice * 10 ** 18)
            const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
            const privateKeyOfwallet = privateKey //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0x4b80Efd0087F255DAf1F4b43D99948b0e6356481" // Auction contract address
            let tokenIdNew = parseInt(userId); //convert to hex
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
            // console.log(transactionReceipt, 'transactionReceipt');
            if (transactionReceipt?.status === true) {
                LoaderHelper.loaderStatus(false);
                handleSellStatus(userId)
                alertSuccessMessageonSell();
            }
        } catch (error) {
            console.log(error, 'error');
            alertErrorMessage('cannot buy NFT')
            LoaderHelper.loaderStatus(false);
        }
    }


    const handlePassReset = () => {
        setPassword('');
    }


    const filteredPrices = [];
    for (let i = 0; i < nftDetailFiltered?.length; i++) {
        if (nftDetailFiltered[i]?.nftSeller != userDetails) {
            filteredPrices.push(nftDetailFiltered[i]);
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
                                    {filteredPrices ? filteredPrices.map((item, index) => {
                                        let price;
                                        return (
                                            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  mb-6">
                                                <div className="explore-style-one explore-style-overlay border-gradient">
                                                    <div className="thumb ">
                                                        <div className="ratio ratio-1x1" >
                                                            <img src={item?.metaData?.image ? `${item?.metaData?.image}` : "images/explore/13.jpg"} alt="nft thumbnail" />
                                                        </div>
                                                    </div>
                                                    <div className="content px-4">
                                                        <div className="d-flex-between align-items-center" >
                                                            <div>
                                                                <div className="header d-flex-between pt-4 pb-2">
                                                                    <h3 className="title">{item?.metaData?.name}</h3>
                                                                </div>
                                                                <div className="product-owner d-flex-between">
                                                                    <span className="bid-owner text-secondry d-flex align-items-center">
                                                                        {item?.name}</span>
                                                                </div>
                                                            </div>
                                                            <span className="biding-price d-flex-center text-white"> {item?.token_id}</span>
                                                        </div>
                                                        <hr />
                                                        <div className="action-wrapper d-flex flex-column justify-content-start border-0 pb-4">
                                                            <small className="biding-price d-flex-center  text-white">Price : {item?.buyNowPrice.toFixed(5)}
                                                            </small>
                                                        </div>
                                                    </div>
                                                    {
                                                        tokenType === 'centralized' ?
                                                            <button type="button" onClick={() => handleGetValue(item?.token_id, item?.buyNowPrice)}
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
                                <div class="form-group mb-5">
                                    <label> Password </label>
                                    <input type="password" class="form-control" placeholder="Enter Your Password" aria-label="f-name" aria-describedby="basic-addon2" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <button type="button" class="btn btn-gradient btn-border-gradient w-100 justify-content-center mb-4" onClick={() => handleDecryptData(password)}>
                                    <span>Verify</span></button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="successmessageonsell" tabindex="-1" data-bs-backdrop="static" aria-labelledby="enterpasswordmodallabel" aria-hidden="true">
                <div className="modal-dialog modal-sm modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header no-border flex-column px-8 pt-5 ">
                            <img src="images/success.png" width="150" height="150" />
                            <h3 className="pt-5" id="enterpasswordmodallabel"> NFT Purchased Successfully</h3>
                        </div>
                        <div className="modal-body d-flex justify-content-center" >
                            <button type="button" class="btn btn-gradient btn-border-gradient w-50 justify-content-center mb-4" onClick={() => getSellsList()}>  <span>ok</span></button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default BuyNftPage