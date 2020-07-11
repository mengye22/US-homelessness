var link = "static/data/shelters_clean.geojson";

d3.json(link, function (sData) {

    // console.log(sData);
    var button = d3.select("#button");
    var form = d3.select("#form");

    button.on("click", runEnter);
    form.on("submit", runEnter);

    function runEnter() {
        // prevent the page from refreshing
        d3.event.preventDefault();
        // console.log(sData);
        // select the input element and get the raw html code
        var inputData = d3.select("#zipcode-input");
        // get the value property of the input element
        var inputValue = inputData.property("value");
        // console.log(inputValue);

        // filter the results that match the input
        var filteredData = sData.features.filter(data => data.properties.Zipcode == inputValue)
        // console.log(filteredData.length);

        if (filteredData.length == 0) {
            d3.select(".summary").append("h4").text(`This zipcode had no shelter location available!`);

        } else {
            var name = filteredData.map(data => data.properties.Name);
            var address = filteredData.map(data => data.properties.Address);
            var state = filteredData.map(data => data.properties.State);
            var zipcode = filteredData.map(data => data.properties.Zipcode);

            var list = d3.select(".summary");
            list.html("");

            list.append("h4").text(`Shelter Name: ${name}`);
            list.append("h5").text(`Address: ${address} ${state} ${zipcode}`);

            // var coord = filteredData.map(data => data.geometry.coordinates)
            // console.log(coord[0]);
            var lat = parseFloat(filteredData.map(data => data.properties.Latitude));
            var lng = parseFloat(filteredData.map(data => data.properties.Longitude));
            // console.log(lat);
            // console.log(lng);

            // var oldmap = d3.select("#mapid");
            // oldmap.html("");
            // if (myMap) {
            //     myMap.redraw()
            //     // myMap.invalidateSize()
            //     // myMap = null;
            //     // myMap.off();
            //     // myMap.remove()
            // }

            // if(myMap != undefined || myMap != null){
            //     map.remove();
            //    $("#mapid").html("");
            //    $( "<div id=\"mapid\" style=\"height: 500px;\"></div>" ).appendTo("#myMap");
            // }


            var myMap = new L.map("mapid", {
                center: [lat, lng],
                zoom: 14
            });

            L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
                attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
                tileSize: 512,
                maxZoom: 18,
                zoomOffset: -1,
                id: "mapbox/streets-v11",
                accessToken: API_KEY
            }).addTo(myMap);

            var marker = L.marker([lat, lng], {
                draggable: false,
                title: name
            }).addTo(myMap);

            // Binding a pop-up to our marker
            //   marker.bindPopup(name);

        }



    }
})

