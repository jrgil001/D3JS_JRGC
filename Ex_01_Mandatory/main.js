var totalSales = [
    { product: 'Hoodie', sales: 7 },
    { product: 'Jacket', sales: 6 },
    { product: 'Snuggie', sales: 9 },
];

var svg = d3.select('svg');

var rects = svg.selectAll('rect')
    .data(totalSales);

var maxSales = d3.max(totalSales, function (d, i) {
    return d.sales;
});

var setLinearAxis = d3.scaleLinear()
    .range([0, 350])
    .domain([0, maxSales]);

var setDiscreteAxis = d3.scaleBand()
    .rangeRound([0, 75])
    .domain(totalSales.map(function (d, i) {
        return d.product;
    })).padding(0.05);

var newRects = rects.enter();

var colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];

newRects.append('rect')
    .attr('x', function (d, i) {
        return setDiscreteAxis(d.product);
    })
    .attr('y', function (d, i) {
        return setLinearAxis(0)
    })
    .attr('height', function (d, i) {
        return setLinearAxis(d.sales);
    })
    .attr('width', setDiscreteAxis.bandwidth)
    .attr('fill', function (d, i) {
        return colors[i];
    })
    .attr('orient', 'bottom');

var legend = svg.selectAll(".legend")
    .data(totalSales.slice())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
    .attr("x", 200)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function (d, i) {
        return colors[i];
    });

legend.append("text")
    .attr("x", 190)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function (d) { return d.product; });