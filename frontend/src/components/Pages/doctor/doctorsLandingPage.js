import { React, useState } from "react";
import "./doctorsLandingPage.css";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firabase_config";

const DoctorsLandingPage = () => {
  var [name, setName] = useState("");
  var [age, setAge] = useState("");
  var [height, setHeight] = useState("");
  var [add, setAddress] = useState("");
  var [gender, setGender] = useState("");
  var [token, setToken] = useState("");
  var [ciphertext, setCiphertext] = useState("");
  var [key, setKey] = useState("");
  const [value, setValue] = useState();
  console.log("here we are ");

  const Read = async (params) => {
    // console.log("token is ", params);
    if (params === "") {
      setAddress("");
      setName("");
      setAge("");
      setGender("");
      setHeight("");
      alert("Input cannot be null");
      // setValue(1);
    } else {
      var docRef = doc(db, "temporary", params);
      var docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        var timeNow = Math.floor(Date.now() / 1000);
        var timeSavedData = docSnap.data().timeStamp.seconds;
        console.log("Clou timeStamp is ", timeSavedData);
        console.log("local timeStamp is ", timeNow);
        console.log(timeNow - timeSavedData);
        if (timeNow - timeSavedData <= 3600) {
          var cipher = docSnap.data().data;
          var k = docSnap.data().key;

          var crypto = require("crypto-js");
          // const secretKey = "my-secret-key@123";

          console.log("k is: ", k);
          console.log("cipher is ", cipher);
          // Decrypt
          var bytes = crypto.AES.decrypt(cipher, k);
          var decryptedData = await JSON.parse(bytes.toString(crypto.enc.Utf8));
          console.log(decryptedData[0].name);
          setName(decryptedData[0].name);
          setAddress(decryptedData[0].address);
          setAge(decryptedData[0].age);
          setGender(decryptedData[0].height);
          setHeight(decryptedData[0].gender);
          alert("Data Retrieve successfully");

          console.log("in dosnap");
        } else {
          await deleteDoc(doc(db, "temporary", params)); 
          alert("Token ID is not valid");
          setToken("");
          setName("");
          setAddress("");
          setAge("");
          setGender("");
          setHeight("");
        }
        // console.log(docSnap.data().data);

        // return docSnap.data().data;
      } else {
        alert("No such Documents!");
        setAddress("");
        setName("");
        setAge("");
        setGender("");
        setHeight("");
      }
    }
  };

  const ReadData = () => {
    Read(token);
  };
  return (
    <div>
      <h2>Welcome to Doctor's Page</h2>
      <div className="doctorsbox">
        <div>
          <h3>Patient Data</h3>
        </div>
        <br />
        <br />
        <form>
          {/* <div class="flex flex-row items-center justify-center lg:justify-start"> */}

          {/* <!-- Email input --> */}
          <div class="mb-6">
            <input
              type="text"
              class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="exampleFormControlInput2"
              onChange={(e) => setToken(e.target.value)}
              value={token}
              // onClick={navigateToPatient}
              placeholder="Email address"
            />
          </div>
        </form>
        <button className="tokenButton" onClick={ReadData}>
          Read Data
        </button>
        <h5>{name}</h5>
        <h5>{age}</h5>
        <h5>{gender}</h5>
        <h5>{height}</h5>
        <h5>{add}</h5>
      </div>
    </div>
  );
};

export default DoctorsLandingPage;
