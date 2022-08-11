import React, { useEffect, useCallback, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {getDatabase, ref, onValue, push, set} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";

import { DummyImage, NoItems } from "../assets/Images/Index";
import Header from "../Components/Header";
import app from "../firebase";

const db = getDatabase(app);

function AlumniPanel() {
  const [check, setCheck] = useState(false);
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [showItem, setShowItem] = useState(false);

  const { alumniSchoolname } = useSelector((state) => state.persistedReducer);
  // console.log('ghias',key,'alSchoolName', alumniSchoolname)
  const dispatch = useDispatch();
  let key = "";

  const dbRef = ref(db, "School");
  onValue(dbRef, (snapshot) => {
    snapshot.forEach((childDatasnapShot) => {
      if (childDatasnapShot.val().schoolName == alumniSchoolname) {
        console.log("key in right noew", childDatasnapShot.key);
        //dispatch(setKey(childDatasnapShot.key))
        key = childDatasnapShot.key;
      } else {
        console.log(
          "else key in right noew",
          childDatasnapShot.val(),
          "schname",
          alumniSchoolname
        );
      }
    });
  });

  //  const { key,alumnikey } = useSelector(state => state.persistedReducer)

  const starCountRef = ref(db, "School/" + key + "/items");

  // dispatch(setKey(key))
  let navigate = useNavigate();
  useEffect(() => {
    console.log("hello");
    setData([]);
    setFilterData([]);

    onValue(
      starCountRef,
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          childData["itemKey"] = childKey;

          onValue(ref(db, "School/" + key), (innerSnapshot) => {
            innerSnapshot.forEach((innerChildsnapshot) => {
              console.log("forEach", innerChildsnapshot.val());
              if (innerChildsnapshot.val() == alumniSchoolname) {
                console.log("child data should bee called", childData);
                setData((prev) => [...prev, childData]);
                setFilterData((prev) => [...prev, childData]);
              }
            });
          });
          // console.log('child data should bee called',childData);
          // setData((prev)=>[...prev,childData])
          // ...
        });
        setCheck(true);
      },
      {
        onlyOnce: false,
      }
    );
  }, [check]);
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
            <input style={{ outline: "none", width: "20px", height: "20px", marginLeft:"20px", }} type="checkbox" />
          </div>
          <div
            style={{
              width: "15%",
              display: " flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                style={{ marginRight: "20px", width: "40px", height: "40px", borderRadius:"5px", }}
              />
            ) : (
              <img
                src={DummyImage}
                style={{ marginRight: "20px", width: "40px", height: "40px", borderRadius:"5px", }}
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
              cursor: "pointer",
            }}
          >
            <button
              onClick={() =>
                payHandler(item.itemCost, item.itemName, item.itemKey)
              }
            >
              Pay
            </button>
          </div>
        </div>
      );
    },
    [data]
  );
  function payHandler(passedAmount, desc, itemKey) {
    //   navigate('/addInfo')
    //dispatch(setAmount(passedAmount))

      // testing
      // onValue(ref(db,"School/" + key + "/donations"),snapshot => {
      //    passedAmount = parseInt(snapshot.val()) + parseInt(passedAmount);
      //     console.log("passed am", passedAmount)
      //
      // })
      // set(ref(db, "School/" + key + "/donations"), passedAmount)

    navigate("/payment", {
      state: { amount: passedAmount, desc: desc, itemKey: itemKey,key },
    });

    //    setShowItem(true);
  }
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
        <Header data={data} setFilterData={setFilterData} />

        <Container>
          <div className="nav">
            <div className="leftDiv">
              <h3 style={{ fontFamily: "Poppins", fontSize: "25px", margin: "0", color:"#0E3746", fontWeight:"500" }}>Needs</h3>
            </div>
          </div>
          {filterData.length > 0 ? (
            <div className="innerDiv">
              <div className="AlumniPanelHeaderContainer">
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
                      {item == "nill" || item == "nil" ? null : <h6 style={{fontSize:"13px", color:"#0E3746"}}>{item}</h6>}
                    </div>
                  );
                })}
              </div>
              {filterData.map((item, index) => {
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
              <img src={NoItems} />
              <h4 style={{ color: "rgba(14, 55, 70, 0.4)" }}>
                This school does not have any listed Needs
              </h4>
            </div>
          )}
        </Container>
      </>
    );
}

export default AlumniPanel;

const Container = styled.div`
  //background-color: gray;
  height: 79.7vh;
  width: 94%;
  padding-inline: 3%;
  display: flex;
  align-items: center;
  flex-direction: column;
  .cutText {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: #0e3746;
    font-weight: 500;
    font-size: 16px;
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
    height: 17%;
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
    overflow: auto;
  }
  .AlumniPanelHeaderContainer {
    height: 7%;
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
    background-color: #2291f1;
    width: 70%;
    height: 35px;
    border: 0px;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 0px 15px #2190f0;
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
