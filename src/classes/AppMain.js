import './AjaxHandler';
import './MapsMain';

window.AppMain = {
    app_type: 'OpenLayersApplication',
    app_version: '1.0.0',
    app_name: 'Nautic Center BOL',

    author_name: 'Jure Plavcic',
    author_email: 'plavju@gmail.com',
    data_required: true,
    data_received: false,

    data_host: '',
    data_module: '',
    data_method: '',
    data_object_id: '',
    data_response_var: '',

    console_hlp: null,
    raw_data: null,

    map_config:null,
    map_style_config:null,

    logger: null,

    maps_init: function (data_config,map_config,map_style_config ) {
        this.data_config = data_config;
        this.map_config = map_config;
        this.map_style_config = map_style_config;

        this.data_required = data_config.data_required;
        this.data_host = data_config.data_host;
        this.data_module = data_config.data_module;
        this.data_method = data_config.data_method;
        this.data_object_id = data_config.data_object_id;
        this.data_response_var = data_config.data_response_var;
    },
    get_data_and_construct_map: function () {
        if (this.data_required === true && this.data_received === false) {
            var ah = Object.create(AjaxHandler);
            var url = this.data_host + this.data_module + this.data_method + this.data_object_id;
            var that = this;
            ah.init(url);
            var data = ah.setCallback(function (status) {
                if (status === true) {
                    var recieved_data = this.getResponseVariable(that.data_response_var);
                    that.raw_data = recieved_data;
                    that.data_received = true;
                    that.construct_app();
                } else {
                }
            });
            ah.setData("dd");
            ah.executeRequest();
        }
        else{
            this.construct_app();
        }
    },
    construct_app: function () {

        var that = this;
        if (this.data_required === true) {
            console.log("Data dependant ");
        }

        if (this.data_received === true) {

            var main = Object.create(MapsMain);
            main.init(
                this.raw_data,
                this.data_config,
                this.map_config,
                this.map_style_config
            );
            main.determineLayers(this.data,this.map_config);
        }
    }
};