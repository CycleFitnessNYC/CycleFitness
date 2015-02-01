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
  //Make Draggabilly work with scaling
  Draggabilly.prototype.positionDrag = Draggabilly.prototype.setLeftTop;

  //Parse bikeinfo JSON into bikeInfo object
  var succeeded = false;
  $.getJSON("../json/bikeinfo.json", function(data) {
    console.log(data);
    bikeInfo = data;
    succeeded = true;
    initPackery(bikeTypes.ELECTRIC);
  });

  if(!succeeded)
  {
    $.getJSON("/cyclefitness/json/bikeinfo.json", function(data) {
      console.log(data);
      bikeInfo = data;
      succeeded = true;
      initPackery(bikeTypes.ELECTRIC);
    });
  }
});

//Initialize Packery and all the cards within
function initPackery(bikeType)
{
  var index = 0;
  var wait = 0;
  currentType = bikeType;

  //Remove existing bikes if they exist
  if ($(".packery").children().length > 0)
  {
    $(".packery").children().each(function(i, itemElem)
    {
      $packery.packery("remove", itemElem);
    });
    wait = 500;
  }

  setTimeout(function()
  {
    //Create bike cards from JSON
    bikeInfo.bikes[bikeType].forEach(function(bike)
    {
      $(".packery").append(getBikeString(bikeType, index));
      index++;
    });

    //Init packery object
    if ($packery != null)
    {
      $packery.packery("destroy");
    }
    $packery = $(".packery").packery(
        {
          columnWidth: 160,
          rowHeight: 160,
          gutter: 2
        });

    //Init cards
    var cardIndex = 0;
    $packery.find('.card').each(function (i, itemElem)
    {
      initCard(itemElem)
    });
  }, wait);
}

function getBikeString(type, id, slotted)
{
  return '<div class="card' + (slotted ? " slotted" : " tooltip") + ' ' + type + '" id="' + id.toString() + '">' + (!slotted ? '<span> <img class="callout" src="img/callout.gif" /> <strong>' + getBike(type, id).name + '</strong></span>' : '') + '</div>'
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
  elem.style.backgroundImage = "url(" + getBikeElem(elem).image + ")";
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
      if (overlap > maxOverlap /*&& slotElem.childNodes.length == 0*/)
      {
        maxOverlap = overlap;
        slotEntered = slotElem;
      }
    });

    if (slotEntered)
    {
        draggie.disable();
        if (slotEntered.childNodes.length == 0)
        {
          placeCard(slotEntered, itemElem);
        }
        else
        {
          replaceCard(slotEntered.childNodes[0]);
          placeCard(slotEntered, itemElem);
        }
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
      console.log(slotEntered.children.length);
      if (slotEntered.children.length == 0)  //Is the slot empty?
      {
        var subinfoElem = itemElem.parentNode.parentNode.parentNode;

        //Reset text
        setInformation(subinfoElem, -1, -1);

        collapseSubinfo(subinfoElem);

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
    $(slotEntered).append(getBikeString(getBikeType(itemElem), itemElem.id, true));

    //Set the text
    var subinfoElem = slotEntered.parentNode.parentNode;

    expandSubinfo(subinfoElem);

    //Bike name
    setInformation(subinfoElem, getBikeType(itemElem), parseInt(itemElem.id));

    var cardElem = slotEntered.childNodes[0];
    initCard(cardElem);
  }
}
function replaceCard(itemElem)
{
  var subinfoElem = (itemElem.parentNode.parentNode.parentNode);

  //Reset text
  setInformation(subinfoElem, -1, -1);

  //Remove card from the slot
  itemElem.remove();

  collapseSubinfo(subinfoElem);

  //Add identical card to the packery if types match
  if (getBikeType(itemElem) == currentType)
  {
    var cardElem = $.parseHTML(getBikeString(getBikeType(itemElem), itemElem.id))[0];
    $packery.append(cardElem);
    $packery.packery("appended", cardElem);
    initCard(cardElem);
  }
}

//Displays all the information about a bike
function setInformation(subinfoElem, type, bikeIndex)
{
  var $name = $(subinfoElem).find(".name-table").find(".name");
  var $bikeinfo = $(subinfoElem).find(".bike-info");

  var $type = $bikeinfo.find(".type").find(".value");
  var $year = $bikeinfo.find(".year").find(".value");
  var $price = $bikeinfo.find(".price").find(".value");
  var $desc = $bikeinfo.find(".desc").find(".value");

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
    $type.text(getBike(type, bikeIndex).type);
    $year.text(getBike(type, bikeIndex).year);
    $price.text(getBike(type, bikeIndex).price);
    $desc.text(getBike(type, bikeIndex).description);

  }
}

function expandSubinfo(subinfoElem)
{
  var which = $(subinfoElem).hasClass('left') ? '.left' : '.right';
  $(".info-prop" + which).each(function(i, itemElem)
  {
    console.log(itemElem);
    itemElem.style.visibility = "visible";
  });

  subinfoElem.style.maxHeight = "1200px";
  //subinfoElem.style.height = "640px";
}

function collapseSubinfo(subinfoElem)
{
  var which = $(subinfoElem).hasClass('left') ? '.left' : '.right';
  $(".info-prop" + which).each(function(i, itemElem)
  {
    itemElem.style.visibility = "hidden";
  });
  subinfoElem.style.maxHeight = "180px";
}

function getBikeElem(itemElem)
{
  return bikeInfo.bikes[getBikeType(itemElem)][parseInt(itemElem.id)];
}

function getBike(type, id)
{
  return bikeInfo.bikes[type][id];
}

$(".styled-select select").change(function()
{
  console.log(bikeInfo);
  initPackery(parseInt($(".styled-select select option:selected")[0].value));
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