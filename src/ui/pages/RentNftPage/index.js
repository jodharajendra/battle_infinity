
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import contract from '../../../contract.json'
import Web3 from "web3";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import { $ } from "react-jquery-plugin";

const RentNftPage = () => {

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

    const [nftDetails, setnftDetails] = useState([]);

    const [nftDetailFiltered, setnftDetailFiltered] = useState();
    const token_address = '0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437';
    const [nftDetailFilteredSearch, setnftDetailFilteredSearch] = useState();

    let web3

    if (!window.ethereum) {
        web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/")
    } else {
        web3 = new Web3(window.ethereum)

    }

    const nftContract = new web3.eth.Contract(contract.nftAbi, contract.nftAddress);
    const marketplace = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)




    const [password, setPassword] = useState('');
    const [centerlizedData, setCenterlizedData] = useState([])
    const [userId, setUserId] = useState('')
    const [userPrice, setUserPrice] = useState('')

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
                rentNftCentralized(dcrypt?.privateKey)
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
        $("#successmessageonsell").modal('hide');
        let arr = [];
        try {
            for (let i = 0; i < nftDetails.length; i++) {
                LoaderHelper.loaderStatus(true);
                let tkId = parseInt(nftDetails[i].token_id)
                let ownerOfNft = await nftContract.methods.ownerOf(nftDetails[i].token_id).call()
                if (ownerOfNft === contract.marketplaceAddress) {
                    let sellDetails = await marketplace.methods.rents(nftDetails[i].token_id).call()
                    console.log(sellDetails, 'SellDetailsRj');
                    if (sellDetails.autoRent === true) {
                        let obj = {
                            token_address: nftDetails[i].token_address,
                            metadata: JSON.parse(nftDetails[i].metadata),
                            token_id: nftDetails[i].token_id,
                            rentEndTime: sellDetails.rentEndTime / 86400,
                            ownerPercent: sellDetails.ownerPercent,
                            rentPrice: sellDetails.rentPrice / 10 ** 18,
                            rentedAt: sellDetails.rentedAt,
                            owner: sellDetails.owner,
                            tenant: sellDetails.tenant
                        }
                        arr.push(obj);
                    }
                    LoaderHelper.loaderStatus(false);
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

    const rentNft = async (tokenid, priceNew) => {
        try {
            LoaderHelper.loaderStatus(true);
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            let tokenId = parseInt(tokenid);
            var hexaDecimalToken = "0x" + (tokenId).toString(16);
            var weiAmtPrice = (1000000000000000000 * priceNew);
            var price = "0x" + weiAmtPrice.toString(16);//hex format
            const tx = await marketplace.methods.rent(tokenId, contract.nftAddress).send({ from: account, value: price })
            if (tx?.status) {
                handleSellStatus(tokenid)
                LoaderHelper.loaderStatus(false);
                alertSuccessMessageonSell();
            }
        } catch (error) {
            alertErrorMessage(error?.message)
            LoaderHelper.loaderStatus(false);
        }

    }

    const rentNftCentralized = async (privateKey) => {
        try {
            LoaderHelper.loaderStatus(true);
            const contract_interaction = new web3.eth.Contract(contract.marketplaceAbi, contract.marketplaceAddress)
            const privateKeyOfwallet = privateKey //Private key of wallet goes here
            const address = await web3.eth.accounts.privateKeyToAccount(privateKeyOfwallet).address;
            const contract_address = "0x4b80Efd0087F255DAf1F4b43D99948b0e6356481" // Auction contract address
            let tokenId = parseInt(userId)  //convert to hex
            var weiAmtPrice = (1000000000000000000 * userPrice);
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
            // console.log(transactionReceipt, 'transactionReceipt');
            if (transactionReceipt?.status === true) {
                LoaderHelper.loaderStatus(false);
                alertSuccessMessageonSell();
                handleSellStatus(userId);
            }
        } catch (error) {
            console.log(error, 'error');
            alertErrorMessage('Transaction has been reverted by the EVM')
            LoaderHelper.loaderStatus(false);
        }
    }


    const handleSellStatus = async (tokenid, priceNew) => {
        await AuthService.sellStautsRented(tokenid, priceNew, token_address).then(async result => {
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

    const filteredPricesNew = [];
    for (let i = 0; i < nftDetailFiltered?.length; i++) {
        if (nftDetailFiltered[i]?.owner != userDetails) {
            filteredPricesNew.push(nftDetailFiltered[i]);
        }
    }


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
                            {filteredPricesNew ?
                                filteredPricesNew.map((item, index) => {
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

                                                {tokenType === 'centralized' ?
                                                    <Link to="#" onClick={() => handleGetValue(item?.token_id, item?.rentPrice)} className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Rent Now</span>
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
                                    <span>SAVE</span></button>
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
                            <h3 className="pt-5" id="enterpasswordmodallabel"> NFT Rented Successfully </h3>
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




{/* <>
{item?.tenant === userDetails && item?.autoRent === true ?

    tokenType === 'centralized' ?
        <Link to="#" onClick={() => handleGetValue(item?.token_id, item?.rentPrice)} className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Rent Now</span>
        </Link>
        :
        <Link to="#" onClick={() => rentNft(item?.token_id, item?.rentPrice)} className="btn  btn-block btn-gradient w-100 text-center btn-small"><span> Rent Now</span>
        </Link>
    :
    <Link to="#" onClick={() => rentNftRemove(item?.token_id)} className="btn  btn-block btn-gradient w-100 text-center btn-small"><span>Remove Rent</span>
    </Link>


}
</> */}

export default RentNftPage

