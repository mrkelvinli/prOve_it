$(document).ready(function () {
  var upload_response = $("#upload_response");
  var cumulative_response = $('#cumulative_response');
  $(".json-response").hide();


  // Here is how to show an error message next to a form field

  //  var errorField = $('.form-input-name-row');

  // Adding the form-invalid-data class will show
  // the error message and the red x for that field

  //      errorField.addClass('form-invalid-data');
  //      errorField.find('.form-invalid-data-info').text('Please enter your name');


  // Here is how to mark a field with a green check mark

  var successField = $('.form-input-name-row');

  successField.on('change paste keyup', function () {
    if ($(this).find('input').val() != '') {
      $(this).addClass('form-valid-data');
    } else {
      $(this).removeClass('form-valid-data');

    }
  });


  var upper_window = $("input[name=upper_window]");
  var lower_window = $("input[name=lower_window]");
  var upper_var = $("input[name=upper_range]");
  var lower_var = $("input[name=lower_range]");
  var var_name = $("input[name=var_name]");
  var token = $("input[name=token]");


  // var base_url = "http://prove-it-unsw.herokuapp.com/api/v1";
  var base_url = "http://localhost:3000/api/v1";


  //  upper_window.on('change paste keyup',function(){
  //    console.log($(this).val());
  //  });
  //  
  $("#upload_form").submit(function (event) {
    event.preventDefault();

    upload_response.empty();
    upload_response.show();
    upload_response.html("Processing ...");

    $.ajax({
      url: base_url + "/event-study/submit-files",
      type: 'POST',
      data: new FormData(this),
      processData: false,
      contentType: false,
      success: function (data) {
        console.log(data.token);
        upload_response.show();
        upload_response.empty();
        upload_response.html("Your token is: " + data.token);
      },
      error: function (data) {
        upload_response.show();
        upload_response.empty();
        upload_response.text(JSON.stringify(data.responseJSON, undefined, 2));
      },
    });
    return false;
  });



  $("#cumulative-return-form").submit(function (event) {
    event.preventDefault();

    cumulative_response.empty();
    cumulative_response.show();
    cumulative_response.html("Processing ...");

    var data = {
      upper_window: 5,
      lower_window: -5,
      topic_upper_range: 1.5,
      topic_lower_range: 0.5,
      topic_name: "Cash Rate",
      token: "ofs9PCBMsKsvByft3NWc",
      //      upper_window: upper_window.val(),
      //      lower_window: lower_window.val(),
      //      topic_upper_range : upper_var.val(),
      //      topic_lower_range : lower_var.val(),
      //      topic_name : var_name.val(),
      //      token: token.val(),
    };

    $.ajax({
      url: base_url + "/event-study/cumulative-returns",
      type: 'GET',
      data: data,
      processData: true,
      success: function (data) {
        all_cr = data.Event_Cumulative_Return;
        populate_events(data.Event_Cumulative_Return);
        cumulative_response.empty();
        cumulative_response.show();
//        cumulative_response.text(JSON.stringify(data.Event_Cumulative_Return, undefined, 2));
//        cumulative_response.text("Use the chart below to view the results.");
      },
      error: function (data) {
        console.log(data.responseJSON);
        cumulative_response.empty();
        cumulative_response.show();
        cumulative_response.text(JSON.stringify(data.responseJSON, undefined, 2));
      },
    });

    return false;
  });

  var all_cr = null;

  function render_chart(data) {
    var company_name = data['company_name'].toString();
    var date = data['event_date'].toString();
    var cr = data['cumulative_returns'];
    var labels = [];
    var series = [];
    for (var j = 0; j < cr.length; j++) {
      var k = getHashKey(cr[j]);
      labels.push(k);
      series.push(cr[j][k]);
    }
    new Chartist.Line('.ct-chart', {
      labels: labels,
      series: [series],
    });

  }

  function getHashKey(h) {
    return Object.keys(h)[0];
  }

  function populate_events(data) {
    var dropdown = document.getElementById("chart-dropdown-menu");

    for (var i = 0; i < data.length; i++) {
      var company_name = data[i]['company_name'].toString();
      var date = data[i]['event_date'].toString();

      var li = document.createElement("li");
      var a = document.createElement('a');
      a.appendChild(document.createTextNode(company_name + " | " + date));
      li.appendChild(a);
      dropdown.appendChild(li);
      $(li).data('company_name', company_name);
      $(li).data('date', date);
    }
  }

  $('#chart-dropdown-menu').on('click', 'li', function () {
    //    console.log($(this).data());
    var company_name = $(this).data('company_name');
    var date = $(this).data('date');
    for (var i = 0; i < all_cr.length; i++) {
      var curr_c = all_cr[i]['company_name'].toString();
      var curr_date = all_cr[i]['event_date'].toString();
      if (company_name == curr_c && date == curr_date) {
        //        console.log("found");
        render_chart(all_cr[i]);
        break;
      }
    }
  });






});