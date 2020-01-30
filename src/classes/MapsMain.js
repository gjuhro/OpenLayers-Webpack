import './MapObject';
import './Destinations';

window.MapsMain = {
    map_object: null,
    init: function (data,data_config,map_config, map_style_config) {
        console.log("AppMain Init! ");
        this.data = data;
        this.data_config = data_config;
        this.map_config = map_config;
        this.map_style_config = map_style_config;
        this.map_object = Object.create(MapObject);
        this.map_object.init(
            this.data,
            this.data_config,
            this.map_config,
            this.map_style_config
        );
        this.map_object.construct_map();
    },
    determineLayers: function () {
        console.log("Add Layers");
        if (this.map_config.map_type === 'boat') {
            this.map_object.add_radius_layer(this.data.boat.radius,this.data.boat.name);
            this.map_object.add_icons_layer(this.data.destinations);
        }
        else if (this.map_config.map_type === 'destinations') {

            this.map_object.add_radius_layer(70, 'Nautic Center Bol');
            this.map_object.add_radius_layer(5000, 'Nautic Center Bol');
            this.map_object.add_radius_layer(10000, 'Nautic Center Bol');
            this.map_object.add_radius_layer(50000, 'Nautic Center Bol');
            this.map_object.add_radius_layer(100000, 'Nautic Center Bol');
            this.map_object.add_radius_layer(150000, 'Nautic Center Bol');
            this.map_object.add_radius_layer(200000, 'Nautic Center Bol');


            this.map_object.add_icons_layer(
                this.data.destinations
        );


        }
        else if (this.map_config.map_type === 'excursion') {
            this.map_object.add_routes_layer(this.data.destinations);

            this.map_object.add_icons_layer(
                this.data.destinations
            );
        }
    }
};