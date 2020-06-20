import React , {useEffect, useState }from 'react';
import Card from '../card/Card';
import styles from './home.module.css'
import { gql } from 'apollo-boost'
import { useQuery} from 'react-apollo'


const GraphHome = () => {

    let [chars,setChars] = useState([])

    let query = gql`
        {
            characters{
                results{
                    name
                  image
                }
              }
        }
    `
    let {data,loading,error} = useQuery(query)

    useEffect(()=>{
        if(data && !loading && !error){
            setChars([...data.characters.results])
        }
    },[data,loading,error])
    
    if(loading) return <h2>cargando...</h2>
    
    const nextCharacter = () => {
        chars.shift()
        setChars([...chars])
    }

    const renderCharacter = () => {
        
       return (
        //    <Card  rightClick={faveCharacter} {...char}/>
           <Card leftClick={nextCharacter} {...chars[0]} />
       )
   }


//    const faveCharacter = () => {
//        addToFavsAction()
//    }

   return (
       <div className={styles.container}>
           <h2>Personajes de Rick y Morty</h2>
           <div>
               {renderCharacter()}
           </div>
       </div>
   )
    
}

export default GraphHome;