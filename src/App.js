import logo from './logo.svg';
import './App.css';
import TokenTagger from './componets/TokenTagger';
import DogCard from './componets/DogCard';
import SearchableDropdown from './componets/SearchDropDown';
import {useState, useEffect} from 'react'
import { AuthProvider, useAuth } from './AuthContext';
//import { useAuth } from './Auth';


const BASE_URL = 'https://frontend-take-home-service.fetch.com'

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "honeydew", label: "Honeydew" },
  { value: "kiwi", label: "Kiwi" },
  { value: "lemon", label: "Lemon" },
  { value: "mango", label: "Mango" },
  { value: "nectarine", label: "Nectarine" },
  { value: "orange", label: "Orange" },
  { value: "papaya", label: "Papaya" },
]


const params = {
  breeds: [],      // Array of breeds
  zipCodes: [],        // Array of zip codes
  ageMin: null,                           // Minimum age
  ageMax: null,                          // Maximum age
  size: null,                            // Number of results per page (config)
  from: null,                             // Pagination offset (config)
  sort: null                    // Sort order (config)
};



const Main = () => {

  const { isAuthenticated, handleLogout } = useAuth();


  const [selectedOptions, setSelectedOptions] = useState([])
  const [breedList, setBreedList] = useState([])


  const [searchResults, setSearchResults] = useState([])
  const [searchParams, setSearchParams] = useState(params)
  const [dogData, setDogData] = useState([])

  useEffect(() => {

    const abortController = new AbortController();

    const getDogData = async () => {
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/search', {
          method: 'GET',
          credentials: 'include',
          signal: abortController.signal
        });
        const data = await response.json();
        console.log('Dog data:', data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Dog data fetch error:', err);
        }
      }
    };
  
    const getDogBreeds = async () => {
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
          method: 'GET',
          credentials: 'include',
          signal: abortController.signal
        });
        const data = await response.json();
        //console.log('Dog breeds:', data);
        //console.log(data)

        const x = data.map((item) => {
          return {
            value : item,
            label : item
          }
        })

        setBreedList(x)
        
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Breeds fetch error:', err);
        }
      }
    };
  
    // Execute both requests
    const fetchData = async () => {
      try {
        //await getDogData();
        await getDogBreeds();
        
        // If you want to run them in parallel:
        // await Promise.all([getDogData(), getDogBreeds()]);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
  
    fetchData();
  
    // Cleanup function
    return () => {
      abortController.abort();
    };


  }, [])



  const fetchQuery = () => {

    const queryParams = new URLSearchParams();

    const filter = selectedOptions.map((item) => item.value)
    const copy = {...params, breeds : filter}
    //console.log(copy)
    console.log(filter)
    setSearchParams(copy)

    searchParams.breeds?.forEach(breed => queryParams.append('breeds', breed));

    searchParams.zipCodes?.forEach(zip => queryParams.append('zipCodes', zip));

// Add other parameters
if (searchParams.ageMin) queryParams.append('ageMin', searchParams.ageMin);
if (searchParams.ageMax) queryParams.append('ageMax', searchParams.ageMax);
if (searchParams.size) queryParams.append('size', searchParams.size);
if (searchParams.from) queryParams.append('from', searchParams.from);
if (searchParams.sort) queryParams.append('sort', searchParams.sort);



    const url = `${BASE_URL}/dogs/search?${queryParams}`




    async function fetchData() {
      try {
          const res = await fetch(url, {
              method: 'GET',
              credentials: 'include'
          });
  
          if (!res.ok) throw new Error(`Error: ${res.status}`);
  
          const data = await res.json(); // Extract data from first fetch
  
          // Use extracted data to make the second fetch
          const diffRes = await fetch(`${BASE_URL}/dogs`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json', // Specify JSON data type
              },
              body: JSON.stringify(data.resultIds),
              credentials: 'include'
          });
  
          if (!diffRes.ok) throw new Error(`Error: ${diffRes.status}`);
  
          const diffData = await diffRes.json();
          
          console.log(diffData); // Handle or return the data
          setDogData(diffData)
  
      } catch (error) {
          console.error('Fetch error:', error);
      }
  }
  
  fetchData();


  //   console.log(url)
  //   fetch(url, {
        
  //     method: 'GET',
  //     credentials: 'include' 
        
  // })
  //   .then(res => res.json())
  //   .then(res => {

  //     fetch(diffurl)
  //     .then()
  //   })
   
  }

  

  return (
    <div>


       <div>

       {isAuthenticated ? (
  <>
    <p>testsdsfs</p>
    <button onClick={handleLogout}>Logout</button>
    {/* <TokenTagger />
    <DogCard /> */}
    <SearchableDropdown options={breedList} onChange={setSelectedOptions} />

    <div>

      <button onClick={fetchQuery}>Search</button>


      {dogData.length !== 0 && (
        dogData.map((item) => <DogCard {...item}/>)
      )}


    </div>
  </>
) : (
  <Login />
)}
        
      </div>

    </div>
  )
}



const Login = () => {






//     const handleSubmit = () => {


//       fetch('https://frontend-take-home-service.fetch.com/auth/login', {
// method: 'POST',
// headers: {
//   'Content-Type': 'application/json', // Specify JSON data type
// },
// body: JSON.stringify({ // Convert object to JSON string
//   name: 'testingM123',
//   email: 'testing@yahoo.com',

//   //fake : 'fakedata'
// }),
// credentials: 'include'
// })
// .then(res => {
//     //console.log(response)
//     //console.log(res.headersList)
   
//   return res.json()
//   //return res

// }) // Parse JSON response
// .then(data => console.log('Success:', data))
// .catch(error => {
//     console.error('Error:', error)
//       console.log("wtf")
//       console.log(error)
// });


  //}

  const { handleLogin } = useAuth();
  const [credentials, setCredentials] = useState({
    name: 'testingM123',
    email: 'testing@yahoo.com'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await handleLogin(credentials);
      if (!success) {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };
  


  return (

    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            //required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            //required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-button">Sign In</button>
      </form>
    </div>
    
  )
}

function App() {




  
  


  return (
    <div className="container">

      <AuthProvider>

        <Main/>
      </AuthProvider>
      
    </div>
  );
}

export default App;
