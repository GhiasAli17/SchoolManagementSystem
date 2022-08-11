import React, { useState } from "react";
import styled from "styled-components";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { getDatabase, ref, set } from "firebase/database";

import app from "../../firebase";
import { User, Document,Bank, Succes, Fail, Cancel} from "../../assets/Images/Index";

const db = getDatabase(app);

function Payment(props) {
  const { key } = useSelector((state) => state.persistedReducer);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    routingNumber: "",
  });
  function backHandler() {
    var val = "schoolInformation";
    props.onClick(val);
  }
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    if (name != "routingNumber") {
      setBankInfo({ ...bankInfo, [name]: value });
      console.log("shcool info", name, value);
    } else {
      var letters = /^$|^[0-9\b]+$/;
      if (value.match(letters)) {
        if (value >= 0 && value < 9999999999) {
          setBankInfo({ ...bankInfo, [name]: value });
        } else {
          toast.custom(
            <div
            style={{
              marginTop: "2%",
              marginLeft: '12%',
              width: "100%",
              height: "8vh",
              borderRadius: '20px',
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                width: "30%",
                height: "100%",
                borderRadius: '30px',
                borderWidth: '1px',
                borderColor: '#F5F5F5',
                borderStyle: "solid",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                paddingInline: '5px',
                justifyContent: "space-between",
              }}
            >
              <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center',borderRadius: '50px', backgroundColor: 'rgba(255, 0, 0, 0.22)', width: '11%', height: '75%'}}>
                <img src={Fail} style={{width: '60%', height: '60%', borderRadius: '60px', overflow: 'hidden'}}/>
                 </div>
              <div style={{width: '70%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'center'}}>
                <h6 style={{margin: 0}}>Empty fields</h6>
                <h6 style={{color: '#FF0000', margin: 0}}>Kindly fill all the fields</h6>
    
              </div>
              <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
              <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>
    
              </div>
            </div>
          </div>,
            { duration: 1000 }
          );
        }
      } else {
        toast.custom(
          <div
          style={{
            marginTop: "2%",
            marginLeft: '12%',
            width: "100%",
            height: "8vh",
            borderRadius: '20px',
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              width: "30%",
              height: "100%",
              borderRadius: '30px',
              borderWidth: '1px',
              borderColor: '#F5F5F5',
              borderStyle: "solid",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              paddingInline: '5px',
              justifyContent: "space-between",
            }}
          >
            <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center',borderRadius: '50px', backgroundColor: 'rgba(255, 0, 0, 0.22)', width: '11%', height: '75%'}}>
              <img src={Fail} style={{width: '60%', height: '60%', borderRadius: '60px', overflow: 'hidden'}}/>
               </div>
            <div style={{width: '70%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'center'}}>
              <h6 style={{margin: 0}}>invalid key presed</h6>
              <h6 style={{color: '#FF0000', margin: 0}}>Kindly put numeric value</h6>
  
            </div>
            <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
            <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>
  
            </div>
          </div>
        </div>,
          { duration: 1000 }
        );
      }
    }
  };
  function nextHandler() {
    if (
      bankInfo.accountName == "" ||
      bankInfo.accountNumber == "" ||
      bankInfo.bankName == "" ||
      bankInfo.routingNumber == ""
    ) {
      toast.custom(
        <div
        style={{
          marginTop: "2%",
          marginLeft: '12%',
          width: "100%",
          height: "8vh",
          borderRadius: '20px',
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <div
          style={{
            width: "30%",
            height: "100%",
            borderRadius: '30px',
            borderWidth: '1px',
            borderColor: '#F5F5F5',
            borderStyle: "solid",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            paddingInline: '5px',
            justifyContent: "space-between",
          }}
        >
          <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center',borderRadius: '50px', backgroundColor: 'rgba(255, 0, 0, 0.22)', width: '11%', height: '75%'}}>
            <img src={Fail} style={{width: '60%', height: '60%', borderRadius: '60px', overflow: 'hidden'}}/>
             </div>
          <div style={{width: '70%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'center'}}>
            <h6 style={{margin: 0}}>Empty fields</h6>
            <h6 style={{color: '#FF0000', margin: 0}}>Kindly fill all the fields</h6>

          </div>
          <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
          <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>

          </div>
        </div>
      </div>,
        { duration: 1000 }
      );
    } else {
      //data will be inserted from here

      set(ref(db, "users/admin/" + key + "/bankInfo"), bankInfo)
        .then(() => {
          console.log("account data saved successfully");
        })
        .catch((err) => {
          console.log(err);
        });
      var val = "complete";
      props.onClick(val);
    }
  }
  const InputsList = [
    {
      id: 1,
      image: Bank,
      value: bankInfo.bankName,
      name: "bankName",
      onch: onChangeHandler,
      ph: "Enter Bank Name",
    },
    {
      id: 2,
      image: Bank,
      value: bankInfo.routingNumber,
      name: "routingNumber",

      onch: onChangeHandler,
      ph: "Enter Routing Number",
    },
    {
      id: 3,
      image: User,
      value: bankInfo.accountName,
      name: "accountName",

      onch: onChangeHandler,
      ph: "Enter Account Name",
    },
    {
      id: 4,
      image: Document,
      value: bankInfo.accountNumber,
      name: "accountNumber",

      onch: onChangeHandler,
      ph: "Enter Account Number",
    },
  ];

  return (
    <Container>
      {InputsList.map((item) => {
        return (
          <div id={item.id} className="inputsConatiner">
            <img className="ledtIcon" src={item.image} style={{ width: "25px", height: "25px" }} />
            <input
              className="inputDiv"
              style={{ outline: "none" }}
              placeholder={item.ph}
              name={item.name}
              value={item.value}
              onChange={item.onch}
            />
          </div>
        );
      })}

      <button
        className="inputsConatiner button blueBack"
        onClick={() => nextHandler()}
      >
        <h3 className="whiteText"> Next</h3>
      </button>
      <button
        className="inputsConatiner button"
        style={{ marginTop: -20 }}
        onClick={() => backHandler()}
      >
        <h3 className="blueText">Back</h3>
      </button>
      <Toaster />
    </Container>
  );
}

export default Payment;

const Container = styled.div`
  //background-color: green;
  height: 75vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  .inputsConatiner {
    height: 10%;
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: white;
    border: 1px solid #2291f1;
    border-radius: 5px;
  }
  .blueBack {
    background-color: #2291f1;
    border-radius: 5px;
    box-shadow: 0 0px 15px #2190f0;
    margin-bottom: 10px;
  }
  .whiteText {
    color: white;
  }
  .blueText {
    color: #2291f1;
  }
  .inputDiv {
    height: 100%;
    padding-inline: 20px;
    width: 83%;
    display: flex;
    justify-content: center;
    padding-left: 20px !important;
    border-radius: 5px;
    border: 1px solid rgba(218, 221, 225, 0.4);
    background-color: rgba(218, 221, 225, 0.4);
  }
  // .ledtIcon {
  //   border: 2px solid #f0f1f3;
  //   padding: 9px;
  //   border-radius: 5px;
  // }
  .inputDiv::placeholder {
    color: rgba(14, 55, 70, 0.4);
    opacity: 1;
  }
`;
