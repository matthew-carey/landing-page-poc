// Load Vendors - I need these in the <head>. DataTables only needs to be loaded on the index HTML page.
//require('jquery');
//require('bootstrap');
//require('datatables.net');
//require('datatables.net-bs4');
//require('datatables.net-select');
//require('datatables.net-select-bs4');

//import SandBox from "./SandBox";
//const sandbox = new SandBox();

// My JS for the app

// Removes duplicate values from array - var arrayName = {srcArray}.filter( onlyUnique );
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

$(function(){ // document.ready
  // Update btn-group based on drop-down selection
  $(document).on('click','a.dropdown-item',function(e){
    e.preventDefault();
    $(this).parents(".btn-group").find('.btn:first-child').html( $(this).text() );
  });

/* BEGIN DATATABLE ITEMS */
/* --------------------- */

  if( $('#table-releases').length > 0 ){
    $('#filterClear').hide();

    // Allow sorting and filtering of the datatable - See https://datatables.net
    $.fn.dataTable.moment( 'D MMMM YYYY' );
    $('#table-releases').DataTable({
      "paging":   false,
      "info":     false,
      "searching": true,
      columnDefs: [
        { targets: [3,4,5], orderable: false }, // disable sorting on 'Status', 'Applications' and 'Actions' column
      ],
      "order": [[ 2, "desc" ]], // default sort by 'Date' column
      dom: 'lrtp',
    });
  }

  // Clear data table filters
  $(document).on('click','#filterClear',function(){
    $('#filterClear').hide();
    var table = $('#table-releases').DataTable();
    table.columns().search('').draw();
  });

  // Test Filter data table
  /*
  $(document).on('click','#filter',function(){
    var table = $('#table-releases').DataTable();
    table.columns(3).search("Archived").draw();
  });
  */

  // Filter data table based on which filter is clicked
  $(document).on('click','a.a__filter',function(e){
    e.preventDefault();

    // determine column
    var thText = $(this).parents("th").text();
    var index = $('#table-releases tr th').filter(
      function(){
        return $(this).text() == thText;
      }
    ).index();

    // get all badge text within the selected column
    var tdVals = [];
    $('#table-releases tr td:nth-child('+ parseInt(index+1) +')').each(function(){
      $(this).find('.badge').each(function(){
        tdVals.push( $(this).text() ) // array contains multiples of the same value at this point
      });
    });
    tdVals = tdVals.filter( onlyUnique ); // array now contains only one of each badge text

    // prepare content sting to use in popover
    var filterContentString="";
    for(var i=0;i<tdVals.length;i++){
      filterContentString+="<span id=\""+index+"_filterChoices\" class=\"badge badge-pill badge-dark badge__filterChoices\">"+tdVals[i]+"</span><br />";
    }

    // populate and show popover with all the possible filter choices
    $(this).popover({
      content: filterContentString,
      html: true
    });
    $(this).popover('show');
  });

  // Filter the data table based on the text of the chosen badge
  $(document).on('click','span[id$="_filterChoices"]',function(){
    $('#filterClear').show();
    var id = $(this).attr('id');
    var idPieces = id.split("_");
    var index = idPieces[0];
    var filterTerm = $(this).text();
    var table = $('#table-releases').DataTable();

    table.columns(index).search(filterTerm).draw();
    $(document).popover('dispose');
  });

/* ------------------- */
/* END DATATABLE ITEMS */
  
  function get_card_markup(index){
    return `<div class="row"><div class="card col-md-12 cardItem cardGlow"><div class="card-body"><form><div class="row"><div class="col-md-4"><div class="row"><div class="col-md-12 align-self-center"><div class="btn-group"><button type="button" class="btn btn-outline-primary">Desktop Client</button> <button type="button" class="btn btn-outline-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown"><span class="caret"></span></button><div class="dropdown-menu"><a class="dropdown-item" href="#">Desktop Client</a> <a class="dropdown-item" href="#">Home</a></div></div><div class="btn-group"><button type="button" class="btn btn-outline-primary">Enhancement</button> <button type="button" class="btn btn-outline-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown"><span class="caret"></span></button><div class="dropdown-menu"><a class="dropdown-item" href="#">Enhancement</a> <a class="dropdown-item" href="#">New</a> <a class="dropdown-item" href="#">Fix</a></div></div></div></div><div class="row"><div class="col-md-12 align-self-center blockFeaturedChange"><div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input" id="customSwitch${index}"> <label class="custom-control-label" for="customSwitch${index}">Featured Change</label></div></div></div></div><div class="col-md-5"><div class="form-group"><textarea name="description" placeholder="Description of change" class="form-control"></textarea></div><div class="form-group"><input type="text" placeholder="Title (Optional)" name="title" class="form-control"></div></div><div class="col-md-2"><div class="btn-group d-flex" role="group"><button type="button" class="btn btn-outline-primary w-100 text-left">English</button> <button type="button" class="btn btn-outline-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown"><span class="caret"></span></button><div class="dropdown-menu w-100"><a class="dropdown-item" href="#">English</a> <a class="dropdown-item" href="#">French</a> <a class="dropdown-item" href="#">Spanish</a></div></div><br><div class="faButton"><button type="button" class="btn btn-outline-primary btn-block text-left btn__addTranslation">Add Translation</button><i class="fa fa-plus-circle"></i></div></div><div class="col-md-1 text-right release-note-actions"><button type="button" class="btn btn-block btn-primary btn--caps">Save</button> <button type="button" class="btn btn-block btn-secondary btn--caps">Cancel</button><br><button type="button" class="btn btn-block btn-secondary btn--caps">Delete</button></div></div></form></div></div></div>`
  }

  // add new card with btn press
  // Method 1 - Copy from assets folder
  $(document).on('click','#addNote',function(e){
    fetch("assets/card.html").then(function (response) {
      return response.text();
    }).then(function (data) {
      document.querySelector("#cardContainer").innerHTML += data; // add to dom
      document.querySelector('.cardGlow').scrollIntoView({ // scroll to the new card
        behavior: 'smooth',
        block: 'end',
      });
      setTimeout(function(){ // remove the glow effect (which has a css transition)
        $(".card").removeClass("cardGlow");
      },1000);
    });
  });
  // Method 2 - Remove assets folder completely. Get HTML string from func get_card_markup
  /*
  $(document).on('click','#addNote',function(e){
    const index = $('.card').length;
    const htmlToAppend = get_card_markup(index);
    document.querySelector("#cardContainer").innerHTML += htmlToAppend; // add to dom
    document.querySelector('.cardGlow').scrollIntoView({ // scroll to the new card
      behavior: 'smooth',
      block: 'end',
    });
    setTimeout(function(){ // remove the glow effect (which has a css transition)
      $(".card").removeClass("cardGlow");
    },1000);
  });
  */
});

/*
// pre-load card component(s) if appropriate (REMOVED IN FAVOR OF HANDLEBARS + JSON)
if( $('#cardContainer').length > 0 ){
  var cardCount = 2; // how many cards to pre-load
  for(var i=0;i<cardCount;i++){
    fetch("assets/card.html").then(function (response) {
      return response.text();
    }).then(function (data) {
      document.querySelector("#cardContainer").innerHTML += data;
      $(".card").removeClass("cardGlow");
    });
  }
}
*/

// Need to replicate items when the 'Add Translation' btn is clicked
$(document).on('click','.btn__addTranslation',function(e){
  console.log('Add Translation button clicked.');
  /*
  fetch("assets/XXX").then(function (response) {
    return response.text();
  }).then(function (data) {
    document.querySelector("#").innerHTML += data;
  });
  */
});
