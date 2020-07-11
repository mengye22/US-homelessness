
(function(){
    var width = 1200;
    var height = 700;

    var svg = d3.select("#chart")
        .append("svg")
        .attr("height",height)
        .attr("width",width)
        .append("g")
        .attr("transform","translate(0,0)")

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("color", "white")
        .style("padding", "8px")
        .style("background-color", "rgba(0, 0, 0, 0.75)")
        .style("border-radius", "6px")
        .style("font", "12px sans-serif")
        .text("tooltip");
    
    var radiusScale = d3.scaleSqrt()
        .domain([5,365])
        .range([10,90])
    
    var simulation = d3.forceSimulation()
        .force("x",d3.forceX(width/2).strength(0.05))
        .force("y",d3.forceY(height/2).strength(0.05))
        .force("collide",d3.forceCollide(d => radiusScale(d.Count)+1))

    var color = d3.scaleOrdinal(d3.schemeCategory20)

    d3.queue()
        .defer(d3.csv,"static/data/shelter_state_count.csv")
        .await(ready)

    function ready(error,countData){

        var circles = svg.selectAll(".state")
            .data(countData)
            .enter()
            .append("circle")
            .attr("class", "state")
            .attr("r", d => radiusScale(d.Count))
            .attr("fill", d => color(d.State))
            .on("mouseover", function (d) {
                tooltip.text(d.State + ": " + d.Count);
                tooltip.style("visibility", "visible");
            })
            .on("mousemove", function () {
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function () { return tooltip.style("visibility", "hidden"); });
  

        var text = svg.selectAll(null)
            .data(countData)
            .enter()
            .append("text")
            .text(d => d.Code)
            .attr('color','black')
            .attr('text-anchor','middle')
            .attr('font-size',15)

        simulation.nodes(countData)
            .on("tick",ticked)

        function ticked(){
            circles.attr("cx",d => d.x)
                .attr("cy",d => d.y)
            text.attr("x",d => d.x)
                .attr("y",d => d.y)
        }

    }
})();