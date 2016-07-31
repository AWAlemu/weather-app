var getCurrent = function(city) {
	var request = {
		id: city,
		APPID: '8dac38d11acbe3e6ecf035a449582cac',
	};

	$.ajax({
		url: '//api.openweathermap.org/data/2.5/weather',
		data: request,
		dataType: 'jsonp',
		type: 'GET',
	})
	.done(function(result){
		console.log(result);
		var rslt = showResults(result);
		$('.result').append(rslt);
	})
	.fail(function(){

	});
};

$(function(){
	$('.city').submit(function(e){
		e.preventDefault();
		var cityID = $("input[name='city']").val();
		$("input[name='city']").val('');
		getCurrent(cityID);
		getForecast(cityID);
	});
	
});

