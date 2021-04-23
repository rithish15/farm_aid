/*import 'ol/ol.css';
import Draw from 'ol/interaction/Draw';
import Map from 'ol/Map';
import View from 'ol/View';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';*/

var baseMap;
var poly;
var base;
var user_key;
var userID;
var productSelected;
var center;
var plink;
var dateSelected;
var availUDates = new Array();
var availHDates = new Array();
var j;
var jsonDate;
var dataLink;
var flag;
var tableFlag = 0;
var statLink;
var api_url;
var selectedDate;
var chartH = new Array();
var chartU = new Array();
var mean = new Array();
var surl = new Array();
var links = new Array();
var sample;
var tflag = 0;
var lflag = 0;
var legendIcon = 0;
var productList;
var farm_name;
var selected;
/*
var raster = new ol.layer.Tile({
  source: new ol.source.OSM(),
});*/

var raster = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmFsYWppMjI3IiwiYSI6ImNrbm10Z2h6NjB2eXQybnBlaTZ3cGgxMzMifQ.KSd7ydAqcZCAEzgoB6iLzA',
        tileSize: 512
    })
});

var source = new ol.source.Vector({ wrapX: false });

var vector = new ol.layer.Vector({
    source: source,
});

var map = new ol.Map({
    layers: [raster, vector],
    target: 'map',
    view: new ol.View({
        center: [-11000000, 4600000],
        zoom: 4,
    }),
});

//js function to set cookie

//var typeSelect = document.getElementById('type');
function drawFarm() {

    console.log('Hello');

    var formatArea = function(polygon) {
        var area = ol.Sphere.getArea(polygon);
        var output;
        output = (Math.round(area / 1000000 * 100) / 100);
        console.log("In function = " + output);
        return output;
    };
    var draw;

    function addInteraction() {
        var value = 'Polygon';
        if (value !== 'None') {
            draw = new ol.interaction.Draw({
                source: source,
                type: value,
            });
            map.addInteraction(draw);
        }
        map.addInteraction(draw);
        draw.on('drawstart', function(evt) {
            sketch = evt.feature;
            console.log("sketch:" + sketch);
            console.log("here ");

            listener = sketch.getGeometry().on('change', function(evt) {
                //console.log("in listener")
                var geom = evt.target;
                var output;
                if (geom instanceof ol.geom.Polygon) {
                    output = formatArea(geom);
                    /*console.log("output: "+output);*/
                    farm_area = parseFloat(output);
                    console.log(farm_area)
                } else {
                    console.log("outside");
                }
            })

        });
        draw.on('drawend', function(event) {
            var intersect = false;
            var feature = event.feature;
            if (sketch.getGeometry().getType() == "Polygon") {
                console.log("Hi, from inside");
                poly = feature.getGeometry().getCoordinates();
                console.log("poly: " + poly);
                var kinkedPoly = turf.polygon(poly);
                var unkinkedPoly = turf.unkinkPolygon(kinkedPoly);
                if (unkinkedPoly.features.length > 1) {
                    console.log("In intersection");
                    intersect = true;
                    /*sweetAlert({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'The farm you have drawn in having intersection(s).'
                    })*/
                }

            }
            if (!intersect) {
                console.log("intersect: " + intersect);
                if (farm_area > 8.093713) {
                    var message = "Farm size exceeded!\n" + "Your Farm Size: " + farm_area;
                    sweetAlert({
                        icon: 'error',
                        title: 'Oops!',
                        text: message,
                        footer: 'Your Farm Size: ' + farm_area
                    });
                    source.clear();
                } else {

                    (async() => {

                        const { value: formValues } = await Swal.fire({
                            title: 'Enter your farm name',
                            html: '<input id="drawFarmName" class="swal2-input">' + '<h3>Crop Type</h3>' +
                                ' <br> <input type="radio" id="rice" name="crop" value="rice"> <label for="rice">Rice</label><br> <input type="radio" id="wheat" name="crop" value="wheat"> <label for="wheat">Wheat</label><br> <input type="radio" id="other" name="crop" value="other"><label for="other">Other</label>',
                            focusConfirm: false,
                            allowOutsideClick: false,
                            showCancelButton: true,

                            preConfirm: () => {
                                return [
                                    document.getElementById('drawFarmName').value,

                                ]
                            }
                        })


                    })()
                    .then((value) => {

                        selected = $('input[name="crop"]:checked').val();
                        console.log(selected);
                        //product = productList.toString();
                        farm_name = document.getElementById('drawFarmName').value,
                            //console.log('products=' + product);

                            console.log('proper_format=' + proper_format);
                        var jsonobj = JSON.parse(proper_format);
                        //console.log(jsonobj); 
                        jsonobj.name = farm_name;
                        proper_format = JSON.stringify(jsonobj);
                        console.log(proper_format); // do all your logic here 
                        console.log(farm_name);
                        proper_format.cropname = selected



                        insertValues();
                        console.log("coord1234: " + proper_format);
                        // do all your logic here
                        console.log("in swal " + farm_name);

                        console.log("in swal " + selected);
                    });
                }
            } else {
                console.log("intersect: " + intersect);
                sweetAlert({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'Please draw a valid farm.'
                });
                intersect = false;
            }
        });
    }
    addInteraction();
    const format = new ol.format.GeoJSON({ featureProjection: 'EPSG:3857' });
    const download = document.getElementById('download');
    source.on('change', function() {
        const features = source.getFeatures();
        const json = format.writeFeatures(features);
        json_data = json;
        console.log(typeof(json));
        console.log(json_data);
        var json_obj = JSON.parse(json_data);
        console.log(json_obj.features[0].geometry.coordinates[0]);
        var dummy_obj = {
            type: "FeatureCollection",
            name: "dummy",
            geo_json: {
                type: "name",
                properties: {
                    name: "urn:ogc:def:crs:OGC:1.3:CRS84"
                },
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        [

                        ]
                    ]
                }
            },
            cropname: "dummyval"
        }
        console.log(dummy_obj.geo_json.geometry.coordinates[0]);
        dummy_obj.geo_json.geometry.coordinates[0] = json_obj.features[0].geometry.coordinates[0];
        proper_format = JSON.stringify(dummy_obj);
        console.log(proper_format);

        //download.href = 'data:text/json;charset=utf-8,' + json;
    });
}

