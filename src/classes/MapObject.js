import {Map, View} from 'ol';
import {fromLonLat} from 'ol/proj.js';
import TileLayer from 'ol/layer/Tile.js';
import {Tile, Vector} from 'ol/layer.js';
import BingMaps from 'ol/source/BingMaps.js';
import {Stamen, Raster} from 'ol/source';
import VectorSource from 'ol/source/Vector.js';
import Feature from 'ol/Feature.js';
import Overlay from 'ol/Overlay.js';
import Point from 'ol/geom/Point.js';
import {defaultsControl as defaultControls, FullScreen} from 'ol/control';
import {defaults} from 'ol/interaction';
import {Icon, Style, Circle, Text, Stroke, Fill} from 'ol/style';
import CircleGeom from 'ol/geom/Circle.js';
import OSM from 'ol/source/OSM.js';
import LineString from 'ol/geom/LineString.js';
import Geometry from 'ol/geom/Geometry.js';
import Control from 'ol/control/Control.js';
import Layer from 'ol/layer/Layer.js';
import Cluster from 'ol/source/Cluster';
import GeoJSON from 'ol/format/GeoJSON.js';
import KML from 'ol/format/KML.js';
import GPX from 'ol/format/GPX.js';

window.MapObject = {
    map: null,
    container: null,
    default_zoom: 10,
    default_lon: '',
    default_lat: '',
    center: null,
    zoom: null,
    data_config: null,
    data: [],

    map_config: {
        map_type: 'destinations',
        entity_name: '',
        radius: '5000',
        bing_api_key: 'AgDIw5d4u-xAIjrGSyKdo1FAFhHUPxEuKkx7eicMJyHkaJb2GcU-zGKxY92bfZE3',
        zoom: 8,
        center_lon: 16.363765,
        center_lat: 43.148504
    },
    map_style_config: {
        stroke_1: {
            color: '#fa7a0c',
            width: 2,
            lineDash: [.1, 5]
        },
        stroke_2: {
            color: '#82AE46',
            width: 1.0
        },
        stroke_3: {
            color: '#82AE46',
            width: 1.0
        },
        fill_1: {
            color: '#291aae'
        },
        fill_2: {
            color: '#82AE46'
        },
        fill_3: {
            color: '#82AE46'
        },
        point_icon: 'http://ncb.plavju.icu/webroot/img/coordinate.png',
        home_icon: 'http://ncb.plavju.icu/img/logo5.png',
    },
    layers: [],

    popover_on: false,
    popover_curr_location: false,

    init: function (data,data_config, map_config, map_style_config) {
        this.data = data;
        this.data_config = data_config;
        this.container = document.getElementById(map_config.html_el_id);
        this.default_zoom = map_config.zoom;
        this.default_lon = map_config.c_lon;
        this.default_lat = map_config.c_lat;
        this.map_config = map_config;
        this.map_style_config = map_style_config;

        this.center = fromLonLat([
            map_config.c_lon,
            map_config.c_lat
        ]);

        var view = new View({
            center: this.center,
            zoom: this.default_zoom
        });
        this.map = new Map({
            // interactions: defaults({mouseWheelZoom:false}),
            controls: [],
            // controls: defaultControls().extend([
            //     new FullScreen()
            // ]),
            // layers: layers,
            // layers: [],
            target: this.container,
            view: view
        });
    },
    set_listeners: function () {
        /* POPUP BTN I OBRADA*/
        var element = document.getElementById('popup');

        var element_hover = document.getElementById('popup_hover');

        var hover_overlay = {
            element: element,
            positioning: 'center',
            stopEvent: false,
            opacity: 0.5,
            offset: [0, 0]
        };

        var popup = new Overlay(hover_overlay);
        var popup_hover = new Overlay(hover_overlay);
        this.map.addOverlay(popup);

        // CLICK LISTENERS
        var statusElement = document.getElementById('popup_hover');


        var that = this;
        this.map.on('click', function (evt) { // display popup on click
            var feature = that.map.forEachFeatureAtPixel(evt.pixel,
                function (feature) {
                    return feature;
                },
                {hitTolerance: 10}
            );

            if (feature) {
                if (feature.values_.type==="icon") {
                    var ah = Object.create(window.AjaxHandler);
                    var url = that.data_config.data_host
                        // + that.data_config.data_module
                        + 'destinations/'
                        + that.data_config.data_method
                        +  feature.values_.id;
                    ah.init(url);
                    var data = ah.setCallback(function (status) {
                        if (status === true) {
                            var recieved_data = this.getResponseVariable('data')['destinations'][0];
                            $(element_hover).popover({
                                placement: 'bottom',
                                html: true,
                                created: true,
                                content:
                                    '<div id="popover_control_div" class="">'
                                    +'<div class="condtainer">'
                                    +'<div class="row">'
                                    +'<div class="col-sm-12">'
                                    +'<h4  class="textColorPrimary">'
                                    + recieved_data.name
                                    +'</h4>'
                                    + '<img '
                                    + 'alt="image_' + recieved_data.name + '" '
                                    + 'title="' + recieved_data.name + '" '
                                    + 'src="' + recieved_data.image_source + '" '
                                    + 'style="max-width:200px; height:100%;" '
                                    + 'class="img img-thumbnail">'
                                    +'</div>'
                                    +'</div>'
                                    +'<div class="row hidden-xs d-none d-sm-block">'
                                    +'<div class="col-sm-12">'
                                    +'<hr>'
                                    +'<p  style="color:black;"> '
                                    +feature.values_.desc
                                    +'</p>'
                                    +'</div>'
                                    +'</div>'
                                    +'</div>'
                                    +'</div>'
                            });
                            $(element_hover).popover('show');

                            var popup_exit = document.getElementById('popover_control_div');
                            popup_exit.addEventListener('click', function (event) {
                                $(element_hover).popover('dispose');
                            });

                        } else {
                        }
                    });
                    ah.setData("dd");
                    ah.executeRequest();
                }
                else{
                    $(element_hover).popover('dispose');
                }
            } else {
                $(element_hover).popover('dispose');
            }
        });
    },
    construct_map: function () {
        this.add_tile_osm_layer('waterway');
        this.set_listeners();
    },
    build_icon: function (point_name, point_desc, point_coordinates, point_image, point_id) {

        var iconStyle = new Style({
            text: new Text({
                text: point_name,
                scale: 2.0,
                offsetX: 10,
                offsetY: 15,
                stroke: new Stroke({
                    color: 'rgba(255,255,255, 1)',
                    width: 5
                }),

                fill: new Fill({
                    color: 'green',
                    width:2
                })
            }),
            image: new Icon(
                /** @type {module:ol/style/Icon~Options} */
                ({
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
                    opacity: 0.5,
                    anchorYUnits: 'pixels',
                    src: this.map_style_config.point_icon,
                    scale: 0.3
                })
            )
        });

        var iconFeature = new Feature({
            geometry: new Point(point_coordinates),
            id: point_id,
            name: point_name,
            desc: point_desc,
            image: point_image,
            type: 'icon',
            price: '-'
        });
        iconFeature.setStyle(iconStyle);
        return iconFeature;
    },
    add_routes_layer: function (data) {
        var index_i = 0;
        var point_name, vectorSource, point_desc, point_longitude=0, point_latitude=0, point_coordinates;
        var lnstr_arr = [];
        var vectorRoutes = [], lnstr, featureRoutes = [], ftr, lnstr;
        var point_coord_prev_lon = 0;
        var point_coord_prev_lat = 0;
        for (index_i = 0; index_i < data.length; index_i++) {
            //VRTI RUTE
            point_longitude = parseFloat(data[index_i].longitude);
            point_latitude = parseFloat(data[index_i].latitude);
            point_coordinates = fromLonLat([point_longitude, point_latitude]);

            // RUTE -Veze redom između svakog pointa
            lnstr_arr.push(point_coordinates);

            // var display_point_lon = point_longitude + (point_longitude-point_coord_prev_lon);
            // var display_point_lat = point_latitude + (point_latitude-point_coord_prev_lat);
            // lnstr_arr.push(
            //     fromLonLat([
            //             display_point_lon,
            //             display_point_lat
            //         ]));
            // point_coord_prev_lon = point_longitude;
            // point_coord_prev_lat = point_latitude;
        }

        lnstr = new LineString(
            lnstr_arr
        );

        ftr = new Feature({

                geometry: lnstr,
                name: '-',
                desc: '-',
                price: '-'
            }
        );

        ftr.setId("NEKI_ID");
        featureRoutes.push(ftr);


        var routesLayer = new Vector({
            source: new VectorSource({
                features: featureRoutes
            }),

            style: new Style({
                // stroke: new Stroke({
                //     color: 'rgba(0,128,0,0.4)',
                //     width: 3
                // }),
                text: new Text({
                    offsetX: -50,
                    offsetY: -100,
                    text: data[0]['excursion_name'],
                    scale: 3,
                    fill: new Fill({
                        color: 'rgba(0,128,0,0.8)',
                        width: 3
                    }),
                    stroke: new Stroke({
                        color: 'rgba(255,255,255,0.8)',
                        width: 2
                    }),
                }),
            })
        });
        this.map.addLayer(routesLayer);
    },
    add_radius_layer: function (radius, boat_name) {
        var radius_int = parseInt(radius);
        var centerLongitudeLatitude = fromLonLat([16.640570000000025, 43.2596]);
        var centessrLongitudeLatitude = fromLonLat([16.6540570000000025, 43.72596]);

        var RadiusTextStyle = new Feature(
            new CircleGeom(
                centerLongitudeLatitude,
                radius_int
            )
        );

        var source = new VectorSource({
            projection: 'EPSG:4326',
            features: [
                RadiusTextStyle
            ]
        });
        var radiusLayer = new Vector({
            source: source,
            center:centessrLongitudeLatitude,

            style: new Style({
                opacity: 0.4,
                stroke: new Stroke({
                    color: 'rgba(0, 0, 255, 0.2)',
                    width: 3
                }),
                text: new Text({
                    offsetX: 200,
                    offsetY: 50,
                    text: boat_name,
                    scale: 3,
                    fill: new Fill({
                        color: 'blue',
                        width: 2
                    }),
                    stroke: new Stroke({
                        color: 'white',
                        width: 3
                    }),
                }),
                fill: new Fill({
                    color: 'rgba(0, 0, 255, 0.06)'
                }),
            })
        });
        this.map.addLayer(radiusLayer);
    },
    add_icons_layer: function (data) {
        var index_i = 0, iconFeatures = [], iconFeature;
        var point_name,point_id, point_image='', vectorSource, point_desc, point_longitude, point_latitude, point_coordinates;

        for (index_i = 0; index_i < data.length; index_i++) {
            if (this.map_config.map_type === 'excursions') {
                var time_start = data[index_i].time_start;
                time_start = time_start.substring(0, 5);
                point_name = time_start + " - " + data[index_i].name;
            } else {
                point_name = data[index_i].name;
            }
            point_image = data[index_i].image_source;
            point_id = data[index_i].id;
            point_desc = data[index_i].description;
            point_longitude = data[index_i].longitude;
            point_latitude = data[index_i].latitude;
            point_coordinates = fromLonLat([point_longitude, point_latitude]);
            iconFeature = this.build_icon(point_name, point_desc, point_coordinates,point_image, point_id);
            iconFeatures.push(iconFeature);
        }
        vectorSource = new VectorSource({
            features: iconFeatures
        });
        var LayerIcons = new Vector({
            source: vectorSource,
            style: new Style({
                opacity: 0.4,
                stroke: new Stroke({
                    color: 'green',
                    width: 3
                }),

                fill: new Fill({
                    color: 'rgba(0, 0, 255, 0.1)'
                })
            })
        });
        this.map.addLayer(LayerIcons);
    },
    add_bing_layer: function () {
        var TerrainBingLayer = new TileLayer({
            source: new BingMaps({
                key: this.init_map_display_configuration.bing_api_key,
                imagerySet: 'Aerial'
            })
        });
        this.map.addLayer(TerrainBingLayer);
    },
    add_layer_watercolor: function () {
        var layer = new TileLayer({
            source: new Stamen({
                projection: 'EPSG:4326',
                layer: 'watercolor'
            })
        });
        this.map.addLayer(layer);
    },
    add_tile_osm_layer: function (type) {
        var layer = new TileLayer({
            source: new OSM(type),
            overflow: true
        });
        this.map.addLayer(layer);
    }
};