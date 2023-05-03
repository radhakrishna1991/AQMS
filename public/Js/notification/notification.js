
var timeout;

window.onload = function () {
    
    $(".Notificationclose").click(function () {
        $('.flyover').addClass('out');
        $('.flyover').removeClass('in');
        clearTimeout(timeout);
    });
}

function notifySuccess(message) {
    $('.flyover').removeClass('in');
    $('.flyover').addClass('out');
    $("#SuccesMessageText").html("");
    clearTimeout(timeout);

    $('.flyover').removeClass('out');
    $('#SucessMsg').addClass('in');
    timeout = setTimeout(function () {
        $('#SucessMsg').addClass('out');
        $('#SucessMsg').removeClass('in');
    }, 3000);
    $("#SuccesMessageText").html(message);
}

function notifyError(message) {
    $('.flyover').removeClass('in');
    $('.flyover').addClass('out');
    $("#ErrorMessageText").html("");
    clearTimeout(timeout);

    $('.flyover').removeClass('out');
    $('#ErrorMsg').addClass('in');
    timeout = setTimeout(function () {
        $('#ErrorMsg').addClass('out');
        $('#ErrorMsg').removeClass('in');
    }, 3000);
    $("#ErrorMessageText").html(message);
}

function notifyAlert(message) {
    $('.flyover').removeClass('in');
    $('.flyover').addClass('out');
    $("#AlertMessageText").html("");
    clearTimeout(timeout);

    $('.flyover').removeClass('out');
    $('#AlertMsg').addClass("in");
    timeout = setTimeout(function () {
        $('#AlertMsg').addClass('out');
        $('#AlertMsg').removeClass('in');
    }, 3000);
    $("#AlertMessageText").html(message);
}