import React, { useState } from "react";
import styled from "styled-components";
import { getDatabase, ref, push, onValue } from "firebase/database";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import app from "../../firebase";
import { setAlumniKey } from "../../Redux/actions";
import { User, Mail, Lock } from "../../assets/Images/Index";
import { useEffect } from "react";

const db = getDatabase(app);

function RegisterAlumni(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [alreadyRegisteredEmails, setAlreadyRegisteredEmails] = useState([]);
  var emailist = [];

  useEffect(() => {
    onValue(
      ref(db, "users/alumni"),
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
        let emailCheck = false;
        for (let i = 0; i < alreadyRegisteredEmails.length; i++) {
          if (inputValue == alreadyRegisteredEmails[i]) {
            emailCheck = true;
            break;
          }
        }
        if (!emailCheck) setEmail(inputValue);
        else {
          alert("User is already registered!");
        }
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
      var val = "schoolInformation";

      var alumnikey = push(ref(db, "users/alumni"), {
        firstName,
        lastName,
        email,
        password,
        confirmPass,
        approve: false,
      });
      props.ongetval(alumnikey.key);
      console.log("storing alumni");
      dispatch(setAlumniKey(alumnikey.key));

      props.onClick(val);
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
            <img src={item.image} style={{ width: "25px", height: "25px" }} />
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

export default RegisterAlumni;

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
    width: 60%;
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
    cursor: pointer;
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
    background-color: rgba(218, 221, 225, 0.4);
  }
  .inputDiv::placeholder {
    color: rgba(14, 55, 70, 0.4);
    opacity: 1;
  }
`;
