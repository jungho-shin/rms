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

var Popup = {
		
	POPUP_ID_PREFIX : "popupwin", 
	POPUP_CLASS : "popupwin",
	DEFAULT_WIDTH: "",
	DEFAULT_HEIGHT: "",
	
	instance : [], //{id, width, height, top, left, autoClose }
	
    open : function( contents, opt){
        
        if( Popup.instance.length != $("." + Popup.POPUP_CLASS).length ){
            //fadein/out 등이 일어나고 있는 동안은 새로 생성하지 말고 잠깐 대기 
            setTimeout(function(){
                Popup.open(contents,opt);    
            }, 500);
            
        } else {
            //open!
            return Popup._open(contents, opt);   
        }
        
    },
    
	_open : function( contents , opt ){
        
        var newId = Popup.POPUP_ID_PREFIX  + Popup.instance.length;
		Popup.instance.push({ "id" : newId });
		
		
		//{ width, height, top. left, autoClose:false, btnClose:true, buttons: [ { text, fn },{ text, fn },{ text, fn }...  ]}
		var defaultOpt = { width : "", height : "", top : "", left : "", autoClose : false, btnClose:true , buttons : [] , title : "" }
		opt = $.extend(defaultOpt, opt);
		
		var closeBtn = "";
		if(opt.btnClose) closeBtn = "<div class='close'>×</div>";
		
		
		//make btn html
		var buttonsHtml = "";
		var arrBtns = [];
		if(opt.buttons.length > 0){
			for( var i=0; i<opt.buttons.length ; i++){
				arrBtns.push( "<button class='btn" + i +"'>" + opt.buttons[i].text + "</button>" )
			}
			buttonsHtml ="<div class='buttonGroup'>" + arrBtns.join("") + "</div>";
		}
		
		//append html
		$("body").append(
			"<div class='"+ Popup.POPUP_CLASS +"-background' id='" + newId + "-background'></div>" + 
			"<div class='" + Popup.POPUP_CLASS + "' id='" + newId + "' >" +
				"<div class='title'>" + opt.title +  
				closeBtn + 
				"</div>" + 
				"<div class='content'>" + contents + "</div>" + 
				buttonsHtml + 
			"</div>"
		);
		
		
		var $popup = $("#" + newId);
		var $popupBackground = $("#" + newId + "-background");
		
		
		//bind btn events
		if(opt.buttons.length > 0){
			for( var i=0; i<opt.buttons.length ; i++){
				$popup.find(".btn"+i).on("click", opt.buttons[i].fn );
			}
		}
		
		
		if( opt.width ){
			$popup.css("width", opt.width);
		} else if(Popup.DEFAULT_WIDTH) {
			$popup.css("width", Popup.DEFAULT_WIDTH);
		} 
		
		if( opt.height ){
			$popup.css("height", opt.height);
		}
		if( opt.autoClose ){
			setTimeout(function(){
				Popup.close(newId);
			}, opt.autoClose );
		}
		if(opt.btnClose){
			$popup.find(".close").on("click", function(){
				var id = $(this).parents("." + Popup.POPUP_CLASS ).first().attr("id");
				Popup.close(id);
			});
		}
		
		
		var top = ( $(window).height() - $popup.outerHeight() ) / 2;
		var left = ( $(window).width() - $popup.outerWidth() ) / 2;
		$popup.css("top", top + "px" ).css("left", left);
		
		return newId;
		
	},
	
	close : function(id){
		
		for ( var i = 0; i < Popup.instance.length; i++) {
			if(Popup.instance[i].id == id){
				$("#"+id).fadeOut( function(){ $(this).remove() } );
				$("#"+id+"-background").fadeOut( function(){ $(this).remove() } );
				
				Popup.instance.splice(i,1);
			}
		}
		
	},
	
	alert : function(text, onClickEvent) {
		var opt = {};
		opt.btnClose = false;
		opt.buttons = [{text : "확인", fn : function(){
			var id =  $(this).parents("." + Popup.POPUP_CLASS).first().attr("id");
			Popup.close(id);
			onClickEvent();
		}}];
		
		var popupId = Popup.open(
			text, opt
		);
	}
}

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