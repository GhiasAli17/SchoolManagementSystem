import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import lock from "../assets/Images/lock.svg";
import toast, { Toaster } from "react-hot-toast";

import cardCheck from "../assets/Images/cardCheck.svg";
import Header from "../Components/Header";
import user from "../assets/Images/userImg.png";
import userIcon from "../assets/Images/user.svg";
import mailIcon from "../assets/Images/mail.svg";
import contact from "../assets/Images/contact.svg";
import { setProfilePic } from "../Redux/actions";
import { useSelector, useDispatch } from "react-redux";
import { getDatabase, onValue, ref, update } from "firebase/database";
import app, { storage } from "../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref as sRef,
  uploadBytesResumable,
} from "firebase/storage";

const db = getDatabase(app);

function Settings({ navigation }) {
  const { key } = useSelector((state) => state.persistedReducer);
  const [buttonPressed, setButtonPresed] = useState("Personal");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const [imageUri, setImageUri] = useState("");
  const [prevImageUri, setPrevImageUri] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const dbRef = ref(db, "users/admin/" + key);
    onValue(dbRef, (snapshot) => {
      console.log("setting", snapshot.val().imageUri.imageUri);
      setImageUri(snapshot.val().imageUri.imageUri);
      setPrevImageUri(snapshot.val().imageUri.imageUri);
    });
  }, []);

  const [bankInfo, setBankInfo] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "allied",
    routingNumber: "123",
    imageUrl: "",
  });

  // Handles input change event and updates state
  function handleChange(event) {
    setFile(event.target.files[0]);
    handleUpload(event.target.files[0]);
  }

  // handle upload
  function handleUpload(image) {
    if (!image) {
      alert("Please choose a file first!");
    }

    const storageRef = sRef(storage, `/profiles/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log("url", url);
          // setBankInfo({ ...bankInfo, imageUrl: url });
          update(ref(db, "users/admin/" + key + "/imageUri"), {
            imageUri: url,
          });
          setImageUri(url);

          let url1 = prevImageUri + "";
          dispatch(setProfilePic(prevImageUri));
          // note below url will be different for every project, So update it if new firebase app is made from client
          const baseUrl =
            "https://firebasestorage.googleapis.com/v0/b/school-management-system-79f54.appspot.com/o/";

          var imagePath = url1.replace(baseUrl, "");

          const indexOfEndPath = imagePath.indexOf("?");

          imagePath = imagePath.substring(0, indexOfEndPath);

          imagePath = imagePath.replace("%2F", "/");
          console.log("omage name", imagePath);

          deleteObject(sRef(storage, imagePath))
            .then(() => {
              console.log(" File deleted successfully");
            })
            .catch((error) => {
              console.log("delete error:", error);
            });
        });
      }
    );
  }

  const onAccountInputHandler = (e) => {
    const { name, value } = e.target;
    setBankInfo({ ...bankInfo, [name]: value });
  };

  const updatePaymentHandler = () => {
    update(ref(db, "users/admin/" + key + "/bankInfo"), bankInfo).then(() => {
      console.log("payment data updated successfully");
    });
  };

  const updateClickHandler = () => {
    update(ref(db, "users/admin/" + key), {
      firstName,
      lastName,
      email,
      password,
      confirmPass: password,
    }).then(() => {
      console.log("user data updated successfully");
    });
  };

  return (
    <>
      <Header />
      <Container>
        <div className="mainBody">
          <h3
            style={{ alignSelf: "flex-start", fontFamily: "poppins-regular" }}
          >
            Settings
          </h3>
          <div className="headerButtonsContainer">
            <button
              style={{
                outline:
                  buttonPressed == "Personal"
                    ? "2px solid #2291f1"
                    : "2px solid #0e374666",
                color: buttonPressed == "Personal" ? "#2291f1" : "#0e374666",
              }}
              className="headerButton"
              onClick={() => setButtonPresed("Personal")}
            >
              Personal Information
            </button>
            <button
              style={{
                outline:
                  buttonPressed == "Account"
                    ? "2px solid #2291f1"
                    : "2px solid #0e374666",
                color: buttonPressed == "Account" ? "#2291f1" : "#0e374666",
              }}
              className="headerButton"
              onClick={() => setButtonPresed("Account")}
            >
              Payment Details
            </button>
          </div>
          {buttonPressed == "Personal" ? (
            <>
              {" "}
              <div className="userData">
                <div className="info">
                  <div>
                    <img
                      width={50}
                      height={50}
                      src={imageUri}
                      style={{ borderRadius: 30 }}
                    />
                  </div>
                  <div className="data">
                    <input
                      style={{ outline: "none", marginLeft: "20px" }}
                      placeholder="enter name"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="userContact">
                <div className="inputRow">
                  <div className="inputsContainer">
                    <img width={25} height={25} src={userIcon} />
                    <input
                      type="textbox"
                      id="firstname"
                      name="firstname"
                      className="input"
                      placeholder="firstname"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="inputsContainer">
                    <img width={25} height={25} src={userIcon} />
                    <input
                      type="textbox"
                      id="lastname"
                      name="lastname"
                      className="input"
                      placeholder="lastname"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="inputRow">
                  <div className="inputsContainer">
                    <img width={25} height={25} src={mailIcon} />
                    <input
                      type="textbox"
                      id="email"
                      name="email"
                      className="input"
                      placeholder="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="inputsContainer">
                    <img width={25} height={25} src={lock} />
                    <input
                      type="textbox"
                      id="password"
                      name="password"
                      className="input"
                      placeholder="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="inputRow">
                  <div className="inputButton">
                    <input
                      type="button"
                      id="lastname"
                      name="lastname"
                      className="input"
                      value="Update"
                      onClick={updateClickHandler}

                      // value={userType}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="paymentContainer">
              <div
                className="cardDetailContainer"
                style={{
                  backgroundColor: "rgba(218, 221, 225, 0.4)",
                  marginTop: "20%",
                  paddingInline: "5%",
                  width: "90%",
                }}
              >
                <input type="text" className="cardNumber" />
                {/*<div classNameCVV="cardNumber">{`2334   -   2424   -   2424   -   5666`}</div>*/}
                <img
                  style={{ width: "30px", height: "30px" }}
                  src={cardCheck}
                />
              </div>
              <div className="cardDetailContainer">
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                  }}
                >
                  <h4 style={{ fontFamily: "poppins-regular" }}>CVV Number</h4>
                  <h6
                    style={{
                      fontFamily: "poppins-regular",
                      color: "rgba(14, 55, 70, 0.4)",
                    }}
                  >
                    Enter the 3 or 4 digit number on the card
                  </h6>
                </div>
                <input
                  name="accountNumber"
                  value={bankInfo.accountNumber}
                  onChange={onAccountInputHandler}
                  style={{
                    backgroundColor: "rgba(218, 221, 225, 0.4)",
                    width: "30%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    outline: "none",
                    paddingLeft: "20px",
                    borderWidth: 0,
                  }}
                />
              </div>

              <div className="cardDetailContainer">
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                  }}
                >
                  <h4 style={{ fontFamily: "poppins-regular" }}>Expiry Date</h4>
                  <h6
                    style={{
                      fontFamily: "poppins-regular",
                      color: "rgba(14, 55, 70, 0.4)",
                    }}
                  >
                    Enter the expiration date on the card
                  </h6>
                </div>
                <input
                  name="accountName"
                  value={bankInfo.accountName}
                  onChange={onAccountInputHandler}
                  style={{
                    backgroundColor: "rgba(218, 221, 225, 0.4)",
                    width: "30%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    outline: "none",
                    paddingLeft: "20px",
                    borderWidth: 0,
                  }}
                />
              </div>
              <button
                className="cardDetailContainer"
                style={{
                  backgroundColor: "#2291F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 0,
                }}
                onClick={updatePaymentHandler}
              >
                <h4 style={{ color: "white" }}> Update</h4>
              </button>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}

export default Settings;

const Container = styled.div`
  width: 100%;
  // padding-inline: 1vw;
  height: 87vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .mainBody {
    width: 80%;
    // padding-inline: 1vw;
    height: 87vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
  }
  .paymentContainer {
    width: 60%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }
  .cardDetailContainer {
    width: 100%;
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 25px;
  }

  .headerButtonsContainer {
    width: 40%;
    height: 7%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 12px;
  }
  .headerButton {
    width: 45%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    border: none;
    outline: none;
    cursor: pointer;
  }

  .userData {
    width: 45%;
    height: 15%;
    display: flex;
    justify-content: space-between;
    margin-left: 20px;
    align-items: center;
    border-bottom: 1px solid #dadde1;
    margin-top: 20px;
    margin-left: 120px;
  }
  .info {
    width: 30%;
    height: 100%;
    line-height: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .data {
    line-height: 12px;
    height: 50%;
    display: flex;
    justify-content: center;

    flex-direction: column;
    gap: 5px;
  }
  h4,
  h6 {
    margin: 0;
    padding: 0;
  }

  .uploadButton {
    width: 25%;
    height: 50%;
    display: flex;
    background: #2291f1;
    color: #ffffff;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    border: none;
    outline: none;
  }
  .userContact {
    width: 70%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 50%;
    margin-left: 100px;
  }
  .inputRow {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    height: 25%;
    margin-left: 20px;
  }

  .inputsContainer {
    height: 50%;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
  }
  .inputButton {
    height: 50%;
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    // margin:0 auto;
    margin-left: 50px;
  }
  .input {
    height: 100%;
    width: 60%;
    background: #dadde166;
    border: none;
    border-radius: 5px;
    padding-left: 20px !important;
  }
  .input[type="button"] {
    width: 80%;
    background: #2291f1;
    border-radius: 0;
    color: #ffffff;
  }
`;
