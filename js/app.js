//Model constructor 
var Model = function() {
	this.location = '';
	this.autofillResults = {};
	this.onChange = null;
};

//bind a method to Model prototype
Model.prototype.getAutocomplete = function(value){
	//process make api call
	this.location = value;
	//this.autofillResults = getLocation(value);
	//calls show Auto Complete
	if(this.onChange) {
		//this.onChange(this.autofillResults);
		this.onChange(this.location);
	}
};
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
View.prototype.showAutocomplete = function(text) {
	this.resultsElement.html(text);
};

//define a Controller constructor 
var Controller = function(model, view) {
	view.onChange = model.getAutocomplete.bind(model);
	model.onChange = view.showAutocomplete.bind(view);
};

//construct MVC objects 
document.addEventListener('DOMContentLoaded', function() {
	var model = new Model();
	var view = new View('#autocomplete', '#results ul');
	var controller = new Controller(model, view);
});