import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import RegisterAlumni from "../Components/EnrollAlumni/RegisterAlumni";
import SchoolInformationAlumni from "../Components/EnrollAlumni/SchoolInformationAlumni";
import CompleteAlumni from "../Components/EnrollAlumni/CompleteAlumni";
import { RegisterImage, Logo } from "../assets/Images/Index";

function EnrollAlumni() {
  const navigate = useNavigate();

  const [component, setcomponent] = useState("register");
  const [key, setKey] = useState("");

  function getKey(item1) {
    setKey(item1);
  }

  function componentHandler(item1) {
    if (item1 == "contactus") {
      navigate("/");
    }
    setcomponent(item1);
  }

  return (
    <>
      <Container>
        <div className="leftChild">
          <div style={{ paddingLeft: "20px" }}>
            <img src={Logo} style={{ width: "70px", height: "60px" }} />
            <h3
              style={{
                fontSize: 20,
                margin: 0,
                marginTop: 10,
                fontFamily: "Poppins-Regular",
              }}
            >
              {component}
            </h3>
          </div>
          {component === "register" ? (
            <RegisterAlumni onClick={componentHandler} ongetval={getKey} />
          ) : component === "schoolInformation" ? (
            <SchoolInformationAlumni onClick={componentHandler} getKey={key} />
          ) : component === "complete" ? (
            <CompleteAlumni onClick={componentHandler} />
          ) : null}
        </div>
        <div className="rightChild">
          <img src={RegisterImage} id="img" />
        </div>
      </Container>
    </>
  );
}

export default EnrollAlumni;

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
`;
