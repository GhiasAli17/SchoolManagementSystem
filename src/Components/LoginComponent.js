import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

import setLogedinEmail, {
  setAlumniSchoolName,
  setUserName,
  setLoginUserType,
  setUserData,
  setKey,
} from "../Redux/actions";

import app from "../firebase";

import { School, Alumni, Lock, Mail } from "../assets/Images/Index";
const db = getDatabase(app);
function LoginComponent(props) {
  const dispatch = useDispatch();

  // get data from redux

  const { data, key, alumnikey } = useSelector(
    (state) => state.persistedReducer
  );
  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [check, setCheck] = useState(false);

  const handleAlumni = () => {
    setUserType("Alumni");
  };
  const handleAdmin = () => {
    setUserType("Admin");
  };
  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);
  const onChangeHandler = (event) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    switch (inputName) {
      case "email":
        setEmail(inputValue);
        break;
      case "password":
        setPassword(inputValue);
        break;
      default:
        console.log("default");
        break;
    }
  };

  function nextHandler(event) {
    if (email == "" || password == "") {
      toast.custom(
        <div
          style={{
            marginTop: "5%",
            width: "100%",
            height: "6vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              alignSelf: "flex-start",
              width: "30%",
              height: "100%",
              borderLeftWidth: "8px",
              borderColor: "red",
              borderStyle: "solid",
              borderBottomWidth: 0,
              borderRightWidth: 0,
              borderTopWidth: 0,
              borderRadius: 5,
              backgroundColor: "#F5F5F5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h3
              style={{
                color: "#515C6F",
                fontFamily: "GraphikMedium",
                fontWeight: "100",
                fontSize: "12px",
              }}
            >
              Kindly fill all the fields
            </h3>
          </div>
        </div>,
        { duration: 1000 }
      );
    } else {
      let role = "";

      if (userType == "Admin") role = "admin";
      else {
        role = "alumni";
      }
      const starCountRef = ref(db, "users/" + role);
      let emailAndPassCheck = false;
      let keyvalue;

      onValue(
        starCountRef,
        (snapshot) => {
          let alumniEmail, alumniPassword;
          let approveCheck = false;
          let SchoolName = "";
          snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            console.log("child data Login", childData);
            dispatch(setUserData(childData));
            if (email == childData.email && password == childData.password) {
              alumniEmail = childData.email;
              dispatch(setUserName(childData.firstName));
              alumniPassword = childData.password;
              keyvalue = childKey;
              approveCheck = childData.approve;
              onValue(
                ref(db, "users/" + role + "/" + childKey + "/schoolInfo"),
                (innerSnapShot) => {
                  innerSnapShot.forEach((innerChildSnapshot) => {
                    SchoolName = innerChildSnapshot.val();
                  });
                  console.log(`data is this ${innerSnapShot}`);
                }
              );

              // SchoolName = childData.schoolName;
            }
            if (email == childData.email) {
              alumniEmail = childData.email;
            }
            if (password == childData.password) {
              alumniPassword = childData.password;
            }

            // ...
          });
          if (alumniEmail == email) {
            if (alumniPassword == password) {
              if (userType == "Alumni") {
                if (approveCheck) {
                  dispatch(setLogedinEmail(email));
                  dispatch(setAlumniSchoolName(SchoolName));
                  dispatch(setLoginUserType("Alumni"));
                  navigate("/AlumniLogin");
                } else {
                  console.log("Sorry!, you are not approved");
                  toast.custom(
                    <div
                      style={{
                        marginTop: "3%",
                        width: "100%",
                        height: "6vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "flex-start",
                          width: "30%",
                          height: "100%",
                          borderLeftWidth: "8px",
                          borderColor: "red",
                          borderStyle: "solid",
                          borderBottomWidth: 0,
                          borderRightWidth: 0,
                          borderTopWidth: 0,
                          borderRadius: 5,
                          backgroundColor: "#F5F5F5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <h3
                          style={{
                            color: "#515C6F",
                            fontFamily: "GraphikMedium",
                            fontWeight: "100",
                            fontSize: "12px",
                          }}
                        >
                          You are not approved
                        </h3>
                      </div>
                    </div>,
                    { duration: 1000 }
                  );
                }
              } else {
                if (approveCheck) {
                  dispatch(setLogedinEmail(email));

                  dispatch(setKey(keyvalue));
                  dispatch(setLoginUserType("Admin"));

                  navigate("/SchoolLogin");
                } else {
                  console.log("Sorry!, you are not approved");
                  toast.custom(
                    <div
                      style={{
                        marginTop: "3%",
                        width: "100%",
                        height: "6vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "flex-start",
                          width: "30%",
                          height: "100%",
                          borderLeftWidth: "8px",
                          borderColor: "red",
                          borderStyle: "solid",
                          borderBottomWidth: 0,
                          borderRightWidth: 0,
                          borderTopWidth: 0,
                          borderRadius: 5,
                          backgroundColor: "#F5F5F5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <h3
                          style={{
                            color: "#515C6F",
                            fontFamily: "GraphikMedium",
                            fontWeight: "100",
                            fontSize: "12px",
                          }}
                        >
                          You are not approved
                        </h3>
                      </div>
                    </div>,
                    { duration: 1000 }
                  );
                }
              }
            }
          }
          if (alumniPassword == password) {
            if (alumniEmail == email) {
              if (userType == "Alumni") {
                if (approveCheck) {
                  dispatch(setAlumniSchoolName(SchoolName));
                  navigate("/AlumniLogin");
                } else {
                  console.log("Sorry!, you are not approved");
                  toast.custom(
                    <div
                      style={{
                        marginTop: "3%",
                        width: "100%",
                        height: "6vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "flex-start",
                          width: "30%",
                          height: "100%",
                          borderLeftWidth: "8px",
                          borderColor: "red",
                          borderStyle: "solid",
                          borderBottomWidth: 0,
                          borderRightWidth: 0,
                          borderTopWidth: 0,
                          borderRadius: 5,
                          backgroundColor: "#F5F5F5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <h3
                          style={{
                            color: "#515C6F",
                            fontFamily: "GraphikMedium",
                            fontWeight: "100",
                            fontSize: "12px",
                          }}
                        >
                          You are not approved
                        </h3>
                      </div>
                    </div>,
                    { duration: 1000 }
                  );
                }
              } else {
                if (approveCheck) {
                  navigate("/SchoolLogin");
                  dispatch(setKey(keyvalue));
                } else {
                  console.log("Sorry!, you are not approved");
                  toast.custom(
                    <div
                      style={{
                        marginTop: "3%",
                        width: "100%",
                        height: "6vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "flex-start",
                          width: "30%",
                          height: "100%",
                          borderLeftWidth: "8px",
                          borderColor: "red",
                          borderStyle: "solid",
                          borderBottomWidth: 0,
                          borderRightWidth: 0,
                          borderTopWidth: 0,
                          borderRadius: 5,
                          backgroundColor: "#F5F5F5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <h3
                          style={{
                            color: "#515C6F",
                            fontFamily: "GraphikMedium",
                            fontWeight: "100",
                            fontSize: "12px",
                          }}
                        >
                          You are not approved
                        </h3>
                      </div>
                    </div>,
                    { duration: 1000 }
                  );
                }
              }
            }
          }
          if (alumniEmail != email) {
            toast.custom(
              <div
                style={{
                  marginTop: "5%",
                  width: "100%",
                  height: "6vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    alignSelf: "flex-start",
                    width: "30%",
                    height: "100%",
                    borderLeftWidth: "8px",
                    borderColor: "red",
                    borderStyle: "solid",
                    borderBottomWidth: 0,
                    borderRightWidth: 0,
                    borderTopWidth: 0,
                    borderRadius: 5,
                    backgroundColor: "#F5F5F5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <h3
                    style={{
                      color: "#515C6F",
                      fontFamily: "GraphikMedium",
                      fontWeight: "100",
                      fontSize: "12px",
                    }}
                  >
                    email not found
                  </h3>
                </div>
              </div>,
              { duration: 1000 }
            );
          } else if (alumniPassword != password) {
            toast.custom(
              <div
                style={{
                  marginTop: "5%",
                  width: "100%",
                  height: "6vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    alignSelf: "flex-start",
                    width: "30%",
                    height: "100%",
                    borderLeftWidth: "8px",
                    borderColor: "red",
                    borderStyle: "solid",
                    borderBottomWidth: 0,
                    borderRightWidth: 0,
                    borderTopWidth: 0,
                    borderRadius: 5,
                    backgroundColor: "#F5F5F5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <h3
                    style={{
                      color: "#515C6F",
                      fontFamily: "GraphikMedium",
                      fontWeight: "100",
                      fontSize: "12px",
                    }}
                  >
                    Invalid Password
                  </h3>
                </div>
              </div>,
              { duration: 1000 }
            );
          }

          // setCheck(true)
        },
        {
          onlyOnce: false,
        }
      );
    }
    event.preventDefault();
  }

  return (
    <Container>
      <div className="inputsConatiner">
        <img src={Mail} style={{ width: "30px", height: "30px" }} />
        <input
          className="inputDiv"
          style={{ outline: "none" }}
          placeholder="Email"
          name="email"
          value={email}
          onChange={onChangeHandler}
        />
      </div>
      <div className="inputsConatiner">
        <img src={Lock} style={{ width: "30px", height: "30px" }} />
        <input
          className="inputDiv"
          style={{ outline: "none" }}
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChangeHandler}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          flexDirection: "row",
          marginTop: "30px",
          marginBottom: "30px",

          width: "70%",
        }}
      >
        <div style={{ flexDirection: "row" }}>
          <input
            style={{ cursor: "pointer", outline: "none" }}
            type="checkbox"
            id="topping"
            name="topping"
            value={userType}
            checked={userType == "Admin"}
            onChange={handleAdmin}
          />
          <img
            src={School}
            style={{ marginInline: "12px", width: "15px", height: "15px" }}
          />
          <h5 style={{ color: "#2291F1" }}>School</h5>
        </div>
        <div style={{ flexDirection: "row" }}>
          <input
            style={{ cursor: "pointer", outline: "none" }}
            type="checkbox"
            id="topping"
            name="topping"
            value={userType}
            checked={userType == "Alumni"}
            onChange={handleAlumni}
          />
          <img
            src={Alumni}
            style={{ marginInline: "12px", width: "15px", height: "15px" }}
          />
          <h5 style={{ color: "#2291F1" }}>Alumni</h5>
        </div>
      </div>
      <button
        className="inputsConatiner button blueBack"
        onClick={() => nextHandler()}
        style={{ cursor: "pointer" }}
      >
        <h3 className="whiteText">Login</h3>
      </button>

      <Toaster />
    </Container>
  );
}

export default LoginComponent;

const Container = styled.div`
  //background-color: green;
  height: 75vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;

  .inputsConatiner {
    height: 10%;
    width: 60%;
    display: flex;
    align-items: center;
    margin-top: 20px;
    justify-content: space-between;
  }
  .select {
    justify-content: flex-start;
  }
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: white;
    border: 1px solid #2291f1;
  }
  .blueBack {
    background-color: #2291f1;
  }
  .whiteText {
    color: white;
  }
  .blueText {
    color: #2291f1;
  }
  .inputDiv {
    height: 100%;
    padding-inline: 10px;
    width: 80%;
    display: flex;
    justify-content: center;
    padding-left: 20px !important;
    border-radius: 7px;
    border: 1px solid rgba(218, 221, 225, 0.4);
  }
  .inputDiv::placeholder {
    color: rgba(14, 55, 70, 0.4);
    opacity: 1;
  }
`;
