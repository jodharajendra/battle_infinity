import React from "react";
import loading from "../../assets/logo-preloader.png";

const LoadingPage = (props) => {
  return (
    <div id="preloader">
      <div id="ctn-preloader" className="ctn-preloader">
        <div className="animation-preloader">
          <div className="icon">
            <img src={loading} alt="logo" className="m-auto d-block" />
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
