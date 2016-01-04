$(document).ready(function() {

	loadJsCssFile("/assets/css/page/" + "login" + ".css", "css");

	$("#email-address").on("keypress", function(e) {
		if (e.keyCode == 13)
			$("#logIn").trigger("click");
	});

	$("#pw").on("keypress", function(e) {
		if (e.keyCode == 13)
			$("#logIn").trigger("click");
	});

	$("#logIn").on("click", function() {
		if ($("#email-address").val().trim().isEmpty()) {
			$("#email-address").focus();
		} else if ($("#pw").val().trim().isEmpty()) {
			$("#pw").focus();
		} else {
			User.logIn($("#email-address").val(), $("#pw").val(), "/");
		}
	});
	
});