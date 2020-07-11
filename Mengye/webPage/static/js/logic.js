
var myMap = L.map("map", {
    center: [39.01, -98.48],
    zoom: 5
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 15,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
d3.json("static/data/shelters_clean.geojson", function (gData) {

  // console.log(gData);
  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through data
  for (var i = 0; i < gData.features.length; i++) {

    // Set the data location property to a variable
    var location = gData.features[i].geometry;
    // console.log(location);
    // Check for location property
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
        .bindPopup(`Name:${gData.features[i].properties.Name}<br> Zipcode: ${gData.features[i].properties.Zipcode}`));
    }

  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

});

