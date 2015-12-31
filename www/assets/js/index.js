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

		/*
		 * set page.
		 */
		if(!User.isLogin()) {
			if(Request.pageName != "new_account") {
				Request.pageName = "login";
			}
		}

		Page.init();

	}

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

var HashChange = {

	_oldHash : {},

	_fn : {},

	detect : function(func) {

		this._fn = func;

		$(window).on('hashchange', function() {
			HashChange._fn();
		});

	}
};

var Page = {
		
	init : function(){
		
		// Load pageBody.
		$("#mainarea").load("/html/" + Request.pageName + ".html", function(res) {
			// dynamically load js file of this page
			loadJsCssFile("/assets/js/page/" + Request.pageName + ".js", "js");
		});
		
	}
}

var Api = {
	
	"apiPath" : "http://127.0.0.1:3000",
	"apiJsonPPath" : "http://127.0.0.1:3000/jsonp",
	
	"guestToken" : "c72697466effd0db4ac78592b40c323607bguest",
	
	_getHeader : function( customHeader ){
		
		var httpHeaders = {};
    	if(customHeader){
    		httpHeaders = customHeader;
    		
    	} else {
    		httpHeaders = {
    	    		//,"token": token
            }
	    	if ( User.token && User.token != "" ) {
	    		httpHeaders["Token"] = User.token;
	    	} else {
	    		httpHeaders["Token"] = this.guestToken;
	    	}
    	}
    	
    	return httpHeaders;
		
	},
	
	_call : function (method, url, data, success_callback, fail_callback , customHeader) {
		
    	console.log(method + " : " + url );
    	var sendingData = data;
    	if( method.toUpperCase() == "POST") sendingData = JSON.stringify(data);
    	
    	
    	// ie10+ & modern browsers have "window.atob"
        if ( !window.atob ) { //old browser( old IE )
        	
        	if(url.indexOf("http://", 0)>-1){
        	} else {
        		url = Api.apiJsonPPath + '/' + method.toLowerCase() + '/' + url.replace(/^\//g, '');
        		
        		url += "?json=" + JSON.stringify(data) //jsonData; //url += $.param(data);
        		
        		if(customHeader){
        		} else {
        			if ( User.token && User.token != "" ) {
        				url += "&token=" + User.token;
        	    	} else {
        	    		url += "&token=" + this.guestToken;
        	    	}
        		}
        	}

			/*if (arguments.length == 2) {
				success_callback = data;
				data = null;
			}*/
            
            //loadJsCssFile( url , "js" , success_callback );
            $.getScript( url , function( data, textStatus, jqxhr ) {
            	
            	//document.title = 'MyFitSize';
            	console.log( textStatus ); 
            	console.log( jqxhr.status ); 
            	console.log( "Load was performed." );
            	
            	//loaded script start with "var jsonpRes = ..." so, 
            	success_callback( jsonpRes ); 
            	
            });
            
            return;
        }
        
        
        //CASE of modern browser : cors ajax
        
        var httpHeaders = this._getHeader(customHeader);
        
        if(url.indexOf("http://", 0)>-1){
    		
    	} else {
    		url = Api.apiPath + '/' + url.replace(/^\//g, '');
    	}

        /*if (arguments.length == 2) {
            success_callback = data;
            data = null;
        }*/

        $.ajax(
            {
                url: url,
                type: method.toUpperCase() ,
                //processData: false,
                data: sendingData,
                contentType: 'application/json; charset=UTF-8',
                dataType: 'json',
            	headers: httpHeaders,
	            beforeSend: function (request, settings) {
//		              // modal background
//		              var $back = $('<div class="modal-background ajax-modal-background"></div>');
//		              $('.modal-background.ajax-modal-background').remove();
//		              $('body').prepend($back);
//		              $back.hide().css('z-index', new Date().getTime()).fadeIn(500);
	            }
            }).done(function (result, textStatus, jqXHR) {
//					if (!res.status)
//					{
//						alertNotice(res.message);
//						return;
//					}
                success_callback(result, textStatus, jqXHR);
            }).fail(function (jx, textStatus, errorThrown) {
                try {
                    var res = JSON.parse(jx.responseText);
                    var status = JSON.parse(jx.status);
                }
                catch (ex) {
                    if (console) console.log(jx.description);
                    return;
                }

                if (fail_callback) {
                	if(status == 498) {
                		Loader.hide();
                		Popup.alertCallback(res, function() {
                			location = "#login";
                		});
                	} else if(status == 401) {
                		Loader.hide();
                		Popup.alert(res);
                	} else {
                        fail_callback(res);
                	}
                }
                else {
                    alertWarning(res.message);
                }
            }).always(function () {
                $('.modal-background.ajax-modal-background').remove();
            });
    },
    
	
    get: function (url, data, success_callback, fail_callback, customHeader) {
    	
    	this._call("get", url, data, success_callback, fail_callback, customHeader);
    	
    },

    post: function (url, data, success_callback, fail_callback , customHeader) {

    	this._call("post", url, data, success_callback, fail_callback, customHeader);
    }
};

$(document).ready(function() {

	/*
	 * load user info.
	 */
	User.load();

	/*
	 * parse Request & init page.
	 */
	Request.read();

	HashChange.detect(function() {
		Request.read();
	});
	
});

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

function goBack() {
	window.history.back();
}