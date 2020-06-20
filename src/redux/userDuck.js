import { loginWithGoogle, signOutGoogle} from '../firebase'
import { retrieveFavs } from './charsDuck'
// Const
const LOGIN = "LOGIN"
const LOGIN_SUCCESS = "LOGIN_SUCCESS"
const LOGIN_SUCCESS_LOCALE= "LOGIN_SUCCESS_LOCALE"
const LOGIN_ERROR = "LOGIN_ERROR"
const LOGOUT = "LOGOUT"

let initialData= {
    fetching:false,
    loggedIn: false
}

// Reducers

export default function reducer(state = initialData, action){
    switch(action.type){
        case LOGIN:
            return {...state, fetching:true}
        case LOGIN_SUCCESS:
            return {...state, fetching:false, loggedIn:true, ...action.payload}
        case LOGIN_SUCCESS_LOCALE:
            return {...state, fetching:false, loggedIn:true, ...action.payload}
        case LOGIN_ERROR:
            return {...state, fetching:false, error:action.payload}
        case LOGOUT:
            return {...initialData}
        default:
            return state
    }
}

//aux
const saveStorage = storage => {
    localStorage.storage = JSON.stringify(storage)
}

const deleteStorage = () => localStorage.removeItem('storage')
// action

export let restoreSessionAction = () => dispatch => {
    let storage = localStorage.getItem('storage')
    storage = JSON.parse(storage)

    if(storage && storage.user) dispatch({type:LOGIN_SUCCESS_LOCALE,payload:storage.user}) 
}

export let doGoogleLoginAction = () => (dispatch,getState) => {
    dispatch({type:LOGIN})
    return loginWithGoogle()
    .then(user => {
        dispatch({type:LOGIN_SUCCESS,payload:{
            uid:user.uid,
            displayName:user.displayName,
            email:user.email,
            photoURL:user.photoURL
        }})
        
    })
    .then(x => retrieveFavs()(dispatch,getState))
    .then(x => saveStorage(getState()))
    .catch(err=>{
        console.log(err)
        dispatch({type:LOGIN_ERROR,payload:err.message})
    })
}

export let logOutAction = () => (dispatch,getState) => {
    signOutGoogle()
    dispatch({
        type: LOGOUT
    })
    deleteStorage()
}