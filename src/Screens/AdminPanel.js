import React, { useMemo, useEffect, useCallback, useState } from "react";
import styled from "styled-components";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  update,
} from "firebase/database";
import { useSelector } from "react-redux";

import app from "../firebase";
import { Back, DropDown } from "../assets/Images/Index";

const db = getDatabase(app);

function AdminPanel() {
  const [modalVisible, setModalVisible] = useState("");
  const [filterData, setFilterData] = useState([]);

  const [deleteCheck, setdeleteCheck] = useState(false);
  const HaederList = ["Name", "Email", "Key", "Status"];
  const StatusList = ["Pending"];
  const DeleteItem = (id) => {
    console.log(id);
  };
  const [check, setCheck] = useState(false);
  const [dummyCheck, setDummyCheck] = useState(false);
  const [buttonPressed, setButtonPresed] = useState("Pending");
  const [data, setLogedinEmail] = useState([]);

  const { key, alumniSchoolName } = useSelector(
    (state) => state.persistedReducer
  );
  console.log("key is", key);

  // key should be dynamic
  const starCountRef = ref(db, "users/admin");

  let navigate = useNavigate();
  const onApproveHandler = (alKey) => {
    console.log("approve called", alKey);
    set(ref(db, "users/admin/" + alKey + "/approve"), true);
    dummyCheck ? setDummyCheck(false) : setDummyCheck(true);
    setLogedinEmail([]);
    setFilterData([]);
  };

  const onDisapproveHandler = (alKey) => {
    console.log("disaprove called", alKey);
    set(ref(db, "users/admin/" + alKey), null);
    set(ref(db, "School/" + alKey), null);
    deleteCheck ? setdeleteCheck(false) : setdeleteCheck(true);
    setLogedinEmail([]);
    setFilterData([]);
  };
  console.log(`modalllllllllllllllllllllllllllllllllll ${modalVisible}`);
  useEffect(() => {
    onValue(
      starCountRef,
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();

          console.log("admin data", childData);

          if (!childData.approve) {
            childData["alumniKey"] = childKey;
            setLogedinEmail((prev) => [...prev, childData]);
            setFilterData((prev) => [...prev, childData]);
          }
        });
        setCheck(true);
      },
      {
        onlyOnce: false,
      }
    );
  }, [deleteCheck, dummyCheck]);
  const addTodo = (item, index) => {
    console.log(`1111111111111111111111 ${item}`);
    return (
      <div className="rows">
        <div
          style={{
            width: "15%",
            display: " flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h4 className="cutText">
            {item.firstName} {item.lastName}
          </h4>
        </div>

        <div
          style={{
            width: "15%",
            display: " flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h4 className="cutText">{item.email}</h4>
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
          <h4 className="cutText">{item.alumniKey}</h4>
        </div>

        <div
          style={{
            width: "15%",
            display: " flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "80%",
                marginRight: "20px",
                height: "60%",
                padding: "10px",
                backgroundColor: "rgba(34, 145, 241, 0.14)",
              }}
            >
              <h6 style={{ color: "#2291F1", margin: 0 }}> Pending</h6>
            </div>
            <img
              src={DropDown}
              style={{ width: "10px", height: "10px", cursor: "pointer" }}
              onClick={() => {
                modalVisible == item.alumniKey
                  ? setModalVisible("")
                  : setModalVisible(item.alumniKey);
              }}
            />
          </div>
          {modalVisible == item.alumniKey ? (
            <div className="approveDiv">
              <div
                style={{
                  width: "100%",
                  height: "50%",
                  borderBottom: "1px solid #DADDE1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <h6 onClick={() => onApproveHandler(item.alumniKey)}>
                  Approve
                </h6>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "50%",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  justifyContent: "center",
                }}
              >
                <h6 onClick={() => onDisapproveHandler(item.alumnikey)}>
                  Reject
                </h6>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  function addHandler() {
    navigate("/addInfo");
  }

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
        <Header data={data} setFilterData={setFilterData} />

        <Container>
          <div className="nav">
            <h3 style={{ fontFamily: "poppins-regular" }}>Admin Dashboard</h3>
          </div>
          <div
            style={{
              width: "30%",
              display: "flex",
              height: "10%",
            }}
          ></div>
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
                  }}
                >
                  {item == "nill" || item == "nil" ? null : <h6>{item}</h6>}
                </div>
              );
            })}
          </div>
          <div className="innerDiv">
            {filterData.map((item, index) => {
              return addTodo(item, index);
            })}
          </div>
        </Container>
      </>
    );
}

export default AdminPanel;

const Container = styled.div`
  //background-color: gray;
  height: 79.7vh;
  width: 94%;
  margin-inline: 3%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  .nav {
    background-color: white;
    height: 10vh;
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-top: 10px;
  }
  .approveDiv {
    position: absolute;
    width: 70px;
    height: 50px;
    margin-top: 80px;
    margin-left: 100px;
    z-index: 100;
    background-color: white;
    border: 1px solid #dadde1;
  }
  .cutText {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: #0e3746;
    font-weight: 500;
    font-size: 12px;
  }
  .schoolPanelHeaderContainer {
    height: 7%;
    width: 100%;
    background-color: rgba(34, 145, 241, 0.14);
    display: flex;
    margin-top: 20;
    align-items: center;
    justify-content: space-between;
  }
  .backButton {
    width: 10%;
    height: 50px;
    margin-left: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    align-self: flex-end;
    cursor: pointer;
  }
  .rightDiv {
    //background-color: yellow;
    height: 100%;
    width: 40%;
    display: flex;
    align-items: center;
    justify-content: right;
  }
  .rows {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .input {
    width: 30px;
    height: 30px;
  }
  .innerDiv {
    //background-color: aqua;
    height: 100%;
    width: 95%;
    padding-bottom: 50px;
    margin-bottom: 50px;
    overflow: auto;
    margin-top: 20px;
  }
  .tableHeaderDiv {
    height: 10%;
    //background-color: brown;
    display: flex;
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
    background-color: #2291f1;
    width: 100%;
    height: 100%;
    border: 0px;
    color: white;
    border-radius: 5px;
  }
  .paragraphDiv {
    //background-color: red;
    height: 10%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;
