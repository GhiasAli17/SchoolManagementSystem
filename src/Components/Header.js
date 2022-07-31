import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
import { useLocation } from "react-router-dom";

import {
  setProfilePic,
  setLogedinEmail,
  setUserName,
  setUserData,
} from "../Redux/actions";
import {
  UserAvatar,
  Settings,
  SearchIcon,
  LogOut,
  DropDown,
  AdminIcon,
  Logo,
} from "../assets/Images/Index";

function Header(props) {
  if (props) {
    console.log(`headr props data is this${props.data}`);
  }
  const dispatch = useDispatch();
  const { userType, profilepic } = useSelector(
    (state) => state.persistedReducer
  );
  const [modalVisible, setModalVisible] = useState(false);

  const location = useLocation();
  let navigate = useNavigate();

  const { data, key, username } = useSelector(
    (state) => state.persistedReducer
  );
  
  const searchData = (searchVal) => {
    if (props) {
      const newdata = props.data.filter((item) => {
        if (item.itemName) {
          const itemdata = item.itemName
            ? item.itemName.toUpperCase()
            : "".toUpperCase();

          const textdata = searchVal.toUpperCase();
          return itemdata.indexOf(textdata) > -1;
        } else {
          const itemdata = item.firstName
            ? item.firstName.toUpperCase()
            : "".toUpperCase();

          const textdata = searchVal.toUpperCase();
          return itemdata.indexOf(textdata) > -1;
        }
      });
      props.setFilterData(newdata);
    } else {
      props.setFilterData(props.data);
    }
  };

  useEffect(() => {
    console.log(location);
    console.log(data);
    console.log(`data is ${data}`);

    if (
      location.pathname == "/SchoolLogin" ||
      location.pathname == "/AlumniLogin"
    ) {
      if (data == "") {
        navigate("/login");
      }
    }
  }, [location, data]);

  function loginHandler() {
    navigate("/");
  }

  return (
    <Container>
      <div className="innerDiv">
        <div className="leftDiv">
          <div className="logoContainer" onClick={() => navigate("/")}>
            <img src={Logo} style={{ width: "100px", height: "60px" }} />
          </div>
        </div>
        <div className="rightDiv">
          <div className="searchDiv">
            <img
              src={SearchIcon}
              style={{
                width: "20px",
                height: "20px",
                marginLeft: "20px",
                marginRight: "6px",
                borderRadius: "20px",
              }}
            />{" "}
            <input
              id="inputID"
              style={{
                outline: "none",
                backgroundColor: "transparent",
                width: "100%",
              }}
              placeholder="Search"
              className="searchInput"
              onChange={(e) => searchData(e.target.value)}
            />
          </div>

          <div className="loginAndIconDiv">
            {data == "" ? (
              <div className="buttonContainer">
                <button
                  className="headerButtons"
                  onClick={() => navigate("/admin")}
                  style={{ backgroundColor: "white" }}
                >
                  {" "}
                  <h3
                    style={{
                      color: "#0E3746",
                      alignSelf: "center",
                      justifySelf: "center",
                      fontSize: 15,
                      fontWeight: "500",
                    }}
                  >
                    {" "}
                    Admin
                  </h3>
                </button>
                <button
                  className="headerButtons"
                  onClick={() => navigate("/login")}
                >
                  <h3
                    style={{
                      color: "white",
                      alignSelf: "center",
                      justifySelf: "center",
                      fontSize: 15,
                      fontWeight: "500",
                    }}
                  >
                    {" "}
                    Login
                  </h3>
                </button>
              </div>
            ) : (
              <>
                <div
                  className="headerButtons blueButton"
                  onClick={() => {
                    data == "Admin" ? navigate("./AdminPanel") : console.log();
                  }}
                >
                  <h3
                    style={{
                      color: "#0E3746",
                      alignSelf: "center",
                      justifySelf: "center",
                      fontSize: 13,
                      fontWeight: "500",
                    }}
                  >
                    {" "}
                    {username.split("<")[0]}
                  </h3>
                </div>
                <div className="buttonContainer">
                  <div onClick={() => navigate("/")}>
                    {profilepic == "" ? (
                      <img
                        src={
                            username.split("<")[1]
                        }
                        style={{
                          width: "35px",
                          height: "35px",
                          borderRadius: "20px",
                        }}
                      />
                    ) : (
                      <img
                        src={profilepic}
                        style={{
                          width: "35px",
                          height: "35px",
                          borderRadius: "20px",
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => setModalVisible(true)}
                  >
                    <img
                      src={DropDown}
                      style={{
                        marginLeft: "20px",
                        width: "10px",
                        height: "10px",
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        style={{
          overlay: {
            backdropFilter: "blur(none)",
          },
          content: {
            position: "absolute",
            top: "5%",
            left: "90%",
            right: "auto",
            width: "7%",
            overflow: "hidden",
            bottom: "78%",
            borderWidth: 0,
            backgroundColor: "transparent",

            outline: "none",
          },
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid #ccc",
            borderRadius: "4px",
            outline: "none",
          }}
        >
          {userType != "SuperAdmin" ? (
            <div
              style={{
                minWidth: "100%",
                height: "50%",
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #ccc",
                justifyContent: "space-evenly",
                cursor: "pointer",
              }}
              onClick={() => navigate("/settings")}
            >
              <img src={Settings} style={{ width: "20px", height: "20px" }} />
              <h6 style={{ margin: 0, color: "#0E3746" }}>Settings</h6>
            </div>
          ) : (
            <div
              style={{
                minWidth: "100%",
                height: "50%",
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #ccc",
                justifyContent: "space-evenly",
                cursor: "pointer",
              }}
              onClick={() => navigate("/AdminPanel")}
            >
              <img src={AdminIcon} style={{ width: "20px", height: "20px" }} />
              <h6 style={{ margin: 0, color: "#0E3746" }}>Dashboard</h6>
            </div>
          )}
          <div
            style={{
              width: "100%",
              height: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              cursor: "pointer",
            }}
            onClick={() => {
              dispatch(setProfilePic(""));
              dispatch(setUserData(""));
              dispatch(setUserName(""));
              setModalVisible(false);
              dispatch(setLogedinEmail(""));
              navigate("/");
            }}
          >
            <img src={LogOut} style={{ width: "20px", height: "20px" }} />

            <h6 style={{ margin: 0, color: "#0E3746" }}>Logout</h6>
          </div>
        </div>
      </Modal>
    </Container>
  );
}

export default Header;

const Container = styled.div`
  height: 12vh;
  width: 100%;
  border-bottom: 1px solid #dadde1;

  .innerDiv {
    height: 100%;
    width: 96%;
    margin-inline: 2%;
    display: flex;
  }
  .leftDiv {
    width: 25%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .imgDiv {
    height: 60%;
    width: 15%;
    border-radius: 70%;
    overflow: hidden;
  }
  .logoCotainer {
    height: 60%;
    width: 25%;
  }
  .userImg {
    width: 100%;
    height: 100%;
  }
  #inputID::placeholder {
    color: #0e3746;
    font-size: 15px;
    opacity: 1;
  }
  .rightDiv {
    height: 100%;
    width: 75%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .searchDiv {
    width: 50%;
    height: 55%;
    display: flex;
    align-items: center;
    border-radius: 11px;
    background-color: rgba(218, 221, 225, 0.4);
  }
  .searchIcon {
    color: #0e3746;
    margin-inline: 2%;
  }
  .searchInput {
    border-width: 0px;
  }

  .loginAndIconDiv {
    width: 20%;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .buttonContainer {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  .headerButtons {
    background-color: #2291f1;
    height: 60%;
    width: 100%;
    margin-inline: 5px;
    align-items: center;
    display: flex;
    justify-content: center;
    border: 0px;
    border-radius: 5px;
    cursor: pointer;
  }
  .blueButton {
    background-color: white;
    width: 70%;
  }
  .logoContainer {
    cursor: pointer;
  }
`;
