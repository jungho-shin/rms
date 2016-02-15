var User = {
	
	id : "",
	name : "",
	token : "",
	isLogin : false,
	isAdmin : false,
	
	load : function(){
		
		User.id = $.cookie('userId');
		User.name = $.cookie('userName');
		User.token = $.cookie('userToken');
		if($.cookie('isLogin')) User.isLogin = JSON.parse( $.cookie('isLogin') );
		if($.cookie('isAdmin')) User.isAdmin = JSON.parse( $.cookie('isAdmin') );
		
		if(User.isLogin){
			$(".nav > a.myinfo").show();
			$(".nav .dropdown.myinfo .username").html( User.name + " 님" );
		} else {
			$(".nav > a.myinfo").hide();
		}
		if(User.isAdmin){
			$(".nav .adminonly").show();
			$(".nav .useronly").hide();
		} else {
			$(".nav .adminonly").hide();
			$(".nav .useronly").show();
		}
		
		
		console.log( JSON.stringify(User) );
		
	},
	login : function(userId, password, returnUrl){
		
		var data = {
			"userId" : userId,
			"password" : password
		};
			
		Api.post("/login", data, function(res) {
			
			if(res.code == "200") {
				if( res.data && res.data.token ){
					
					$.cookie('userId', res.data.userId);
					$.cookie('userToken', res.data.token);
					$.cookie('userName', res.data.name);

					if(res.data.level == 0) {
						$.cookie('isLogin', true);
						$.cookie('isAdmin', true);
					} else {
						$.cookie('isLogin', true);
						$.cookie('isAdmin', false);
					}
					
				} else {
					$.cookie('isLogin', false);
					$.cookie('isAdmin', false);
				}
				
				User.load();
				if( returnUrl ) location.href =  returnUrl;
				
			} else {
				Popup.alert(res.message);
			}
		}, function(res) {
			console.log(res);
			User.isAdmin = false;
			User.isLogin = false;
			
			User.load();
		});
		
			
	},
	logout : function(){
		Api.post("/logout/" + User.id, {}, function(res) {
			// No action.
		}, function(res) {
			console.log(res);
		});
		
		$.removeCookie('userId');
		$.removeCookie('userName');
		$.removeCookie('userToken');
		$.removeCookie('isLogin');
		$.removeCookie('isAdmin');
		
		User.id = "";
		User.name = "";
		User.token = "";
		User.isLogin = false;
		User.isAdmin = false;
	}
	
};

var Api = {
	
	"apiPath" : "http://52.192.224.104:3000",
	"apiJsonPPath" : "http://52.192.224.104:3000/jsonp",
	
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
    

    post: function (url, data, success_callback, fail_callback , customHeader) {

    	this._call("post", url, data, success_callback, fail_callback, customHeader);
    },
	
    get: function (url, data, success_callback, fail_callback, customHeader) {
    	
    	this._call("get", url, data, success_callback, fail_callback, customHeader);
    	
    },
    
    put: function(url, data, success_callback, fail_callback , customHeader) {
    	this._call("put", url, data, success_callback, fail_callback, customHeader);
    },
    
    del: function(url, data, success_callback, fail_callback , customHeader) {
    	this._call("delete", url, data, success_callback, fail_callback, customHeader);
    }
};
