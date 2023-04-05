
import React from "react";
import { Link } from "react-router-dom";


const RandomErrorPage = (props) => {

  return (
    <>


      <section class="ptb-120">
      <div class="container">
        <div class="not-found-inner">
          <div class="row align-items-cente">
            <div class="col-md-5 mb-5">
              <img src="images/404/404.png" alt="not found page" class="img-fluid"/>
            </div>
            {/* <!-- End .col --> */}

            <div class="col-md-7">
              <div class="not-found-content">
                <h1 class="title">Opps...! <br/>
                  Page not found</h1>
                <p>You seem can’t to find the page <br/> you’re looking for.</p>
                <Link to="/" class="btn btn-gradient  btn-border-gradient"><span>Back To Home</span></Link>
              </div>
            </div>
            {/* <!-- End .col --> */}
          </div>
        </div>
        {/* <!-- End .not-found-inner --> */}
      </div>
    </section>


    
    </>
  );
}

export default RandomErrorPage;
