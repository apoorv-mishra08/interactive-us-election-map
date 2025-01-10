const width = 960;
const height = 600;


const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g"); 


const projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2]) 
    .scale(1200); 

const path = d3.geoPath().projection(projection);


const stateCounts = {
    democrat: 0,
    swing: 0,
    republican: 0,
};


const updateDashboard = () => {
    document.getElementById("democrat-count").textContent = stateCounts.democrat;
    document.getElementById("swing-count").textContent = stateCounts.swing;
    document.getElementById("republican-count").textContent = stateCounts.republican;
};


d3.json("us-states.json").then(data => {
    const states = svg.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "state")
        .attr("fill", "lightgray")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .on("click", function (event, d) {
            const currentColor = d3.select(this).attr("fill");
            
            //colors in order: Blue → Purple → Red → Light Gray
            if (currentColor === "lightgray") {
                stateCounts.democrat++;
                d3.select(this).attr("fill", "blue");
            } else if (currentColor === "blue") {
                stateCounts.democrat--;
                stateCounts.swing++;
                d3.select(this).attr("fill", "purple");
            } else if (currentColor === "purple") {
                stateCounts.swing--;
                stateCounts.republican++;
                d3.select(this).attr("fill", "red");
            } else if (currentColor === "red") {
                stateCounts.republican--;
                d3.select(this).attr("fill", "lightgray");
            }

            
            updateDashboard();
        });

    
    updateDashboard();
});


document.getElementById("reset-button").addEventListener("click", () => {
    svg.selectAll("path").attr("fill", "lightgray");
    stateCounts.democrat = 0;
    stateCounts.swing = 0;
    stateCounts.republican = 0;
    updateDashboard();
});


document.getElementById("reset-counters").addEventListener("click", () => {
    stateCounts.democrat = 0;
    stateCounts.swing = 0;
    stateCounts.republican = 0;
    updateDashboard();
});

document.getElementById("save-button").addEventListener("click", () => {
    const mapState = [];
    svg.selectAll("path").each(function (d) {
        mapState.push({ id: d.id, color: d3.select(this).attr("fill") });
    });
    localStorage.setItem("mapState", JSON.stringify(mapState));
    alert("Map state saved!");
});

document.getElementById("load-button").addEventListener("click", () => {
    const savedMap = JSON.parse(localStorage.getItem("mapState"));
    if (savedMap) {
        svg.selectAll("path").each(function (d) {
            const savedState = savedMap.find(s => s.id === d.id);
            if (savedState) {
                d3.select(this).attr("fill", savedState.color);
            }
        });
       
        stateCounts.democrat = 0;
        stateCounts.swing = 0;
        stateCounts.republican = 0;

        svg.selectAll("path").each(function () {
            const color = d3.select(this).attr("fill");
            if (color === "blue") stateCounts.democrat++;
            else if (color === "purple") stateCounts.swing++;
            else if (color === "red") stateCounts.republican++;
        });

        updateDashboard();
    }
});
