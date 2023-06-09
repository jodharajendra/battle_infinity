const appUrl = 'https://api.appinopinfo.com';

export const ApiConfig = {
  // =========EndPoints==========

  login: 'login',
  register: "signup",
  getcode: "forget-password",
  forgotpassword: "reset-password",
  UserProfile: 'profile',
  tokenRefresh: 'refresh-token',
  updateAddress: 'update-address',
  allnftCreated: 'nft/created',
  subscribe: 'subscribe',
  updatePrfile: 'update-profile',
  collectionCreate: 'collection/create',
  uploads: 'upload',
  notifications: 'notifications',
  notificationUpdate: 'update-notifications',
  categoryList: 'category',
  collectionsList: 'collections',
  updateFavourite: 'collections/update-favourite',
  favouriteList: 'collections/details',
  collectionsDetails: 'collections/details',
  getnftMetadata:'moralis/getnftmetadata',
  getnftDetails:'moralis/getnftmetadata',
  addIfps:'moralis/uploadipfs',
  nftCreate: 'nft/create',
  allnftCollected:'nft/collected',
  mycollections:'my-collections',
  eachCollectionDetails:'collections/details?id=',
  nftSellsList:'moralis/nftownsmartcontract',
  nftUpdate:'nft/update',
  thirdpartyLogin:'user/third-party-login',
  nftUpdateMakebid:'nft/make-bid',
  nftReports:'report',
  activityReports:'activity-logs',
  collectionFavourite:'collections/favourites',
  favouriteUpdate:'collections/update-favourite',
  updateFavouriteState:'collections/update-favourite',
  createdBundle:'nft/create-bundle',
  createWallet:'wallet/create-wallet',
  updateCenterlized:'user/update-address',
  walletData:'wallet/user-wallet',




  // ============URLs================
  baseUrl: `${appUrl}/`,
  baseUser: `${appUrl}/user/`,
};