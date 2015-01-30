var open = false;

$(document).ready()
{
    $("#content").click(function () {
        if (open) {
            $(".js-wrapper").removeClass("so-open");
            setTimeout(function () {
                open = false;
            }, 200);
        }
    });

    console.log($(".js-so-menu"));
    $(".js-so-menu").click(function () {
        $(".js-wrapper").toggleClass("so-open");
        setTimeout(function () {
            open = !open;
        }, 200);
    });
}
