import React, { useState } from "react";
import styled from "styled-components";
import { getDatabase, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

import { Mail, Lock, RegisterImage } from "../assets/Images/Index";
import {
  setLoginUserType,
  setLogedinEmail,
  setUserName,
} from "../Redux/actions";
import app from "../firebase";
import Header from "../Components/Header";

const db = getDatabase(app);

function AdminLogin() {
  const [component, setcomponent] = useState("register");

  const dispatch = useDispatch();

  // get data from redux

  const { data, key, alumnikey } = useSelector(
    (state) => state.persistedReducer
  );
  console.log(`data ${key}`);
  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("superadmin");
  const [isChecked, setIsChecked] = useState(false);
  const [check, setCheck] = useState(false);

  // const handleAlumni = () => {
  //     setUserType("Alumni");
  // };
  // const handleAppAdmin = () => {
  //     setUserType("AppAdmin");
  // };
  const onChangeHandler = (event) => {
    console.log("name", event.target.name);
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

  function nextHandler() {
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

      // if (userType == "Admin") role = "admin";
      // else {
      //     role = "alumni";
      // }
      role = "superadmin";
      const starCountRef = ref(db, "users/" + role);
      let emailAndPassCheck = false;
      let keyvalue;
      if (email == "admin@gmail.com" && password == "123") {
        dispatch(setLogedinEmail("Admin"));
        dispatch(setUserName("Admin"));
        dispatch(setLoginUserType("SuperAdmin"));

        navigate("/AdminPanel");
      } else {
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
                Sorry, You are not super admin!
              </h3>
            </div>
          </div>,
          { duration: 1000 }
        );
      }
      {
        /*
      onValue(
        starCountRef,
        (snapshot) => {
          let alumniEmail, alumniPassword;
          let approveCheck = false;
          let SchoolName = "";
          if (
            snapshot.val().email == email &&
            snapshot.val().password == password
          ) {
            dispatch(setLogedinEmail("Admin"));
            navigate("/AdminPanel");
          }
          else {
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
                    Sorry, You are not super admin!
                  </h3>
                </div>
              </div>,
              { duration: 1000 }
            );
          }
          console.log("snapdata superadmin", snapshot.val(), "email", email);
          // snapshot.forEach((childSnapshot) => {
          //     const childKey = childSnapshot.key;
          //     const childData = childSnapshot.val();
          //     console.log("child data Login", childKey);
          //
          //     if (email == childData.email && password == childData.password) {
          //         alumniEmail = childData.email;
          //         alumniPassword = childData.password;
          //         keyvalue = childKey;
          //         approveCheck = childData.approve;
          //         onValue(
          //             ref(db, "users/" + role + "/" + childKey + "/schoolInfo"),
          //             (innerSnapShot) => {
          //                 innerSnapShot.forEach((innerChildSnapshot) => {
          //                     console.log("inner snap", innerChildSnapshot.val());
          //                     SchoolName = innerChildSnapshot.val();
          //                 });
          //             }
          //         );
          //
          //         // SchoolName = childData.schoolName;
          //     }
          //     if (email == childData.email) {
          //         alumniEmail = childData.email;
          //     }
          //     if (password == childData.password) {
          //         alumniPassword = childData.password;
          //     }
          //
          //     // ...
          // });
          // if (alumniEmail == email) {
          //     if (alumniPassword == password) {
          //         dispatch(setLogedinEmail(email));
          //         if (userType == "Alumni") {
          //             if (approveCheck) {
          //                 dispatch(setAlumniSchoolName(SchoolName));
          //                 dispatch(setLoginUserType("Alumni"));
          //                 console.log("setAlumniSchoolName", SchoolName);
          //                 navigate("/AdminPanel");
          //             } else {
          //                 console.log("Sorry!, you are not approved");
          //                 toast.custom(
          //                     <div
          //                         style={{
          //                             marginTop: "5%",
          //                             width: "100%",
          //                             height: "6vh",
          //                             display: "flex",
          //                             alignItems: "center",
          //                             justifyContent: "flex-start",
          //                         }}
          //                     >
          //                         <div
          //                             style={{
          //                                 alignSelf: "flex-start",
          //                                 width: "30%",
          //                                 height: "100%",
          //                                 borderLeftWidth: "8px",
          //                                 borderColor: "red",
          //                                 borderStyle: "solid",
          //                                 borderBottomWidth: 0,
          //                                 borderRightWidth: 0,
          //                                 borderTopWidth: 0,
          //                                 borderRadius: 5,
          //                                 backgroundColor: "#F5F5F5",
          //                                 display: "flex",
          //                                 alignItems: "center",
          //                                 justifyContent: "center",
          //                             }}
          //                         >
          //                             <h3
          //                                 style={{
          //                                     color: "#515C6F",
          //                                     fontFamily: "GraphikMedium",
          //                                     fontWeight: "100",
          //                                     fontSize: "12px",
          //                                 }}
          //                             >
          //                                 You are not approved
          //                             </h3>
          //                         </div>
          //                     </div>,
          //                     { duration: 1000 }
          //                 );
          //             }
          //         } else {
          //             dispatch(setKey(keyvalue));
          //             dispatch(setLoginUserType("Admin"));
          //
          //             navigate("/AdminPanel");
          //         }
          //     }
          // }
          // if (alumniPassword == password) {
          //     if (alumniEmail == email) {
          //         if (userType == "Alumni") {
          //             if (approveCheck) {
          //                 console.log("sch", SchoolName);
          //                 dispatch(setAlumniSchoolName(SchoolName));
          //                 navigate("/AlumniLogin");
          //             } else {
          //                 console.log("Sorry!, you are not approved");
          //                 toast.custom(
          //                     <div
          //                         style={{
          //                             marginTop: "5%",
          //                             width: "100%",
          //                             height: "6vh",
          //                             display: "flex",
          //                             alignItems: "center",
          //                             justifyContent: "flex-start",
          //                         }}
          //                     >
          //                         <div
          //                             style={{
          //                                 alignSelf: "flex-start",
          //                                 width: "30%",
          //                                 height: "100%",
          //                                 borderLeftWidth: "8px",
          //                                 borderColor: "red",
          //                                 borderStyle: "solid",
          //                                 borderBottomWidth: 0,
          //                                 borderRightWidth: 0,
          //                                 borderTopWidth: 0,
          //                                 borderRadius: 5,
          //                                 backgroundColor: "#F5F5F5",
          //                                 display: "flex",
          //                                 alignItems: "center",
          //                                 justifyContent: "center",
          //                             }}
          //                         >
          //                             <h3
          //                                 style={{
          //                                     color: "#515C6F",
          //                                     fontFamily: "GraphikMedium",
          //                                     fontWeight: "100",
          //                                     fontSize: "12px",
          //                                 }}
          //                             >
          //                                 You are not approved
          //                             </h3>
          //                         </div>
          //                     </div>,
          //                     { duration: 1000 }
          //                 );
          //             }
          //         } else {
          //             navigate("/SchoolLogin");
          //             dispatch(setKey(keyvalue));
          //         }
          //     }
          // }
          // if (alumniEmail != email) {
          //     toast.custom(
          //         <div
          //             style={{
          //                 marginTop: "5%",
          //                 width: "100%",
          //                 height: "6vh",
          //                 display: "flex",
          //                 alignItems: "center",
          //                 justifyContent: "flex-start",
          //             }}
          //         >
          //             <div
          //                 style={{
          //                     alignSelf: "flex-start",
          //                     width: "30%",
          //                     height: "100%",
          //                     borderLeftWidth: "8px",
          //                     borderColor: "red",
          //                     borderStyle: "solid",
          //                     borderBottomWidth: 0,
          //                     borderRightWidth: 0,
          //                     borderTopWidth: 0,
          //                     borderRadius: 5,
          //                     backgroundColor: "#F5F5F5",
          //                     display: "flex",
          //                     alignItems: "center",
          //                     justifyContent: "center",
          //                 }}
          //             >
          //                 <h3
          //                     style={{
          //                         color: "#515C6F",
          //                         fontFamily: "GraphikMedium",
          //                         fontWeight: "100",
          //                         fontSize: "12px",
          //                     }}
          //                 >
          //                     email not found
          //                 </h3>
          //             </div>
          //         </div>,
          //         { duration: 1000 }
          //     );
          // } else if (alumniPassword != password) {
          //     toast.custom(
          //         <div
          //             style={{
          //                 marginTop: "5%",
          //                 width: "100%",
          //                 height: "6vh",
          //                 display: "flex",
          //                 alignItems: "center",
          //                 justifyContent: "flex-start",
          //             }}
          //         >
          //             <div
          //                 style={{
          //                     alignSelf: "flex-start",
          //                     width: "30%",
          //                     height: "100%",
          //                     borderLeftWidth: "8px",
          //                     borderColor: "red",
          //                     borderStyle: "solid",
          //                     borderBottomWidth: 0,
          //                     borderRightWidth: 0,
          //                     borderTopWidth: 0,
          //                     borderRadius: 5,
          //                     backgroundColor: "#F5F5F5",
          //                     display: "flex",
          //                     alignItems: "center",
          //                     justifyContent: "center",
          //                 }}
          //             >
          //                 <h3
          //                     style={{
          //                         color: "#515C6F",
          //                         fontFamily: "GraphikMedium",
          //                         fontWeight: "100",
          //                         fontSize: "12px",
          //                     }}
          //                 >
          //                     Invalid Password
          //                 </h3>
          //             </div>
          //         </div>,
          //         { duration: 1000 }
          //     );
          // }

          // setCheck(true)
        },
        {
          onlyOnce: false,
        }
      );
      */
      }
    }
  }

  return (
    <>
      <Header />
      <Container>
        <div className="leftChild">
          <h3 style={{ fontFamily: "Poppins", fontSize: "30px", margin: "0 auto", fontWeight: "500", paddingTop: "20px", color: "#0E3746", }}>Admin Login</h3>
          <div className="loginComponent">
            <div className="inputsConatiner">
              <img className="ledtIcon" src={Mail} style={{ width: "25px", height: "25px" }} />
              <input
                className="inputDiv"
                style={{ outline: "none" }}
                placeholder="enter email"
                name="email"
                value={email}
                onChange={onChangeHandler}
              />
            </div>
            <div className="inputsConatiner">
              <img className="ledtIcon" src={Lock} style={{ width: "25px", height: "25px" }} />
              <input
                className="inputDiv"
                style={{ outline: "none" }}
                type="password"
                placeholder="enter password"
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
                width: "70%",
              }}
            ></div>
            <button
              style={{ width: "80%", cursor: "pointer", height: "40px", borderRadius: "5px", boxShadow: "0 0px 15px #2190f0", marginTop:"70px" }}
              className="inputsConatiner button blueBack"
              onClick={() => nextHandler()}
            >
              <h3 className="whiteText">Login</h3>
            </button>

            <Toaster />
          </div>
        </div>
      </Container>
    </>
  );
}

