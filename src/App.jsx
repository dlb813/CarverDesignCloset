import React, { useState, Component, useEffect } from 'react'
import search from './bx-search-alt.svg'
import closet from './bx-closet.svg'
import './App.css'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, startAfter, getDocsFromCache, updateDoc, doc, arrayUnion, deleteField, Timestamp, Firestore, FieldValue } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import ClothingItem from './ClothingItem';
import { Alert } from 'react-st-modal';
import { CustomDialog, useDialog, Confirm, ModalButton, ModalContent, ModalFooter, } from 'react-st-modal'
import DisplayImage from './DisplayImage';
import { getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "APIKEY",
  authDomain: "AUTHDOMAIN",
  projectId: "PROJECTID",
  storageBucket: "BUCKET",
  messagingSenderId: "SENDERID",
  appId: "APPID",
  measurementId: "MEASUREMENTID"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();
const firebaseApp = getApp();
const storage = getStorage(firebaseApp);

var clothes = [];
var allClothes;

function App() {
  useEffect(() => {
    GetDatabase();
  }, []);

  const [name, setName] = useState("ClothingItem");
  const [loaded, updateLoadState] = useState(false);
  const [clothesState, updateClothesState] = useState([]);

  async function CheckOut(id, size, stock, name, astock) {
    const docRef = doc(db, "Clothes", id + '');
    var key = 'astock.' + name;
    if (astock[name] != null) {
      await Alert('You can only check out one size of an item at a time', 'Too many!');
      return;
    }
    else {
      await updateDoc(docRef, {
        [key]: size
      });
    }
    if (size == "xs") {
      await updateDoc(docRef, {
        'stock.xs': stock,
      });
    }
    if (size == "s") {
      await updateDoc(docRef, {
        'stock.s': stock,
      });
    }
    if (size == "m") {
      await updateDoc(docRef, {
        'stock.m': stock,
      });
    }
    if (size == "l") {
      await updateDoc(docRef, {
        'stock.l': stock,
      });
    }
    if (size == "xl") {
      await updateDoc(docRef, {
        'stock.xl': stock,
      });
    }
   
    await Alert('Item successfully checked out under name: ' + name, 'Success!');
    window.location.reload(false);
  }

  async function Return(id, size, stock, name, astock) {
    const docRef = doc(db, "Clothes", id + '');
    var key = 'astock.' + name;
    if (astock[name] != null) {
      await updateDoc(docRef, {
        [key]: deleteField(),
        Timestamp: FieldValue.serverTimestamp(),
      });

      if (size == "xs") {
        await updateDoc(docRef, {
          'stock.xs': stock,
        });
      }
      if (size == "s") {
        await updateDoc(docRef, {
          'stock.s': stock,
        });
      }
      if (size == "m") {
        await updateDoc(docRef, {
          'stock.m': stock,
        });
      }
      if (size == "l") {
        await updateDoc(docRef, {
          'stock.l': stock,
        });
      }
      if (size == "xl") {
        await updateDoc(docRef, {
          'stock.xl': stock,
        });
      }
    }
    else {
      await Alert('This item has not been checked out under this name', 'Not Found!');
      return;
    }
    await Alert('Item successfully returned under name: ' + name, 'Success!');
    window.location.reload(false);
  }

  async function GetDatabase() {
    clothes = [];
    const q = query(collection(db, "Clothes"));
    console.log("Fetching...");
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      clothes.push(doc);
    });
    allClothes = clothes;
    updateClothesState(clothes);
    updateLoadState(true);
    console.log(loaded);

  }

  function handleInput(event) {
    var temp = allClothes;
    clothes = [];
    var search = event.target.value;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].data().Name.toUpperCase().includes(search.toUpperCase())) {
        console.log("Is Included")
        clothes.push(temp[i]);
      }
    }
    updateClothesState(clothes);
    updateLoadState(true);
  }

  async function AddToDatabase(name,_xs,_s,_m,_l,_xl,img) {
    try {
      if(img!=null)
      {
        var iUrl;
        const storageRef = ref(storage, 'Images/'+img.name);
        uploadBytes(storageRef, img).then((snapshot) => {
          getDownloadURL(storageRef)
            .then((url) => {

              const docRef = addDoc(collection(db, "Clothes"), {
                Name: name,
                InStock: true,
                stock: {
                  xs:_xs,
                  s:_s,
                  m:_m,
                  l:_l,
                  xl:_xl
                },
                astock: "",
                Image: url,
                Timestamp: FieldValue.serverTimestamp(),
              });
            });
        });
      }
      else
      {
        const docRef = await addDoc(collection(db, "Clothes"), {
          Name: name,
          InStock: true,
          stock: {
            xs:_xs,
            s:_s,
            m:_m,
            l:_l,
            xl:_xl
          },
          astock: "",
          Image: "https://firebasestorage.googleapis.com/v0/b/dpapp-b5351.appspot.com/o/Images%2Fquestion.png?alt=media&token=b2004466-1ada-4066-990f-981cf2beb107",
          Timestamp: FieldValue.serverTimestamp(),
        });
      }
      await Alert('Item sucessfully added', 'Success!');
      window.location.reload(false);
      //console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <div className="Page">
      <header className="App-header" >
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <img src={closet} className="Icon" /> <br></br>Carver Design Closet
          <br></br>
        <input onChange={handleInput} placeholder="&#xF002; Search..." className="SearchBar" style={{ fontFamily: 'Arial,FontAwesome' }} />
        <br></br>
        <button onClick={async () => {
          const result = await CustomDialog(<AddDialog />, {});

          if(result[0]=="Added")
          {
            AddToDatabase(result[1],result[2],result[3],result[4],result[5],result[6],result[7]);
          }
        }} className="addButton">Add an Item &#xf055;</button>
      </header>

      <div className="Cards">

        <br></br>
        <div>
          {clothesState.length > 0 ?
            clothesState.map(doc =>
              <ClothingItem key={doc.id} name={doc.data().Name} check={CheckOut} return={Return} id={doc.id} source={doc.data().Image} stock={doc.data().stock} astock={doc.data().astock} />)
            : <p className="NoneFound"> <span className="NoneFoundImage">&#xf1e5;</span><br></br> Could not find any Items... <br></br> <span className="nF2"> Try changing your search.</span>
            </p>
          }
        </div>
      </div>

    </div >

  );

}

