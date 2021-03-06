import React,{useState} from 'react';
import styled from 'styled-components';
import { getDatabase, ref, set, onValue,push } from "firebase/database";
import app from '../firebase'
const db = getDatabase(app);

function Register(props) {

    const[firstName,setFirstName] = useState('');
    const[lastName,setLastName] = useState('');
    const[email, setEmail] = useState('');
    const[password,setPassword] = useState('');
    const[confirmPass,setConfirmPass] = useState('');

    const onChangeHandler= (event)=>{
        console.log('name',event.target.name);
        const inputName = event.target.name;
        const inputValue = event.target.value;
        switch (inputName){
            case 'firstName':
                setFirstName(inputValue)
                break;
            case 'lastName':
                setLastName(inputValue)
                break;
            case 'email':
                setEmail(inputValue)
                break;
            case 'password':
                setPassword(password)
                break;
            case 'confirmPass':
                setConfirmPass(inputValue)
                break;
            default:
                console.log('default')
                break;

        }
    }



    function nextHandler() {
        var val = "schoolInformation";
        push(ref(db, 'users/admin' ), {
            firstName,
            lastName,
            email,
            password,
            confirmPass
        }).then(()=>{
            console.log('data saved successfully')
        }).catch(err=>{
            console.log(err)
        });

        props.onClick(val);
    }

    return (
        <Container>
            <div className='firstNameLastNameDiv'>
                <div className='firstNameDiv'>
                    <div className='h3Div'>
                        <h3>First Name</h3>
                    </div>
                    <div className='inputDiv'>
                        <input placeholder='enter firstname' name="firstName" value={firstName} onChange={onChangeHandler} />
                    </div>
                </div>
                <div className='lastNameDiv'>
                    <div className='h3Div'>
                        <h3>Last Name</h3>
                    </div>
                    <div className='inputDiv'>
                        <input placeholder='enter lastName' name="lastName" value={lastName} onChange={onChangeHandler}/>
                    </div>
                </div>
            </div>


            <div className='emailMainDiv'>
                <div className='emailDiv'>
                    <div className='h3Div2'>
                        <h3>Email</h3>
                    </div>
                    <div className='emailInputDiv'>
                        <input placeholder='enter email' name="email" value={email} onChange={onChangeHandler} />
                    </div>
                </div>
            </div>

            <div className='emailMainDiv'>
                <div className='emailDiv'>
                    <div className='h3Div2'>
                        <h3>Password</h3>
                    </div>
                    <div className='emailInputDiv'>
                        <input placeholder='enter password' name="password" value={password} onChange={onChangeHandler} />
                    </div>
                </div>
            </div>

            <div className='emailMainDiv'>
                <div className='emailDiv'>
                    <div className='h3Div2'>
                        <h3>Confirm Password</h3>
                    </div>
                    <div className='emailInputDiv'>
                        <input placeholder='enter confirm password'  name="confirmPass" value={confirmPass} onChange={onChangeHandler}/>
                    </div>
                </div>
            </div>

            <div className='btnMainDiv'>
                <div className='btnInnerDiv'>
                    <div className='btnDiv'>
                        <button onClick={()=>nextHandler()}>Next</button>
                    </div>
                    <p>StudentBook does not sell your information to anyone</p>

                </div>

            </div>

        </Container >
    )
}

export default Register;

const Container = styled.div`

//background-color: green;
height: 78vh;
width: 100%;
display: flex;
flex-direction: column;
justify-content: space-between;
.firstNameLastNameDiv {
    //background-color: yellow;
    display: flex;
    height: 18%;
}
.firstNameDiv {
    height: 100%;
    width: 20%;
    //background-color: aqua;
    margin-left: 2%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.lastNameDiv {
    height: 100%;
    width: 20%;
    //background-color: aliceblue;
    margin-left: 2%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.h3Div {
    //background-color: blueviolet;
    height: 50%;
    width: 90%;
    display: flex;
    align-items: center;
}
.inputDiv {
    height: 50%;
    width: 90%;
    //background-color: azure;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 7px;
    border: 1px solid black;
    //border-color: brown;
}
input {
    border: 0px;
}
.emailMainDiv {
    //background-color: yellow;
    height: 18%;
}
.emailDiv {
    //background-color: aqua;
    height: 100%;
    width: 20%;
    margin-left: 2%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.h3Div2 {
    //background-color: blueviolet;
    height: 50%;
    width: 90%;
    display: flex;
    align-items: center;
}
.emailInputDiv {
    //background-color: aliceblue;
    height: 50%;
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 7px;
    border: 1px solid black;
}

.btnMainDiv {
    //background-color: aqua;
    height: 18%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.btnInnerDiv {
    //background-color: red;
    height: 100%;
    width: 94%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.btnDiv {
    //background-color: gray;
    height: 50%;
    width: 16%;
    //border: 1px solid black;
    
}
button {
    background-color: gray;
    height: 100%;
    width: 100%;
    color: white;
    font-size: 20px;
    border-radius: 5px;
    border: 0px;
}




`