import React, { useEffect, useState } from "react";
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
import { NoItems, DropDown,Succes, Fail } from "../assets/Images/Index";

const db = getDatabase(app);

function AccountsReq() {
  const [modalVisible, setModalVisible] = useState("");
  const [filterData, setFilterData] = useState([]);

  const [deleteCheck, setdeleteCheck] = useState(false);
  const HaederList = ["Name", "Graduation Year", "Phone Number", "Status"];
  const StatusList = ["Pending"];
  const DeleteItem = (id) => {
    console.log(id);
  };
  const [check, setCheck] = useState(false);
  const [dummyCheck, setDummyCheck] = useState(false);
  const [buttonPressed, setButtonPresed] = useState("Pending");
  const [data, setLogedinEmail] = useState([]);
  const [approveAlumni, setApprovedAlumni] = useState([]);
  const { key, alumniSchoolName } = useSelector(
    (state) => state.persistedReducer
  );
  console.log("key is", key);

  // key should be dynamic
  const starCountRef = ref(db, "users/alumni");

  let navigate = useNavigate();
 
  const onApproveHandler = (alKey) => {
    setModalVisible(false);
    console.log("approve called", alKey);
    set(ref(db, "users/alumni/" + alKey + "/approve"), true);
    dummyCheck ? setDummyCheck(false) : setDummyCheck(true);
    setLogedinEmail([]);
    setFilterData([]);
  };
  const onDisapproveHandler = (alKey) => {
    setModalVisible(false);

    console.log("disaprove called", alKey);
    set(ref(db, "users/alumni/" + alKey + "/approve"), "rejected");
    deleteCheck ? setdeleteCheck(false) : setdeleteCheck(true);
    setLogedinEmail([]);
  };

  // ---------
  //----------
  useEffect(() => {
    onValue(
      starCountRef,
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();

          //onValue(ref(db,"users/alumni/"+childKey))

          onValue(ref(db, "School/" + key), (innerSnapshot) => {
            console.log("buzz key", innerSnapshot.key);
            console.log("buzz value", innerSnapshot.val().schoolName);
            console.log("child value", childData);

            if (
              innerSnapshot.val().schoolName == childData.schoolInfo.schoolName
            ) {
                childData["alumniKey"] = childKey;
                childData["alumniSchoolname"] = childData.schoolInfo.schoolName;
                childData["gYear"] = childData.schoolInfo.graduationyear;
                setLogedinEmail((prev) => [...prev, childData]);
                setFilterData((prev) => [...prev, childData]);

              // else if(childData.approve){
              //     childData["alumniKey"] = childKey;
              //     childData["alumniSchoolname"] = childData.schoolInfo.schoolName;
              //     childData["gYear"] = childData.schoolInfo.graduationyear;
              //     setApprovedAlumni((prev) => [...prev, childData]);
              // }
            }
          });
          // childData['alumniKey'] = childKey;
          console.log("child data", childData.schoolInfo.schoolName);
          // if(!childData.approve){
          //     setLogedinEmail((prev) => [...prev, childData]);
          // }
          console.log("child data array", data, "length", data.length);
          // ...
        });
        setCheck(true);
      },
      {
        onlyOnce: false,
      }
    );
  }, [deleteCheck, dummyCheck]);
  const addTodo = (item, index) => {
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
          <h4 className="cutText">{item.gYear}</h4>
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
          <h4 className="cutText">{item.schoolInfo.alumniNumber}</h4>
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
                backgroundColor:
                  item.approve == false
                    ? "rgba(34, 145, 241, 0.14)"
                    : item.approve == true
                    ? " rgba(32, 227, 0, 0.14)"
                    : "rgba(255, 0, 0, 0.14)",
                borderRadius: "5px",
              }}
            >
              {item.approve == false ? (
                <h6 style={{ color: "#2291F1", margin: 0 }}> Pending</h6>
              ) : (
                <>
                  {item.approve == true ? (
                    <h6 style={{ color: "#20E300", margin: 0 }}>Accepted</h6>
                  ) : (
                    <h6 style={{ color: "#FF0000", margin: 0 }}>Rejected</h6>
                  )}
                </>
              )}
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
                  borderBottom: "1px solid #DADDE1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  maxHeight: "30px",
                }}
              >
                {item.approve == false ? (
                  <h6 onClick={() => onApproveHandler(item.alumniKey)}>
                    Approve
                  </h6>
                ) : (
                  <>
                    {item.approve == true ? (
                      <h6 onClick={() => onDisapproveHandler(item.alumniKey)}>
                        Reject
                      </h6>
                    ) : (
                      <h6 onClick={() => onApproveHandler(item.alumniKey)}>
                        Approve
                      </h6>
                    )}
                  </>
                )}
              </div>
              {item.approve == false ? (
                <div
                  style={{
                    width: "100%",
                    maxHeight: "30px",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    justifyContent: "center",
                  }}
                >
                  <h6 onClick={() => onDisapproveHandler(item.alumniKey)}>
                    Reject
                  </h6>
                </div>
              ) : null}
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
            <h3 style={{ fontFamily: "Poppins", fontSize: "30px", color: "#0E3746", margin: "0", fontWeight:"500" }}>
              Alumni Registrations requests
            </h3>
          </div>
          <div
            style={{
              width: "30%",
              display: "flex",
              height: "10%",
            }}
          ></div>
          {data.length > 0 ? (
            <>
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
                      {item == "nill" || item == "nil" ? null : <h6 className="tabelSet">{item}</h6>}
                    </div>
                  );
                })}
              </div>
              <div className="innerDiv">
              {filterData.map((item, index) => {
              return addTodo(item, index);
            })}
              </div>
            </>
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
              <img src={NoItems} />
              <h4
                style={{
                  color: "rgba(14, 55, 70, 0.4)",
                  fontFamily: "Poppins-Regular",
                }}
              >
                There is no Registration Requests
              </h4>
            </div>
          )}
          <div
            className="backButton"
            style={{ borderRadius: "10px", overflow: "hidden" }}
          >
            <button
              style={{
                cursor: "pointer",
              }}
              onClick={() => navigate(-1)}
            >
              move back
            </button>
          </div>
        </Container>
      </>
    );
}

export default AccountsReq;

const Container = styled.div`
  //background-color: gray;
  height: 79.7vh;
  width: 98%;
  margin-inline: 1%;
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
    font-size: 16px;
    font-family: "Poppins";
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
    height: 70px;
    margin-left: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: flex-end;
    cursor: pointer;
    background-color: #2291f1;
    border-radius: 5px !important;
    box-shadow: 0 0px 15px #2190f0;
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
    height: 23%;
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
    width: 100%;
    padding-bottom: 50px;
    margin-bottom: 50px;
    overflow: auto;
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
  .tabelSet {
    font-size: 13px;
    color: #0E3746;
  }

`;
