let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    // San Antonio
    center: { lat: 29.4241219, lng: -98.4936282 },
    zoom: 10,
  });
}

function searchPlace() {
    // Bring user's input
    const input = document.getElementById("address").value;

    const request = {
        // Add store's name behind of user's input : Subway
        query: `${input} Subway`,
        // Get store's name, geometry and address
        fields: ["name", "geometry", "formatted_address"]
    };

    const service = new google.maps.places.PlacesService(map);
    // Use textSearch() in Google Place API
    service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            
            // Clear previous results
            const resultContainer = document.getElementById("result");
            resultContainer.innerHTML = "";

            // Add list title
            const listTitle = document.createElement("h1");
            listTitle.style = "word-spacing: 10px; text-align: center; margin-bottom: 20px"
            listTitle.textContent = "< Place List >"
            resultContainer.appendChild(listTitle)

            // Add ul tag into the list
            const placeList = document.createElement("ul")
            placeList.id = "placeList"
            placeList.style = "list-style-type: none; text-align: center; font-size: 15px;"
            resultContainer.appendChild(placeList);

            // Repeat making marks for places and adding places' information into the list
            results.forEach((place) => {
                createMarker(place);
                addPlaceToList(place);
            });

            map.setCenter(results[0].geometry.location);
        } else {
            window.alert("No results found.");
        }
    });
}

function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;

    // Create marker of place
    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
    });

    // Add a click event to the marker
    google.maps.event.addListener(marker, "click", () => {
        const infowindow = new google.maps.InfoWindow({
            content: `${place.name || ""}<br>${place.formatted_address || ""}`
        });
        infowindow.open(map, marker);
    });
}

function addPlaceToList(place) {
    const placeList = document.getElementById("placeList")

    const listItem = document.createElement("li");
    listItem.textContent = `${place.name} - ${place.formatted_address}`;
    listItem.style = "margin-bottom: 10px;"

    // Add a click event to focus on the location when the place list is clicked
    listItem.addEventListener("click", () => {
        map.setCenter(place.geometry.location);
        map.setZoom(14);

        // Create marker and information box then link them
        const infowindow = new google.maps.InfoWindow({
            content: `${place.name || ""}<br>${place.formatted_address || ""}`
        });
        const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });
        infowindow.open(map, marker);
    });

    // Add hover events to each place in place list
    listItem.addEventListener("mouseover", () => {
        listItem.style = "margin-bottom: 10px; text-decoration: underline";
    })

    listItem.addEventListener("mouseout", () => {
        listItem.style = "margin-bottom: 10px;"
    })

    placeList.appendChild(listItem);
}
