import axios from 'axios'
import { updateDB, getFavs} from './../firebase'
import ApolloClient, { gql } from 'apollo-boost'
// Const
const initialData= {
    fetching:false,
    charsArr:[],
    current:{},
    favorites:[],
    nextPage:1
}

const URL = "https://rickandmortyapi.com/api/character"

let client = new ApolloClient({
    uri:"https://rickandmortyapi.com/graphql"
})

const GET_CHARACTERS = "GET_CHARACTERS"
const GET_CHARACTERS_SUCCESS = "GET_CHARACTERS_SUCCESS"
const GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR"

const REMOVE_CHARACTER = "REMOVE_CHARACTER"
const ADD_TO_FAVORITES = "ADD_TO_FAVORITES"

const GET_FAVS = "GET_FAVS"
const GET_FAVS_SUCCESS = "GET_FAVS_SUCCESS"
const GET_FAVS_ERROR = "GET_FAVS_ERROR"

const GET_FAVS_LOCALE = "GET_FAVS_LOCALE"
const UPDATE_PAGE = "UPDATE_PAGE"

// Reducers

export default function reducer(state = initialData, action){
    switch(action.type){
        case GET_CHARACTERS:
            return {...state, fetching: true}
        case GET_CHARACTERS_ERROR:
            return {...state, fetching: false, error: action.payload}
        case GET_CHARACTERS_SUCCESS:
            return {...state, charsArr: action.payload, fetching:false}
        case REMOVE_CHARACTER:
            return {...state, charsArr:action.payload}
        case ADD_TO_FAVORITES:
            return {...state, ...action.payload}
        case GET_FAVS:
            return {...state, fetching:true}
        case GET_FAVS_ERROR:
            return {...state, fetching: false, error: action.payload}
        case GET_FAVS_SUCCESS:
            return {...state, favorites: action.payload, fetching:false}
        case GET_FAVS_LOCALE:
            return {...state, fetching:false , favorites: action.payload}
        case UPDATE_PAGE:
            return {...state, nextPage: action.payload}
        default:
            return state
    }
}

// actions (thunks)

export let restoreFavoritesAction = () => dispatch => {
    let storage = localStorage.getItem('storage')
    storage = JSON.parse(storage)

    if(storage && storage.user) dispatch({type:GET_FAVS_LOCALE,payload:storage.characters.favorites}) 
}

export let retrieveFavs = () => (dispatch,getState) => {
    dispatch({
        type:GET_FAVS
    })

    let {uid} = getState().user

    return getFavs(uid)
        .then( array => dispatch({
                type:GET_FAVS_SUCCESS,
                payload:[...array]
            })
        )
        
        .catch( err => {
            console.log(err)
            dispatch({
                type:GET_FAVS_ERROR,
                payload:err.message
            })
        })
}

export let addToFavsAction = () => (dispatch,getState) => {
    let {charsArr,favorites} = getState().characters
    let {uid} = getState().user
    let char = charsArr.shift()
    favorites.push(char)
    updateDB(favorites,uid)
    dispatch({
        type:ADD_TO_FAVORITES,
        payload:{ charsArr:[...charsArr], favorites:[...favorites]}
    })
}

export let removeCharacterAction = () => (dispatch, getState) => {
    let {charsArr} = getState().characters
    charsArr.shift()
    if(!charsArr.length){
        getCharactersAction()(dispatch,getState)
    }
    dispatch({
        type: REMOVE_CHARACTER,
        payload: [...charsArr]
    })
}

export const getCharactersAction= () => (dispatch, getState) => {

    let query = gql`
        query ($pake:Int){
            characters(page:$pake){
            info{
                pages
                next
                prev
            }
            results{
                name
                image
            }
            }
        }
    `

    dispatch({type:GET_CHARACTERS})

    let {nextPage} = getState().characters

    return client.query({query,variables:{pake:nextPage}})
    .then(res => {
        dispatch({type: GET_CHARACTERS_SUCCESS, payload: res.data.characters.results})
        dispatch({type: UPDATE_PAGE, payload: res.data.characters.info.next ? res.data.characters.info.next : 1})
    })
    .catch(err => dispatch({type:GET_CHARACTERS_ERROR,payload:err}))


    // return axios.get(URL)
    //     .then(res => dispatch({type:GET_CHARACTERS_SUCCESS,payload:res.data.results}))
    //     .catch(err => dispatch({type:GET_CHARACTERS_ERROR,payload:err}))
        
}
