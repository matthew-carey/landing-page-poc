/*
  Name: branding.js
  Description: functions used to set values on the branding form and handle its "submit". Only loaded on index.html at the moment.
*/

// Gets values from querystring (or default vars) and uses to populate the branding form.
function customizeBrandingForm(){
  const patternHex = /[a-fA-F0-9]{6}/gm;
  const defaultPrimaryColor='582D82';
  const defaultSecondaryColor='00B5E2';
  const userPrimaryColor = urlParams.get('color');
  const userSecondaryColor = urlParams.get('secondary');
  const userBrand = urlParams.get('brand');
  const userLogo = urlParams.get('logo');

  if(userLogo){
    document.getElementById('logoURL').value="https://"+userLogo;
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
  if(userBrand=="w"){
    document.getElementById("brand_w").checked = true;
  }
  else{
    document.getElementById("brand_r").checked = true;
  }
}

// Function called on branding form "submit". Puts branding values into querystring and reloads the app.
function brandSite(){
  const colorPrimary = removePound( document.getElementById('colorPrimary').value );
  const colorSecondary = removePound( document.getElementById('colorSecondary').value );
  const brand = getCheckedValue('brand');
  if(document.getElementById('logoURL').value!=""){
    let logoUrl = document.getElementById('logoURL').value;
    logoUrl = logoUrl.replace('https://','');
    logoUrl = logoUrl.replace('http://','');
    window.location.href = "https://siteqa.intrado.com/landing_test/index.html?brand="+brand+"&color="+colorPrimary+"&secondary="+colorSecondary+"&logo="+logoUrl;
  }else{
    window.location.href = "https://siteqa.intrado.com/landing_test/index.html?brand="+brand+"&color="+colorPrimary+"&secondary="+colorSecondary;
  }
}