import React, { useRef, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Web3 from "web3";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import contract from '../../../contract.json';
import { $ } from "react-jquery-plugin";

const BundleList = () => {

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


    const messagesEndRef = useRef(null)

    let web3
    if (!window.ethereum) {
        web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/")
    } else {
        web3 = new Web3(window.ethereum)
    }

    const [password, setPassword] = useState('');
    const nftContract = new web3.eth.Contract(contract.nftAbi, contract.nftAddress);
    const marketplace = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
    const token_address = '0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437';
    const [nftDetails, setnftDetails] = useState([]);
    const [nftDetailFiltered, setnftDetailFiltered] = useState();
    const [nftDetailFilteredSearch, setnftDetailFilteredSearch] = useState();
    const [tokenIdPack, setTokenIdPack] = useState([]);
    const [centerlizedData, setCenterlizedData] = useState([])
    const [userPrice, setUserPrice] = useState('')

    useEffect(() => {
        nftSellsList(token_address);
    }, []);


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
                buyPackCentralized(dcrypt?.privateKey)
            }
        } catch (error) {
            console.log(error, 'error:handleDecryptData');
            alertErrorMessage(error.message)
        }
    }


    const handleGetValue = (price) => {
        $("#enterpasswordmodal").modal('show');
        setUserPrice(price)
    }


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
                if (result.message === 'Unauthorized Request!') {
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
        let arr = [];
        try {
            for (let i = 0; i < nftDetails.length; i++) {
                LoaderHelper.loaderStatus(true);
                let tkId = parseInt(nftDetails[i].token_id)
                let ownerOfNft = await nftContract.methods.ownerOf(nftDetails[i].token_id).call()
                if (ownerOfNft === contract.marketplaceAddress) {
                    let sellDetails = await marketplace.methods.nftContractAuctions(nftDetails[i].token_address, nftDetails[i].token_id).call()
                    console.log(sellDetails,'sellDetails');                  
                    if (sellDetails.minPrice === '0' && sellDetails?.pack === true) {
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
                    // console.log('in else');
                }
            }
            LoaderHelper.loaderStatus(false);
            setnftDetailFiltered(arr)
            setnftDetailFilteredSearch(arr)
            tokenIDPack(arr);
        } catch (error) {
            alertErrorMessage(error.message)
            LoaderHelper.loaderStatus(false);
        }
    };

    const tokenIDPack = async (detailPAck) => {
        let arryaId = []
        let tokenIdsNew = detailPAck; //convert to hex
        for (let i = 0; i < tokenIdsNew.length; i++) {
            var hexaDecimalToken = tokenIdsNew[i].token_id;
            arryaId.push(hexaDecimalToken)
        }
        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]
        let tokenIds = detailPAck[1]?.token_id
        const tx = await marketplace.methods.tokensInPack(contract.nftAddress, tokenIds).call({ from: account })
        setTokenIdPack(tx);
    }

    const buyPack = async (buyPrice) => {
        try {
            LoaderHelper.loaderStatus(true);
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenIds = tokenIdPack
            const numberToHex = (_num) => {
                var inputAmt = _num;
                var weiAmt = (1000000000000000000 * inputAmt);
                var hexaDecimal = "0x" + weiAmt.toString(16);
                return hexaDecimal;
            }
            let buyNowPrice = numberToHex(buyPrice)
            const tx = await marketplace.methods.buyPack(contract.nftAddress, tokenIds).send({ from: account, value: buyNowPrice })
            if (tx?.status === true) {
                alertSuccessMessage('Successfully Buy Pack')
                getSellsList();
            }
        } catch (error) {
            console.log(error,'Error');
            alertErrorMessage('Transaction has been reverted by the EVM')
            LoaderHelper.loaderStatus(false);
        }
    }

    const buyPackCentralized = async (privateKey) => {
        try {
            LoaderHelper.loaderStatus(true);
            const privateKeyOfwallet = privateKey //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0x4b80Efd0087F255DAf1F4b43D99948b0e6356481" // NFt contract address
            let arryaId = tokenIdPack
            const numberToHex = (_num) => {
                var inputAmt = _num;
                var weiAmt = (1000000000000000000 * inputAmt);
                var hexaDecimal = "0x" + weiAmt.toString(16);
                return hexaDecimal;
            }
            let buyNowPrice = numberToHex(userPrice)
            const tx = {
                from: address, // Wallet address
                to: contract_address, // Contract address of battle infinity
                gas: 1000000,
                value: buyNowPrice,
                data: await marketplace.methods.buyPack(contract.nftAddress, arryaId).encodeABI()
            }
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKeyOfwallet);
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            if (transactionReceipt?.status) {
                alertSuccessMessage('Successfully Buy Pack');
                getSellsList();
            }
        } catch (error) {
            console.log(error,'Error');
            alertErrorMessage('Transaction has been reverted by the EVM')
            LoaderHelper.loaderStatus(false);
        }
    }

    const filteredPricesNew = [];

    for (let i = 0; i < nftDetailFiltered?.length; i++) {
        if (nftDetailFiltered[i]?.nftSeller != userDetails) {
            filteredPricesNew.push(nftDetailFiltered[i]);
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
                                    {filteredPricesNew ?
                                        filteredPricesNew.map((item, index) => {
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
                                                                            {/* <span class="product-collection-stock">{tokenIdPack.length} Items</span> */}
                                                                        </div>
                                                                        <span className="h5 text-white" >  {item?.buyNowPrice.toFixed(5)} </span>
                                                                    </div>
                                                                    {
                                                                        tokenType === 'centralized' ?
                                                                            <button type="button" onClick={() => handleGetValue(item?.buyNowPrice)} className="btn  btn-block btn-border-gradient mt-2 btn-gradient w-100 text-center btn-small">
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

export default BundleList