export default AdminLogin;

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 40px;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .loginComponent {
    height: 75vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-top: 20px;
    padding-top: 0;
  }
  .inputsConatiner {
    height: 14%;
    width: 80%;
    display: flex;
    align-items: center;
    margin-top: 5%;
    justify-content: space-between;
    border-radius: 10px;
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
    height: 42px;
    padding-inline: 10px;
    width: 80%;
    display: flex;
    justify-content: center;
    padding-left: 20px !important;
    border-radius: 7px;
    border: 1px solid rgba(218, 221, 225, 0.4);
    background-color: rgba(218, 221, 225, 0.4);
  }
  .inputDiv::placeholder {
    color: rgba(14, 55, 70, 0.4);
    opacity: 1;
  }
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
    width: 40vw;
    align-self: flex-end;
    height: 100vh;
    object-fit: cover;
  }
  .leftChild {
    height: 60%;
    width: 40%;
    padding-top: 1%;
    padding-left: 1%;
    display: flex;
    border: 2px solid rgba(218, 221, 225, 0.4);
    border-radius: 10px;
    flex-direction: column;
    box-shadow: 0 5px 30px #dcdcdc;
  }
  .rightChild {
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .ledtIcon {
    border: 2px solid #f0f1f3;
    padding: 9px;
    border-radius: 5px;
  }
`;
