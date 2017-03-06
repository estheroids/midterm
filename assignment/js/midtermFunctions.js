/* ================================
Week 6 Assignment: Midterm Functions + Signatures

================================ */
/* =====================
Leaflet Configuration
===================== */


var map = L.map('map', {
  center: [40.7147, -74.1024],
  zoom: 11
});
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

//define slidemodel
var slideIds = ['#slideOne','#slideTwo','#slideThree','#slideFour','#slideFive'];
var slideNum = 0;

$(document).ready(function() {
  $('#slideTwo').hide();
  $('#slideThree').hide();
  $('#slideFour').hide();
  $('#slideFive').hide();

  $("#nextButton").click(function(){
    if(slideNum === 1){
     slideTwo();
   }
   else if(slideNum === 2){
     map.removeLayer(RPlayerOne);
     slideThree();
   }
   else if(slideNum === 3){
     map.removeLayer(RPlayerTwo);
     map.removeLayer(layerIntro);
     slideFour();
   }
   else if(slideNum === 4){
     map.removeLayer(RPlayerThree);
     slideFive();
   }
   else if(slideNum === 5){
     map.removeLayer(RPlayerFour);
     slideOne();
   }
  });

  $('#prevButton').click(function(){
    if(slideNum === 1){
      console.log(slideNum);
      map.removeLayer(layerIntro);
      slideFive();
   }
   else if(slideNum === 2){
     console.log(slideNum);
     map.removeLayer(RPlayerOne);
     slideOne();
   }
   else if(slideNum === 3){
     console.log(slideNum);
     map.removeLayer(RPlayerTwo);
     slideTwo();
   }
   else if(slideNum === 4){
     console.log(slideNum);
     map.removeLayer(RPlayerThree);
     slideThree();
   }
   else if(slideNum === 5){
     console.log(slideNum);
     map.removeLayer(RPlayerFour);
     slideFour();
   }
  });
});


// define slides to hide
//define sidebar content for each layer - by slideID
// generate array of [slides content (on sidebar)]  to remove
var slideOutArr= function (sArr, sID){
  $(sID).show();
  return _.filter(sArr, function(x){
    return x !== sID;
  });
};

// takeaway the sidebar layer for the slide
var slideOut = function(sArr){
  _.each(sArr, function(x){
    $(x).hide();
  });
};


//PREP SLIDE ONE
// set intro slide style
var layerIntroStyle = function(color){
  return {
    weight: 0,
    fillOpacity: 0.7,
    fillColor: color
  };
};

// define slideone dataset
var nycFloodDat = "https://raw.githubusercontent.com/estheroids/mappluto/master/Floodplains.geojson";
var nycFlood;
var layerIntro;

//fetch slideone dataset
$.ajax(nycFloodDat).done(function(data){
  nycFlood = JSON.parse(data);
  slideOne();
});

// var slideOne
var slideOne = function (){
  slideNum=1;
  map.setView([40.7147, -74.1024],11);
  slideOut(slideOutArr(slideOutArr(slideIds, '#slideOne')));
  layerIntro = L.geoJson(nycFlood, {style: layerIntroStyle('#abcdef')}).addTo(map);
};


//PREP SLIDE TWO
var RPlayerOneStyle = function(color){
  return {
    weight: 4,
    opactiy: 0.2,
    fillOpacity: 0,
    color: color
  };
};

//define slide two dataset
var RPcensusTract = "https://raw.githubusercontent.com/estheroids/mappluto/master/RP_CT_class.geojson";
var RPct;
var RPlayerOne;

//fetch slide two dataset
$.ajax(RPcensusTract).done(function(data) {
  RPct = JSON.parse(data);
 });

// var slideTwo
var slideTwo = function(){
  slideNum=2;
  map.setView([40.5867, -73.9115],12);
  slideOut(slideOutArr(slideIds, '#slideTwo'));
  RPlayerOne = L.geoJson(RPct, {style: RPlayerOneStyle('#666999')}).addTo(map);
};

