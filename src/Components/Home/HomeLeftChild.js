import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import {
  setLogedinEmail,
  setUserData,
  setUserName,
  setLoginUserType,
} from "../../Redux/actions";

function HomeLeftChild({ enrolAlumni, enrollSchollHandler }) {
  const dispatch = useDispatch();
  return (
    <Container>
      <div className="">
        <div className="bigNeedsDiv">
          <div style={{ display: "flex" }}>
            <h1 className="needsText">Big</h1>
            <h1
              className="needsText"
              style={{ color: "#2291F1", marginLeft: "10px" }}
            >
              Needs
            </h1>
          </div>
          <div style={{ display: "flex" }}>
            <h1
              className="needsText leftMargin"
              style={{ color: "#2291F1", marginRight: "10px" }}
            >
              Small
            </h1>
            <h1 className="needsText">payments</h1>
          </div>
        </div>
      </div>
      <div className="detailTextConatiner">
        <h6 className="detailText">
          Meet the needs of students from your school through small payments
        </h6>
      </div>
      <div className="regButtons">
        <div className="btnDiv">
          <button
            onClick={() => {
              enrollSchollHandler();
              dispatch(setLogedinEmail(""));
              dispatch(setLoginUserType(""));
              dispatch(setUserData(""));
              dispatch(setUserName(""));
            }}
            className="blueBack button"
          >
            <h3 className="enrollText whiteText">Enroll School</h3>
            <h4 className="text whiteText">(for school admins)</h4>
          </button>
        </div>
        <div className="btnDiv">
          <button
            onClick={() => {
              enrolAlumni();
              dispatch(setLogedinEmail(""));
              dispatch(setLoginUserType(""));
              dispatch(setUserData(""));
              dispatch(setUserName(""));
            }}
            className="button"
            style={{ marginLeft: "20px", border: "2px solid #2291f1", background: "unset" }}
          >
            <h3 className="enrollText blueText">Join your School</h3>
            <h4 className="text blueText">(for school alumni)</h4>
          </button>
        </div>
      </div>
    </Container>
  );
}

export default HomeLeftChild;

const Container = styled.div`
  background-color: white;
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 15px;
  .regButtons {
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: flex-start;
  }
  .headingTextContainer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
  .bigNeedsDiv {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 0px 0 0 0;
  }
  h1 {
    font-size: 50px;
    font-weight: bold;
    text-align: center;
    font-weight: 700 !important;
  }

  .button {
    min-width: 100%;
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 5px;
    border-color: #2291f1;
    cursor: pointer;
    
  }
  .blueBack {
    background-color: #2291f1;
    border: 2px solid #2291f1;
    box-shadow: 0 0px 15px #2190f0;
  }
  .rightDiv {
    height: 61%;
    width: 13.3%;
    border-radius: 50%;
    margin-right: 3%;
    display: flex;
    align-items: center;
    background-color: skyblue;
  }
  .detailTextConatiner {
    width: 70%;
  }
  .detailText {
    font-size: 30px;
    font-weight: 400;
    color: rgba(14, 55, 70, 0.4);
    margin: 15px 0 30px 0;

    font-family: "Poppins-Regular";
  }
  .needsText {
    font-size: 50px;
    margin-inline: 5px;
    margin: 0px;
    color: #0E3746;
  }
  .leftMargin {
    margin-left: 3%;
  }
  .donatedText {
    font-size: 15px;
    font-family: "Poppins";
  }
  .enrollText {
    font-size: 20px;
    font-family: "Poppins";
    font-weight: 500;
  }
  .text {
    font-size: 17px;
    font-weight: 500;
    font-family: "Poppins";
  }
  .whiteText {
    color: white;
  }
  .blueText {
    color: #2291f1;
  }
  .btnDiv {
    border-radius: 5px;
    height: 5%;
    width: 37%;
    display: flex;
  }
  @media screen and (max-width: 750px) {
    .needsText {
      font-size: 40px;
    }
    .donatedText {
      font-size: 10px;
    }
  }
`;
