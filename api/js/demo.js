$(document).ready(function () {
  var upload_response = $("#upload_response");
  $(".json-response").hide();


  // Here is how to show an error message next to a form field

  var errorField = $('.form-input-name-row');

  // Adding the form-invalid-data class will show
  // the error message and the red x for that field

  //      errorField.addClass('form-invalid-data');
  //      errorField.find('.form-invalid-data-info').text('Please enter your name');


  // Here is how to mark a field with a green check mark

  var successField = $('.form-input-email-row');

  //      successField.addClass('form-valid-data');



  var upper_window = $("input[name=upper_window]");
  var lower_window = $("input[name=lower_window]");
  var upper_var = $("input[name=upper_range]");
  var lower_var = $("input[name=lower_range]");
  var token = $("input[name=token]");


  var base_url = "http://prove-it-unsw.herokuapp.com/api/v1"

  //  upper_window.on('change paste keyup',function(){
  //    console.log($(this).val());
  //  });
  //  
  $("#upload_form").submit(function (event) {
    event.preventDefault();

    $.ajax({
      url: base_url + "/event-study/submit-files",
      type: 'POST',
      data: new FormData(this),
      processData: false,
      contentType: false,
      success: function (data) {
        console.log(data);
        upload_response.show();
        upload_response.text(JSON.stringify(data, undefined, 2));
      },
    });
    return false;
  });

  

  $("#cumulative-return-form").submit(function (event) {
    event.preventDefault();
    console.log(base_url + "/event-study/cumulative-returns");
    var url_endpoint = base_url + "/event-study/cumulative-returns";
    $.ajax({
      url: url_endpoint,
      type: 'GET',
      headers: {'Access-Control-Allow-Origin': '*'},
      data: {
        upper_window: 888,
      },
//      processData: true,
//      contentType: true,
      success: function (data) {
        console.log(data);
        upload_response.show();
        upload_response.text(JSON.stringify(data, undefined, 2));
      },
    });

//    var url = base_url + "/event-study/cumulative-returns";
//    url = "https://prove-it-unsw.herokuapp.com/api/v1/event-study/cumulative-returns";
//    $.get(url, {
//        upper_window: "678",
//        lower_window: "9",
//      },
//      function (data) {
//        console.log(data);
//      }
//    );
    return false;
  });








});