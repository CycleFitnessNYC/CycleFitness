var state = true;

$(function()
{
    $(".subinfo.left")[0].style.width = "0%";
    $(".slot.left")[0].style.width = "0%";
    $(".name-table.left")[0].style.visibility = "hidden";
})

$("#compare").click(function()
{
    state = false;
    $(".container.left").each(function(i, itemElem)
    {
        console.log("mwidth: " + itemElem.style.maxWidth);
        itemElem.style.width = itemElem.style.maxWidth;
        itemElem.style.borderStyle = "solid";
    });

    $(".name-table.left").each(function(i, itemElem)
    {
        setTimeout(function ()
        {
            if (state == false)
                itemElem.style.visibility = "visible";
        }, 400);

    });

    $("#si2")[0].style.width = "50%";
});

$("#single").click(function()
{
    state = true;

    //Replace slot 1 card if necessary
    var itemElem = $("#s1")[0].childNodes[0];
    if (itemElem)
        replaceCard(itemElem);

    $(".container.left").each(function(i, itemElem)
    {
        itemElem.style.width = "0%";

        setTimeout(function ()
        {
            itemElem.style.borderStyle = "none";
        }, 400);
    });

    $(".info-prop.left, .name-table.left").each(function(i, itemElem)
    {
        itemElem.style.visibility = "hidden";
    });

    $("#si2")[0].style.width = "100%";
});