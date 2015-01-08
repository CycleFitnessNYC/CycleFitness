// external js
// http://packery.metafizzy.co/packery.pkgd.js
// http://draggabilly.desandro.com/draggabilly.pkgd.js

var $slot = $(".slot");
var $packery;
var bikeInfo;
var currentType = 0;

var bikeTypes =
{
  ELECTRIC: 0
}

$(function()
{
  //Make Draggabilly work with scaling
  Draggabilly.prototype.positionDrag = Draggabilly.prototype.setLeftTop;

  //Parse bikeinfo JSON into bikeInfo object
  var succeeded = false;
  $.getJSON("../json/bikeinfo.json", function(data) {
    console.log(data);
    bikeInfo = data;
    succeeded = true;
    initPackery(bikeTypes.ELECTRIC);
    currentType = bikeTypes.ELECTRIC;
  });

  if(!succeeded)
  {
    $.getJSON("/CycleFitness/json/bikeinfo.json", function(data) {
      console.log(data);
      bikeInfo = data;
      succeeded = true;
      initPackery(bikeTypes.ELECTRIC);
      currentType = bikeTypes.ELECTRIC;
    });
  }


});

//Initialize Packery and all the cards within
function initPackery(bikeType)
{
  var index = 0;
  //Create bike cards from JSON
  bikeInfo.bikes[bikeType].forEach(function(bike)
  {
    $(".packery").append('<div class="card" id="' + index.toString() + '"></div>');
    index++;
  });

  //Init packery object
  $packery = $(".packery").packery(
      {
        columnWidth: 160,
        rowHeight: 160
      });

  //Init cards
  var cardIndex = 0;
  $packery.find('.card').each(function (i, itemElem)
  {
    initCard(itemElem)
  });

}

//Initialize a card by binding events, setting image, etc
function initCard(itemElem)
{
  setImage(itemElem);

  makeDraggabilly(itemElem);

  itemElem.onmouseout = function ()
  {
    itemElem.classList.remove("post-post-drag");
  };
}

// Test two ClientRects for overlap
function testRects(r1, r2)
{
  if (r1.right < r2.left)
    return false;
  if (r1.left > r2.right)
    return false;
  if (r1.top > r2.bottom)
    return false;
  if (r1.bottom < r2.top)
    return false;
  return true;
}

//Set image for a given card div
function setImage(elem)
{
  elem.style.backgroundImage = "url(" + getBike(currentType,elem.id).image + ")";
  elem.style.backgroundSize = "100%";
  elem.style.backgroundRepeat = "no-repeat";
  elem.style.backgroundPosition = "center center";
}

//Make an element into a Draggability object
function makeDraggabilly(itemElem)
{
  // make element draggable with Draggabilly
  var draggie = new Draggabilly(itemElem);

  var dragEndUnslotted = function(draggie, event, pointer)
  {
    itemElem.classList.add("post-post-drag");

    //Get slot with largest overlap area
    var slotEntered;
    var maxOverlap = 0;
    $slot.each(function(i, slotElem)
    {
      var itemRect = itemElem.getBoundingClientRect();
      var slotRect = slotElem.getBoundingClientRect();
      //Calculate the area overlapped
      var xOverlap = Math.max(0, Math.min(itemRect.right, slotRect.right) - Math.max(itemRect.left, slotRect.left));
      var yOverlap = Math.max(0, Math.min(itemRect.bottom, slotRect.bottom) - Math.max(itemRect.top, slotRect.top));
      var overlap = xOverlap * yOverlap;
      if (overlap > maxOverlap && slotElem.childNodes.length == 0)
      {
        maxOverlap = overlap;
        slotEntered = slotElem;
      }
    });

    if (slotEntered)
    {
        placeCard(slotEntered, itemElem);
    }
  }

  var dragEndSlotted = function(draggie, event, pointer)
  {
    itemElem.classList.add("post-post-drag");

    if (testRects($(".packery")[0].getBoundingClientRect(), itemElem.getBoundingClientRect()))
    {
      replaceCard(itemElem);
      return;
    }

    //Get slot with largest overlap area
    var slotEntered;
    var maxOverlap = 0;
    $slot.each(function(i, slotElem)
    {
      var itemRect = itemElem.getBoundingClientRect();
      var slotRect = slotElem.getBoundingClientRect();

      //Calculate the area overlapped
      var xOverlap = Math.max(0, Math.min(itemRect.right, slotRect.right) - Math.max(itemRect.left, slotRect.left));
      var yOverlap = Math.max(0, Math.min(itemRect.bottom, slotRect.bottom) - Math.max(itemRect.top, slotRect.top));
      var overlap = xOverlap * yOverlap;

      if (overlap > maxOverlap && slotElem.childNodes.length == 0)
      {
        maxOverlap = overlap;
        slotEntered = slotElem;
      }
    });

    if (slotEntered)
    {
      if (slotEntered.children.length == 0)  //Is the slot empty?
      {
        //Reset text
        setInformation(itemElem.parentNode.parentNode, -1);

        //Remove card from the slot
        itemElem.remove();

        placeCard(slotEntered, itemElem);
      }
    }
    else
    {
      draggie.setLeftTop(0, 0);
    }
  }

  var isSlotted = itemElem.classList.contains("slotted");
  if (isSlotted)
  {
    draggie.on("dragEnd", dragEndSlotted);
  }
  else
  {
    draggie.on("dragEnd", dragEndUnslotted);
  }

  // bind Draggabilly events to Packery
  $packery.packery('bindDraggabillyEvents', draggie);
}

function placeCard(slotEntered, itemElem)
{
  if (slotEntered.children.length == 0)  //Is the slot empty?
  {
    //Remove card from the packery
    $packery.packery("remove", itemElem);

    //Add identical card to the slot
    $(slotEntered).append('<div class="card slotted" id="' + itemElem.id + '"></div>');

    //Set the text
    setInformation(slotEntered.parentNode, parseInt(itemElem.id));

    var cardElem = slotEntered.childNodes[0];
    initCard(cardElem);
  }
}
function replaceCard(itemElem)
{
  //Reset text
  setInformation(itemElem.parentNode.parentNode, -1);

  //Remove card from the slot
  itemElem.remove();

  //Add identical card to the packery
  var cardElem = $.parseHTML('<div class="card" id="' + itemElem.id + '"></div>')[0];
  $packery.append(cardElem);
  $packery.packery("appended", cardElem);
  initCard(cardElem);
}

//Displays all the information about a bike
function setInformation(subinfoElem, bikeIndex)
{
  var $name = $(subinfoElem).find(".name-table").find(".name");
  if (bikeIndex == -1)
  {
    $name.text("Drag bike here");
  }
  else
  {
    $name.text(getBike(currentType, bikeIndex).name);
  }
}

function getBike(bikeType, index)
{
  return bikeInfo.bikes[bikeType][index];
}