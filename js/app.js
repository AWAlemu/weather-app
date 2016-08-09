//Address Autocomplete Model constructor  
var Model = function() {
    this.weatherOutput = {};
    this.autofillResults = [];
    this.current = {};
    this.timeZone = {};
    this.onChange = null;
    this.onSelect = null;
    this.onShowWeather = null;
};

//Method to make API call and callback a display API call results
Model.prototype.getAutocomplete = function(value) {
    //Make API call to Google maps
    getLocation(value);
    //calls show Auto Complete to display autocomplete results
    if (this.onChange) {
        this.onChange(this.autofillResults);
    }
};

//Method to make weather API call
Model.prototype.getWeatherData = function(id) {
    var index = id.substring(1);
    var location = this.autofillResults[index];
    this.weatherOutput.city = location.formatted_address;
    getCurrent(location.geometry.location.lat, location.geometry.location.lng);
};

Model.prototype.organizeCurrent = function() {
    this.weatherOutput.temp = Math.floor(((this.current.main.temp * 9 / 5) - 459.67));
    this.weatherOutput.icon = this.current.weather[0].icon;
    this.weatherOutput.humidity = this.current.main.humidity + '%';
    this.weatherOutput.windSpeed = this.current.wind.speed + ' mph';
    this.weatherOutput.windDirection = this.current.wind.deg;
    this.weatherOutput.description = this.current.weather[0].description;
    if (this.onShowWeather) {
        this.onShowWeather(this.weatherOutput);
    }
};

Model.prototype.getCurrentTime = function() {
    var timestamp = this.timeZone.dstOffset + this.timeZone.rawOffset + this.current.dt;
    convertTime(timestamp);
};

//store Autocomplete API call response in model
var showResult = function(result) {
    this.autofillResults = result;
};

//store current weather data in model
var setCurrent = function(result) {
    this.current = result;
};

//store timezone API call results in model
var setTimeZone = function(result) {
    this.timeZone = result;
    this.getCurrentTime();
};

//edit current local time and store in model
var setCurrentTime = function(data) {
    var string = data.localDate;
    var result = string.split(' ');
    var time = result[4].split(':');
    this.weatherOutput.day = result[0] + ' ' + time[0] + ':' + time[1] + ' ' + result[5];
    this.organizeCurrent();
};

//View constructor
var View = function(elementSelector, rSelector, wtrViewSelector, wtrBox, frm) {
    this.element = $(elementSelector);
    this.resultsElement = $(rSelector);
    this.wtrViewTemplate = $(wtrViewSelector);
    this.wtrView = $(wtrBox);
    this.form = $(frm);
    this.onChange = null;
    this.onSelect = null;
    this.element.on('input', this.onInput.bind(this));
    this.resultsElement.on('click', 'li', this.onClick.bind(this));
    this.form.submit(this.submit.bind(this));
};

//method to pass user input to model
View.prototype.onInput = function() {
    var value = this.element.val();
    this.wtrView.hide();
    if (this.onChange) {
        this.onChange(value);
    }
};

//method to pass user autocomplete selection to model and trigger weather API call
View.prototype.onClick = function(event) {
    var id = event.currentTarget.id;
    this.resultsElement.empty().parent().addClass('hidden');
    this.element.val('');
    this.wtrView.show();
    if (this.onSelect) {
        this.onSelect(id);
    }
};

//method submit type only locations to model and trigger weather API call
View.prototype.submit = function(event) {
    event.preventDefault();
    var id = 's0';
    this.resultsElement.empty().parent().addClass('hidden');
    this.element.val('');
    this.wtrView.show();
    if (this.onSelect) {
        this.onSelect(id);
    }
};

