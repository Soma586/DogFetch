import './styles.scss'
//import { FaBeer } from 'react-icons/fa';
import { FaRegHeart } from "react-icons/fa";
import { zip } from 'lodash';


const DogCard = (props) => {


    const {

        id, 
        img = 'https://www.akc.org/wp-content/uploads/2017/11/German-Shepherd-on-White-00.jpg', 
        name, 
        age, 
        zip_code, 
        breed,
        handleFavorites
    } = props

    const dogobject = {

        id: id,
        name : name,
        age : age,
        breed : breed,
        zip_code : zip_code,
        img : img
    }
//pass a call back function to handlefavorits functions and if so it should turn 

    // const handleFavoirite = () => {


    //     sessionStorage.setItem(id, JSON.stringify(props))
    // }


    return (

        // <div className="dogCard">

            
        //     <img src={img} />
           
            

        //     <div className="dogInfo">
        //         <h2>{name}</h2>
        //         <p> Breed : {breed} </p>
        //         <p>Age: {age} years old</p>
        //         <p>ZipCode: {zip_code}</p>
        //          <FaRegHeart />
        //          <button onClick={() =>handleFavorites(dogobject)}>Hit me to favorite</button>
        //     </div>
        // </div>


        <div class="dog-card">
  <img src={img} alt="Dog" class="dog-image"/>
  <div class="dog-info">
    <h3 class="dog-name">{name}</h3>
    <p class="dog-breed">Breed: {breed}</p>
    <p class="dog-age">Age: {age} years</p>
    <p class="dog-zipcode">Zip Code: {zip_code}</p>
    <button class="favorite-btn" onClick={() =>handleFavorites(dogobject)}>❤️ Add to Favorites</button>
  </div>
</div>
        
    )
}



export default DogCard