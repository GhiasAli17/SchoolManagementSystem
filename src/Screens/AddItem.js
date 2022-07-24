import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../Components/Header";
import { getDatabase, ref, set, onValue, push } from "firebase/database";
import { useNavigate } from "react-router-dom";
import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

import app, { storage } from "../firebase";

const db = getDatabase(app);

function AddItem() {
  let navigate = useNavigate();

  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const [check, setCheck] = useState(false);

  const [itemInfo, setItemInfo] = useState({
    itemName: "",
    itemCost: "",
    stdName: "",
    itemDescription: "",
    imageUrl: "",
  });
  useEffect(() => {
    return () => toast.dismiss();
  }, []);
  const { key } = useSelector((state) => state.persistedReducer);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    if (name != "itemCost") {
      setItemInfo({ ...itemInfo, [name]: value });
    } else {
      var letters = /^$|^[0-9\b]+$/;
      if (value.match(letters)) {
        setItemInfo({ ...itemInfo, [name]: value });
      } else {
        toast.custom(
          <div
            style={{
              marginTop: "5%",
              width: "100%",
              height: "6vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                alignSelf: "flex-start",
                width: "30%",
                height: "100%",
                borderLeftWidth: "8px",
                borderColor: "red",
                borderStyle: "solid",
                borderBottomWidth: 0,
                borderRightWidth: 0,
                borderTopWidth: 0,
                borderRadius: 5,
                backgroundColor: "#F5F5F5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h3
                style={{
                  color: "#515C6F",
                  fontFamily: "GraphikMedium",
                  fontWeight: "100",
                  fontSize: "12px",
                }}
              >
                invalid key presed
              </h3>
            </div>
          </div>,
          { duration: 1000 }
        );
      }
    }
  };

  // Handles input change event and updates state

  console.log("hello");
  const onSubmitHandler = () => {
    if (
      itemInfo.itemName == "" ||
      itemInfo.itemCost == "" ||
      itemInfo.stdName == "" ||
      itemInfo.itemDescription == ""
    ) {
      toast.custom(
        <div
          style={{
            marginTop: "5%",
            width: "100%",
            height: "6vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              alignSelf: "flex-start",
              width: "30%",
              height: "100%",
              borderLeftWidth: "8px",
              borderColor: "red",
              borderStyle: "solid",
              borderBottomWidth: 0,
              borderRightWidth: 0,
              borderTopWidth: 0,
              borderRadius: 5,
              backgroundColor: "#F5F5F5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h3
              style={{
                color: "#515C6F",
                fontFamily: "GraphikMedium",
                fontWeight: "100",
                fontSize: "12px",
              }}
            >
              Kindly fill all the fields
            </h3>
          </div>
        </div>,
        { duration: 1000 }
      );
    } else {
      push(ref(db, "School/" + key + "/items"), itemInfo)
        .then(() => {
          console.log("data saved successfully");
          toast.custom(
            <div
              style={{
                marginTop: "5%",
                width: "100%",
                height: "6vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <div
                style={{
                  alignSelf: "flex-start",
                  width: "30%",
                  height: "100%",
                  borderLeftWidth: "8px",
                  borderColor: "green",
                  borderStyle: "solid",
                  borderBottomWidth: 0,
                  borderRightWidth: 0,
                  borderTopWidth: 0,
                  borderRadius: 5,
                  backgroundColor: "#F5F5F5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h3
                  style={{
                    color: "#515C6F",
                    fontFamily: "GraphikMedium",
                    fontWeight: "100",
                    fontSize: "12px",
                  }}
                >
                  data saved successfully
                </h3>
              </div>
            </div>,
            { duration: 1000 }
          );
          navigate("/SchoolLogin");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  function handleChange(event) {
    setFile(event.target.files[0]);
    handleUpload(event.target.files[0]);
    setCheck(true);
  }

  // handle upload
  function handleUpload(image) {
    if (!image) {
      setCheck(false);
      alert("Please choose a file first!");
    }

    const storageRef = sRef(storage, `/files/${image.name}`);
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
          setItemInfo({ ...itemInfo, imageUrl: url });
          setCheck(false);
        });
      }
    );
  }

  const InputsList = [
    {
      id: 1,
      title: "item",
      onch: onChangeHandler,
      ph: "Enter item Name",
      name: "itemName",
      value: itemInfo.itemName,
    },
    {
      id: 2,
      onch: onChangeHandler,
      title: "Student Name",
      ph: "Enter Student Name",
      name: "stdName",
      value: itemInfo.stdName,
    },
    {
      id: 3,
      onch: onChangeHandler,
      title: "Description",
      ph: "Enter Description",
      name: "itemDescription",
      value: itemInfo.itemDescription,
    },
  ];
  if (check)
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  else {
    return (
      <>
        <Header />
        <Container>
          <div className="headingText">
            <h3 style={{ fontFamily: "Poppins-Regular" }}>Add New Item</h3>
          </div>
          <div className="addItemContainer">
            {InputsList.map((item) => {
              return (
                <div id={item.id} className="inputsConatiner">
                  <div style={{ display: "flex" }}>
                    <h6>{item.title}</h6>
                    <h6 style={{ color: "red" }}>*</h6>
                  </div>
                  <input
                    className="inputDiv"
                    style={{ outline: "none" }}
                    name={item.name}
                    value={item.value}
                    onChange={item.onch}
                  />
                </div>
              );
            })}
            <div className="inputsConatiner select">
              <div style={{ display: "flex" }}>
                <h6>cost</h6>
                <h6 style={{ color: "red" }}>*</h6>
              </div>

              <input
                className="inputDiv"
                style={{
                  outline: "none",
                  marginLeft: 70,
                  height: "80%",
                  width: "40%",
                }}
                name="itemCost"
                value={itemInfo.itemCost}
                onChange={onChangeHandler}
              />
            </div>
            <div
              className="inputsConatiner"
              style={{
                borderColor: "rgba(218, 221, 225, 0.4)",
                height: "15%",
                marginTop: 50,
                borderStyle: "solid",
                flexDirection: "column",
              }}
            >
              <div className="h5Div">
                <h5>Upload Item Image</h5>
              </div>
              <div
                className="inputDiv"
                style={{
                  borderWidth: 0,
                  marginLeft: "40px",
                  backgroundColor: "transparent",
                }}
              >
                <input
                  style={{ outline: "none" }}
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div
              className="inputsConatiner"
              style={{
                borderWidth: 0,
                alignItems: "center",
                justifyContent: "flex-end",
                marginTop: 50,
              }}
            >
              <div
                style={{
                  width: "20%",
                  height: "80%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button style={{ cursor: "pointer" }} onClick={onSubmitHandler}>
                  <h6 style={{ color: "white", margin: 0 }}>Submit</h6>
                </button>
              </div>
            </div>
          </div>

          <Toaster />
        </Container>
      </>
    );
  }
}

export default AddItem;

const Container = styled.div`
  //background-color: burlywood;
  height: 87vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  .inputsConatiner {
    height: 8%;
    width: 50%;
    display: flex;
    align-items: center;
    margin-top: 10px;
    justify-content: space-between;
  }
  .select {
    justify-content: flex-start;
  }
  .inputDiv {
    height: 100%;
    padding-inline: 10px;
    width: 80%;
    display: flex;
    justify-content: center;
    padding-left: 20px !important;
    border-radius: 7px;
    background-color: rgba(218, 221, 225, 0.4);
    border: 1px solid rgba(218, 221, 225, 0.4);
  }
  .addItemContainer {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }
  .headingText {
    //background-color: azure;
    height: 8%;
    width: 95%;
    display: flex;
    align-items: center;
  }
  .itemDiv {
    //background-color: aqua;
    height: 13.5%;
    width: 95%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .h5Div {
    //background-color: yellow;
    height: 45%;
    width: 20%;
    display: flex;
    align-items: center;
  }

  button {
    background-color: #2291f1;
    height: 100%;
    width: 100%;
    border: 0px;
    border-radius: 5px;
    font-size: 20px;
    color: white;
  }
`;
