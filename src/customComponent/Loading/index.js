import React from 'react';
import loading from "../../assets/logo-preloader.png";
import './Loading.css';

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaderState: false,
    };
  }

  updateStatus = status => {
    this.setState({ loaderState: status });
  };

  render() {
    const { loaderState } = this.state;
    return (
      loaderState &&
      <div className="centerbox">
        <img src={loading} alt="" />
      </div>
    )

  }
}

export default Loading;