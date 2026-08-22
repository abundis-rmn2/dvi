$(document).ready(function(){
    $(".card.card-body form *").on("input", function(){
        muidReplace();
        hashtagAmountDisplay()
    });
});

$(document).ready(function(){
    console.log("Fu");
});

function muidReplace() {
    // Print entered value in a div box
    //$("#result").text($(this).val());
    var seednode = $("#seednode").val();
    var miningtype = $("#miningtype").val();
    if(!$("#hashtagmediaamount").val()){
        var hashtagmediaamount = "";
    } else{
        var hashtagmediaamount = "_"+$("#hashtagmediaamount").val();
    }
    var depth = $(".depth input:checked").val();
    $("#muid").val(seednode+"_"+depth+"_"+miningtype+hashtagmediaamount);
}

function hashtagAmountDisplay(){
    console.log("F Display");
    if (miningtype  = $("#miningtype").val().substring(0, 4) == "hash") {
        $(".hashtagmediaamount.form-group").css('display', 'flex');
    } else {
        $(".hashtagmediaamount.form-group").css('display', 'none');
        $(".hashtagmediaamount.form-group").css('display', 'none');
        $("#hashtagmediaamount").val("");
    }

}