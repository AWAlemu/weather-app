//Model constructor 
var Model = function() {
    this.location = '';
    this.autofillResults = [];
    this.onChange = null;
};

//bind a method to Model prototype
Model.prototype.getAutocomplete = function(value) {
    //process make api call
    this.location = value;
    getLocation(value);
    //calls show Auto Complete
    if (this.onChange) {
        this.onChange(this.autofillResults);
    }
};

Model.prototype.setAuto = function(data) {
        this.autofillResults = data;
    }
    //define a View constructor
var View = function(elementSelector, rSelector) {
    this.element = $(elementSelector);
    this.resultsElement = $(rSelector);
    this.onChange = null;
    this.element.on('input', this.onInput.bind(this));
    //this.resultsElement.on('click', this.onClick.bind(this));
};

View.prototype.onInput = function() {
    var value = this.element.val();
    if (this.onChange) {
        this.onChange(value);
    }
};

//display autocomplete output
View.prototype.showAutocomplete = function(array) {
    this.resultsElement.html('');

    for (var i = 0; i < array.length; i++) {
        var address = array[i].formatted_address;
        var list = $('.templates .autoCompList').clone();
        var autocomplete = list.find('div');
        autocomplete.text(address);
        this.resultsElement.append(list);
    }
    console.log('inside show auto Complete');
};

//define a Controller constructor 
var Controller = function(model, view) {
    view.onChange = model.getAutocomplete.bind(model);
    model.onChange = view.showAutocomplete.bind(view);
    var setAuto = showResult.bind(model);
    getLocation = function(adrs) {
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
                	$('#results').removeClass('hidden');
                    var array = data.results;
                    setAuto(array);
                })
                .fail(function(jqXHR, error) {
                    console.log('Failed')
                });
        } else {
            $('#results').addClass('hidden').children().empty();
        }
    };
};


//construct MVC objects 
document.addEventListener('DOMContentLoaded', function() {
    var model = new Model();
    var view = new View('#autocomplete', '#results ul');
    var controller = new Controller(model, view);
});

var showResult = function(result) {
    this.setAuto(result);
};
