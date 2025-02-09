
import "./App.scss";
import DogCard from "./componets/DogCard";
import SearchableDropdown from "./componets/SearchDropDown";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BASE_URL } from "./utiltiy";



const DEFAULT_PARAMS = {
  breeds: [], // Array of breeds
  ageMin: "", // Minimum age
  ageMax: "", // Maximum age
  size: null, // Number of results per page (config)
  from: null, // Pagination offset (config)
  sort: "breed:asc", // Sort order (config)
};

const Main = () => {
  const { isAuthenticated, handleLogout } = useAuth(); // Get authentication status

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [breedList, setBreedList] = useState([]);
  const [size, setSize] = useState(25);
  const [minAge, setMinAge] = useState(null);
  const [maxAge, setMaxAge] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchParams, setSearchParams] = useState(DEFAULT_PARAMS);
  const [dogData, setDogData] = useState([]);
  const [hasNext, setHasNext] = useState(null);
  const [hasPrev, setHasPrev] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [favoriteList, setFavoriteList] = useState([]);
  const [yourMatch, setMatch] = useState(null);

  // Fetch dog breeds on component mount (only if authenticated)
  useEffect(() => {
    if (!isAuthenticated) return; // Exit if not authenticated

    const abortController = new AbortController();

    const getDogBreeds = async () => {
      try {
        const response = await fetch(`${BASE_URL}/dogs/breeds`, {
          method: "GET",
          credentials: "include",
          signal: abortController.signal,
        });
        const data = await response.json();

        const x = data.map((item) => ({
          value: item,
          label: item,
        }));
        console.log(x);
        console.log("who let the dogs out");
        setBreedList(x);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Breeds fetch error:", err);
        }
      }
    };

    getDogBreeds();

    // Cleanup function
    return () => {
      abortController.abort();
    };
  }, [isAuthenticated]); // Run only when isAuthenticated changes

  // Fetch dog data when searchParams changes (only if authenticated)
  useEffect(() => {
    if (!isAuthenticated) return; // Exit if not authenticated

    const queryParams = new URLSearchParams();

    searchParams.breeds?.forEach((breed) =>
      queryParams.append("breeds", breed)
    );
    
    if (searchParams.ageMin) queryParams.append("ageMin", searchParams.ageMin);
    if (searchParams.ageMax) queryParams.append("ageMax", searchParams.ageMax);
    if (searchParams.size) queryParams.append("size", searchParams.size);
    if (searchParams.from) queryParams.append("from", searchParams.from);
    if (searchParams.sort) queryParams.append("sort", searchParams.sort);

  
    const url = `${BASE_URL}/dogs/search?${queryParams}`;

    async function fetchData() {
      try {
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json(); // Extract data from first fetch

        data.prev ? setHasPrev(data.prev) : setHasPrev(null);
        data.next ? setHasNext(data.next) : setHasPrev(null);
        // Use extracted data to make the second fetch
        const diffRes = await fetch(`${BASE_URL}/dogs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Specify JSON data type
          },
          body: JSON.stringify(data.resultIds),
          credentials: "include",
        });

        if (!diffRes.ok) throw new Error(`Error: ${diffRes.status}`);

        const diffData = await diffRes.json();
        
        setDogData(diffData);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchData();
  }, [searchParams, isAuthenticated]); // Run only when searchParams or isAuthenticated changes

  const fetchQuery = () => {
    if (!isAuthenticated) return; // Exit if not authenticated

    const filter = selectedOptions.map((item) => item.value);
    const copy = {
      ...DEFAULT_PARAMS,
      breeds: filter,
      ageMin: minAge,
      ageMax: maxAge,
      size,
      sort: `breed:${sortOrder}`,
    };

    setPageCount(1);
    setSearchParams(copy);
  };

  async function fetchData(url) {
    try {
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json(); // Extract data from first fetch

      data.prev ? setHasPrev(data.prev) : setHasPrev(null);
      data.next ? setHasNext(data.next) : setHasPrev(null);
      // Use extracted data to make the second fetch
      const diffRes = await fetch(`${BASE_URL}/dogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(data.resultIds),
        credentials: "include",
      });

      if (!diffRes.ok) throw new Error(`Error: ${diffRes.status}`);

      const diffData = await diffRes.json();
     
      setDogData(diffData);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  const handlePrevAndNext = (params, right = true) => {
    right ? setPageCount((prev) => prev + 1) : setPageCount((prev) => prev - 1);
    const url = `${BASE_URL}${params}`;
    fetchData(url);
  };

  const handleFavorites = (item) => {
    if (favoriteList.length >= 100) return;

    const isAlreadyFavorite = favoriteList.some((fav) => fav.id === item.id);

    if (!isAlreadyFavorite) {
      // Add the item to the favorites list
      setFavoriteList((prev) => [...prev, item]);
    } else {
      // Remove the item from the favorites list
      setFavoriteList((prev) => prev.filter((fav) => fav.id !== item.id));
    }
  };

  const handleFullResetOnLogOut  = () => {
    setSearchParams(DEFAULT_PARAMS);
    setMaxAge("");
    setMinAge("");

    setSelectedOptions([]);
    setFavoriteList([])
    setHasPrev(null)
    setHasNext(null)
    setBreedList([])
    setMatch(null)
  }

  const handleReset = () => {
    setSearchParams(DEFAULT_PARAMS);
    setMaxAge("");
    setMinAge("");

    setSelectedOptions([]);
  };

  const findMyMatchFromFavorites = () => {
    const listofIDs = favoriteList.map((item) => item.id);

    fetch(`${BASE_URL}/dogs/match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(listofIDs),
      credentials: "include",
    })
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        console.log(res);
        const match = favoriteList.find((fav) => (fav.id = res.match));

        console.log(match);
        setMatch(match);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <div className="row">
            <div className="col">
              <button onClick={() => handleLogout(handleFullResetOnLogOut)} className="mb-3">Logout</button>
              <div className="searchBox">
              <SearchableDropdown
                handleReset={handleReset}
                options={breedList}
                onChange={setSelectedOptions}
                minAge={minAge}
                maxAge={maxAge}
                setMinAge={setMinAge}
                setMaxAge={setMaxAge}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                size={size}
                setSize={setSize}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                fetchQuery={fetchQuery}
              />
            
              <div>
                <div
                  className="d-flex align-items-center mt-4 mb-4"
                  style={{ width: "200px" }}
                >
                  <FaChevronLeft
                    size={16}
                    onClick={() => handlePrevAndNext(hasPrev, false)}
                  />
                  <p className="mb-0 mx-2">{pageCount}</p>
                  <FaChevronRight
                    size={16}
                    onClick={() => handlePrevAndNext(hasNext)}
                  />
                </div>
              </div>
              <button onClick={findMyMatchFromFavorites}>find match</button>

                {yourMatch && (
                  <>
                    <h3>your match!</h3>
                    <DogCard {...yourMatch} />
                  </>
                )}
              </div>

              <div>
                
              </div>
            </div>
            <div className="col">
              <div className="d-flex flex-wrap">
                {dogData.length !== 0 &&
                  dogData.map((item) => (
                    <DogCard key={item.id} {...item} handleFavorites={handleFavorites} />
                  ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

const Login = () => {
  const { handleLogin } = useAuth();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await handleLogin(credentials);
      if (!success) {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (

    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input 
          type="text" 
          name="name" 
          placeholder="Name" 
          value={credentials.name} 
          onChange={((e) => setCredentials({...credentials, name : e.target.value}))} 
          required 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={credentials.email} 
          onChange={((e) => setCredentials({...credentials, email : e.target.value}))} 
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

function App() {
  return ( 
      <AuthProvider>
      
          <div className="container">
          <Main />
          </div>
        
      </AuthProvider>
   
  );
}

export default App;
