function init_map()
{
    var myOptions = {zoom:14,center:new google.maps.LatLng(40.7543922,-73.9197439),mapTypeId: google.maps.MapTypeId.ROADMAP};
    var map = new google.maps.Map(document.getElementById("gmap_canvas"), myOptions);
    var marker = new google.maps.Marker({map: map,position: new google.maps.LatLng(40.7543922, -73.9197439)});
    var infowindow = new google.maps.InfoWindow({content:"<b>Cycle Fitness</b><br/> 3455 42nd Street<br/> New York, NY" });
    google.maps.event.addListener(marker, "click", function(){infowindow.open(map,marker);});
    infowindow.open(map,marker);

    loadPaths(map);
}

function animateIcon(line) {
    var count = 0;
    window.setInterval(function() {
        var icons = line.get('icons');
        icons.forEach(function(icon, index)
        {
            if (index != 0)
            {
                var num = icon.offset = parseFloat(icon.offset) + .5;
                if (num > 100)
                    num = 0;
                icon.offset = num + "%";
            }
        });

        line.set('icons', icons);
    }, 20);
}

//Load the paths from pathinfo.json and add them to the google map
function loadPaths(map)
{
    //Given the object load from json, add the paths to the map
    function makePaths(pathInfos)
    {
        pathInfos.paths.forEach(function(pathInfo, index)
        {
            //The icons
            var arrow =
            {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 3,
                strokeColor: pathInfo.color
            };
            var startPoint =
            {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 4,
                strokeColor: pathInfo.color
            };

            //Create LatLng object array from json object array
            var pathCoords = [];
            pathInfo.pathCoords.forEach(function(elem, index)
            {
               pathCoords[index] = new google.maps.LatLng(elem[0], elem[1]);
            });

            var path = new google.maps.Polyline({
                path: pathCoords,
                icons:
                    [
                        {
                            icon:startPoint,
                            offset: '0%'
                        }
                    ],
                geodesic: true,
                strokeColor: pathInfo.color,
                strokeOpacity: 1.0,
                strokeWeight: 4
            });

            var numArrows = 1;
            for (var i = 1; i <= numArrows; i++)
            {
                path.icons[path.icons.length] =
                {
                    icon: arrow,
                    offset: (100 / numArrows) * i + "%"
                };
            }

            var infowindow = new google.maps.InfoWindow({content:"<b>" + pathInfo.name + "</b><br/>Distance: " + pathInfo.distance + "<br/>Time: " + pathInfo.time});
            google.maps.event.addListener(path, "click", function(event)
            {
                var marker = new google.maps.Marker({map: map, position: event.latLng});
                infowindow.open(map, marker);
                google.maps.event.addListener(infowindow, "closeclick", function()
                {
                    marker.setMap(null);
                });
            });

            animateIcon(path);
            path.setMap(map);
        });
    }

    var succeeded = false;
    $.getJSON("../json/pathinfo.json", function(data) {
        console.log(data);
        succeeded = true;
        makePaths(data);
    });
    if(!succeeded)
    {
        $.getJSON("/cyclefitness/json/pathinfo.json", function(data) {
            console.log(data);
            succeeded = true;
            makePaths(data);
        });
    }
}

google.maps.event.addDomListener(window, 'load', init_map);