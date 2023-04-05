import { ApiConfig } from "../apiConfig/apiConfig"
import { ApiCallPost } from "../apiConfig/apiCall"
import { ApiCallGet } from "../apiConfig/apiCall"
import { ApiCallPut } from "../apiConfig/apiCall"
import { ApiCallPatch } from "../apiConfig/apiCall"

const TAG = 'AuthService';
// const refreshToken = localStorage.getItem("refreshToken");

const AuthService = {

  login: async (signId, password) => {
    const { baseUser, login } = ApiConfig;
    const url = baseUser + login;
    const params = {
      email: signId,
      password: password
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    return ApiCallPost(url, params, headers);
  },

  register: async (signId, userName, firstName, lastName, password) => {
    const { baseUser, register } = ApiConfig;
    const url = baseUser + register;
    const params = {
      email_or_phone: signId,
      username: userName,
      first_name: firstName,
      last_name: lastName,
      password: password
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    return ApiCallPost(url, params, headers);
  },

  getCode: async (signId) => {
    const { baseUser, getcode } = ApiConfig;
    const url = baseUser + getcode;
    const params = {
      email_or_phone: signId,
      resend: false
    };
    const headers = {
      'Content-Type': 'application/json',
    };

    return ApiCallPost(url, params, headers);
  },

  getCoderesend: async (signId) => {
    const { baseUser, getcode } = ApiConfig;
    const url = baseUser + getcode;
    const params = {
      email_or_phone: signId,
      "resend": true
    };
    const headers = {
      'Content-Type': 'application/json',
    };

    return ApiCallPost(url, params, headers);
  },

  forgotPassword: async (signId, otp, newPassword, cNewPassword) => {
    const { baseUser, forgotpassword } = ApiConfig;
    const url = baseUser + forgotpassword;
    const params = {
      email_or_phone: signId,
      otp: otp,
      new_password: newPassword,
      confirm_password: cNewPassword,
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    return ApiCallPost(url, params, headers);
  },

  getUserDetails: async () => {
    const accessToken = localStorage.getItem("accessToken");
    const { baseUser, UserProfile } = ApiConfig;
    const url = baseUser + UserProfile;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': accessToken
    };
    return ApiCallGet(url, headers);
  },

  refreshTokenData: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUser, tokenRefresh } = ApiConfig;
    const url = baseUser + tokenRefresh;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallGet(url, headers);
  },

  sendWalletAddress: async (address) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUser, updateAddress } = ApiConfig;
    const url = baseUser + updateAddress;
    const params = {
      address
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallPost(url, params, headers);
  },


  getCreatedNftData: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, allnftCreated } = ApiConfig;
    const url = baseUrl + allnftCreated;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallGet(url, headers);
  },

  getCollectedNft: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, allnftCollected } = ApiConfig;
    const url = baseUrl + allnftCollected;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallGet(url, headers);
  },


  subscribeEmail: async (emailAddress) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, subscribe } = ApiConfig;
    const url = baseUrl + subscribe;
    const params = {
      email: emailAddress
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallPost(url, params, headers);
  },


  createCollection: async (logoImage, featuredImage, bannerImage, name, urls, description, category, walletNetwork, tokenType, tokens) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, collectionCreate } = ApiConfig;
    const url = baseUrl + collectionCreate;
    const params = {
      logo: logoImage,
      featured_image: featuredImage,
      banner_image: bannerImage,
      name: name,
      url: urls,
      description: description,
      category_id: category,
      network: walletNetwork,
      token_type: tokenType,
      gas_fee_token: tokens,
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPost(url, params, headers);
  },


  updateProfile: async (logoImage, bannerImage, firstName, lastName, userName, shortBio, emailId, facebookLink, twitterLink, instagram, socialLink) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUser, updatePrfile } = ApiConfig;
    const url = baseUser + updatePrfile;
    const params = {
      logo: logoImage,
      cover_photo: bannerImage,
      first_name: firstName,
      last_name: lastName,
      username: userName,
      bio: shortBio,
      email_or_phone: emailId,
      social_connections: {
        facebookLink: facebookLink,
        twitter: twitterLink,
        instagram: instagram,
        socialLink: socialLink,
      },
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallPut(url, params, headers);
  },

  // updateProfile: async (formData) => {
  //   const refreshToken = localStorage.getItem("refreshToken");

  //   const { baseUser, updatePrfile } = ApiConfig;

  //   const url = baseUser + updatePrfile;

  //   const headers = {
  //     'Content-Type': 'multipart/form-data',
  //     'Authorization': refreshToken
  //   };

  //   return ApiCallPost(url, formData, headers);
  // },




  updateLogoImages: async (formData) => {
    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl, uploads } = ApiConfig;

    const url = baseUrl + uploads;

    const headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': refreshToken
    };

    return ApiCallPost(url, formData, headers);
  },

  updateBannerImage: async (formData) => {
    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl, uploads } = ApiConfig;

    const url = baseUrl + uploads;

    const headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': refreshToken
    };

    return ApiCallPost(url, formData, headers);
  },

  getNotification: async () => {
    const accessToken = localStorage.getItem("accessToken");
    const { baseUser, notifications } = ApiConfig;
    const url = baseUser + notifications;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': accessToken
    };
    return ApiCallGet(url, headers);
  },




  updateNotification: async (sales, successfulBids, bidsOutbids, expiredBids) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUser, notificationUpdate } = ApiConfig;
    const url = baseUser + notificationUpdate;
    const params = {
      sales: sales,
      successfull_bids: successfulBids,
      bids_and_outbids: bidsOutbids,
      expired_bids: expiredBids
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallPut(url, params, headers);
  },


  getCategoryList: async () => {

    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl, categoryList } = ApiConfig;
    const url = baseUrl + categoryList;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallGet(url, headers);
  },


  getCollectionData: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, collectionsList } = ApiConfig;
    const url = baseUrl + collectionsList;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallGet(url, headers);
  },




  // getCollectionStateData: async () => {
  //   const refreshToken = localStorage.getItem("refreshToken");
  //   const { baseUrl, collectionsList } = ApiConfig;
  //   const url = baseUrl + collectionsList;
  //   const headers = {
  //     'Content-Type': 'application/json',
  //     'Authorization': refreshToken,
  //   };
  //   return ApiCallGet(url, headers);
  // },



  addFavourite: async (item, status) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, updateFavourite } = ApiConfig;
    const url = baseUrl + updateFavourite;
    const params = {
      id: item,
      favourite: status
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallPut(url, params, headers);
  },


  getFavouriteList: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, favouriteList } = ApiConfig;
    const url = baseUrl + favouriteList;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallGet(url, headers);
  },



  getCollectionDetails: async (userId) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl } = ApiConfig;
    const url = baseUrl + `collections/details?id=${userId}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallGet(url, headers);
  },

  createNft: async (walletNetwork, price, minimumBid, startingDate, expirationDate, totalExpirationDate, collectionName, collection, description, royalties, PropertiesData, fixedPrice, checkboxButton, walletAddress, featuredImage, contract, tokenId, uploadIfpsData) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, nftCreate } = ApiConfig;
    const url = baseUrl + nftCreate;
    const params = {
      wallet_network: walletNetwork,
      price: +price,
      minimum_bid: minimumBid,
      auction_start_date: startingDate,
      auction_end_date: expirationDate,
      expiration_time: totalExpirationDate,
      name: collectionName,
      collection_id: collection,
      description: description,
      royality: royalties,
      attributes: PropertiesData,
      sell_type: fixedPrice,
      put_on_marketplace: checkboxButton,
      to_address: walletAddress,
      royalty_recipient_address: walletAddress,
      file: featuredImage,
      token_address: '0xD081A82179bdC6ecc25Fbfa8D956E06BbC8F3437',
      token_id: tokenId,
      metadata: uploadIfpsData,

    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPost(url, params, headers);
  },




  nftDetails: async (tokenID, address) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, getnftDetails } = ApiConfig;
    const url = baseUrl + getnftDetails;
    const params = {

      //   "nft_address": "0x107c9a4bf609e754f0581af1464fdd3fff85b87d",
      // "tokenId": 68
      tokenId: tokenID,
      nft_address: address,
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPost(url, params, headers);
  },
  mycollections: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, mycollections } = ApiConfig;
    const url = baseUrl + mycollections;
    const params = {

    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallGet(url, params, headers);
  },

  nftSellsList: async (token_address) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, nftSellsList } = ApiConfig;
    const url = baseUrl + nftSellsList;
    const params = {
      contract_address: token_address
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPost(url, params, headers);
  },



  collectionDetails: async (id) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, eachCollectionDetails } = ApiConfig;
    const url = baseUrl + eachCollectionDetails + id;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallGet(url, headers);
  },


  addIfpsDetails: async (description, PropertiesData, collectionName, featuredImage) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, addIfps } = ApiConfig;
    const url = baseUrl + addIfps;

    function genHexString(len) {
      const hex = '0123456789ABCDEF';
      let output = '';
      for (let i = 0; i < len; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length));
      }
      return output;
    }
    let raj = genHexString(80)
    const params = {
      data: [
        {
          path: `${raj}.json`,
          content: {
            name: collectionName,
            description: description,
            image: featuredImage,
            attributes: PropertiesData
          }
        }
      ]

    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPost(url, params, headers);
  },

  loginWithMetamask: async (firstName, lastName, email, address) => {
    const { baseUrl, thirdpartyLogin } = ApiConfig;
    const url = baseUrl + thirdpartyLogin;
    const params = {
      token: address,
      type: 'metamask',
      payload: {
        first_name: firstName,
        last_name: lastName,
        email: email,
      },

    };
    const headers = {
      'Content-Type': 'application/json',
    };
    return ApiCallPost(url, params, headers);
  },



  sellStautsRented: async (tokenid, myTokenAddress) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, nftUpdate } = ApiConfig;
    const url = baseUrl + nftUpdate;
    const params = {
      token_id: tokenid,
      token_address: myTokenAddress,
      sell_type: "on_rented",
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPatch(url, params, headers);
  },




  sellStautsSellNow: async (tokenID, address, owner_id, sellAmount) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, nftUpdate } = ApiConfig;
    const url = baseUrl + nftUpdate;
    const params = {
      token_id: tokenID,
      token_address: address,
      other_user_id: owner_id,
      nft_price: sellAmount,
      sell_type: "on_sell",
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPatch(url, params, headers);
  },

  sellStautsBuy: async (tokenID, address) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, nftUpdate } = ApiConfig;
    const url = baseUrl + nftUpdate;
    const params = {
      token_id: tokenID,
      token_address: address,
      sell_type: "on_buy",
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPatch(url, params, headers);
  },




  sellStautsMakeBid: async (bidAmountInput, tokenID, address) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, nftUpdateMakebid } = ApiConfig;
    const url = baseUrl + nftUpdateMakebid;
    const params = {
      amount: bidAmountInput,
      token_id: tokenID,
      token_address: address,
      sell_type: 'on_bid',
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPatch(url, params, headers);
  },


  // getCollectionDetails: async (userId) => {
  //   const refreshToken = localStorage.getItem("refreshToken");
  //   const { baseUrl } = ApiConfig;
  //   const url = baseUrl + `collections/details?id=${userId}`;

  //   const headers = {
  //     'Content-Type': 'application/json',
  //     'Authorization': refreshToken,
  //   };
  //   return ApiCallGet(url, headers);
  // },

  getSearchDetails: async (searchDetailData) => {
    const accessToken = localStorage.getItem("accessToken");
    const { baseUrl } = ApiConfig;
    const url = baseUrl + `marketplace-search/${searchDetailData}`;
    // const url = baseUser + searchQuery;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': accessToken
    };
    return ApiCallGet(url, headers);
  },


  getCollectionDetailsReport: async (collectionDetails, reportReason, description) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, nftReports } = ApiConfig;
    const url = baseUrl + nftReports;
    const params = {
      collection_id: collectionDetails,
      reason: reportReason,
      description: description,
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPost(url, params, headers);
  },

  nftDetailsReport: async (collectionDetails, reportReason, description) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, nftReports } = ApiConfig;
    const url = baseUrl + nftReports;
    const params = {
      collection_id: collectionDetails,
      reason: reportReason,
      description: description,
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPost(url, params, headers);
  },

  sellStautsRent: async (tokenID, address, owner_id, sellAmount) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, nftUpdate } = ApiConfig;
    const url = baseUrl + nftUpdate;
    const params = {
      token_id: tokenID,
      token_address: address,
      other_user_id: owner_id,
      nft_price: sellAmount,
      sell_type: "on_rent",
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPatch(url, params, headers);
  },

  sellStautsAuctionNow: async (tokenID, address, owner_id, sellAmount) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, nftUpdate } = ApiConfig;
    const url = baseUrl + nftUpdate;
    const params = {
      token_id: tokenID,
      token_address: address,
      other_user_id: owner_id,
      nft_price: sellAmount,
      sell_type: "on_auction",
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPatch(url, params, headers);
  },


  getActivityDetails: async (salesEvent, rentEvent, buyEvent, offerEvent, collectionId) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, activityReports } = ApiConfig;
    const url = baseUrl + activityReports;
    const params = {
      events: [salesEvent, rentEvent, buyEvent],
      offers: offerEvent,
      collection_id: collectionId,
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPost(url, params, headers);
  },


  getFavouriteData: async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl, collectionFavourite } = ApiConfig;
    const url = baseUrl + collectionFavourite;

    // const url = baseUser + searchQuery;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallGet(url, headers);
  },

  getLimitCreated: async (createdLimit) => {
    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl } = ApiConfig;
    const url = baseUrl + `nft/created?limit=${createdLimit}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallGet(url, headers);
  },

  getLimitCollected: async (collectedLimit) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl } = ApiConfig;
    const url = baseUrl + `nft/collected?limit=${collectedLimit}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallGet(url, headers);
  },

  getLimitMycollected: async (createdLimit) => {
    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl } = ApiConfig;
    const url = baseUrl + `my-collections?limit=${createdLimit}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallGet(url, headers);
  },

  getLimitExplorecollected: async (createdLimit) => {
    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl } = ApiConfig;
    const url = baseUrl + `collections?limit=${createdLimit}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallGet(url, headers);
  },


  mycollections1: async (dataLIMIT) => {
    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl } = ApiConfig;
    const url = baseUrl + `collections/trending?limit=${dataLIMIT}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallGet(url, headers);
  },

  mycollections2: async (dataLIMIT) => {
    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl } = ApiConfig;
    const url = baseUrl + `my-collections?limit=${dataLIMIT}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallGet(url, headers);
  },


  updateMeatmaskAdderess: async (searchDetailData) => {
    const accessToken = localStorage.getItem("accessToken");

    const { baseUrl } = ApiConfig;
    const url = baseUrl + `user/wallet-registered/${searchDetailData}`;


    // const url = baseUser + searchQuery;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': accessToken
    };
    return ApiCallGet(url, headers);
  },

  getCollectedFilter: async (minimumPrize, maxPrize, allItemQuantity, onSingleQuantity, bundleQuantity, CategoryCollectibles, categoryArt, categoryDomainNames, categoryMusic, categoryPhotography, categorySports, CurrencyIbat, CurrencyBnb, salesEvent, rentEvent, buyEvent, offerEvent, collectionEventId) => {
    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl } = ApiConfig;
    const url = baseUrl + `nft/collected?offset=0&limit=998&min_price=${minimumPrize}&max_price=${maxPrize}&collection_id=${collectionEventId}&sell_type=${buyEvent}&sell_type=${salesEvent}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallGet(url, headers);
  },


  getCreatedFilter: async (minimumPrize, maxPrize, allItemQuantity, onSingleQuantity, bundleQuantity, CategoryCollectibles, categoryArt, categoryDomainNames, categoryMusic, categoryPhotography, categorySports, CurrencyIbat, CurrencyBnb, salesEvent, rentEvent, buyEvent, offerEvent, collectionEventId) => {
    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl } = ApiConfig;
    const url = baseUrl + `nft/created?offset=0&limit=998&min_price=${minimumPrize}&max_price=${maxPrize}&collection_id=${collectionEventId}&sell_type=${buyEvent}&sell_type=${salesEvent}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallGet(url, headers);
  },

  addFavouriteData: async (id, status) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, updateFavouriteState } = ApiConfig;
    const url = baseUrl + updateFavouriteState;
    const params = {
      id: id,
      favourite: status,
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallPut(url, params, headers);
  },

  setFavouriteDataNft: async (id, status) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, updateFavouriteState } = ApiConfig;
    const url = baseUrl + updateFavouriteState;
    const params = {
      id: id,
      favourite: true,
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallPut(url, params, headers);
  },


  createBundle: async (bundleName, bundlePrice, userinfoLength, userinfo) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, createdBundle } = ApiConfig;
    const url = baseUrl + createdBundle;
    const params = {
      bundle_name: bundleName,
      price: bundlePrice,
      quantity: userinfoLength,
      nft_object: userinfo,
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallPost(url, params, headers);
  },


  getCollectedFilterSalesEvent: async (salesEvent) => {
    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl } = ApiConfig;
    const url = baseUrl + `nft/created?sell_type=${salesEvent}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallGet(url, headers);
  },


  getCollectedFilterRentEvent: async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl } = ApiConfig;
    const url = baseUrl + `nft/created?sell_type=${'on_rented'}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallGet(url, headers);
  },

  getCollectedFilterBuyEvent: async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl } = ApiConfig;
    const url = baseUrl + `nft/created?sell_type=${'on_buy'}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallGet(url, headers);
  },

  getCollectedFilterOfferEvent: async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl } = ApiConfig;
    const url = baseUrl + `nft/created?sell_type=${'true'}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallGet(url, headers);
  },



  getCollectedFilterPrice: async (minimumPrize, maxPrize) => {
    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl } = ApiConfig;
    const url = baseUrl + `nft/created?min_price=${minimumPrize}&max_price=${maxPrize}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallGet(url, headers);
  },


  loginWithgoogle: async (token, email, given_name, family_name) => {
    const { baseUrl, thirdpartyLogin } = ApiConfig;
    const url = baseUrl + thirdpartyLogin;
    const params = {
      token: token,
      type: 'google',
      payload: {
        email: email,
        first_name: given_name,
        last_name: family_name,
      },
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    return ApiCallPost(url, params, headers);
  },


  sendUpdatedPassword: async (password) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, createWallet } = ApiConfig;
    const url = baseUrl + createWallet;
    const params = {
      password: password
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPost(url, params, headers);
  },

  sendUpdatedWallet: async (walletAddress) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, updateCenterlized } = ApiConfig;
    const url = baseUrl + updateCenterlized;
    const params = {
      address: walletAddress,
      type: "centralized"
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPost(url, params, headers);
  },



  getCenterlizedWalletData: async (salesEvent) => {
    const refreshToken = localStorage.getItem("refreshToken");

    const { baseUrl, walletData } = ApiConfig;
    const url = baseUrl + walletData;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallGet(url, headers);
  },


  statusonBundle: async (tokenID, address, owner_id, sellAmount) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl, nftUpdate } = ApiConfig;
    const url = baseUrl + nftUpdate;
    const params = {
      token_id: tokenID,
      token_address: address,
      other_user_id: owner_id,
      nft_price: sellAmount,
      sell_type: "on_bundle",
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    };
    return ApiCallPatch(url, params, headers);
  },

  getNftDetails: async (userId) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { baseUrl } = ApiConfig;
    const url = baseUrl + `nft/${userId}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': refreshToken,
    };
    return ApiCallGet(url, headers);
  },



}

export default AuthService;