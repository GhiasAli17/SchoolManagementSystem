import React from "react";
import styled from "styled-components";

function Complete(props) {
  function doneHandler() {
    var val = "contactus";
    props.onClick(val);
  }
  return (
    <Container>
      <div className="paragraphDiv">
        <div className="h4Div">
          <h4
            style={{
              fontFamily: "Poppins",
              fontSize: "40px",
              fontWeight: "500",
            }}
          >
            Thank you for registering.You will be notified within one business
            day when the School Admin would accept your registration          </h4>
        </div>
      </div>
      <button
        className="inputsConatiner button"
        style={{ width: "25%" }}
        onClick={() => doneHandler()}
      >
        <h3 style={{ color: "white" }}>Done</h3>
      </button>
    </Container>
  );
}

export default Complete;

const Container = styled.div`
  background-color: white;
  height: 78vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  .paragraphDiv {
    //background-color: yellow;
    height: 60%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    //justify-content: center;
  }
  .inputsConatiner {
    height: 10%;
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2291f1;
    border: 1px solid #2291f1;
    border-radius: 5px;
    box-shadow: 0 0px 15px #2190f0;
  }

  .h4Div {
    //background-color: aqua;
    height: 90%;
    width: 75%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h4 {
    text-align: center;
    color: rgba(14, 55, 70, 0.4);
  }
`;
