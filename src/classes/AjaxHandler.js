window.AjaxHandler = {
  url: '',
  method: "GET",
  async: true,
  data: null,
  callback: null,
  responseText: null,


  init: function (url) {
    this.url = url;
  },
  setData: function (data) {
    this.data = data;
  },

  setCallback: function (callback) {
    this.callback = callback;
  },
  executeRequest: function () {
    var that = this;
    var xhttp = new XMLHttpRequest();
    xhttp.open(this.method, this.url, this.async);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.timeout = 10000; // timeout 10 sekundi
    xhttp.ontimeout = function () {
      console.log("SERVER UNRESPONSIVE");
      that.callback(false);
    };
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200 && xhttp.responseText) {
          //console.log("-----------", xhttp.responseText);
          //console.log("-----status------", xhttp.status);
          try {

            that.responseText = JSON.parse(xhttp.responseText);
            that.callback(true);
          } catch (e) {
            //console.log(e);
            that.responseText = {success: false};
            that.callback(false);
          }
        } else {
          //console.log("-----------", xhttp.responseText);
          //console.log("Error", xhttp.statusText);
          that.callback(false);
        }
      }
    };

    try {
      xhttp.send(this.data);
    } catch (e) {
      console.log("xhttp.send.error: ", e);
    }
  },
  getResponseVariable: function (variableName) {
    return this.responseText[variableName];
  }
};