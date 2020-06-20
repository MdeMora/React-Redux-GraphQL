import React from 'react'
import { Switch, Route, Redirect} from 'react-router-dom'
import Home from './components/home/HomePage'
import FavPage from './components/favs/FavPage'
import LoginPage from './components/login/LoginPage'
import { connect } from 'react-redux'
import GraphHome from './components/home/GraphHome'

function PrivateRoute({loggedIn,component,path, ...rest}){

    if(loggedIn){
        return <Route path={path} component={component} {...rest}/>
    }
    else{
        return <Redirect to='/login' {...rest}/>
    }
}

function Routes({loggedIn}) {
    return (
        <Switch>
            <PrivateRoute exact path="/" component={Home} loggedIn={loggedIn}/>
            <PrivateRoute path="/favs" component={FavPage} loggedIn={loggedIn} />
            <Route path="/login" component={LoginPage} />
        </Switch>
    )
}

const mapState = ({user:{loggedIn}}) => {
    return {
        loggedIn
    }
}

export default connect(mapState)(Routes)