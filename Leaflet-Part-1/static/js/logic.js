// Create the base map object
// Set latitude 39.8283 and longitude -98.5795 to center the map on the USA
let myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5
});

// Add the tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store the earthquake data API endpoint as url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Load the earthquake data using d3 library
d3.json(url).then(function(data) {
    
    // print output to console to confirm data is fetched successfully
    console.log(data.features);

    earthquakeLayers(data.features);
});

// Create a function for setting colors to corresponding earthquake depth
function markerColor(depth) {
    if (depth <10) return "#61FE4C";
    else if (depth < 30) return "#E3FE4C";
    else if (depth < 50) return "#FED74C";
    else if (depth < 70) return "#FEB14C";
    else if (depth < 90) return "#FE7B4C";
    else return "#FE4C4C";
}

// Create a function for setting marker size based on the earthquake's magnitude
function markerSize(magnitude) {
    return magnitude*15000;
}

// Create a function to build the earthquake data layer
function earthquakeLayers(earthquakeData) {
    let earthquakeLayer = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circle(latlng, {
                stroke: true,
                fillOpacity: 0.75,
                color:"black",
                fillColor: markerColor(feature.geometry.coordinates[2]),
                radius: markerSize(feature.properties.mag),
                weight: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}<br>Magnitude: ${feature.properties.mag}<br>Longitude: ${feature.geometry.coordinates[0]}<br>Latitude: ${feature.geometry.coordinates[1]}<br>Depth: ${feature.geometry.coordinates[2]}</p>`);
        }
    });
    earthquakeLayer.addTo(myMap);
}

// Create legend and its content
let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    let depth = ["-10–10", "10–30", "30–50", "50–70", "70–90", "90+"];
    let color = ["#61FE4C", "#E3FE4C", "#FED74C", "#FEB14C", "#FE7B4C", "#FE4C4C"];
    div.innerHTML = "<h4>Earthquake Depth (km)</h4>";
    for (let i = 0; i < depth.length; i++) {
        div.innerHTML += "<i style='background:" + color[i] + "'></i> " + depth[i] + "<br>";
    }
    return div;
}

legend.addTo(myMap);