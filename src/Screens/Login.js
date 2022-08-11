import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { Logo, RegisterImage } from "../assets/Images/Index";
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
              src={Logo}
              style={{ cursor: "pointer", width: "70px", height: "60px" }}
              onClick={() => navigate("/")}
            />
            <h3
              style={{
                fontSize: 30,
                    margin: 0,
                    marginTop: 10,
                    fontFamily: "Poppins",
                    color: "#0E3746",
                    fontWeight:"500"
              }}
            >
              Login
            </h3>
          </div>
          <LoginComponent onClick={componentHandler} />
        </div>
        <div className="rightChild">
          {/* <img src={RegisterImage} id="img" /> */}
          <div className="rightImg"></div>
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
  .rightImg {
    width: 680px;
    height: 100vh;
    background-image: url(${RegisterImage});
    background-repeat: no-repeat;
    background-size: cover;
  }
`;
