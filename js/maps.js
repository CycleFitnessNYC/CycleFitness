function init_map()
{
    var myOptions = {zoom:14,center:new google.maps.LatLng(40.7543922,-73.9197439),mapTypeId: google.maps.MapTypeId.ROADMAP};
    map = new google.maps.Map(document.getElementById("gmap_canvas"), myOptions);
    marker = new google.maps.Marker({map: map,position: new google.maps.LatLng(40.7543922, -73.9197439)});
    infowindow = new google.maps.InfoWindow({content:"<b>Cycle Fitness</b><br/> 3455 42nd Street<br/> New York, NY" });
    google.maps.event.addListener(marker, "click", function(){infowindow.open(map,marker);});
    infowindow.open(map,marker);

    loadPaths(map);
}

function animateIcon(line) {
    var count = 0;
    window.setInterval(function() {
        count = (count + 1) % 200;

        var icons = line.get('icons');
        icons[0].offset = (count / 2) + '%';
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
                scale: 2,
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
               pathCoords[index] = new google.maps.LatLng(elem.x, elem.y);
            });

            var path = new google.maps.Polyline({
                path: pathCoords,
                icons:
                    [
                        {
                            icon: arrow,
                            offset: '100%'
                        },
                        {
                            icon:startPoint,
                            offset: '0%'
                        }
                    ],
                geodesic: true,
                strokeColor: pathInfo.color,
                strokeOpacity: 1.0,
                strokeWeight: 2
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