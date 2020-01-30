window.Logger = {
  display_categories : [
      'none','info','debug','all'
  ],
  current_display_setting:'all',


  log : function(item, entry_category){
    var log_true = false;
    if(this.current_display_setting === 'all'){
      log_true = true;
    }
    else if(this.current_display_setting === entry_category){
      log_true = true;
    }

    if(log_true === true){
      console.log(item);
    }
  },
  set_display_rule : function(code_name){
    if(code_name in this.display_categories){
      this.current_display_setting = code_name;
    }
  },
};