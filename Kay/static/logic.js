// *****************US HOMELESS POPULATION MAP**********************************

// ******************BASIC STATES MAP*******************************************
const API_KEY = "pk.eyJ1Ijoia2F5YW5uZTAxMSIsImEiOiJja2Jud2RzcG0xMnFzMnJ0bWVtMDU0bHV1In0.36tk05jmTpvSWXsNLZkGOQ"; 

var map = L.map('map').setView([37.8, -96], 4);

var light = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",{
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
})
// .addTo(map);

var dark1= L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
}); 

var dark2 = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

var baseMaps = {
    "Light": light,
    "Dark1": dark1,
    "Dark2": dark2
};

L.control.layers(baseMaps).addTo(map);

var data = statesData19; 

function drawMap(dt){
    
    // control that shows state info on hover
    var info = L.control({position: 'bottomleft'});

    info.onAdd = function (map) {
        d3.select(".info").remove();
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>US Homeless Population Density</h4>' +  (props ?
            '<b>' + props.name + '</b><br />' + props.density + ' total homeless'
            : 'Hover over a state');
    };

    info.addTo(map);
    // *****************************************************************************
    // ******************************ADD COLOR**************************************
    // get color depending on population density value
    function getColor(d) {
        return d > 100000 ? '#800026' :
            d > 50000  ? '#BD0026' :
            d > 20000  ? '#E31A1C' :
            d > 10000  ? '#FC4E2A' :
            d > 5000   ? '#FD8D3C' :
            d > 2000   ? '#FEB24C' :
            d > 1000   ? '#FED976' :
                        '#FFEDA0';
    }
    // *****************************************************************************
    // ******************************ADD STYLE**************************************
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.density),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }
    L.geoJson(dt, {style: style}).addTo(map);
    // *****************************************************************************
    // ******************************ADD INTERACTION********************************
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        info.update(layer.feature.properties);
    }
    // *****************************************************************************
    // ******************************EVENT LISTENER********************************
    var geojson;

    // on mouseout - reset layer to default 
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }

    // a click listener that zooms to the state
    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    // onEachFeature option to add the listeners on our state layers
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    geojson = L.geoJson(dt, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    map.attributionControl.addAttribution('Homeless data &copy; <a href="http://hud.gov/">U.S. Department of Housing and Urban Development </a>');
    // *****************************************************************************
    // *****************************LEGEND******************************************
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        d3.select(".legend").remove();
        var div = L.DomUtil.create('div', 'legend'),
            grades = [0, 1000, 2000, 5000, 10000, 20000, 50000, 100000],
            labels = [],
            from, to;

        for (var i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];

            labels.push(
                '<i style="background:' + getColor(from + 1) + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'));
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };

    legend.addTo(map);
}

// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", updateMap);

// This function is called when a dropdown menu item is selected
function updateMap() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");

    if (dataset === 'dataset1') {
        data = statesData19; 
    }
    if (dataset === 'dataset2') {
        data = statesData18; 
    }
    if (dataset === 'dataset3') {
        data = statesData17; 
    }
    if (dataset === 'dataset4') {
        data = statesData16; 
    }
    if (dataset === 'dataset5') {
        data = statesData15;
    }
    if (dataset === 'dataset6') {
        data = statesData14;
    }
    if (dataset === 'dataset7') {
        data = statesData13;
    }
    if (dataset === 'dataset8') {
        data = statesData12;
    }
    if (dataset === 'dataset9') {
        data = statesData11;
    }
    if (dataset === 'dataset10') {
        data = statesData10;
    }

    drawMap(data);
}

drawMap(data);






























// *****************************************************************************
// ****************************YEAR SLIDER**************************************
// function to create the range slider
// function createSliderUI(breaks) {
            
//     // create a Leaflet control object and store a reference to it in a variable
//     var sliderControl = L.control({ position: 'bottomleft'} );

//     // when we add this control object to the map
//     sliderControl.onAdd = function(map) {

//         // select an existing DOM element with an id of "ui-controls"
//         var slider = L.DomUtil.get("ui-controls");

//             // when the user clicks on the slider element
//             L.DomEvent.addListener(slider, 'mousedown', function(e) { 

//                 // prevent the click event from bubbling up to the map
//                 L.DomEvent.stopPropagation(e); 

//             });

//         // return the slider from the onAdd method
//         return slider;
//     }

//     // add the control object containing our slider element to the map
//     sliderControl.addTo(map); 
    
//      var years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"];
    
//     $('.year-slider')
//         .on('input change', function () {
//            attribute = $(this).val();
//            updateMap(breaks);
//         // $('.legend h3').html('Homeless Population: <br>'+ years[attribute-1])
//     });    
// }
// //Create a marker layer (in the example done via a GeoJSON FeatureCollection)
// var testlayer = L.geoJson(statesData19);
// var sliderControl = L.control.sliderControl({position: "bottomleft", layer: testlayer});

// map.addControl(sliderControl);
// //And initialize the slider
// sliderControl.startSlider();
// *****************************************************************************
// *****************************************************************************