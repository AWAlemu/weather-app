$(function(){
	$('.city').submit(function(e){
		e.preventDefault();
		var cityID = $("input[name='city']").val();
		$("input[name='city']").val('');
		getCurrent(cityID);
		getForecast(cityID);
	});
	
});