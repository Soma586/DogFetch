import './styles.scss'
import { useState, useEffect, useRef } from "react"
import { Check, X, SlidersHorizontal } from "lucide-react"

export default function SearchableDropdown(props) {
  
  const {
    size, 
    setSize, 
    selectedOptions,
    setSelectedOptions, 
    options, 
    minAge, 
    maxAge, 
    onChange, 
    setMinAge, 
    setMaxAge, 
    setSortOrder,
    sortOrder,
    handleReset,
    fetchQuery
  }= props
  
    const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  //const [selectedOptions, setSelectedOptions] = useState([])
  //const [zipCodes, setZipCodes] = useState([])
//   const [ageMin, setAgeMin] = useState("")
//   const [ageMax, setAgeMax] = useState("")
  //const [size, setSize] = useState("")
  //const [sortOrder, setSortOrder] = useState("asc")
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)




  useEffect(() => {
    onChange(selectedOptions)
  }, [selectedOptions, onChange])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

//   const filteredOptions = options
//     .filter((option) => option.label.toLowerCase().includes(search.toLowerCase()))
//     .filter((option) => {
//       if (zipCodes.length > 0 && !zipCodes.includes(option.zipCode)) return false
//       if (minAge && option.age < parseInt(minAge)) return false
//       if (maxAge && option.age > parseInt(maxAge)) return false
//       if (size && option.size !== size) return false
//       return true
//     })
//     .sort((a, b) => {
//       if (sortOrder === "asc") {
//         return a.label.localeCompare(b.label)
//       } else {
//         return b.label.localeCompare(a.label)
//       }
//     })

const filteredOptions = options
  .filter((option) => {
    const matchesSearch = option.label.toLowerCase().includes(search.toLowerCase());
    //console.log("Matches Search:", option.label, matchesSearch);
    return matchesSearch;
  })

  const toggleOption = (option) => {
    setSelectedOptions((prev) => {
      const isSelected = prev.some((item) => item.value === option.value)
      if (isSelected) {
        return prev.filter((item) => item.value !== option.value)
      } else {
        return [...prev, option]
      }
    })
  }

  const removeOption = (option) => {
    setSelectedOptions((prev) => prev.filter((item) => item.value !== option.value))
  }

  return (
    <div className="searchContainer">
        
      <div className="searchable-dropdown" ref={dropdownRef}>
        <div className="selected-options">
          {selectedOptions.map((option) => (
            <div key={option.value} className="option-tag">
              {option.label}
              <button className="remove-button" onClick={() => removeOption(option)}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="dropdown">
          <input
            className="search-input"
            placeholder="Search options..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setOpen(true)}
            ref={inputRef}
          />
          {open && (
            <div>
              <div className="filters">
               
                <input
                  type="number"
                  placeholder="Min Age"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max Age"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                />
                <select value={size} onChange={(e) => setSize(e.target.value)}>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>

                <button onClick={handleReset}>Reset</button>
                <button onClick={fetchQuery}>Search</button>
              </div>
              <ul className="options-list">
                {filteredOptions.length === 0 && <li className="no-results">No results found.</li>}
                {filteredOptions.map((option) => (
                  <li key={option.value} className="option-item" onClick={() => toggleOption(option)}>
                    <div
                      className={`checkbox ${selectedOptions.some((item) => item.value === option.value) ? "checked" : ""}`}
                    >
                      {selectedOptions.some((item) => item.value === option.value) && (
                        <Check size={12} className="check-icon" />
                      )}
                    </div>
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
     

      
    </div>
  )
}