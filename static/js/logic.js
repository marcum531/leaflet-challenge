var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(queryUrl,function(data) {
    createFeatures(data.features);
});

function magColor(d){
    return d > 5 ? 'red' :
           d > 4 ? "orange":
           d > 3 ? 'yellow':
           d > 2 ? 'blue':
           d > 1 ? 'gray':
                   'black' 
}

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + 
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlong){
            var markersFormat = {
                radius: (feature.properties.mag)*15000,
                fillColor: magColor(feature.properties.mag),
                stroke: false,
                color: "orange",
                fillOpacity:1
            }

            return L.circle(latlong, markersFormat)

        }
    });

    createMap(earthquakes);
 }
 //var API_KEY = "pk.eyJ1IjoibWFyY3VtNTMxIiwiYSI6ImNrZWMybjR0ZzBlZHYyd28xbjZvZTQyczYifQ.WN2aR9qbjzhoOMqbV5DMcw";
 function createMap(earthquakes) {
        var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        //attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',

    // var streetmap = L.tileLayer("https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    //     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Street Map": streetmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


var legend = L.control({position: 'bottomright'});

legend.onAdd = function() {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [0,1,2,3,4,5];
        var colors = [
            "black",
            "gray",
            "blue",
            "yellow",
            "orange",
            "red"
        ];
    
    for (var i = 0; i < magnitudes.length; i++){
        div.innerHTML +=
        "<i style='color:" + colors[i] +"'>"+
       magnitudes[i] + (magnitudes[i+1] ? '&ndash;'+magnitudes[i+1]+ '</i><br>': '+');
    }

    return div;

};
legend.addTo(myMap);

}
