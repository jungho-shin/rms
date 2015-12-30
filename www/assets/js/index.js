var Request = {

	pageName : "index",
	params : {},

	read : function() {

		// URL : localhost/#pagename&popup=entername&b=2&c=3

		var h = location.hash;
		if (h.trim() != "") {
			h = location.hash.slice(1);
		}

		var params = h.split("&");
		this.pageName = params[0];
		params = params.splice(1);

		if (this.pageName.trim() == "")
			this.pageName = "index";

		this.params = {};
		for (var i = 0; i < params.length; i++) {
			var p = params[i].split("=");
			this.params[p[0]] = p[1];

		}
		// console.log( JSON.stringify(Request) );

	}

}

function loadJsCssFile(filename, filetype) {

	if (filetype == "js") { // if filename is an external JavaScript file
		var fileref = document.createElement('script')
		fileref.setAttribute("type", "text/javascript")
		fileref.setAttribute("src", filename)
	} else if (filetype == "css") { // if filename is an external CSS file
		var fileref = document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename)
	}
	if (typeof fileref != "undefined")
		document.getElementsByTagName("head")[0].appendChild(fileref);

}

var User = {

	"token" : "",
	"name" : "",

	"isLogin" : function() {
		if (this.token && this.token != "")
			return true;
		else
			return false;
	},

	"load" : function() {
		if ($.cookie('userToken')) {
			this.token = $.cookie('userToken');
			this.name = $.cookie('userName');
		}
	},

	"logIn" : function(id, pw, returnUrl) {
		res = {
			"msg" : "ok",
			"data" : {
				"userToken" : "userToken",
				"userName" : "admin"
			}
		};

		if (res.msg.toUpperCase().indexOf("OK") != -1) {
			$.cookie('userToken', res.data.userToken, {
				path : '/'
			});
			$.cookie('userName', res.data.userName, {
				path : '/'
			});

			User.load();
			if (returnUrl)
				location.href = returnUrl;
		}
	},

	"logOut" : function() {
		$.cookie('userToken', "", {
			path : '/'
		});
		$.cookie('userName', "", {
			path : '/'
		});
		$.removeCookie('userToken', {
			path : '/'
		});
		$.removeCookie('userName', {
			path : '/'
		});

		this.token = "";
		this.name = "";

		User.load();
	}
};

$(document).ready(function() {

	/*
	 * parse Request & init Page
	 */
	Request.read();

	/*
	 * load user info.
	 */
	User.load();

	if (User.isLogin()) {

	} else {
		Request.pageName = "login";
	}

	// Load pageBody.
	$("#mainarea").load("/html/" + Request.pageName + ".html", function(res) {
		// dynamically load js file of this page
		loadJsCssFile("/assets/js/page/" + Request.pageName + ".js", "js");
	});
});
