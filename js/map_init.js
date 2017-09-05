
/*********** json tree data *********************/

{
    "trees":   [
        {
            "t_1.1.1": {
                "species": "apple",
                "variety": "Red Fuji",
                "section": 1,
                "row": 1,
                "location": {
                    "lng": -122.0368147641,
                    "lat": 37.7638157364
                },
                "date_planted": false,
                "icon": "icon_001.jpg",
                "notes": []
            },
            "t_1.1.2": {
                "species": "apple",
                "variety": "Red Fuji",
                "section": 1,
                "row": 1,
                "location": {
                    "lng": -122.0368040353,
                    "lat": 37.7637558058
                },
                "date_planted": false,
                "icon": "icon_001.jpg",
                "notes": []
            },
            "t_1.2.1": {
                "species": "apple",
                "variety": "Golden Delicious",
                "section": 1,
                "row": 2,
                "location": {
                    "lng": -122.0367482956,
                    "lat": 37.7638469171
                },
                "date_planted": false,
                "icon": "icon_001.jpg",
                "notes": []
            }
        }
    ]
}
     /*************** why doesn't map initialization work from external file? **************/

     var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map_'), {
        center: {lat: 37.76425, lng: -122.03665},
        zoom: 19,
        mapTypeId: 'satellite'
    });
    setMarkers(map, trees);
}
/* end of initMap() */

function setMarkers(map,trees) {

    /* initialize variables for tree data */
    var lat_lng = { "lng": 0, "lat": 0};
    var tree_id, species, species_cap, variety, start_date, section, row, icon_1;  // notes not implemented

    console.log(trees);  // view data structure in console
    for (var tree in trees) {
        for (var i = 0; i < trees[tree].length; i++) {
            for (key2 in trees[tree][i]) {
                // in each iteration -
                // 1) extract all necessary data for this tree and put in variables
                for (key3 in trees[tree][i][key2]) {
                    var data_point = trees[tree][i][key2][key3];
                    tree_id = key2;
                    icon_1 = "images/dir_0.png";
                    if (key3 === "location") {
                        lat_lng.lng = (data_point.lng);
                        lat_lng.lat = (data_point.lat);
                    }
                    else if (key3 === "species") {
                        species = data_point;
                        species_cap = capitalizeFirstLetter(species);
                    }
                    else if (key3 === "variety") {
                        variety = data_point;
                    }
                    else if (key3 === "section") {
                        section = data_point;
                    }
                    else if (key3 === "row") {
                        row = data_point;
                    }
                    else if (key3 === "date_planted") {
                        start_date = data_point;
                        if (!start_date) {
                            start_date = "Unknown";}
                    }
                    //else if (key3 === "notes") {
                    // not implemented yet
                    //}
                    //else if (key3 === "icon") {
                    // not implemented yet
                    //}
                }
                // 2) set up a marker, give lat lng
                var marker = new google.maps.Marker({
                    map: map, position: lat_lng,
                    icon: icon_1

                });
                // 3) create html content for infoWindow
                var content = ("<h3>" + species_cap + " - " + variety + "</h3>" +
                    "<p>Tree ID - " + key2 + "</p>" +
                    "<p>Section - " + section + "</p>" +
                    "<p>Row - " + row + "</p>" +
                    "<p>Date planted - " + start_date + "</p>" +
                    "<p>Notes - </p>");
                console.log(content);
                // 4) load the content into the infoWindow
                var infowindow = new google.maps.InfoWindow()
                // 5) attach an event listener
                google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
                    return function() {
                        /* close the previous info-window */
                        closeInfos();
                        infowindow.setContent(content);
                        infowindow.open(map,marker);
                        /* keep the handle, in order to close it on next click event */
                        infos[0]=infowindow;
                    };
                })(marker,content,infowindow));
            }
        }
    }
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function closeInfos(){
    if(infos.length > 0){
        /* detach info-window from marker */
        infos[0].set("marker", null);
        /* and close it */
        infos[0].close();
        /* blank the array */
        infos.length = 0;
    }
}