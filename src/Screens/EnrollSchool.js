import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Register from "../Components/EnrollSchool/Register";
import SchoolInformation from "../Components/EnrollSchool/SchoolInformation";
import Payment from "../Components/EnrollSchool/Payment";
import Complete from "../Components/EnrollSchool/Complete";
import ContactUs from "../Components/EnrollSchool/ContactUs";
import { Logo, RegisterImage } from "../assets/Images/Index";
import Header from "../Components/Header";

function EnrollSchool({ navigation }) {
  const navigate = useNavigate();

  const [component, setcomponent] = useState("Register");
  const [key, setKey] = useState("");
  function getKey(item1) {
    setKey(item1);
  }
  function componentHandler(item1) {
    console.log(item1);
    if (item1 == "contactus") {
      navigate("/");
    }
    setcomponent(item1);
  }

  return (
    <>
      <Container>
        {component != "complete" ? (
          <>
            <div className="leftChild">
              <div style={{ paddingLeft: "20px" }}>
                <img src={Logo} style={{ width: "70px", height: "60px" }} />
                <h3
                  style={{
                    fontSize: 30,
                    margin: 0,
                    marginTop: 10,
                    fontFamily: "Poppins",
                    color: "#0E3746",
                    fontWeight: "500",
                  }}
                >
                  {component}
                </h3>
              </div>
              {component === "Register" ? (
                <Register
                  navigation={navigation}
                  onClick={(item1) => componentHandler(item1)}
                  ongetval={(item1) => getKey(item1)}
                />
              ) : component === "School Information" ? (
                <SchoolInformation onClick={componentHandler} getKey={key} />
              ) : component === "payment" ? (
                <Payment onClick={componentHandler} />
              ) : component === "contactus" ? (
                <ContactUs onClick={componentHandler} />
              ) : null}
            </div>
            <div className="rightChild">
              {/* <img src={RegisterImage} id="img" /> */}
              <div className="rightImg"></div>
            </div>
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Header />
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
              <Complete onClick={componentHandler} />
            </div>
          </div>
        )}
      </Container>
    </>
  );
}

export default EnrollSchool;

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .bgImage {
    position: fixed;
    bottom: 0;
    background-position-x: right;
    background: url(${RegisterImage});
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
  }
  #img {
    display: block;
    width: 44vw;
    align-self: center;
    height: 100vh;
    object-fit: cover;
  }
  .leftChild {
    height: 90%;
    width: 60%;
    padding-top: 1%;
    padding-left: 1%;
    display: flex;
    flex-direction: column;
  }
  .rightChild {
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  button {
    cursor: pointer;
  }
  .rightImg {
    width: 680px;
    height: 100vh;
    background-image: url(${RegisterImage});
    background-repeat: no-repeat;
    background-size: cover;
  }
`;
