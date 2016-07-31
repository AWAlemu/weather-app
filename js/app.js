var getCurrent = function(city) {
	var request = {
		id: city,
		APPID: '8dac38d11acbe3e6ecf035a449582cac',
	};

	$.ajax({
		url: 'https://api.openweathermap.org/data/2.5/weather',
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

var showResults = function(obj) {
	var result = $('.templates .main').clone();

	var cityName = result.find('#location span');
	cityName.text(obj.name);

	var tempp = result.find('#tmp span');
	tempp.text(tempConverter(obj.main.temp));

	var misc = result.find('#humidity');
	misc.text(obj.main.humidity);
	
	var misc = result.find('#wind');
	misc.text(obj.wind.speed);
	
	return result;
};

var tempConverter = function(temp) {
	var far = (temp * 9/5) - 459.67;
	return Math.floor(far);
};

$(function(){
	$('.city').submit(function(e){
		e.preventDefault();
		var cityID = $("input[name='city']").val();
		$("input[name='city']").val('');
		getCurrent(cityID);
		//getForecast(cityID);
	});
	
});

