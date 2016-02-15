var myModal = new AXModal();
var myTree = new AXTree();
var fnObj = {
	Tree : [],
	pageStart: function(){

		fnObj.tree1();
		
		
//		var Tree = [
//			{no:"1", type:"WBS", menu_name:"WBS 이름", desc:"", charger:"", admin:"", docs:"", open:true, subTree:[
//				{no:"1.1", type:"phase", menu_name:"기획 및 설계", desc:"M", charger:"최인석", admin:"", docs:"", open:true, subTree:[
//					{no:"1.1.1", type:"process", menu_name:"기획단계", desc:"M", charger:"최인석", admin:"", docs:"", open:true, subTree:[
//						{no:"1.1.1.1", type:"activity", menu_name:"요구사항정의", desc:"M", charger:"최인석/PM", admin:"홍길동", docs:"[필수]요구사항정의서", open:false, subTree:[]},
//						{no:"1.1.1.2", type:"activity", menu_name:"업무분할", desc:"M", charger:"한승욱/기획", admin:"", docs:"[권고]요구사항정의서", open:false, subTree:[]}
//					]}
//				]}
//			]},
//			{AXTreeSplit:true},
//			{no:"9", type:"WBS", menu_name:"WBS 이름", desc:"", charger:"", admin:"", docs:"", open:true, subTree:[]}
//		];
		myTree.setTree(fnObj.Tree);
	},
	list : function() {
		Api.get("/model/menus", {}, function(res) {
			fnObj.Tree = res.menus;
			fnObj.pageStart();
		});
	},
	tree1: function(){

		myTree.setConfig({
			targetID : "AXTreeTarget",
			theme: "AXTree",
			//height:"auto",
			//width:"auto",
			xscroll:true,
			fitToWidth:true, // 너비에 자동 맞춤
			indentRatio:1,
			reserveKeys:{
				parentHashKey:"pHash", // 부모 트리 포지션
				hashKey:"hash", // 트리 포지션
				openKey:"open", // 확장여부
				subTree:"sub_menus", // 자식개체키
				displayKey:"display" // 표시여부
			},
			colGroup: [
				{
					key:"menu_name",
					label:"Menu Name",
					width:"60", align:"left",
					indent:true,
					getIconClass: function(){
						//folder, AXfolder, movie, img, zip, file, fileTxt, fileTag
						//var iconNames = "folder, AXfolder, movie, img, zip, file, fileTxt, fileTag".split(/, /g);
						var iconName = "file";
						//if(this.item.type) iconName = iconNames[this.item.type];
						return iconName;
					},
					formatter:function(){
						return "<u>" + this.item.menu_name + "</u>";
					},
					tooltip:function(){
						return this.item.menu_name;
					}
				},
			    {key:"create_user", label:"Create User", width:"60", align:"center"},
			    {key:"create_date", label:"Create Date", width:"60", align:"center"},
			],
			colHead: {
				display:true
			},
			body: {
				onclick:function(idx, item){
					toast.push(Object.toJSON(this.item));
				},
				addClass: function(){
					// red, green, blue, yellow
					// 중간에 구분선으로 나오는 AXTreeSplit 도 this.index 가 있습니다. 색 지정 클래스를 추가하는 식을 넣으실때 고려해 주세요.
					/*
					if(this.index % 2 == 0){
						return "green";
					}else{
						return "red";
					}
					*/						
				}
			}
		});

	},
	_appendTree: function(){
		var frm = document.treeWriteForm;
		var writeMode = document.treeWriteForm.writeMode.value;
		if(writeMode == "child"){
			
			var obj = myTree.getSelectedList(); // 선택 아이템의 부모 아이템 가져오기
			var pid = "";
			
			if(obj.item) {
				pid = obj.item._id;
			}
			
			var data = {menu_name:frm.nodeName.value, pid:pid};
			Api.post("/model/menus", data, function(res) {
//				fnObj.appendTree(res.menu);
				location.reload();
			});
			
		}else if(writeMode == "append"){
			
			var obj = myTree.getSelectedListParent(); // 선택 아이템의 부모 아이템 가져오기
			var pid = "";
			
			if(obj.item) {
				pid = obj.item._id;
			}
			
			var data = {menu_name:frm.nodeName.value, pid:pid};
			Api.post("/model/menus", data, function(res) {
//				fnObj.appendTree(res.menu);
				location.reload();
			});
			
		}else if(writeMode == "modify"){
			
		}
	},
	appendTree: function(item){
		var frm = document.treeWriteForm;
		var writeMode = document.treeWriteForm.writeMode.value;
		console.log(">>>>> writeMode : " + writeMode);
		if(writeMode == "child"){
			var obj = myTree.getSelectedList(); // 선택 아이템의 부모 아이템 가져오기
			console.log(">>>>> obj : " + JSON.stringify(obj));
			var pno = 0;
			if(obj.item){
				pno = obj.item.nodeID;
			}
			myTree.appendTree(obj.index, obj.item, [item]);
		}else if(writeMode == "append"){
			var obj = myTree.getSelectedListParent(); // 선택 아이템의 부모 아이템 가져오기
			var pno = 0;
			if(obj.item){
				pno = obj.item.nodeID;
			}
			myTree.appendTree(obj.index, obj.item, [item]);
		}else if(writeMode == "modify"){
			try{
				var obj = myTree.getSelectedList();
				myTree.updateTree(obj.index, obj.item, {nodenm:frm.nodeName.value});
			}catch(e){
				alert(e.print());
			}
		}
		myModal.close('addTreeModal');
        
		return false;
	},
	addTree: function(){
		document.treeWriteForm.reset();
		document.treeWriteForm.writeMode.value = "append";
		myModal.openDiv({
			modalID:"addTreeModal",
			targetID:"modalContent",
			width:300,
			top:100
		});
		document.treeWriteForm.nodeName.focus();
	},
	addChildTree: function(){
		var obj = myTree.getSelectedList();
		if(obj.error){
			alert("부모개체를 선택해 주세요");
			return;
		}
		document.treeWriteForm.reset();
		document.treeWriteForm.writeMode.value = "child";
		myModal.openDiv({
			modalID:"addTreeModal",
			targetID:"modalContent",
			width:300,
			top:100
		});
		document.treeWriteForm.nodeName.focus();
	},
	delTree: function(){
		var obj = myTree.getSelectedList();
		if(obj.error){
			alert("개체를 선택해 주세요");
			return;
		}
		Api.del("/model/menus/" + obj.item._id, {}, function(res) {
			console.log(">>>>> delete success");
//			myTree.removeTree(obj.index, obj.item);
			location.reload();
		});
	},
};

$(document).ready(function() {
	fnObj.list();
});