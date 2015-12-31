$(document).ready(function() {

	$("#create").on("click", function() {
		Api.post("/", {}, function(res) {
			console.log(">>>>> success");
		}, function(res) {
			console.log(">>>>> fail");
		});
	});

	$("#cancel").on("click", function() {
		goBack();
	});
});

function isValid() {
	
}