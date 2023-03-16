import React from "react";

const DefaultInput = (props) => {
    const { errorStatus, errorMessage } = props;
    return (
        <>
            <input {...props}  />
            {errorStatus &&
                <p className="errorText">{errorMessage}</p>
            }
        </>

    )
}

export default DefaultInput;