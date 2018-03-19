var data, svg, div, x, y = null;
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

main();

function main() {
    data = getSummarizeData();
    appendBody();
    setAxisRangesAndDomains();
    addLine();
    addDotsInLine();
    addXAxis();
    addYAxis();
    addGraphTitle();
};

function getValueInX(d) {
    return x(d.style_id);
};

function getValueInY(d) {
    return y(d.count);
};

function appendBody() {
    div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
};

function setAxisRangesAndDomains() {
    x = d3.scaleLinear().range([0, width]);
    y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(data, function (d) {
        return d.style_id;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.count;
    })]);
};

function addLine() {
    var valueline = d3.line()
        .x(getValueInX)
        .y(getValueInY);

    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);
};

function addDotsInLine() {
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", getValueInX)
        .attr("cy", getValueInY)
        .on(["click"], onClick);
    //.on("mouseout", onMouseout);
};

function addXAxis() {
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + 25) + ")")
        .style("text-anchor", "middle")
        .text("Style Id");
};

function addYAxis() {
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("# of Beers");
}

function addGraphTitle() {
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Number of Beers brands by Style Id");
};

function onClick(d) {
    div.transition()
        .duration(200)
        .style("opacity", .9);

    createTooltip(d);
};

function onMouseout(d) {
    div.transition()
        .duration(3000)
        .style("opacity", 0);
};

function createTooltip(d) {
    div.html(getTooltipMessage(d))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px")
        .style("height", "220px")
        .style("width", "500px")
        .style("background", d3.rgb("#fdae6b"));
};

function getTooltipMessage(d) {
    var message = "";

    if (d.count > 0) {
        message = "<b><u>Existen " + d.count + " marcas de cerveza del tipo " + d.style_name + " (" + d.style_id + "):</u></b><br/>";
        message += "</br><u>Aquí tienes algunos ejemplos:</u>";
        message = createBeersListMessage(d, message);
    } else {
        message = "No existen marcas de cerveza del tipo " + d.style_name + "(" + d.style_id + ")" + "<br/>";
    }
    return message;
};

function createBeersListMessage(d, message) {
    message += "<ul>";

    d.names.forEach(function (beer, i) {
        if (i < 10) {
            message += "<li>" + beer + "</li>";
        }
    });
    if (d.count > 10) {
        message += "<li>...</li>";
    }
    message += "</ul></br>";

    return message;
}

function openBeersWindow() {
    var x = window.open();
    x.document.open().write('content');
    x.close();
};

//Data management
function getSummarizeData() {
    var originalData = getData();
    var groupData = [];

    originalData.forEach(function (beer) {
        groupData = iterateBeersByStyle(groupData, beer);
    });

    return transformDictionaryIntoArray(groupData);
};

function iterateBeersByStyle(groupData, beer) {
    var currentBeerStyle = groupData[beer.style_id]
    if (currentBeerStyle) {
        updateBeerStyle(currentBeerStyle, beer);
    } else {
        groupData[beer.style_id] = createNewBeerStyle(beer);
    }
    return groupData;
};

function createNewBeerStyle(beer) {
    return {
        style_id: beer.style_id,
        style_name: beer.style_name,
        count: 1,
        names: [beer.name]
    };
};

function updateBeerStyle(currentBeerStyle, beer) {
    currentBeerStyle.count += 1;
    currentBeerStyle.names.push(beer.name);
};

function transformDictionaryIntoArray(data) {
    var keys = Object.keys(data);
    var values = keys.map(function (v) {
        return data[v];
    });

    return values;
}