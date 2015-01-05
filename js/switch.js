$("#compare").click(function()
{
    $("#si1")[0].style.width = "50%";
    $("#s1")[0].style.width = "160px";
    $("#si2")[0].style.width = "50%";
});

$("#single").click(function()
{
    var itemElem = $("#s1")[0].childNodes[0];
    if (itemElem)
        replaceCard(itemElem);
    $("#si1")[0].style.width = "0%";
    $("#s1")[0].style.width = "0px";
    $("#si2")[0].style.width = "100%";
});