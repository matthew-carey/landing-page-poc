      // Determine the user's language preference and fetch the appropriate JSON file for strings
      function getLangPref(){
        const preferredLanguagesBrowser = navigator.languages;
        let preferredLangs = preferredLanguagesBrowser.map(lang => lang.toLowerCase()); // convert browser values to lowercase so we're dealing with apples-to-apples
        preferredLangs = preferredLangs.map(function(lang) { // I'm only providing two-letter lang. files at the moment (no -AA variants)
          const twoLetterLang = lang.charAt(0)+lang.charAt(1);
          return twoLetterLang;
        });
        preferredLangs = preferredLangs.filter(function(item, index, self) { // remove duplicates (e.g. lang. variants that have been reduced to two-letters)
          return self.indexOf(item) == index;
        });

        return preferredLangs;
      }

      // Determine if file exists
      function fileExists(urlToFile) {
          const xhr = new XMLHttpRequest();
          xhr.open('HEAD', urlToFile, false);
          xhr.send();
          
          if (xhr.status == "404") {
              return false;
          } else {
              return true;
          }
      }

      // check descending preference for existence of lang. files. if not found, use default
      function checkLangFile(preferredLanguages){
        const defaultLang = "en";
        let useSource = "data/"+defaultLang+".json";

        for(let i=0;i<preferredLanguages.length;i++){
          const fileName = preferredLanguages[i]+".json";
          const path2File = dataFilesBaseURL+fileName; // dataFilesBaseURL is a string similar to "https://yoursite.com/app/data/" (for me, it's the public URL of the "data" folder in the repo)
          if( fileExists(path2File) ){
            useSource = "data/"+fileName;
            break;
          }
        }
        return useSource;
      }

      // Populate the contents onto the card from JSON
      function populateCard(key){
        // load the JSON for use
        const appText = request.response;
        const data = JSON.parse(appText);

        if( data.results[0][key] ){ // If the specified key exists, proceed...
          // get values from JSON and assign to vars within the func
          const synopsis = data.results[0][key]['synopsis'];
          const message = data.results[0][key]['message'];
          const whatsNext = data.results[0][key]['whatsNext'];
          const imageURL = data.results[0][key]['image'];
          const imageAlt = data.results[0][key]['image-alt'];

          // Populate values from JSON into DOM
          document.getElementById('submitSynopsis').innerHTML = synopsis;
          document.getElementById('submitMessage').innerHTML = message;
          document.getElementById('whatsNext').innerHTML = whatsNext;
          
          // Assign attributes to the image and add to DOM
          const newImage = document.createElement('object');
            newImage.id = "svgObject";
            newImage.className = "customSVG primarySVG";
            newImage.data = imageURL;
            newImage.type = "image/svg+xml";
            document.getElementById('pictureContainer').appendChild(newImage);

          // Build the 'recommendations' area from an array of items
          let content = "";
          const cardChoices = data.results[0][key]['choices'];
          cardChoices.forEach(function(result,i){
            if(i==0){
              content += "<div class=\"row\">"; // make a new row for the first item in the array
            }
            // each item in the array will get the following...
            content += "<div class=\"col-xs-12 col-sm-12 col-md-6 col-lg-6 reccomendationBox\">";
            str = cardChoices[i]['image'];
            if(str.substring(str.length-3)=="svg"){
              content += "<object class=\"svgObjects\" data=\""+cardChoices[i]['image']+"\" type=\"image/svg+xml\"></object>";
            }else{
              content += "<img src=\""+cardChoices[i]['image']+"\" alt=\""+cardChoices[i]['heading']+"\" />";
            }
            content += "<h4>"+cardChoices[i]['heading']+"</h4>";
            content += "<p>"+cardChoices[i]['text']+"</p>";
            content += "</div>";
            
            // close out the row and start a new row for every second item (if applicable)
            if(i!=0 && i%2==1){
              content += "</div><div class=\"row\">";
            }
          });
          content += "</div>"; // close out the last row
          document.getElementById('recomendations').innerHTML = content; // insert the newly created content into the DOM

        }else{ // If the specified key does not exist, fail...
          console.log("Oops...");
        }
      }

      // Colorize SVG based on hex parameter
      function colorizeSvg(useColor="#582D82"){

        //let useColor2 = "#00B5E2";
        let useColor2 = "#ff0000";

        const obj = document.getElementById('svgObject');
        //console.log(obj);
        const svgDoc = obj.contentDocument;
        //console.log(svgDoc);
        const svgItem = svgDoc.getElementsByClassName('svg-primary-color');
        //console.log(svgItem);
        for(let i=0; i<svgItem.length; i++){
          svgItem[i].setAttribute('fill',useColor);
        }

        const objs = document.getElementsByClassName('svgObjects');
        for(let i=0; i<objs.length; i++){
          const svgDoc = objs[i].contentDocument;
          const svgItem = svgDoc.getElementsByClassName('svg-primary-color');
          const svgItem2 = svgDoc.getElementsByClassName('svg-secondary-color');
          for(let i=0; i<svgItem.length; i++){
            svgItem[i].setAttribute('fill',useColor);
          }
          for(let i=0; i<svgItem2.length; i++){
            svgItem2[i].setAttribute('fill',useColor2);
          }
        }

        //svgObject.style.visibility="visible";
      }

      function colorizeSvg2(useColor="#00B5E2"){
        const objs = document.getElementsByClassName('svgObjects');
        for(let i=0; i<objs.length; i++){
          const svgDoc = objs[i].contentDocument;
          const svgItem2 = svgDoc.getElementsByClassName('svg-secondary-color');
          for(let i=0; i<svgItem2.length; i++){
            svgItem2[i].setAttribute('fill',useColor);
          }
        }
      }

      function colorizeCss(useColor="#582D82"){
        // apply background colors
        const bg = document.getElementsByClassName('primaryColorBG');
        for(let i=0; i<bg.length; i++){
          bg[i].style.backgroundColor=useColor;
        }

        // apply text colors
        const text = document.getElementsByClassName('primaryColorText');
        for(let i=0; i<text.length; i++){
          text[i].style.color=useColor;
        }

        // apply border colors
        const border = document.getElementsByClassName('primaryColorBorder');
        for(let i=0; i<border.length; i++){
          border[i].style.borderColor=useColor;
        }
      }

      function colorizeCss2(useColor2="#00B5E2"){
        // apply background colors
        const bg2 = document.getElementsByClassName('secondaryColorBG');
        for(let i=0; i<bg2.length; i++){
          bg2[i].style.backgroundColor=useColor2;
        }

        // apply text colors
        const text2 = document.getElementsByClassName('secondaryColorText');
        for(let i=0; i<text2.length; i++){
          text2[i].style.color=useColor2;
        }
        // apply border colors
        const border2 = document.getElementsByClassName('secondaryColorBorder');
        for(let i=0; i<border2.length; i++){
          border2[i].style.borderColor=useColor2;
        }
      }

      function returnValidHexColor(str){
        let hexColor = str.replace('#','');
        hexColor = '#'+hexColor;
        hexColor = hexColor.toLowerCase();
        return hexColor;
      }

      function getColorPref(){
        // Change SVG color from querystring
        const defaultColor='#582D82';
        const userColor = urlParams.get('color');
        const patternHex = /#?[a-fA-F0-9]{6}/gm;
        let useColor = defaultColor;

        if( queryString && userColor && patternHex.test(userColor) ){
          useColor = returnValidHexColor(userColor);
        }

        return useColor;
      }

      function getColorPref2(){
        // Change SVG color from querystring
        const defaultColor='#00B5E2';
        const userColor = urlParams.get('secondary');
        const patternHex = /#?[a-fA-F0-9]{6}/gm;
        let useColor = defaultColor;

        if( queryString && userColor && patternHex.test(userColor) ){
          useColor = returnValidHexColor(userColor);
        }

        return useColor;
      }

      function updateLinks(){
        const qString = paramString
        document.getElementById('uHome').href = "index.html"+qString;
        document.getElementById('uRecordings').href = "recordings.html"+qString;
      }

      // Where our data/content comes from  - Use the appropriate JSON file for the language if it exists, otherwise fall back on the default
      const preferredLanguages = getLangPref();    
      const dataSource = checkLangFile(preferredLanguages);

      // Look for incoming querystring and parameters
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      let paramString = urlParams.toString();
      paramString = "?"+paramString;
      
      // This is the custom value to look for
      const result = urlParams.get('result');
      const okResults = ["success","maybe","failure","unknown"];

      // connect to the JSON
      let request = new XMLHttpRequest();
      request.open('GET', dataSource);
      request.responseType = 'text';
      request.send();

      function buildSidebar(){
        const useSource = "data/brand.json";
        const queryString = window.location.search;
        const result = urlParams.get('brand');
        const okResults = ["r","w"];

        let request = new XMLHttpRequest();
        request.responseType = 'text';
        request.open('GET', useSource);
        request.send();

        // load the JSON for use
        request.onload = function(){
          const appText = request.response;
          const data = JSON.parse(appText);

          if( result && okResults.includes(result) ){
            brand=result;
          }
          else{
            brand = "r";
          }

          document.getElementById('logo').src = data.results[0][brand]['logo'];
          document.getElementById('footerImg').src = data.results[0][brand]['footer'];
        };
      }

      // Load the first card when the page loads - start populating content from our initial screen
      request.onload = function() {
        const startingCard = "unknown"; // This is our starting point - make sure this is a valid key in the JSON
        if( queryString && result && okResults.includes(result) ){ // use the querystring if it exists and is valid
          populateCard(result);
        }else{
          populateCard(startingCard); // otherwise load the default content
        }

        buildSidebar();
      }  