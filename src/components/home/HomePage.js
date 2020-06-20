import React from 'react'
import Card from '../card/Card'
import styles from './home.module.css'
import { connect } from 'react-redux'
import {removeCharacterAction,addToFavsAction} from './../../redux/charsDuck'


const Home = ({chars, removeCharacterAction, addToFavsAction}) => {


    const renderCharacter = () => {
         let char = chars[0]
        return (
            <Card leftClick={nextCharacter} rightClick={faveCharacter} {...char}/>
        )
    }

    const nextCharacter = () => {
        removeCharacterAction()
    }

    const faveCharacter = () => {
        addToFavsAction()
    }

    return (
        <div className={styles.container}>
            <h2>Personajes de Rick y Morty</h2>
            <div>
                {renderCharacter()}
            </div>
        </div>
    )
}

const mapState = (state) => {
    return {
        chars:state.characters.charsArr
    }
}

export default connect(mapState, {removeCharacterAction,addToFavsAction})(Home)

