import _ from 'lodash';
import './assets/style.css';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './classes/AppMain';


// export var initMaps = function (data_config, map_config, map_style_config) {
window.initMaps = function (data_config, map_config, map_style_config) {
    var app_main = Object.create(AppMain);
    app_main.maps_init(
        data_config,
        map_config,
        map_style_config
    );
    app_main.get_data_and_construct_map();
};

function component() {
    var element = document.createElement('div');
    var container_map = document.createElement('div');
    container_map.innerHTML = _.join([
        '<div id="map" class="map">' +
        '   <div id="popup" style="background-color:red;color:green;">' +
        '       <div id="popup-content" style="background-color:red;color:green;" class="backgroundColorSdecondary"></div>' +
        '       </div>' +
        '       <div id="popup_hover" style="background-color:red;color:green;">' +
        '           <div id="popup-content" style="background-color:red;color:green;" class="backgroundColordSecondary"></div>' +
        '       </div>' +
        '   </div>' +
        '</div>']);
    element.classList.add('container');
    element.appendChild(container_map);

    // var data_host = 'http://localhost:8765/';
    // initMaps({
    //         data_required: true,
    //         data_host: data_host,
    //         data_module: 'destinations/',
    //         data_method: 'indexAjax/',
    //         data_object_id: '',
    //         data_response_var: 'data'
    //     },
    //     {
    //         html_el_id: 'map',
    //         map_type: 'destinations',
    //         popup_type: 'destinations',
    //         entity_name: '',
    //         bing_api_key: 'AgDIw5d4u-xAIjrGSyKdo1FAFhHUPxEuKkx7eicMJyHkaJb2GcU-zGKxY92bfZE3',
    //         zoom: 9,
    //         c_lon: 16.363765,
    //         c_lat: 43.148504
    //     },
    //     {
    //         stroke_1: {
    //             color: '#fa7a0c',
    //             width: 2,
    //             lineDash: [.1, 5]
    //         },
    //         stroke_2: {
    //             color: '#82AE46',
    //             width: 1.0
    //         },
    //         stroke_3: {
    //             color: '#82AE46',
    //             width: 1.0
    //         },
    //         fill_1: {
    //             color: '#291aae'
    //         },
    //         fill_2: {
    //             color: '#82AE46'
    //         },
    //         fill_3: {
    //             color: '#82AE46'
    //         },
    //         point_icon: data_host + 'img/coordinate.png',
    //         home_icon: data_host + 'img/logo_new_2.png',
    //     });
    //

    return element;
}

document.body.appendChild(component());