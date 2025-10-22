$(".icon-nav").click(function() {
    $(".nav-cover").toggleClass('expand');
    $(".header-nav").toggleClass('expand');
})
$(".nav-cover").click(function() {
    $(".nav-cover").toggleClass('expand');
    $(".header-nav").toggleClass('expand');
})

$(".nav-item.expand .nav-con").on('click', function(e) {
    if ($(e.target).closest('.icon-go').length) {
        e.preventDefault();
        $(this).parent().find(".nav-sub-list").toggleClass("expand");
    }
});