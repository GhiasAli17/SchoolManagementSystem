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
  setApprove
} from "../Redux/actions";

import app from "../firebase";

import { School, Alumni, Lock, Mail, Succes, Fail, Cancel} from "../assets/Images/Index";
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
              approveCheck = childData.approve;

              if(childData.approve == true)
              {
                alumniEmail = childData.email;
                dispatch(setUserName(childData.firstName + "<" + childData.imageUri.imageUri));
                alumniPassword = childData.password;
                keyvalue = childKey;
                onValue(
                  ref(db, "users/" + role + "/" + childKey + "/schoolInfo"),
                  (innerSnapShot) => {
                    innerSnapShot.forEach((innerChildSnapshot) => {
                      SchoolName = innerChildSnapshot.val();
                    });
                    console.log(`data is this ${innerSnapShot}`);
                  }
                );
  
              }
            
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
                if (approveCheck == true) {
                  dispatch(setLogedinEmail(email));
                  dispatch(setAlumniSchoolName(SchoolName));
                  dispatch(setLoginUserType("Alumni"));
                  dispatch(setApprove('Accepted'))
                  toast.custom(
                    <div
                      style={{
                        marginTop: "2%",
                        marginLeft: '12%',
                        width: "100%",
                        height: "8vh",
                        borderRadius: '20px',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: "30%",
                          height: "100%",
                          borderRadius: '30px',
                          borderWidth: '1px',
                          borderColor: '#F5F5F5',
                          borderStyle: "solid",
                          backgroundColor: "white",
                          display: "flex",
                          alignItems: "center",
                          paddingInline: '5px',
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center',borderRadius: '50px', backgroundColor: 'rgba(32, 227, 0, 0.14)', width: '11%', height: '75%'}}>
                          <img src={Succes} style={{width: '60%', height: '60%', borderRadius: '60px', overflow: 'hidden'}}/>
                           </div>
                        <div style={{width: '70%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'center'}}>
                          <h6 style={{margin: 0}}>Login Succefull</h6>
                          <h6 style={{color: '#20E300', margin: 0}}>Thanks for login into your account</h6>
      
                        </div>
                        <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                        <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>
      
                        </div>
                      </div>
                    </div>,
                    { duration: 1000 }
                  );
                  navigate("/AlumniLogin");
                } 
                else {
                  if(approveCheck == false)
                  {
                    dispatch(setLogedinEmail(email));
                  dispatch(setAlumniSchoolName(SchoolName));
                  dispatch(setLoginUserType("Alumni"));
                  dispatch(setApprove('Pending'))
                  toast.custom(
                    <div
                      style={{
                        marginTop: "2%",
                        marginLeft: '12%',
                        width: "100%",
                        height: "8vh",
                        borderRadius: '20px',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: "30%",
                          height: "100%",
                          borderRadius: '30px',
                          borderWidth: '1px',
                          borderColor: '#F5F5F5',
                          borderStyle: "solid",
                          backgroundColor: "white",
                          display: "flex",
                          alignItems: "center",
                          paddingInline: '5px',
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center',borderRadius: '50px', backgroundColor: 'rgba(32, 227, 0, 0.14)', width: '11%', height: '75%'}}>
                          <img src={Succes} style={{width: '60%', height: '60%', borderRadius: '60px', overflow: 'hidden'}}/>
                           </div>
                        <div style={{width: '70%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'center'}}>
                          <h6 style={{margin: 0}}>Login Succefull</h6>
                          <h6 style={{color: '#20E300', margin: 0}}>Thanks for login into your account</h6>
      
                        </div>
                        <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                        <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>
      
                        </div>
                      </div>
                    </div>,
                    { duration: 1000 }
                  );
                  navigate("/AlumniLogin");
                  
                  }
                  else {
                    toast.custom(
                      <div
                      style={{
                        marginTop: "2%",
                        marginLeft: '12%',
                        width: "100%",
                        height: "8vh",
                        borderRadius: '20px',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: "30%",
                          height: "100%",
                          borderRadius: '30px',
                          borderWidth: '1px',
                          borderColor: '#F5F5F5',
                          borderStyle: "solid",
                          backgroundColor: "white",
                          display: "flex",
                          alignItems: "center",
                          paddingInline: '5px',
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center',borderRadius: '50px', backgroundColor: 'rgba(255, 0, 0, 0.22)', width: '11%', height: '75%'}}>
                          <img src={Fail} style={{width: '60%', height: '60%', borderRadius: '60px', overflow: 'hidden'}}/>
                           </div>
                        <div style={{width: '70%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'center'}}>
                          <h6 style={{margin: 0}}>Your request is Rejected</h6>
                          <h6 style={{color: '#FF0000', margin: 0}}>Kindly create new account</h6>
      
                        </div>
                        <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                        <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>
      
                        </div>
                      </div>
                    </div>,
                      { duration: 1000 }
                    );
                  }
                
                }
              } else {
                if (approveCheck == true) {
                  dispatch(setLogedinEmail(email));

                  dispatch(setKey(keyvalue));
                  dispatch(setLoginUserType("Admin"));
                  dispatch(setApprove('Accepted'))
                  toast.custom(
                    <div
                    style={{
                      marginTop: "2%",
                      marginLeft: '12%',
                      width: "100%",
                      height: "8vh",
                      borderRadius: '20px',
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "30%",
                        height: "100%",
                        borderRadius: '30px',
                        borderWidth: '1px',
                        borderColor: '#F5F5F5',
                        borderStyle: "solid",
                        backgroundColor: "white",
                        display: "flex",
                        alignItems: "center",
                        paddingInline: '5px',
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center',borderRadius: '50px', backgroundColor: 'rgba(255, 0, 0, 0.22)', width: '11%', height: '75%'}}>
                        <img src={Fail} style={{width: '60%', height: '60%', borderRadius: '60px', overflow: 'hidden'}}/>
                         </div>
                      <div style={{width: '70%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'center'}}>
                        <h6 style={{margin: 0}}>Your request is Rejected</h6>
                        <h6 style={{color: '#FF0000', margin: 0}}>Kindly create new account</h6>
    
                      </div>
                      <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                      <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>
    
                      </div>
                    </div>
                  </div>,
                    { duration: 1000 }
                  );
                  navigate("/SchoolLogin");
                }
                else {
                  if(approveCheck == false)
                  {
                    dispatch(setLogedinEmail(email));
                    dispatch(setKey(keyvalue));
                    dispatch(setLoginUserType("Admin"));
                    dispatch(setApprove('pending'))
                    toast.custom(
                      <div
                        style={{
                          marginTop: "2%",
                          marginLeft: '12%',
                          width: "100%",
                          height: "8vh",
                          borderRadius: '20px',
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            width: "30%",
                            height: "100%",
                            borderRadius: '30px',
                            borderWidth: '1px',
                            borderColor: '#F5F5F5',
                            borderStyle: "solid",
                            backgroundColor: "white",
                            display: "flex",
                            alignItems: "center",
                            paddingInline: '5px',
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center',borderRadius: '50px', backgroundColor: 'rgba(32, 227, 0, 0.14)', width: '11%', height: '75%'}}>
                            <img src={Succes} style={{width: '60%', height: '60%', borderRadius: '60px', overflow: 'hidden'}}/>
                             </div>
                          <div style={{width: '70%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'center'}}>
                            <h6 style={{margin: 0}}>Login Succefull</h6>
                            <h6 style={{color: '#20E300', margin: 0}}>Thanks for login into your account</h6>
        
                          </div>
                          <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                          <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>
        
                          </div>
                        </div>
                      </div>,
                      { duration: 1000 }
                    );
                    navigate("/SchoolLogin");
                  
                  }
                  else {
                    toast.custom(
                      <div
                      style={{
                        marginTop: "2%",
                        marginLeft: '12%',
                        width: "100%",
                        height: "8vh",
                        borderRadius: '20px',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: "30%",
                          height: "100%",
                          borderRadius: '30px',
                          borderWidth: '1px',
                          borderColor: '#F5F5F5',
                          borderStyle: "solid",
                          backgroundColor: "white",
                          display: "flex",
                          alignItems: "center",
                          paddingInline: '5px',
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center',borderRadius: '50px', backgroundColor: 'rgba(255, 0, 0, 0.22)', width: '11%', height: '75%'}}>
                          <img src={Fail} style={{width: '60%', height: '60%', borderRadius: '60px', overflow: 'hidden'}}/>
                           </div>
                        <div style={{width: '70%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'center'}}>
                          <h6 style={{margin: 0}}>Your request is Rejected</h6>
                          <h6 style={{color: '#FF0000', margin: 0}}>Kindly create new account</h6>
      
                        </div>
                        <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                        <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>
      
                        </div>
                      </div>
                    </div>,
                      { duration: 1000 }
                    );
                  }
                
                }
              }
            }
          }
          if (alumniPassword == password) {
            if (alumniEmail == email) {
              if (userType == "Alumni") {
                if (approveCheck) {
                  dispatch(setAlumniSchoolName(SchoolName));
                  toast.custom(
                    <div
                      style={{
                        marginTop: "2%",
                        marginLeft: '12%',
                        width: "100%",
                        height: "8vh",
                        borderRadius: '20px',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: "30%",
                          height: "100%",
                          borderRadius: '30px',
                          borderWidth: '1px',
                          borderColor: '#F5F5F5',
                          borderStyle: "solid",
                          backgroundColor: "white",
                          display: "flex",
                          alignItems: "center",
                          paddingInline: '5px',
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center',borderRadius: '50px', backgroundColor: 'rgba(32, 227, 0, 0.14)', width: '11%', height: '75%'}}>
                          <img src={Succes} style={{width: '60%', height: '60%', borderRadius: '60px', overflow: 'hidden'}}/>
                           </div>
                        <div style={{width: '70%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'center'}}>
                          <h6 style={{margin: 0}}>Login Succefull</h6>
                          <h6 style={{color: '#20E300', margin: 0}}>Thanks for login into your account</h6>
      
                        </div>
                        <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                        <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>
      
                        </div>
                      </div>
                    </div>,
                    { duration: 1000 }
                  );
                  navigate("/AlumniLogin");
                  
                } else {
                  console.log("Sorry!, you are not approved");
                  toast.custom(
                    <div
                style={{
                  marginTop: "2%",
                  marginLeft: '12%',
                  width: "100%",
                  height: "8vh",
                  borderRadius: '20px',
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "30%",
                    height: "100%",
                    borderRadius: '30px',
                    borderWidth: '1px',
                    borderColor: '#F5F5F5',
                    borderStyle: "solid",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    paddingInline: '5px',
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center',borderRadius: '50px', backgroundColor: 'rgba(255, 0, 0, 0.22)', width: '11%', height: '75%'}}>
                    <img src={Fail} style={{width: '60%', height: '60%', borderRadius: '60px', overflow: 'hidden'}}/>
                     </div>
                  <div style={{width: '70%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'center'}}>
                    <h6 style={{margin: 0}}>You are not Approve</h6>
                    <h6 style={{color: '#FF0000', margin: 0}}>Kindly request your admin to Approve request</h6>

                  </div>
                  <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                  <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>

                  </div>
                </div>
              </div>,
                    { duration: 1000 }
                  );
                }
              } else {
                if (approveCheck) {
                  toast.custom(
                    <div
                      style={{
                        marginTop: "2%",
                        marginLeft: '12%',
                        width: "100%",
                        height: "8vh",
                        borderRadius: '20px',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: "30%",
                          height: "100%",
                          borderRadius: '30px',
                          borderWidth: '1px',
                          borderColor: '#F5F5F5',
                          borderStyle: "solid",
                          backgroundColor: "white",
                          display: "flex",
                          alignItems: "center",
                          paddingInline: '5px',
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center',borderRadius: '50px', backgroundColor: 'rgba(32, 227, 0, 0.14)', width: '11%', height: '75%'}}>
                          <img src={Succes} style={{width: '60%', height: '60%', borderRadius: '60px', overflow: 'hidden'}}/>
                           </div>
                        <div style={{width: '70%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'center'}}>
                          <h6 style={{margin: 0}}>Login Succefull</h6>
                          <h6 style={{color: '#20E300', margin: 0}}>Thanks for login into your account</h6>
      
                        </div>
                        <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                        <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>
      
                        </div>
                      </div>
                    </div>,
                    { duration: 1000 }
                  );
                  navigate("/SchoolLogin");
                  dispatch(setKey(keyvalue));
                } else {
                  toast.custom(
                    <div
                    style={{
                      marginTop: "2%",
                      marginLeft: '12%',
                      width: "100%",
                      height: "8vh",
                      borderRadius: '20px',
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "30%",
                        height: "100%",
                        borderRadius: '30px',
                        borderWidth: '1px',
                        borderColor: '#F5F5F5',
                        borderStyle: "solid",
                        backgroundColor: "white",
                        display: "flex",
                        alignItems: "center",
                        paddingInline: '5px',
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center',borderRadius: '50px', backgroundColor: 'rgba(255, 0, 0, 0.22)', width: '11%', height: '75%'}}>
                        <img src={Fail} style={{width: '60%', height: '60%', borderRadius: '60px', overflow: 'hidden'}}/>
                         </div>
                      <div style={{width: '70%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'center'}}>
                        <h6 style={{margin: 0}}>You are not Approve</h6>
                        <h6 style={{color: '#FF0000', margin: 0}}>Kindly request Admin to approve your request</h6>
    
                      </div>
                      <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                      <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>
    
                      </div>
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
                  marginTop: "2%",
                  marginLeft: '12%',
                  width: "100%",
                  height: "8vh",
                  borderRadius: '20px',
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "30%",
                    height: "100%",
                    borderRadius: '30px',
                    borderWidth: '1px',
                    borderColor: '#F5F5F5',
                    borderStyle: "solid",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    paddingInline: '5px',
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center',borderRadius: '50px', backgroundColor: 'rgba(255, 0, 0, 0.22)', width: '11%', height: '75%'}}>
                    <img src={Fail} style={{width: '60%', height: '60%', borderRadius: '60px', overflow: 'hidden'}}/>
                     </div>
                  <div style={{width: '70%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'center'}}>
                    <h6 style={{margin: 0}}>Email is inccorect</h6>
                    <h6 style={{color: '#FF0000', margin: 0}}>Kindly check your Email</h6>

                  </div>
                  <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                  <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>

                  </div>
                </div>
              </div>,
              { duration: 1000 }
            );
          } else if (alumniPassword != password) {
            toast.custom(
              <div
                style={{
                  marginTop: "2%",
                  marginLeft: '12%',
                  width: "100%",
                  height: "8vh",
                  borderRadius: '20px',
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "30%",
                    height: "100%",
                    borderRadius: '30px',
                    borderWidth: '1px',
                    borderColor: '#F5F5F5',
                    borderStyle: "solid",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    paddingInline: '5px',
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center',borderRadius: '50px', backgroundColor: 'rgba(255, 0, 0, 0.22)', width: '11%', height: '75%'}}>
                    <img src={Fail} style={{width: '60%', height: '60%', borderRadius: '60px', overflow: 'hidden'}}/>
                     </div>
                  <div style={{width: '70%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'center'}}>
                    <h6 style={{margin: 0}}>Password is inccorect</h6>
                    <h6 style={{color: '#FF0000', margin: 0}}>Kindly check your Password</h6>

                  </div>
                  <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                  <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>

                  </div>
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
        <img className="ledtIcon" src={Mail} style={{ width: "25px", height: "25px" }} />
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
        <img className="ledtIcon" src={Lock} style={{ width: "25px", height: "25px" }} />
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
          justifyContent: "space-between",
          flexDirection: "row",
          marginTop: "30px",
          marginBottom: "30px",
          width: "90%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            marginTop: "30px",
            marginBottom: "30px",
            width: "100%",
          }}
        >
          <div
          className="check"
          >
            <input
              style={{ cursor: "pointer", outline: "none", height: "20px", width: "20px"}}
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
          <div
          className="check"
          >
            <input
              style={{ cursor: "pointer", outline: "none", height: "20px", width: "20px" }}
              type="checkbox"
              id="topping"
              name="topping"
              value={userType}
              checked={userType == "Alumni"}
              onChange={handleAlumni}
            />
            <img
              src={Alumni}
              style={{ marginInline: "10px", width: "15px", height: "15px" }}
            />
            <h5 style={{ color: "#2291F1" }}>Alumni</h5>
          </div>
        </div>
      </div>
      <button
        className="inputsConatiner button blueBack"
        onClick={() => nextHandler()}
        style={{ cursor: "pointer", borderRadius: "5px" }}
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
  margin-top: 30px;

  .inputsConatiner {
    height: 10%;
    width: 90%;
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
    box-shadow: 0 0px 15px #2190f0;
  }
  .whiteText {
    color: white;
  }
  .blueText {
    color: #2291f1;
  }
  .inputDiv {
    height: 100%;
    padding-inline: 20px;
    width: 83%;
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
  //   .ledtIcon {
  //   border: 2px solid #f0f1f3;
  //   padding: 9px;
  //   border-radius: 5px;
  // }
  .check {
    flex-direction: row;
    display: flex;
    align-items: center;
    width: 48%;
    border: 2px solid #f0f1f3;
    border-radius: 5px;
    padding: 0 16px;
    box-sizing: border-box;
  }
  .inputDiv::placeholder {
    color: rgba(14, 55, 70, 0.4);
    opacity: 1;
  }
`;
