// external js
// http://packery.metafizzy.co/packery.pkgd.js
// http://draggabilly.desandro.com/draggabilly.pkgd.js

$( function()
{
  //Make Draggabilly work with scaling
  Draggabilly.prototype.positionDrag = Draggabilly.prototype.setLeftTop;

  //Parse bikeinfo JSON into bikeInfo object
  var bikeInfo = null;
  $.getJSON("/CycleFitness/json/bikeinfo.json", function(data) {
    console.log(data);
    initPackery(data);
  });

});

function initPackery(bikeInfo) {
  //Get Packery container
  var $contElem = $(".packery")[0];

  //Init Packery
  var $container = $(".packery").packery(
      {
        columnWidth: 160,
        rowHeight: 160,
        isResizeBound: false
      });

  //Init cards
  var cardIndex = 0;
  $container.find('.card').each(function (i, itemElem) {
    itemElem.style.content = "url(" + bikeInfo.bikes[0].image + ")";
    // make element draggable with Draggabilly
    var draggie = new Draggabilly(itemElem);
    draggie.on("dragEnd", function (draggieInstance, event, pointer) {
      if (!(testRects($contElem.getBoundingClientRect(), itemElem.getBoundingClientRect())))
        $container.packery("remove", itemElem);
      else {
        itemElem.classList.add("post-post-drag");
      }
    });

    itemElem.onmouseout = function () {
      itemElem.classList.remove("post-post-drag");
    };
    // bind Draggabilly events to Packery
    $container.packery('bindDraggabillyEvents', draggie);
  });

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