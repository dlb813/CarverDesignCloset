import React, { Component } from "react";
import './DisplayImage.css';
import './App.css';

class DisplayImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null
    };

    this.onImageChange = this.onImageChange.bind(this);
  }

  onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      this.setState({
        image: URL.createObjectURL(img)
      });
      this.props.updateImg(img);
    }
  };

  render() {
    return (
      <div>
        <div>
          <div>
            <div className="header">Upload an Image (Optional):</div>
            <input type="file" name="myImage" onChange={this.onImageChange} />
            <img src={this.state.image}/>
          </div>
        </div>
      </div>
    );
  }
}
export default DisplayImage;