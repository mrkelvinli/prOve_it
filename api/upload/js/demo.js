$(document).ready(function () {


  var upload_response = $("#upload_response");

  
  $(document).keypress(function(e) {
    console.log(e.which);
    if(e.code == 116 || e.which == 116) {
      window.location.href = '../event-study';
    }
  });
  


  //  upper_window.on('change paste keyup',function(){
  //    console.log($(this).val());
  //  });
  //  
  $("#upload_form").submit(function (event) {
    event.preventDefault();

    upload_response.empty();
    upload_response.show();
    upload_response.html("Processing ...");
    return false;
  });






});