function AddDialog() {
  const dialog = useDialog();
  const [value, setValue] = useState();
  var response=[];

  function updateImg(image)
  {
    response[7]=image;
  }

  return (
    <div>
      <h1 className="Title"> Add an Item </h1>
      <ModalContent>
        <div>
          <span className="header">Name:</span>
          <br></br>
            <input
            type="text"
            onChange={(e) => {
              response[1] = e.target.value;
            }}
          />
        </div>
        <div>
        <span className="header">Stock:</span>
          <br></br>
          XS: <input
            type="number"
            onChange={(e) => {
              response[2] = e.target.value;
            }}
          />
          <br></br>
          S: <input
            type="number"
            onChange={(e) => {
              response[3] = e.target.value;
            }}
          />
          <br></br>
          M: <input
            type="number"
            onChange={(e) => {
              response[4] = e.target.value;
            }}
          />
          <br></br>
          L: <input
            type="number"
            onChange={(e) => {
              response[5] = e.target.value;
            }}
          />
          <br></br>
          XL: <input
            type="number"
            onChange={(e) => {
              response[6] = e.target.value;
            }}
          />
        </div>
        <div>
          <DisplayImage updateImg={updateImg}></DisplayImage>
        </div>
      </ModalContent>
      <ModalFooter>
        <div className="GreenButton"
          onClick={() => {
            response[0]= "Added";
            dialog.close(response);
          }}
        >
           Add
          </div>
          <div className="Cancel"
          onClick={() => {
            response[0]= "Cancel";
            dialog.close(response);
          }}
        >
          Cancel
          </div>
      </ModalFooter>
    </div>
  );
}

export default App
