import {
  SET_AMOUNT,
  SET_DATA,
  SET_USE_TYPE,
  SET_KEY,
  SET_ALUMNI_KEY,
  SET_ALUMNI_SCHOOLNAME,
  SET_PROFILE,
  SET_USER_DATA,
  SET_USERNAME,
  SET_APPROVE_STATUS
} from "./actions";
const inittialstate = {
  data: "",
  alumnikey: "",
  key: "",
  alumniSchoolname: "",
  userType: "",
  amount: "",
  profilepic: "",
  userData: "",
  username: "",
  approve : ""
};
function userReducer(state = inittialstate, action) {
  switch (action.type) {
    case SET_DATA:
      console.log(action.payload.data);
      return { ...state, data: action.payload.data };
      case SET_APPROVE_STATUS:
      return { ...state, approve: action.payload.approve };
    case SET_KEY:
      console.log(action.payload.key);
      return { ...state, key: action.payload.key };
    case SET_USERNAME:
      console.log(action.payload.key);
      return { ...state, username: action.payload.username };
    case SET_USER_DATA:
      console.log(action.payload.key);
      return { ...state, userData: action.payload.userData };
    case SET_ALUMNI_KEY:
      console.log(` alumni key  ${action.payload.alumnikey}`);
      return { ...state, alumnikey: action.payload.alumnikey };

    case SET_PROFILE:
      return { ...state, profilepic: action.payload.profilepic };

    case SET_ALUMNI_SCHOOLNAME:
      return { ...state, alumniSchoolname: action.payload.alumniSchoolname };
    case SET_USE_TYPE:
      return { ...state, userType: action.payload.userType };
    case SET_AMOUNT:
      return { ...state, userType: action.payload.amount };
    default:
      return state;
  }
}

export default userReducer;

{
  /* 
    const { index1 } = action.payload;
    alert(index1)
    return {
        
        ...state,
       
        arr: [
            ...state.arr.slice(0, index1),
            ...state.arr.slice(index1 + 1)
        ],
            }
            
            
             case SET_ADDRES_LINE:


            {
                const { name, line, city, state, zip, country } = action.payload;
                //  return { ...state, number: action.payload };

                return {
                    ...state,
                    arr: [...state.arr, {
                        Name: name,
                        line: line,
                        city: city,
                        state: state,
                        zip: zip,
                        country: country
                    }]


                }
            }
            
            */
}
