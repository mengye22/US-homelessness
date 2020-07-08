var link = "static/data/shelters_clean.geojson";


d3.json(link,function(sData){

    console.log(sData);
    // var button = d3.select("#buttom");
    // var form = d3.select("#form");

    // button.on("click",runEnter);
    // form.on("submit",runEnter);
})


// // function to run for vaild input
// function runEnter() {
//     // prevent the page from refreshing
//     d3.event.preventDefault();
//     // select the input element and get the raw html code
//     var inputData = d3.select("#zipcode-input");
//     // get the value property of the input element
//     var inputValue = inputData.property("value");
//     console.log(inputValue);
//     // var result = tableData;
//     // filter the results that match the input
//     if (inputValue){
//         result = result.filter(date => date.features.properties.Zipcode === inputValue);
//     };
//     // display the filtered table
//     displayTable(result);

// };