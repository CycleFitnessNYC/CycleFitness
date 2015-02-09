// external js
// http://packery.metafizzy.co/packery.pkgd.js
// http://draggabilly.desandro.com/draggabilly.pkgd.js

var $slot = $(".slot");
var $packery;
var bikeInfo;
var currentType = 0;

var bikeTypes =
{
  ELECTRIC: 0,
  WOMENS: 1,
  CHILDRENS: 2,
  FOLDING: 3,
  ROAD: 4,
  CYCLOCROSS: 5,
  MOUNTAIN: 6
};

$(function()
{
  //Parse bikeinfo JSON into bikeInfo object
  var succeeded = false;
  $.getJSON("../json/bikeinfo.json", function(data) {
    console.log(data);
    bikeInfo = data;
    succeeded = true;
    initList(bikeTypes.ELECTRIC);
  });

  if(!succeeded)
  {
    $.getJSON("/cyclefitness/json/bikeinfo.json", function(data) {
      console.log(data);
      bikeInfo = data;
      succeeded = true;
      initList(bikeTypes.ELECTRIC);
    });
  }
});

//Initialize Packery and all the cards within
function initList(bikeType)
{
  var index = 0;
  var wait = 0;
  currentType = bikeType;

  //Remove existing bikes if they exist
  if ($("#bike-list").children().length > 0)
  {
    $("#bike-list").empty();
  }

  //Create bike lis from JSON
  bikeInfo.bikes[bikeType].forEach(function(bike)
  {
    $("#bike-list").append(getBikeString(bikeType, index));
    index++;
  });
}

function getBikeString(type, id)
{
  return "<li><a href='javascript:display(" + type + "," + id + ")'>" + getBike(type, id).name + "</a></li>";
}

//Set image for a given card div
function setImage(type, bikeIndex)
{
  $image = $("#image")[0];
  $image.style.backgroundImage = "url(" + getBike(type, bikeIndex).image + ")";
  $image.style.backgroundSize = "100%";
  $image.style.backgroundRepeat = "no-repeat";
  $image.style.backgroundPosition = "center center";
}

//Displays all the information about a bike
function display(type, bikeIndex)
{
  var $name = $("#name")
  var $type = $("#type")
  var $year = $("#year")
  var $price = $("#price")
  var $desc = $("#desc")

  if (bikeIndex == -1)
  {
    $name.text("Drag Bike Here");
    $type.text("");
    $year.text("");
    $price.text("");
    $desc.text("");
  }
  else
  {
    $name.text(getBike(type, bikeIndex).name);
    $type.text("Type: " + getBike(type, bikeIndex).type);
    $year.text("Year:" + getBike(type, bikeIndex).year);
    $price.text("Price: " + getBike(type, bikeIndex).price);
    $desc.text("Description: " + getBike(type, bikeIndex).description);
    setImage(type, bikeIndex);
  }
}

function getBike(type, id)
{
  return bikeInfo.bikes[type][id];
}

$(".styled-select select").change(function()
{
  console.log(bikeInfo);
  initList(parseInt($(".styled-select select option:selected")[0].value));
});

function getBikeType(itemElem)
{
  if (itemElem.classList.contains("0"))
    return 0;
  else if (itemElem.classList.contains("1"))
    return 1;
  else if (itemElem.classList.contains("2"))
    return 2;
  else if (itemElem.classList.contains("3"))
    return 3;
  else if (itemElem.classList.contains("4"))
    return 4;
  else if (itemElem.classList.contains("5"))
    return 5;
  else if (itemElem.classList.contains("6"))
    return 6;
}