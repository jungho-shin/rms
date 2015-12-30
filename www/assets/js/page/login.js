$(document).ready(function() {

	loadJsCssFile("/assets/css/page/" + "login" + ".css", "css");

	$("#id").on("keypress", function(e) {
		if (e.keyCode == 13)
			$("#logIn").trigger("click");
	});

	$("#pw").on("keypress", function(e) {
		if (e.keyCode == 13)
			$("#logIn").trigger("click");
	});

	$("#logIn").on("click", function() {
		if ($("#id").val().trim().isEmpty()) {
			$("#id").focus();
		} else if ($("#pw").val().trim().isEmpty()) {
			$("#pw").focus();
		} else {
			User.logIn($("#id").val(), $("#pw").val(), "/");
		}
	});

});