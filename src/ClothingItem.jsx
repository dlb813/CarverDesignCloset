import React, { useState, Component, useEffect } from 'react'
import './ClothingItem.css'
import ChangeDoc from './App'
import { CustomDialog, useDialog, Confirm, ModalButton, ModalContent, ModalFooter, } from 'react-st-modal'
import { doc } from 'firebase/firestore';
import Select from 'react-select';

class ClothingItem extends React.Component {

  constructor(props) {
    super(props);
  }

  CheckOutItem(size,name) {
    console.log("out");
    this.props.check(this.props.id,size,this.props.stock[size]-1,name,this.props.astock);
  }

  ReturnItem(name) {
    console.log("in");
    var size = this.props.astock[name];
    this.props.return(this.props.id,size,this.props.stock[size]+1,name,this.props.astock);
  }

  Check(size)
  {
    console.log(size);
  }



  render() {

    function getStock(map) {
      let sum = 0;
      for (let key in map) {
        sum = sum + map[key];
      }
      return sum;
    }
    var stuffInStock = [];
    for (let key in this.props.stock) {
      if (this.props.stock[key] > 0) {
        stuffInStock.push(key.toUpperCase() + ": " + this.props.stock[key] + ", ");
      }
    }
    var stock;

    if (getStock(this.props.stock) > 0) {
      stock = <span className="green">In Stock</span>;
    }
    else {
      stock = <span className="red">Out of Stock</span>;
    }
    return (
      <span>
        <div className="Content" onClick={async () => {
          const result = await CustomDialog(<AddToNewClothingItem aStock={this.props.stock} checkOut={this.CheckOutItem} return={this.ReturnItem} />, {
            showCloseIcon: false,
          });

          if (result[0]=="CheckOut") {
            this.CheckOutItem(result[1], result[2]);
          }
          else if (result[0]=="Return") {
            this.ReturnItem(result[1],result[2]);
          } else {
            // Сonfirmation not confirmed
          }
        }}>
          <div className="TheText">{this.props.name + ": "}</div>
          <img src={this.props.source} className="ClothingImage"></img>
          <span className="footer">{stock}</span>
          {stuffInStock.map(item => <span className="sizes" key={item}>{item}</span>)}
        </div>
      </span>
    );
  }
}
var name;
var response=[];
function AddToNewClothingItem(props) {
  const dialog = useDialog();

  const [value, setValue] = useState("");
  var options = [];

  useEffect(() => {
    for (let key in props.aStock) {
      if (props.aStock[key] > 0) {
        options.push({ value: [key], label: [key] });
      }
    }
  })

  function handleChange(e){
    setValue(e.value);
    console.log(e.value);
  };
  
  function onChange(e) {
    name = e.target.value;
    console.log(name);
  }
  const [alert, setAlert] = useState(<span className="Alert"></span>);
  return (
    <div>
      <h1 className="Title"> Checkout </h1>
      <ModalContent>
        <label>
        <span className="header">Which size would you like to check out? (not needed for returns)</span>
          <Select className="basic-single" options={options} onChange={(e) => handleChange(e)} />
          <br></br>
          <span className="header">Enter a name to continue</span> <br></br>
          <input placeholder="Name..." onChange={(e) => onChange(e)} className="NameField"/>
          <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
          {alert}
        </label>
      </ModalContent>
      <ModalFooter>
        <div className="CheckOut"
          onClick={() => {
            console.log(value);
            if(name==null||value=="")
            {
              setAlert(<span ></span>);
              setAlert(<div className="Alert">Please make sure all fields are filled out</div>);
            }
            else
            {
              response = ["CheckOut",value,name];
              dialog.close(response);
            }
          }}
        >
          Checkout
          </div>
          <div className="Return"
          onClick={() => {
            console.log(value);
            if(name==null)
            {
              setAlert(<span ></span>);
              setAlert(<div className="Alert">Please enter a name</div>);
            }
            else
            {
              response = ["Return",name];
              dialog.close(response);
            }
          }}
        >
          Return
          </div>
        <div className="Cancel"
          onClick={() => {
            response = ["Canceled",value];
            dialog.close(response);
          }}
        >
          Cancel
          </div>
      </ModalFooter>
    </div>
  );
}

export default ClothingItem

