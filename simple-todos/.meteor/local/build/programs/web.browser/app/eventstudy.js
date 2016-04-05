function readSingleFile(evt) {
        //Retrieve the first (and only!) File from the FileList object
        var f = evt.target.files[0]; 

        if (f) {
          var r = new FileReader();
          r.onload = function(e) { 
              var contents = e.target.result;
            alert( "Got the file.\n" 
                  +"name: " + f.name + "\n"
                  +"type: " + f.type + "\n"
                  +"size: " + f.size + " bytes\n"
                  + "starts with: " + contents.substr(1, contents.indexOf("\n"))
            );  
            document.getElementById('area').value=  contents;
          }
          r.readAsText(f);

        } else { 
          alert("Failed to load file");
        }
      }

      document.getElementById('fileinput').addEventListener('change', readSingleFile, false); 
