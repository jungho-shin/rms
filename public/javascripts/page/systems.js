$(document).ready(function() {
	$("#btn-update").on("click", function() {
		var data = {system_name : $("#system-name").val()};
		console.log(">>>>> data : " + JSON.stringify(data));
		Api.post("/model/systems", data, function(res) {
			location.reload();
		}, function(res) {
			console.log(res);
		});
	});
});