//PREP SLIDE THREE

var setCTstyle = function(features) {
  switch (features) {
      case 4: return {fillColor: "#a11035",  weight: 0, opacity:0.7, fillOpacity:0.5};
      case 3:   return {fillColor: "#b65256",  weight: 0, opacity:0.7, fillOpacity:0.5};
      case 2:   return {fillColor: "#cd8b87",  weight: 0, opacity:0.7, fillOpacity:0.5};
      case 1:   return {fillColor: "#e5c5c0", weight: 0, opacity:0.7, fillOpacity:0.5};
      default:
    }
};

var showLegend = function(lb1, lb2, lb3, lb4){
  $('.legend_colorblock').show();
  $('#lb1').text(lb1);
  $('#lb2').text(lb2);
  $('#lb3').text(lb3);
  $('#lb4').text(lb4);
};

// var slideThree
//Queens_c_5 CENSUS TRACTS

var slideThree = function(){
  slideNum=3;
  map.setView([40.5867, -73.9115],12);
  slideOut(slideOutArr(slideIds, '#slideThree'));
  var ctLayer = L.geoJson(RPct, {style: RPlayerOneStyle('#ffffff')}).addTo(map);


  $('#ctdropdown').val("blank");
  $('#ctdropdown').change(function(){
    switch ($('#ctdropdown').val()) {
      case "blank": {
      showLegend("lowest","","","highest");
      }break;

      case "hu": {
        ctLayer.setStyle(function(features){
          return setCTstyle(features.properties.huclass);
        });
      showLegend("0 - 1499","1500 - 2999","3000 - 4499","4500 - 5999");
      }break;

      case "lowinc": {
      ctLayer.setStyle(function(features){
        return setCTstyle(features.properties.LI_class);
      });
      showLegend("5% - 11%","14% - 24%","25% - 39%","greater than 40%");
      }break;

      case "nfiptu": {
      ctLayer.setStyle(function(features){
      return setCTstyle(features.properties.TU_class);
      });
    showLegend("up to 10%","10% - 20%","21% - 40%","41% - 55%");
    }break;

      case "premium": {
        ctLayer.setStyle(function(features){
        return setCTstyle(features.properties.PMclass);
        });
      showLegend("less than $3.00","$3.00 - $4.49","$4.50 - $5.99","$6.00 - $7.00");
      }break;
      default:
     }
   });
   RPlayerTwo = ctLayer;
};

//slideFour dataset

