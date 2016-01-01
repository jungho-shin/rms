$(document).ready(function() {

	$("#create").on("click", function() {

		var user_level = $("ul.nav-tabs li.active a").prop("name");

		if (isValid(user_level)) {
			var data = {
				user_id : $("#user-id").val().trim(),
				user_pw : $("#user-pw").val(),
				user_level : user_level
			}
			
			if(user_level == 2) { // individual level.
				data.user_name = $("#user-name").val().trim();
				data.user_phone_number = $("#user-phone-number").val().trim();
			} else if(user_level == 1) { // company level.
				data.company_registration_number = $("#company-registration-number").val().trim();
				data.company_name = $("#company-name").val().trim();
				data.manager_name = $("#manager-name").val().trim();
			}
			
			Api.post("/users", data, function(res) {
				Popup.alert("Congratulations on the Register", function() {
					$("#user-id").focus();
				});
			});
		}
	});

	$("#cancel").on("click", function() {
		goBack();
	});
});

function isValid(user_level) {

	if ($("#user-id").val().trim() == "") {
		Popup.alert("Please enter your E-mail Address", function() {
			$("#user-id").focus();
		});
		return false;
	}

	if ($("#user-pw").val() == "") {
		Popup.alert("비밀번호는 8자 이상 16자 이하로 기재해 주십시오", function() {
			$("#user-pw").focus();
		});
		return false;
	}

	if ($("#user-pw").val() != $("#user-cpw").val()) {
		Popup.alert("Passwords do not match.", function() {
			$("#user-cpw").focus();
		});
		return false;
	}

	if (user_level == 2) { // individual level.
		if ($("#user-name").val().trim() == "") {
			Popup.alert("Please enter your name", function() {
				$("#user-name").focus();
			});
			return false;
		}

		if ($("#user-phone-number").val().trim() == "") {
			Popup.alert("Please enter your phone number", function() {
				$("#user-phone-number").focus();
			});
			return false;
		}
	} else if (user_level == 1) { // company level.
		if ($("#company-registration-number").val().trim() == "") {
			Popup.alert("Please enter Company Registration Number", function() {
				$("#company-registration-number").focus();
			});
			return false;
		}

		if ($("#company-name").val().trim() == "") {
			Popup.alert("Please enter company name", function() {
				$("#company-name").focus();
			});
			return false;
		}

		if ($("#manager-name").val().trim() == "") {
			Popup.alert("Please enter manager name", function() {
				$("#manager-name").focus();
			});
			return false;
		}
	}

	return true;
}