$("#header").load("html/header.html", function()
{
    $("li")[pageNo].setAttribute("id", "current-page");
});
$("#footer").load("html/footer.html");