function insertValues() {
    console.log("func : " + farm_name);
    console.log("func : " + selected);
    console.log("function : " + proper_format);

    js_ob = JSON.parse(proper_format)
    console.log(js_ob.cropname)
    js_ob.cropname = selected
        //console.log(proper_format)


    console.log('http://127.0.0.1:5010/postjson?key=0')
    var jsonstr = JSON.stringify(js_ob)
    console.log(typeof(jsonstr))
        //console.log(jsonstr);
    $.ajax({
        url: 'http://127.0.0.1:5010/postjson?key=0',
        type: 'POST',
        cors: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        contentType: 'application/json',
        data: jsonstr,
        success: function(data) {
            console.log(data);
        }
    });
}

function fetchfarms(user_key) {
    console.log("func key: " + farm_name);
    var key = 0

    console.log('http://127.0.0.1:5010/userfarms?key=' + toString(user_key));
    //var jsonstr = JSON.stringify(js_ob)
    //console.log(typeof(jsonstr))
    //console.log(jsonstr);
    $.ajax({
        url: 'http://127.0.0.1:5010/userfarms?key=' + toString(user_key),
        type: 'POST',
        cors: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        contentType: 'application/json',
        success: function(data) {
            console.log(data);
            farmArray = data["Active"]
            for (let i = 0; i < FarmArray.length; i++) {
                console.log(FarmArray["farmname"], FarmArray["farmid"]);
                formoption += "<ul class='nav nav-treeview'><li class='nav-item'><a alt='" + FarmArray["farmid"] + "' class='nav-link'><i class='fas fa-leaf nav-icon></i><p>" + FarmArray["farmname"] + "</p></a></li></ul>";
            }
            $('#user_farms').html(formoption);
        }
    });


}

function fetchfarms_dummy(user_key) {
    $("#user_farms").empty();
    formoption = "<div class='nav-link' id='myfarms'> <i class='nav-icon fa fa-eye'></i> <p> My Farms <i class='right fas fa-angle-left'></i> </p> </div>"
    data = {
        "Active": [{
                "farmid": 1,
                "farmname": null
            },
            {
                "farmid": 2,
                "farmname": null
            },
            {
                "farmid": 3,
                "farmname": null
            },
            {
                "farmid": 4,
                "farmname": null
            },
            {
                "farmid": 5,
                "farmname": null
            },
            {
                "farmid": 6,
                "farmname": null
            },
            {
                "farmid": 7,
                "farmname": null
            },
            {
                "farmid": 8,
                "farmname": null
            },
            {
                "farmid": 9,
                "farmname": null
            },
            {
                "farmid": 10,
                "farmname": null
            },
            {
                "farmid": 11,
                "farmname": null
            },
            {
                "farmid": 12,
                "farmname": null
            },
            {
                "farmid": 13,
                "farmname": null
            },
            {
                "farmid": 14,
                "farmname": "rice"
            },
            {
                "farmid": 15,
                "farmname": "wheat"
            },
            {
                "farmid": 16,
                "farmname": "wheat"
            },
            {
                "farmid": 17,
                "farmname": "ghtasd"
            }
        ]
    }
    $('#user_farms').append(formoption);
    FarmArray = data["Active"]
    console.log(FarmArray.length)
    for (let i = 0; i < FarmArray.length; i++) {
        console.log(FarmArray[i]["farmname"], FarmArray[i]["farmid"]);
        formoption = "<ul class='nav nav-treeview'><li class='nav-item'><div id='" + FarmArray[i]["farmid"] + "/" + FarmArray[i]["farmname"] + "' onclick='myfarms_id(this);' class='nav-link'><i class='fas fa-leaf nav-icon'></i><p>" + FarmArray[i]["farmname"] + "</p></div></li></ul>";
        $('#user_farms').append(formoption);
        console.log(i, formoption)
    }
    //   $('#user_farms').html(formoption);
}

// drawFarm();
// fetchfarms();