// var slidefour
var slideFour = function(){
  slideNum=4;
  map.setView([40.5867, -73.8115],14);
  slideOut(slideOutArr(slideIds, '#slideFour'));
/*  featureGroup = L.geoJson(RPpar, {style: LUstyle, filter: LUfilter}).addTo(map); */

var dataset = "https://raw.githubusercontent.com/estheroids/mappluto/master/RP.geojson";
var featureGroup;


var myStyle = function(feature) {
  switch (feature.properties.landuse) {
      case '01': return {fillColor: "#fff97f", color: "#fff97f", weight: 0, opacity:0.7, fillOpacity:0.5};
      case '02':   return {fillColor: "#fff64C", color: "#fff64C", weight: 0, opacity:0.7, fillOpacity:0.5};
      case '03':   return {fillColor: "#fff300", color: "#fff300", weight: 0, opacity:0.7, fillOpacity:0.5};
      case '04':   return {fillColor: "#ff5614", color: "#ff5614", weight: 0, opacity:0.7, fillOpacity:0.5};
      case '05':   return {fillColor: "#cc4410", color: "#ffffff", weight: 0, opacity:0.7, fillOpacity:0.5};
      case '06':   return {fillColor: "#c1bbb9", color: "#ffffff", weight: 0, opacity:0.7, fillOpacity:0.5};
      case '07':   return {fillColor: "#6f6c6a", color: "#ffffff", weight: 0, opacity:0.7, fillOpacity:0.5};
      case '08':   return {fillColor: "#a152ce", color: "#ffffff", weight: 0, opacity:0.7, fillOpacity:0.5};
      case '09':   return {fillColor: "#77e134", color: "#ffffff", weight: 0, opacity:0.7, fillOpacity:0.5};
      case '10':   return {fillColor: "#494d47", color: "#ffffff", weight: 0, opacity:0.7, fillOpacity:0.5};
      case '11':   return {fillColor: "#ffeee7", color: "#ffffff", weight: 0, opacity:0.7, fillOpacity:0.5};
    }
};

var showResults = function() {
  $('#results1').show();
  $('#results2').show();
};

var landuseName = function (toFullName){
  switch (toFullName){
    case '01':   return "One & Two Family Buildings";
    case '02':   return "Multi-Family Walk-Up Buildings";
    case '03':   return "Multi-Family Elevator Buildings";
    case '04':   return "Mixed Residential & Commercial Buildings";
    case '05':   return "Commercial & Office Buildings";
    case '06':   return "Industrial & Manufacturing";
    case '07':   return "Transportation & Utility";
    case '08':   return "Public Facilities & Institutions";
    case '09':   return "Open Space & Outdoor Recreation";
    case '10':   return "Parking Facilities";
    case '11':   return "Vacant Land";
  }
};


var eachFeatureFunction = function(layer) {
  layer.on('click', function (event) {
    console.log(layer.feature);

    var displayLU = layer.feature.properties.landuse;
    $(".lu").text(landuseName(displayLU));

    var displayYB = layer.feature.properties.yearbuilt;
    $(".yb").text(displayYB);

    map.fitBounds(layer.getBounds());

    showResults();
  });
};

var myFilter = function(feature) {
  if (feature.properties.landuse !== null){
  return true;
}
};

var closeResults = function() {
  $('#results1').hide();
  $('#results2').hide();
};

$(".resetbtn").click(function(){
  closeResults();
  map.fitBounds(featureGroup.getBounds());
});

$(document).ready(function() {
  $.ajax(dataset).done(function(data) {
    var parsedData = JSON.parse(data);
    featureGroup = L.geoJson(parsedData, {
      style: myStyle,
      filter: myFilter
    }).addTo(map);

    featureGroup.eachLayer(eachFeatureFunction);
    RPlayerThree=featureGroup;
  });
});
};

//set slideFive data
var RPlayerOneStyle = function(color){
  return {
    weight: 4,
    opactiy: 0.2,
    fillOpacity: 0,
    color: color
  };
};

//define slide five dataset
var RPparcel = "https://raw.githubusercontent.com/estheroids/mappluto/master/RP.geojson";
var RPpar;
var RPlayerFour;

//fetch slide five dataset
$.ajax(RPparcel).done(function(data) {
  RPpar = JSON.parse(data);
 });


 var LUstyle = function(feature) {
   switch (feature.properties.landuse) {
       case '01': return {fillColor: "#fff97f", color: "#fff97f", weight: 0, opacity:0.7, fillOpacity:0.5};
       case '02':   return {fillColor: "#fff64C", color: "#fff64C", weight: 0, opacity:0.7, fillOpacity:0.5};
       case '03':   return {fillColor: "#fff300", color: "#fff300", weight: 0, opacity:0.7, fillOpacity:0.5};
     }
 };


var slideFive = function(){
  slideNum=5;
  map.setView([40.5867, -73.8815],13);
  slideOut(slideOutArr(slideIds, '#slideFive'));
  RPlayerFour = L.geoJson(RPpar, {
      style: LUstyle,
      filter: function(feature) {
          return feature.properties.landuse === "01" || feature.properties.landuse === "02" || feature.properties.landuse === "03";
      }}).addTo(map);
};
