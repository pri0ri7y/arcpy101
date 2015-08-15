var app = app || {};

$(document).ready(function(){  
   app.setXHRtacker('Loading Feature Class List','--','IN PROGRESS','danger');
   var ajaxTime= new Date().getTime();
   $.ajax({
		type:"GET",
		url:"http://localhost/ARCPY101/BAckEndHandler/test.py?task=getFeatureClassList",
		dataType:"html",
		success:function(data) {
			var totalTime = new Date().getTime()-ajaxTime;
			app.setFeatureClassList(data,totalTime);			   
		},
		error:function() {
			alert("Error in loading data");
		}
    });
});


app.setXHRtacker = function ( name , time , status , _class ) {
	$("#XHRname").html(name);
	$("#XHRtime").html(time);
	$("#XHRstatus").html(status);
	$("#XHRstatus").attr( "class", _class)
	
	
}

app.setFeatureClassList = function (data,totalTime){  
 
 var totalTime = totalTime/1000;
 app.setXHRtacker('Loading Feature Class List',totalTime,'SUCCESS','success');
 
 var arr = JSON.parse(data)
 for (var x=0; x< arr.length ; x++){
	 $("#featureClassList").append('<option value='+arr[x]+'>'+ arr[x] +'</option>');
 }   
}

app.setFieldsForQuery =  function (fc){	
	app.setXHRtacker('Getting List Of Fields','--','IN PROGRESS','danger');
	
	var URL = "http://localhost/ARCPY101/BAckEndHandler/test.py?task=getFieldsList&fc="+fc	
	var returnSet = app.Ajax ( URL );
	var Fields = JSON.parse(returnSet[0]);		 
	app.setXHRtacker('Getting List Of Fields',returnSet[1]/1000,'SUCCESS','success');
	for (var x=0; x< Fields.length ; x++){
	 $("#FeatureClassFieldSet").append('<option onclick ="app.onItemsClickHandler(' + "'" + Fields[x] + "'" +');" value='+Fields[x]+'>'+ Fields[x] +'</option>');
    }   
	
}

app.MakeQuery = function () {
	
	var Query = $("#WhereClauseHolder").val();
	var fc = $("#featureClassList").val();
	app.setXHRtacker('Making Query','--','IN PROGRESS','danger');
	
	var URL = "http://localhost/ARCPY101/BAckEndHandler/test.py?task=getQueryResults&fc=" + fc + "&query=" + Query;
	var returnSet = app.Ajax ( URL );
	var queryResult = JSON.parse(returnSet[0]);		 
	app.setXHRtacker('Making Query',returnSet[1]/1000,'SUCCESS','success');
	
	$("#ResultHolder").val(  JSON.stringify(queryResult, null, "\t")  );
}










/**  UI Controls & Triggers   **/
$("#featureClassList").change(function() {
   app.setFieldsForQuery($(this).val());
   $("#WhereClauseSpan").html("SELECT * FROM "+ $(this).val() + " WHERE");  
   
});


/**  CommonUtils   **/
app.Ajax = function (url){	
	var ajaxTime= new Date().getTime();
	var res = null;
	$.ajax({
		type:"GET",
		url:url,
		dataType:"html",
		async: false,
		success:function(data) {
			var totalTime = new Date().getTime()-ajaxTime;
			res =  [data,totalTime]		   
			return res;
		},
		error:function() {
			alert("Error in loading data");
		}
    });	
	
	return res;
}

app.onItemsClickHandler =  function(item){	    
     
		var holder = $("#WhereClauseHolder");		
		holder.val(holder.val() + " " + item);	
		
}
