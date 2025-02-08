import './styles.scss'
//import { FaBeer } from 'react-icons/fa';
import { FaRegHeart } from "react-icons/fa";


const DogCard = ({id, img = 'https://www.akc.org/wp-content/uploads/2017/11/German-Shepherd-on-White-00.jpg', name, age, zip_code, breed}) => {




    return (

        <div className="dogCard">

            
            <img src={img} />
           
            

            <div className="dogInfo">
                <h2>'Santa Paws'</h2>
                <p> Breed : German shepard </p>
                <p>Age: 11 years old</p>
                <p>ZipCode: 10475</p>
                 <FaRegHeart />
            </div>
        </div>
    )
}



export default DogCard