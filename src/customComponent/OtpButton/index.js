import React from "react";


const OtpButton = (props) => {
    return (
        <button {...props} type="button" className="btn_view btn-icon">
            {props.children}
        </button>
    )
}

export default OtpButton;