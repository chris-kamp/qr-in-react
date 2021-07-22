import React, { useState } from "react"
import PlacesAutocomplete, { geocodeByAddress } from "react-places-autocomplete"

const LocationAutocomplete = (props) => {
  const [address, setAddress] = useState(props.addresPlaceholder || "")

  const handleChange = (address) => {
    setAddress(address)
  }

  const handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => {
        // Display the received formatted address in the search bar
        setAddress(results[0].formatted_address)
        // pass the parsed address data back to the parent component's callback function
        props.addressCallback(parseAddress(results[0].address_components))
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const parseAddress = (addressComponents) => {
    // Setup a hash to map our address data structure to the one provided.
    let componentParse = {
      street: ["street_number", "street_address", "route"],
      suburb: [
        "locality",
        "sublocality",
        "sublocality_level_1",
        "sublocality_level_2",
        "sublocality_level_3",
        "sublocality_level_4",
        "sublocality_level_5",
      ],
      postcode: ["postal_code"],
      state: [
        "political",
        "administrative_area_level_1",
        "administrative_area_level_2",
        "administrative_area_level_3",
        "administrative_area_level_4",
        "administrative_area_level_5",
      ],
    }

    let address = {
      street: "",
      suburb: "",
      postcode: "",
      state: "",
    }

    // Parse Google's address_components into something that fits our data structure
    addressComponents.forEach((component) => {
      for (let parse in componentParse) {
        if (componentParse[parse].indexOf(component.types[0]) !== -1) {
          if (componentParse.street.includes(component.types[0])) {
            address[parse] += `${component.long_name} `
          } else if (componentParse.state.includes(component.types[0])) {
            address[parse] = component.short_name
          } else {
            address[parse] = component.long_name
          }
        }
      }
    })

    // Trim street edge whitespace
    address.street = address.street.trim()
    return address
  }

  return (
    <React.Fragment>
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
        debounce={500}
        highlightFirstSuggestion={true}
        shouldFetchSuggestions={address.length > 5}
        searchOptions={{ componentRestrictions: { country: "au" } }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="control">
            <input
              className="input"
              type="text"
              {...getInputProps({
                placeholder: "Start typing to search location",
              })}
            />
            <div>
              {loading && <p>Loading Suggestions...</p>}
              {suggestions.map((suggestion) => (
                <div
                  {...getSuggestionItemProps(suggestion, {})}
                  key={suggestion.placeId}
                >
                  <span>{suggestion.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </React.Fragment>
  )
}

export default LocationAutocomplete
