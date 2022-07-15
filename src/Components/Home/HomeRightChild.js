import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Bag, Cycle, Books, Table } from "../../assets/Images/Index";

function HomeRightChild() {
  let navigate = useNavigate();

  const { userType, data } = useSelector((state) => state.persistedReducer);
  function clickHandler() {
    if (data != "") {
      if (userType == "Alumni") {
        navigate("/AlumniLogin");
      } else if (userType == "SuperAdmin") {
        console.log(null);
      } else {
        navigate("/SchoolLogin");
      }
    }
  }
  return (
    <Container onClick={() => clickHandler()}>
      <div className="firstImagesColumn">
        <img src={Cycle} style={{ width: 160, height: 160, marginTop: 20 }} />

        <img src={Bag} style={{ width: 160, height: 160, marginTop: 20 }} />
      </div>
      <div className="secondImagesColumn">
        <img
          src={Books}
          style={{ width: 160, height: 160, marginBottom: 20 }}
        />

        <img
          src={Table}
          style={{ width: 160, height: 160, marginBottom: 20 }}
        />
      </div>
    </Container>
  );
}

export default HomeRightChild;

const Container = styled.div`
  background-color: white;
  height: 80vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .firstImagesColumn {
    width: 30%;
    height: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20;
  }
  .secondImagesColumn {
    width: 30%;
    height: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20;
  }
  h2 {
    text-align: center;
  }
  .imgsDiv {
    //background-color: aqua;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 20;
    justify-content: space-around;
  }
  .imgDiv {
    width: 15%;
    background-color: antiquewhite;
    height: 0%;
    padding-top: 200;
  }
  img {
    height: 100%;
    width: 100%;
  }
`;
