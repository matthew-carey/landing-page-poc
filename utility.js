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

      function populateRecordings(key){
        // load the JSON for use
        const appText = request.response;
        const data = JSON.parse(appText);
        if( data.results[0][key] ){
        }else{ // If the specified key does not exist, fail...
          console.log("Oops...");
        }
      }

      function clearInput(obj){
        const parentContainer = obj.closest('div');
        for(let i=0; i<parentContainer.childNodes.length; i++){
          const inputs = parentContainer.getElementsByTagName('input');
          for(let j=0; j<inputs.length; j++){
            inputs[j].value="";
          }
        }
        obj.style.visibility="hidden"; // hide the clear button       
      }

      function showClear(obj){
        const parentContainer = obj.closest('div');
        if(obj.value!=""){
          for(let i=0; i<parentContainer.childNodes.length; i++){
            if(parentContainer.childNodes[i].className=="btnClear"){
              parentContainer.childNodes[i].style.visibility="visible";
            }
          }
        }else{
          for(let i=0; i<parentContainer.childNodes.length; i++){
            if(parentContainer.childNodes[i].className=="btnClear"){
              parentContainer.childNodes[i].style.visibility="hidden";
            }
          } 
        }
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
          if( document.getElementById('submitSynopsis') ) { document.getElementById('submitSynopsis').innerHTML = synopsis; }
          if( document.getElementById('submitMessage') ) { document.getElementById('submitMessage').innerHTML = message; }
          if( document.getElementById('whatsNext') ) { document.getElementById('whatsNext').innerHTML = whatsNext; }
          
          if( document.getElementById('pictureContainer') ) { 
            // Assign attributes to the image and add to DOM
            const newImage = document.createElement('object');
            newImage.id = "svgObject";
            newImage.className = "customSVG primarySVG";
            newImage.data = imageURL;
            newImage.type = "image/svg+xml";
            document.getElementById('pictureContainer').appendChild(newImage);
          }
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
          if(document.getElementById('recomendations')) { document.getElementById('recomendations').innerHTML = content; } // insert the newly created content into the DOM

        }else{ // If the specified key does not exist, fail...
          console.log("Oops...");
        }
      }

      const pSBC=(p,c0,c1,l)=>{
        // Documentation at...
        // https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
        // https://jsfiddle.net/PimpTrizkit/a7ac0qvp/
        let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
        if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
        if(!this.pSBCr)this.pSBCr=(d)=>{
            let n=d.length,x={};
            if(n>9){
                [r,g,b,a]=d=d.split(","),n=d.length;
                if(n<3||n>4)return null;
                x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
            }else{
                if(n==8||n==6||n<4)return null;
                if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
                d=i(d.slice(1),16);
                if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
                else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
            }return x};
        h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
        if(!f||!t)return null;
        if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
        else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
        a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
        if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
        else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
    }

      // Colorize SVG based on hex parameter
      function colorSVG(useColor1="#582D82",useColor2="#00B5E2"){
        const objs = document.getElementsByClassName('svgObjects');
        for(let i=0; i<objs.length; i++){
          const svgDoc = objs[i].contentDocument;
          const svgItem1 = svgDoc.getElementsByClassName('svg-primary-color');
          const svgItem2 = svgDoc.getElementsByClassName('svg-secondary-color');
          for(let i=0; i<svgItem1.length; i++){
            svgItem1[i].setAttribute('fill',useColor1);
          }
          for(let i=0; i<svgItem2.length; i++){
            svgItem2[i].setAttribute('fill',useColor2);
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

        const menuLinks = document.querySelectorAll("ul#menuSection li.active a");
        for(let i=0; i<menuLinks.length; i++){
          menuLinks[i].style.color=useColor;
        }
        /*console.log(document.styleSheets);*/
        document.styleSheets[6].insertRule('#sidebar ul li a:hover { color: '+useColor+'; }', 6);
        document.styleSheets[6].insertRule('a[aria-expanded="true"] { color: '+useColor+'; }', 6);
        
        const colorNoHash = useColor.split("#").join("");
        const color40 = pSBC(.40,'#'+colorNoHash);
        document.styleSheets[6].insertRule('ul.submenu a { background-color: '+color40+'; }', 6);

        const colorLight = pSBC(.80,'#'+colorNoHash);
        document.styleSheets[6].insertRule('.light { background-color: '+colorLight+'; }', 6);

        // apply border colors
        const border = document.getElementsByClassName('primaryColorBorder');
        for(let i=0; i<border.length; i++){
          border[i].style.borderColor=useColor;
        }

        const lightBorder = document.getElementsByClassName('primaryColorBorderLight');
        for(let i=0; i<lightBorder.length; i++){
          lightBorder[i].style.borderColor=color40;
        }

        const borderBottom = document.getElementsByClassName('primaryColorBorderBottom');
        for(let i=0; i<borderBottom.length; i++){
          borderBottom[i].style.borderBottomColor=useColor;
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
        if( document.getElementById('uHome') ) { document.getElementById('uHome').href = "index.html"+qString; }
        if( document.getElementById('uRecordings') ) { document.getElementById('uRecordings').href = "recordings.html"+qString; }
        if( document.getElementById('uEmail') ) { document.getElementById('uEmail').href = "email.html"+qString;}
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

          if( document.getElementById('logo') ) { document.getElementById('logo').src = data.results[0][brand]['logo']; }
          if( document.getElementById('footerImg') ) { document.getElementById('footerImg').src = data.results[0][brand]['footer']; }

          const productName = document.querySelectorAll(".productName");
          for(let i=0; i<productName.length; i++){
            productName[i].innerHTML=data.results[0][brand]['productName'];
          }

          const companyName = document.querySelectorAll(".companyName");
          for(let i=0; i<companyName.length; i++){
            companyName[i].innerHTML=data.results[0][brand]['companyName'];
          }
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