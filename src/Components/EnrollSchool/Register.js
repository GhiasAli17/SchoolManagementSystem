import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";

import app from "../../firebase";
import { setKey } from "../../Redux/actions";
import { User, Mail, Lock  , Succes, Fail, Cancel} from "../../assets/Images/Index";

const db = getDatabase(app);

function Register(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [emailCheck, setEmailCheck] = useState(false);

  const [alreadyRegisteredEmails, setAlreadyRegisteredEmails] = useState([]);
  var emailist = [];

  useEffect(() => {
    onValue(
      ref(db, "users/admin"),
      (snapshot) => {
        emailist = [];
        snapshot.forEach((childSnapshot) => {
          emailist.push(childSnapshot.val().email);
          setAlreadyRegisteredEmails(emailist);
        });
        // setAlreadyRegisteredEmails(emailist);
        console.log("child dfdslskfjsdslkfjsds", alreadyRegisteredEmails);
      },
      {
        onlyOnce: false,
      }
    );
  }, []);

  const onChangeHandler = (event) => {
    console.log("name", event.target.name);
    console.log("value", event.target.value);
    const inputName = event.target.name;
    const inputValue = event.target.value;
    switch (inputName) {
      case "firstName":
        setFirstName(inputValue);
        break;
      case "lastName":
        setLastName(inputValue);
        break;
      case "email":
        for (let i = 0; i < alreadyRegisteredEmails.length; i++) {
          if (inputValue == alreadyRegisteredEmails[i]) {
            setEmailCheck(true);
            setEmail(inputValue);
            break;
          }
        }
        if (!emailCheck) setEmail(inputValue);
        break;
      case "password":
        setPassword(inputValue);
        break;
      case "confirmPass":
        setConfirmPass(inputValue);
        break;
      default:
        console.log("default");
        break;
    }
  };

  function nextHandler() {
    if (
      firstName == "" ||
      lastName == "" ||
      email == "" ||
      password == "" ||
      confirmPass == ""
    ) {
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
            <h6 style={{margin: 0}}>Empty fields</h6>
            <h6 style={{color: '#FF0000', margin: 0}}>Kindly fill all the fields</h6>

          </div>
          <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
          <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>

          </div>
        </div>
      </div>,
        { duration: 1000 }
      );
    } else {
      if (emailCheck) {
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
              <h6 style={{margin: 0}}>Email alreafy registered</h6>
              <h6 style={{color: '#FF0000', margin: 0}}>Kindly Signup with a new Eamil</h6>

            </div>
            <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
            <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>

            </div>
          </div>
        </div>,
          { duration: 1000 }
        );
      } else {
        if (password != confirmPass) {
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
                <h6 style={{margin: 0}}>Password's not match</h6>
                <h6 style={{color: '#FF0000', margin: 0}}>password should be same</h6>

              </div>
              <div style={{width: '10%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
              <img src={Cancel} style={{width: '40%', height: '40%', borderRadius: '60px', overflow: 'hidden'}}/>

              </div>
            </div>
          </div>,
            { duration: 1000 }
          );
        } else {
          var val = "School Information";

          ////////////////////////////////

          onValue(
            ref(db, "users/admin"),
            (snapshot) => {
              snapshot.forEach((childSnapshot) => {
                console.log("child dfdslkfjdslkfjds", childSnapshot);
              });
            },
            {
              onlyOnce: false,
            }
          );

          /////////////////////////////

          var key = push(ref(db, "users/admin"), {
            firstName,
            lastName,
            email,
            password,
            confirmPass,
            approve: false,
            imageUri: "",
          });

          console.log("key", key.key);
          props.ongetval(key.key);
          dispatch(setKey(key.key));

          props.onClick(val);
        }
      }
    }
  }

  const InputsList = [
    {
      id: 1,
      image: User,
      value: firstName,
      name: "firstName",
      onch: onChangeHandler,
      ph: "Enter Firstname",
    },
    {
      id: 2,
      image: User,
      value: lastName,
      name: "lastName",

      onch: onChangeHandler,
      ph: "Enter Lastname",
    },
    {
      id: 3,
      image: Mail,
      value: email,
      name: "email",

      onch: onChangeHandler,
      ph: "Enter Email",
    },
    {
      id: 4,
      image: Lock,
      value: password,
      name: "password",

      onch: onChangeHandler,
      ph: "Enter Password",
    },
    {
      id: 5,
      image: Lock,
      value: confirmPass,
      name: "confirmPass",

      onch: onChangeHandler,
      ph: "Confirm Password",
    },
  ];

  return (
    <Container>
      {InputsList.map((item) => {
        return (
          <div id={item.id} className="inputsConatiner">
            <img className="ledtIcon" src={item.image} style={{ width: "25px", height: "25px" }} />
            {item.name == "password" || item.name == "confirmPass" ? (
              <input
                className="inputDiv"
                type="password"
                style={{ outline: "none" }}
                placeholder={item.ph}
                name={item.name}
                value={item.value}
                onChange={item.onch}
              />
            ) : (
              <input
                className="inputDiv"
                style={{ outline: "none" }}
                placeholder={item.ph}
                name={item.name}
                value={item.value}
                onChange={item.onch}
              />
            )}
          </div>
        );
      })}

      <button
        className="inputsConatiner button blueBack"
        onClick={() => nextHandler()}
      >
        <h3 className="whiteText"> Next</h3>
      </button>
      <button
        className="inputsConatiner button"
        style={{ marginTop: -20 }}
        onClick={() => navigate(-1)}
      >
        <h3 className="blueText">Back</h3>
      </button>
      <Toaster />
    </Container>
  );
}

export default Register;

const Container = styled.div`
  //background-color: green;
  height: 75vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  .inputsConatiner {
    height: 10%;
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: white;
    border: 1px solid #2291f1;
    border-radius: 5px;
  }
  .blueBack {
    background-color: #2291f1;
    border-radius: 5px;
    box-shadow: 0 0px 15px #2190f0;
    margin-bottom: 5px;
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
    border-radius: 5px;
    border: 0;
    background-color: rgba(218, 221, 225, 0.4);
  }
  // .ledtIcon {
  //   border: 2px solid #f0f1f3;
  //   padding: 9px;
  //   border-radius: 5px;
  // }
  .inputDiv::placeholder {
    color: rgba(14, 55, 70, 0.4);
    opacity: 1;
  }
`;
