import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getDatabase, onValue, ref, update } from "firebase/database";
import {
  deleteObject,
  getDownloadURL,
  ref as sRef,
  uploadBytesResumable,
} from "firebase/storage";

import { setUserData } from "../Redux/actions";
import Header from "../Components/Header";
import { setUserName, setProfilePic } from "../Redux/actions";
import app, { storage } from "../firebase";
import { Mail, User, CardCheck, Lock } from "../assets/Images/Index";

const db = getDatabase(app);

function Settings({ navigation }) {
  const { key, userData, data, userType } = useSelector(
    (state) => state.persistedReducer
  );
  let navigate = useNavigate();

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
    setEmail(userData.email);
    setPassword(userData.password);
    setFirstName(userData.firstName);
    setLastName(userData.lastName);
    const dbRef = ref(db, "users/admin/" + key);
    onValue(dbRef, (snapshot) => {
      console.log("setting", snapshot.val().imageUri.imageUri);
      setImageUri(snapshot.val().imageUri.imageUri);
      setPrevImageUri(snapshot.val().imageUri.imageUri);
    });
    //setEmail(userData.)
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
          dispatch(setProfilePic(url));
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
      navigate("/");
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
      let role = "";

      console.log("user data updated successfully");
      if (userType == "Admin") role = "admin";
      else {
        role = "alumni";
      }
      const starCountRef = ref(db, "users/" + role);
      onValue(
        starCountRef,
        (snapshot) => {
          let alumniEmail, alumniPassword;
          let approveCheck = false;
          let SchoolName = "";
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            console.log("child data Login", childData);
            if (data == childData.email) {
              dispatch(setUserName(childData.firstName));
              dispatch(setUserData(childData));

              // SchoolName = childData.schoolName;
            }

            // ...
          });

          // setCheck(true)
        },
        {
          onlyOnce: false,
        }
      );
      dispatch(setUserName(firstName));
      navigate("/");
    });
  };

  return (
    <>
      <Header />
      <Container>
        <div className="mainBody">
          <h3
            style={{ fontFamily: "Poppins", fontSize: "30px", margin: "0", color: "#0E3746", fontWeight:"500" }}
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
              onClick={() => {
                userType == "Admin"
                  ? setButtonPresed("Account")
                  : console.log("Alumni not allowed to payemnt form");
              }}
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
                    <img className="ledtIcon" width={25} height={25} src={User} />
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
                    <img className="ledtIcon" width={25} height={25} src={User} />
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
                    <img className="ledtIcon" width={25} height={25} src={Mail} />
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
                    <img className="ledtIcon" width={25} height={25} src={Lock} />
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
                    <button
                      className="input update-btn"
                      style={{
                        color: "white",
                        backgroundColor: "#2291F1",
                        borderWidth: 0,
                        marginTop:"70px",
                      }}
                      onClick={updateClickHandler}

                      // value={userType}
                    >
                      Update
                    </button>
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
                  paddingInline: "5%",
                  width: "90%",
                }}
              >
                <input type="text" className="cardNumber card-field" />
                {/*<div classNameCVV="cardNumber">{`2334   -   2424   -   2424   -   5666`}</div>*/}
                <img
                  style={{ width: "25px", height: "25px" }}
                  src={CardCheck}
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
                  <h4 style={{ fontFamily: "Poppins-Regular" }}>CVV Number</h4>
                  <h6
                    style={{
                      fontFamily: "Poppins-Regular",
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
                  <h4 style={{ fontFamily: "Poppins-Regular" }}>Expiry Date</h4>
                  <h6
                    style={{
                      fontFamily: "Poppins-Regular",
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
                className="cardDetailContainer update-btn"
                style={{
                  backgroundColor: "#2291F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 0,
                  cursor: "pointer",
                  borderRadius: "5px",
                  marginTop:"100px",
                  width:"70%",
                  margin:"0 auto",
                }}
                onClick={() => {
                  buttonPressed == "Personal"
                    ? updateClickHandler()
                    : updatePaymentHandler();
                }}
              >
                <h4 style={{ color: "white", cursor: "pointer" }}> Update</h4>
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
  flex-direction: column;
  .mainBody {
    width: 90%;
    // padding-inline: 1vw;
    height: 87vh;
    overflow: hidden;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
    padding-left: 20px;
  }
  button {
    cursor: pointer;
  }
  .paymentContainer {
    width: 100%;
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
    width: 30%;
    height: 7%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 5px;
  }
  .headerButton {
    width: 45%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    border: none;
    outline: none;
    cursor: pointer;
    background: unset;
  }

  .userData {
    width: 100%;
    height: 15%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dadde1;
    margin-top: 20px;
  }
  .info {
    width: 30%;
    height: 100%;
    line-height: 12px;
    display: flex;
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
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 50%;
  }
  .inputRow {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    height: 25%;
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
    margin: 0 auto;
  }
  .input {
    height: 45px;
    width: 88%;
    background: #dadde166;
    border: none;
    border-radius: 5px;
    padding-left: 20px !important;
    outline: none;
  }
  .input[type="button"] {
    width: 80%;
    background: #2291f1;
    border-radius: 0;
    color: #ffffff;
  }
  .update-btn {
    box-shadow: 0 0px 15px #2190f0;
  }
  // .ledtIcon {
  //   border: 2px solid #f0f1f3;
  //   padding: 9px;
  //   border-radius: 5px;
  // }
  .card-field {
    height: 29px;
    width: 95%;
    border: 1px solid lightgrey;
    border-radius: 5px;
    padding-left: 15px;
  }
`;
