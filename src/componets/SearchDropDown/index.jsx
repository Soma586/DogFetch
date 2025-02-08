import './styles.scss'
import { useState, useEffect, useRef } from "react"
import { Check, X, SlidersHorizontal } from "lucide-react"
//import "./searchable-dropdown.css"

export default function SearchableDropdown({ options, onChange }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedOptions, setSelectedOptions] = useState([])
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

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()))

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
                <div> <h1>t</h1> naruto</div>
                
            
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