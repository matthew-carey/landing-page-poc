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
    newImage.className = "customSVG primarySVG svgObjects";
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

function returnContrastingColor(hex){
  hex = hex.replace("#", "");
  var r = parseInt(hex.substr(0,2),16);
  var g = parseInt(hex.substr(2,2),16);
  var b = parseInt(hex.substr(4,2),16);
  var yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 180) ? '#060606' : '#FEFEFE'; // ? 'black' : 'white'
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

  // get contrasting color
  const contastColor = returnContrastingColor(useColor);
  console.log(contastColor);

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
  document.styleSheets[6].insertRule('#sidebar { color: '+contastColor+'; }', 6);
  document.styleSheets[6].insertRule('#sidebar ul p { color: '+contastColor+'; }', 6);

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
    if(urlParams.get('logo') && urlParams.get('logo')!=""){
      document.getElementById('logo').src = "https://"+urlParams.get('logo');
    }else{
      if( document.getElementById('logo') ) { document.getElementById('logo').src = data.results[0][brand]['logo']; }
    }
    
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