import React, { useMemo, useEffect, useCallback, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useSelector } from "react-redux";

import Header from "../Components/Header";
import dummyimage from "../assets/Images/dummyimage.png";
import trsh from "../assets/Images/trsh.png";

import app from "../firebase";
import edit from "../assets/Images/edit.svg";
import noitems from "../assets/Images/noitems.svg";
const db = getDatabase(app);

function SchoolPanel() {
  const [deleteId, setDeletedId] = useState(false);
  const { key } = useSelector((state) => state.persistedReducer);
  const [deleteCheck, setdeleteCheck] = useState(false);

  const DeleteItem = () => {
    console.log("delted id", deleteId);
    set(ref(db, "School/" + key + "/items/" + deleteId), null);
    deleteCheck ? setdeleteCheck(false) : setdeleteCheck(true);
  };
  const [check, setCheck] = useState(false);

  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  console.log("key is", key);

  // key should be dynamic
  const starCountRef = ref(db, "School/" + key + "/items");

  let navigate = useNavigate();

  useEffect(() => {
    setData([]);

    onValue(
      starCountRef,
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          childData["itemKey"] = childKey;
          console.log("child data", childData);
          setData((prev) => [...prev, childData]);
          console.log("child data array", data, "length", data.length);
          // ...
        });
        setCheck(true);
      },
      {
        onlyOnce: false,
      }
    );
  }, [deleteCheck]);
  const addTodo = useCallback(
    (item, index) => {
      console.log(`item image ${item.imageUrl}`);

      return (
        <div className="rows">
          <div
            style={{
              width: "15%",
              display: " flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <input
              style={{ cursor: "pointer", outline: "none" }}
              type="checkbox"
            />
          </div>
          <div
            style={{
              width: "15%",
              display: " flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                style={{ marginRight: "20px", width: "40px", height: "40px" }}
              />
            ) : (
              <img
                src={dummyimage}
                style={{ marginRight: "20px", width: "40px", height: "40px" }}
              />
            )}
            <h4 className="cutText">{item.itemName}</h4>
          </div>

          <div
            style={{
              width: "15%",
              display: " flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h4 className="cutText">{item.itemCost}</h4>
          </div>

          <div
            style={{
              width: "15%",
              display: " flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            <h4 className="cutText">{item.stdName}</h4>
          </div>

          <div
            style={{
              width: "15%",
              display: " flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h4 className="cutText">{item.itemDescription}</h4>
          </div>

          <div
            style={{
              width: "15%",
              display: " flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <img
              src={trsh}
              style={{ cursor: "pointer", width: 20, height: 20 }}
              onClick={() => {
                setModalVisible(true);
                setDeletedId(item.itemKey);
              }}
            />

            <img
              src={edit}
              style={{ cursor: "pointer", width: 20, height: 20 }}
              onClick={() => {
                navigate("/UpdateItem", {
                  state: {
                    itemkey: item.itemKey,
                    desc: item.itemDescription,
                    studentname: item.stdName,
                    cost: item.itemCost,
                    itemname: item.itemName,
                    image: item.imageUrl,
                  },
                });
              }}
            />
          </div>
        </div>
      );
    },
    [data]
  );

  function addHandler() {
    navigate("/additem");
  }
  const HaederList = ["nill", "Items", "Cost", "Student", "Description", "nil"];
  if (!check)
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
  else
    return (
      <>
        <Header />

        <Container>
          <div className="nav">
            <div className="leftDiv">
              <h3 style={{ fontFamily: "poppins-regular" }}>Needs</h3>
            </div>
            <div className="rightDiv">
              <button onClick={() => addHandler()} className="button">
                <h4 style={{ color: "#2291F1", fontFamily: "poppins-regular" }}>
                  Add New
                </h4>
              </button>

              <button onClick={() => navigate("/accounts")} className="button">
                <h4 style={{ color: "#2291F1", fontFamily: "poppins-regular" }}>
                  Accounts Requests
                </h4>
              </button>
            </div>
          </div>
          {data.length > 0 ? (
            <div className="innerDiv">
              <div className="schoolPanelHeaderContainer">
                {HaederList.map((item) => {
                  return (
                    <div
                      key={item}
                      style={{
                        width: "15%",
                        display: " flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "poppins-regular",
                      }}
                    >
                      {item == "nill" || item == "nil" ? null : <h6>{item}</h6>}
                    </div>
                  );
                })}
              </div>
              {data.map((item, index) => {
                return addTodo(item, index);
              })}
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={noitems} />
              <h4
                style={{
                  color: "rgba(14, 55, 70, 0.4)",
                  fontFamily: "poppins-regular",
                }}
              >
                You did not have any item in your list Click "Add new" to add
                your school needs
              </h4>
            </div>
          )}
          <Modal
            isOpen={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
            style={{
              overlay: {
                backgroundColor: "rgba(255, 255, 255, 0.75)",
              },
              content: {
                position: "absolute",
                top: "21.3%",
                left: "35%",
                right: "auto",
                width: "30%",
                bottom: "40%",
                border: "1px solid #ccc",
                background: "#fff",

                WebkitOverflowScrolling: "touch",
                borderRadius: "4px",
                outline: "none",
                padding: "20px",
              },
            }}
          >
            <div
              style={{
                width: "100%",
                flexDirection: "column",
                height: "90%",
                display: "flex",
                paddingTop: "3%",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255, 0, 0, 0.14)",
                  borderRadius: 30,
                }}
              >
                <h4 style={{ color: "white", fontSize: "20px" }}>X</h4>
              </div>
              <h3
                style={{
                  marginTop: "2%",
                  marginLeft: "3%",
                  fontWeight: "500",
                  color: "rgba(255, 0, 0, 0.14)",
                  fontFamily: "poppins-regular",
                }}
              >
                Are you sure to delete this Item
              </h3>
              <button
                onClick={() => {
                  DeleteItem();
                  setModalVisible(false);
                }}
                className="button"
                style={{
                  backgroundColor: " rgba(255, 0, 0, 0.14)",
                  borderWidth: 0,
                  width: "45%",
                  borderRadius: 10,
                }}
              >
                <h4 style={{ color: "white", fontFamily: "poppins-regular" }}>
                  Confirm Delete
                </h4>
              </button>
            </div>
          </Modal>
        </Container>
      </>
    );
}

export default SchoolPanel;

const Container = styled.div`
  //background-color: gray;
  height: 79.7vh;
  width: 96%;
  padding-inline: 2%;
  display: flex;
  align-items: center;
  flex-direction: column;
  .cutText {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: #0e3746;
    font-weight: 500;
    font-size: 12px;
  }

  .nav {
    background-color: white;
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-top: 20px;
  }
  .leftDiv {
    height: 70%;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: white;
  }
  .button {
    width: 30%;
    margin-left: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(34, 145, 241, 0.14);
    cursor: pointer;
  }
  .rightDiv {
    //background-color: yellow;
    height: 70%;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: right;
  }
  .rows {
    width: 100%;
    height: 15%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dadde1;
  }
  .input {
    width: 30px;
    height: 30px;
  }
  .innerDiv {
    //background-color: aqua;
    height: 100%;
    width: 95%;
    overflow: auto;
  }
  .schoolPanelHeaderContainer {
    height: 10%;
    background-color: rgba(34, 145, 241, 0.14);
    display: flex;
    margin-top: 20;
    align-items: center;
    justify-content: space-between;
  }
  .btnMainDiv {
    //background-color: red;
    height: 10%;
    width: 100%;
    display: flex;
    align-items: center;
  }
  .btnDiv {
    //background-color: aliceblue;
    height: 90%;
    width: 17%;
  }
  button {
    background-color: gray;
    width: 100%;
    height: 100%;
    border: 0px;
    color: white;
    border-radius: 5px;
  }
  .paragraphDiv {
    height: 10%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;
