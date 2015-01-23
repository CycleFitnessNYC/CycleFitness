menuClick(".js-so-menu");

function menuClick(target){
    $(target).click(function(){
        $(".js-wrapper").toggleClass("so-open");
    });
}