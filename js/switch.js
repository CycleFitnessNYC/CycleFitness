$("#compare").click(function()
{
    $(".left:not(.info-prop)").each(function(i, itemElem)
    {
        itemElem.style.width = itemElem.style.maxWidth;
    });

    $(".info-prop.left").each(function(i, itemElem)
    {
        setTimeout(function ()
        {
            itemElem.style.visibility = "visible";
        }, 400);

    });

    $("#si2")[0].style.width = "50%";
});

$("#single").click(function()
{
    //Replace slot 1 card if necessary
    var itemElem = $("#s1")[0].childNodes[0];
    if (itemElem)
        replaceCard(itemElem);

    $(".left:not(.info-prop)").each(function(i, itemElem)
    {
        itemElem.style.width = "0%";
    });

    $(".info-prop.left").each(function(i, itemElem)
    {
        itemElem.style.visibility = "hidden";
    });

    $("#si2")[0].style.width = "100%";
});