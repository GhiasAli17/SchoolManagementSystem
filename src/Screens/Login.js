import React, { useState } from "react";
import styled from "styled-components";

import registerImage from "../assets/Images/registerImage.svg";
import logo from "../assets/Images/logo.png";
import { useNavigate } from "react-router-dom";

import LoginComponent from "../Components/LoginComponent";
function Login() {
  const [component, setcomponent] = useState("register");
  let navigate = useNavigate();

  function componentHandler(item1) {
    setcomponent(item1);
  }

  return (
    <>
      <Container>
        <div className="leftChild">
          <div style={{ cursor: "pointer" }}>
            <img
              src={logo}
              style={{ cursor: "pointer", width: "70px", height: "60px" }}
              onClick={() => navigate("/")}
            />
            <h3
              style={{
                fontSize: 20,
                margin: 0,
                marginTop: 10,
                fontFamily: "poppins-regular",
              }}
            >
              Login
            </h3>
          </div>
          <LoginComponent onClick={componentHandler} />
        </div>
        <div className="rightChild">
          <img src={registerImage} id="img" />
        </div>
      </Container>
    </>
  );
}

export default Login;

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .bgImage {
    position: fixed;
    bottom: 0;
    background-position-x: right;
    background: url(${registerImage});
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
  }
  #img {
    display: block;
    width: 40vw;
    align-self: flex-end;
    height: 100vh;
    object-fit: cover;
  }
  .leftChild {
    height: 90%;
    width: 60%;
    padding-top: 1%;
    padding-left: 3%;
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
`;
