/*
  Name: branding.js
  Description: functions used to set values on the branding form and handle its "submit". Only loaded on index.html at the moment.
*/

// Gets values from querystring (or default vars) and uses to populate the branding form.
function disableInputs(){
  const inputs = document.querySelectorAll(".formBranding input:not([type='radio'])");
  for (let i=0;i<inputs.length;i++){
    inputs[i].disabled=true;
  }
}

function enableInputs(){
  const inputs = document.querySelectorAll(".formBranding input");
  for (let i=0;i<inputs.length;i++){
    inputs[i].disabled=false;
  }
}

function customizeBrandingForm(){
  const patternHex = /[a-fA-F0-9]{6}/gm;
  const defaultPrimaryColor='582D82';
  const defaultSecondaryColor='00B5E2';
  const userPrimaryColor = urlParams.get('color');
  const userSecondaryColor = urlParams.get('secondary');
  const userBrand = urlParams.get('brand');
  const userLogo = urlParams.get('logo');
  const userCompany = urlParams.get('company');
  const userProduct = urlParams.get('product');
  const userUrlTc = urlParams.get('urlTC');
  const userUrlP = urlParams.get('urlP');

  if(userBrand=="w"){
    document.getElementById("brand_w").checked = true;
    enableInputs();
  }
  else{
    document.getElementById("brand_r").checked = true;
    disableInputs();
  }

  if(userLogo){
    document.getElementById('logoURL').value="https://"+userLogo;
  }

  if(userCompany){
    document.getElementById('companyName').value=userCompany;
  }

  if(userProduct){
    document.getElementById('productName').value=userProduct;
  }

  if(userUrlTc){
    document.getElementById('urlTC').value = userUrlTc;
  } 

  if(userUrlP){
    document.getElementById('urlP').value = userUrlP;
  } 

  let usePrimaryColor = defaultPrimaryColor;
  if( queryString && userPrimaryColor && patternHex.test(userPrimaryColor) ){
    usePrimaryColor = userPrimaryColor;
  }

  let useSecondaryColor = defaultSecondaryColor;
  console.log(queryString);
  console.log(userSecondaryColor);
  console.log(patternHex.test(userSecondaryColor));
  if( queryString && userSecondaryColor && patternHex.test(userSecondaryColor) ){
    console.log('condition met');
    useSecondaryColor = userSecondaryColor;
  }

  document.getElementById('colorPrimary').value = "#"+usePrimaryColor;
  document.getElementById('colorSecondary').value = "#"+useSecondaryColor;
}

// Function called on branding form "submit". Puts branding values into querystring and reloads the app.
function brandSite(){
  const colorPrimary = removePound( document.getElementById('colorPrimary').value );
  const colorSecondary = removePound( document.getElementById('colorSecondary').value );
  const brand = getCheckedValue('brand');
  let customLink = "https://siteqa.intrado.com/landing_test/index.html";
  customLink = customLink+"?result=success&brand="+brand;

  if( brand!="r" ){
    customLink = customLink+"&color="+colorPrimary+"&secondary="+colorSecondary;
    // Logo
    if(document.getElementById('logoURL').value!=""){
      let logoUrl = document.getElementById('logoURL').value;
      logoUrl = logoUrl.replace('https://','');
      logoUrl = logoUrl.replace('http://','');
      customLink = customLink+"&logo="+logoUrl;
    }
    // Company Name
    if(document.getElementById('companyName').value!="" && brand!="r"){
      const companyName = document.getElementById('companyName').value
      customLink = customLink+"&company="+companyName;
    }
    // Product Name
    if(document.getElementById('productName').value!=""){
      const productName = document.getElementById('productName').value
      customLink = customLink+"&product="+productName;
    }

    // URL - Terms & Conditions
    if(document.getElementById('urlTC').value!=""){
      const urlTC = document.getElementById('urlTC').value
      customLink = customLink+"&urlTC="+urlTC;
    }

    // URL - Privacy Policy
    if(document.getElementById('urlP').value!=""){
      const urlP = document.getElementById('urlP').value
      customLink = customLink+"&urlP="+urlP;
    }
  }

  window.location.href = customLink;
}

function updateBrandingPreview(){
  const brand = getCheckedValue('brand');


  if(brand=="w"){
    
    let primaryColor = "";
    let secondaryColor = "";
    if(document.getElementById('colorPrimary').value=="" || document.getElementById('colorPrimary').value.toLowerCase()=="#582d82"){
      document.getElementById('colorPrimary').value = "#065971";
      primaryColor = "#065971";
    }else{
      primaryColor = document.getElementById('colorPrimary').value;
    }

    if(document.getElementById('colorSecondary').value=="" || document.getElementById('colorSecondary').value.toLowerCase()=="#00b5e2"){
      document.getElementById('colorSecondary').value = "#75868C";
      secondaryColor = "#75868C";
    }else{
      secondaryColor = document.getElementById('colorSecondary').value;
    }

    let urlLogo = "https://siteqa.intrado.com/landing_test/img/logo-wholesale.png";
    if(document.getElementById('logoURL').value!=""){
      urlLogo = document.getElementById('logoURL').value;
      urlLogo = urlLogo.replace('https://','');
      urlLogo = urlLogo.replace('http://','');
      urlLogo = "https://"+urlLogo;
    }
  
    const previewElems_primaryColor = document.querySelectorAll(".previewPrimaryColor");
    const previewElems_secondaryColor = document.querySelectorAll(".previewSecondaryColor");
  
    for(let i=0; i<previewElems_primaryColor.length; i++){
      previewElems_primaryColor[i].style.backgroundColor=primaryColor;
    }
  
    for(let i=0; i<previewElems_secondaryColor.length; i++){
      previewElems_secondaryColor[i].style.color=secondaryColor;
    }
    enableInputs();
    document.getElementById("previewLogo").src = urlLogo;
    document.getElementById('brandingPreview').style.display = "";
  }
  else{
    disableInputs();
    document.getElementById('brandingPreview').style.display = "none";
    document.getElementById('colorPrimary').value = "#582d82";
    document.getElementById('colorSecondary').value = "#00b5e2";
    document.getElementById('logoURL').value = "";
    document.getElementById('companyName').value = "";
    document.getElementById('productName').value = "";
    document.getElementById('urlTC').value = "";
    document.getElementById('urlP').value = "";
  }
}