//method to display autocomplete output
View.prototype.showAutocomplete = function(array) {
    this.resultsElement.children().empty();
    for (var i = 0; i < array.length; i++) {
        var address = array[i].formatted_address;
        var list = $('.templates .autoCompList').clone();
        list.attr('id', 's' + i);
        var autocomplete = list.find('div');
        autocomplete.text(address);
        this.resultsElement.append(list);
    }
};
//method to display weather data
View.prototype.showWeather = function(obj) {

    var result = this.wtrViewTemplate.clone();

    var cityName = result.find('#location span');
    cityName.text(obj.city);
    
    var icon = result.find('#icon img');
    icon.attr('src', 'https://openweathermap.org/img/w/' + obj.icon + '.png');
    
    var tempp = result.find('#tmp span');
    tempp.text(obj.temp);

    var misc = result.find('#humidity');
    misc.text(obj.humidity);

    var misc = result.find('#wind');
    misc.text(obj.windSpeed);

    var day = result.find('#dy');
    day.text(obj.day);

    var dscrp = result.find('#dscrp');
    dscrp.text(obj.description);

    this.wtrView.html('');
    this.wtrView.append(result);
};

//define a Controller constructor 
var Controller = function(model, view) {
    view.onChange = model.getAutocomplete.bind(model);
    model.onChange = view.showAutocomplete.bind(view);
    view.onSelect = model.getWeatherData.bind(model);
    model.onSelect = view.showWeather.bind(view);
    model.onShowWeather = view.showWeather.bind(view);
    setAuto = showResult.bind(model);
    passCurrent = setCurrent.bind(model);
    passTimeZone = setTimeZone.bind(model);
    passCurrentTime = setCurrentTime.bind(model);
};

//construct MVC objects 
document.addEventListener('DOMContentLoaded', function() {
    var model = new Model();
    var view = new View('#autocomplete', '#autoCompResults ul', '.templates .main', '.weatherResult', '#userInput');
    var controller = new Controller(model, view);
});

//function to get location autocomplete data
var getLocation = function(adrs) {
    var params = {
        address: adrs,
        key: 'AIzaSyBflgBDGxIWpqwAjzvQYOVjQ_dVd6QCXDQ',
    };
    if (adrs != '') {
        $.ajax({
                url: 'https://maps.googleapis.com/maps/api/geocode/json',
                data: params,
                type: 'GET',
            })
            .done(function(data) {
                $('#autoCompResults').removeClass('hidden');
                var array = data.results;
                setAuto(array);
            })
            .fail(function(jqXHR, error) {
                var errorElem = showError(error);
                $('.weatherResult').append(errorElem);
            });
    } else {
        $('#autoCompResults').addClass('hidden').children().empty();
    }
};

//function to get current weather data
var getCurrent = function(lt, lng) {
    var request = {
        lat: lt,
        lon: lng,
        APPID: '8dac38d11acbe3e6ecf035a449582cac',
    };
    $.ajax({
            url: '//api.openweathermap.org/data/2.5/weather',
            data: request,
            dataType: 'json',
            jsonp: false,
            type: 'GET',
        })
        .done(function(result) {
            getTimeZone(lt, lng);
            passCurrent(result);
        })
        .fail(function(jqXHR, error) {
            var errorElem = showError(error);
            $('.weatherResult').append(errorElem);
        });
};

//function to get local time data
var getTimeZone = function(lt, lng) {
    var params = {
        location: lt + ',' + lng,
        timestamp: '1331766000',
        key: 'AIzaSyAZg8kaLqghPacqBDb7V_gPGWRuClPHx0Y',
    };
    $.ajax({
            url: 'https://maps.googleapis.com/maps/api/timezone/json',
            data: params,
            type: 'GET',
        })
        .done(function(data) {
            passTimeZone(data);
        })
        .fail(function(jqXHR, error) {
            var errorElem = showError(error);
            $('.weatherResult').append(errorElem);
        });
};

//function to convert timestamp 
var convertTime = function(timestamp) {
    var baseUri = 'http://www.convert-unix-time.com/api?';
    $.getScript(baseUri + 'timestamp=' + timestamp + '&returnType=jsonp&callback=passCurrentTime');
};

//function to display error message when API calls fail
var showError = function(error) {
    var errorElem = $('.templates .error').clone();
    var errorText = '<p>' + error + '</p>';
    errorElem.append(errorText);
};
