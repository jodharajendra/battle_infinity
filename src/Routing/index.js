import React, { useState, useContext, useRef, useEffect } from "react";

import { ProfileContext } from "../context/ProfileProvider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "../ui/pages/LandingPage";
import Footer from "../customComponent/Footer";
import ExplorePage from "../ui/pages/ExplorePage";
import StatsPage from "../ui/pages/StatsPage";
import BuyNftPage from "../ui/pages/BuyNftPage";
import ProfilePage from "../ui/pages/ProfilePage";
import CollectionDetails from "../ui/pages/CollectionDetails";
import ProductDetails from "../ui/pages/ProductDetails";
import NftDetails from "../ui/pages/NftDetails";
import LoginPage from "../ui/pages/LoginPage";
import RegisterPage from "../ui/pages/RegisterPage";
import ForgotPassword from "../ui/pages/ForgotPassword";
import UserHeader from "../customComponent/UserHeader";
import AuthHeader from "../customComponent/AuthHeader";
import Settings from "../ui/pages/Settings";
import MyCollection from "../ui/pages/MyCollection";
import CreateCollection from "../ui/pages/CreateCollection";
import CreateNft from "../ui/pages/CreateNft";
import Notification from "../ui/pages/Notification";
import SearchPage from "../ui/pages/SearchPage";
import RentNftPage from "../ui/pages/RentNftPage";
import AuctonNft from "../ui/pages/AuctonNft";
import { alertErrorMessage, alertSuccessMessage } from "../customComponent/CustomAlertMessage";
import AuthService from "../api/services/AuthService";
import MyBundels from "../ui/pages/MyBundels";
import CreateBundle from "../ui/pages/CreateBundle";
import BundleList from "../ui/pages/BundleList";
import AboutUsPage from "../ui/pages/AboutUsPage";
import HelpCenter from "../ui/pages/HelpCenter";
import PlatforStatus from "../ui/pages/PlatforStatus";
import Partners from "../ui/pages/Partners";
import SuggestedFeature from "../ui/pages/SuggestedFeature";

const Routing = () => {
  const [profileState] = useContext(ProfileContext);

  // console.log(profileState, 'profileStateR');

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  return (
    <Router>
      {(!accessToken && !profileState.refreshToken) ? <UserHeader /> : <AuthHeader />}
      {/* <AuthHeader /> */}
      <Routes>
        <Route exact path="/" element={<LandingPage />}></Route>
        <Route exact path="/explore_collections" element={<ExplorePage />}></Route>
        <Route exact path="/collections_stats" element={<StatsPage />}></Route>
        <Route exact path="/buynft" element={<BuyNftPage />}></Route>
        <Route exact path="/profile" element={<ProfilePage />}></Route>
        <Route exact path="/collection_details" element={<CollectionDetails />}></Route>
        <Route exact path="/product_details" element={<ProductDetails />}></Route>
        <Route exact path="/nft_details" element={<NftDetails />}></Route>
        <Route exact path="/forgotpassword" element={<ForgotPassword />}></Route>
        <Route exact path="/login" element={<LoginPage />}></Route>
        <Route exact path="/signup" element={<RegisterPage />}></Route>
        <Route exact path="/settings" element={<Settings />}></Route>
        <Route exact path="/my_collection" element={<MyCollection />}></Route>
        <Route exact path="/new_collection" element={<CreateCollection />}></Route>
        <Route exact path="/new_nft" element={<CreateNft />}></Route>
        <Route exact path="/notifications" element={<Notification />}></Route>
        <Route exact path="/marketplace-search" element={<SearchPage />}></Route>
        <Route exact path="/rentnft" element={<RentNftPage />}></Route>
        <Route exact path="/auction_nft" element={<AuctonNft />}></Route>
        <Route exact path="/bundels" element={<MyBundels />}></Route>
        <Route exact path="/new_bundle" element={<CreateBundle />}></Route>
        <Route exact path="/bundleList" element={<BundleList />}></Route>
        <Route exact path="/about-us" element={<AboutUsPage />}></Route>
        <Route exact path="/helpcenter" element={<HelpCenter />}></Route>
        <Route exact path="/platforstatus" element={<PlatforStatus />}></Route>
        <Route exact path="/partners" element={<Partners />}></Route>
        <Route exact path="/suggstedfeatures" element={<SuggestedFeature />}></Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default Routing;