import "./styles.scss";
//import { FaBeer } from 'react-icons/fa';
import { FaRegHeart } from "react-icons/fa";
import { zip } from "lodash";

const DogCard = (props) => {
  const { id, img, name, age, zip_code, breed, handleFavorites } = props;

  const dogobject = {
    id: id,
    name: name,
    age: age,
    breed: breed,
    zip_code: zip_code,
    img: img,
  };

  return (
    <div className="dog-card">
      <img src={img} alt="Dog" className="dog-image" />
      <div className="dog-info">
        <h3 className="dog-name">{name}</h3>
        <p className="dog-breed">Breed: {breed}</p>
        <p className="dog-age">Age: {age} years</p>
        <p className="dog-zipcode">Zip Code: {zip_code}</p>
        <button className="favorite-btn" onClick={() => handleFavorites(dogobject)}>
          ❤️ Add to Favorites
        </button>
      </div>
    </div>
  );
};

export default DogCard;
