/*
 * Copyright (c) 2018 Bob Hageman (https://gitlab.com/b.hageman)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license)
 *
 * Version 1.0.3
 */
;( function( $, window, document, undefined ) {
	
	"use strict";
	
	var pluginName = "pinlogin",
	
	defaults = {
		fields: 5,						// number of fields
		placeholder : '•',				// character that's displayed after entering a number in a field
		autofocus : true,				// focus on the first field at loading time
		hideinput : true,				// hide the input digits and replace them with placeholder
		reset : true,					// resets all fields when completely filled
		complete : function(pin){		// fires when all fields are filled in 
			// pin	:	the entered pincode
		},
		invalid : function(field, nr){	// fires when user enters an invalid value in a field
			// field: 	the jquery field object
			// nr	:	the field number
		},
		keydown : function(e, field, nr){	// fires when user pressed a key down in a field
			// e	:	the event object
			// field: 	the jquery field object
			// nr	:	the field number
		},		
		input : function(e, field, nr){	// fires when a value is entered in a field
			// e	:	the event object
			// field: the jquery field object
			// nr:	the field number
		}			
	};

	
	// constructor
	function Plugin ( element, options ) {
		this.element = element;

		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}	
	
		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function() {

				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
				// call them like the example below
				//this.yourOtherFunction( "jQuery Boilerplate" );
				this._values = new Array(this.settings.fields); // keeping track of the entered values
	
				this._container = $('<div />').prop({
					'id' : this._name,
					'class' : this._name
				});
			
				// main loop creating the fields
				for (var i = 0; i < this.settings.fields; i++)
				{
					var input = this._createInput(this._getFieldId(i), i);
					
					this._attachEvents(input, i);
					
					this._container.append(input);
				}
				
				$(this.element).append(this._container);
				
				// reset all fields to starting state
				this.reset();
			},
			
			// create a single input field
			_createInput : function(id, nr)
			{
				return $('<input>').prop({
					'type' : 'tel',				// Thanks to Manuja Jayawardana (https://gitlab.com/mjayawardana) this is 'tel' and not 'text'!:)
					'id': id,
					'name': id,
					'maxlength': 1,
					'inputmode' : 'numeric',
					'x-inputmode' : 'numeric',
					'pattern' : '^[0-9]*$',
					'autocomplete' : 'off',
					'class' : 'pinlogin-field'
				});
			},
			
			// attach events to the field
			_attachEvents : function(field, nr)
			{
				var that = this;

				field.on('focus', $.proxy(function(e){
					$(this).val('');
				}));
				
				field.on('blur', $.proxy(function(e){
					if (!$(this).is('[readonly]') && that._values[nr] != undefined && that.settings.hideinput)
						$(this).val(that.settings.placeholder);
				}));				
				
				field.on('input', $.proxy(function(e){
					
					// validate input pattern
					var pattern = new RegExp($(this).prop('pattern'));
					if (!$(this).val().match(pattern)) {
		
						$(this)
							.val('')
							.addClass('invalid');
							
						// fire error callback
						that.settings.invalid($(this), nr);

						e.preventDefault();
						e.stopPropagation();						
						
						return;
					}
					else
					{
						$(this).removeClass('invalid');
					}
					
					// fire input callback
					that.settings.input(e, $(this), nr);
					
					// store value
					that._values[nr] = $(this).val();
					
					if (that.settings.hideinput)
						$(this).val(that.settings.placeholder);

					// when it's not the last field
					if (nr < (that.settings.fields-1))
					{
						// make next field editable
						that._getField(nr + 1).removeProp('readonly');
						
						// set focus to the next field
						that.focus(nr + 1);
					}
					// and when you're done
					else
					{
						var pin = that._values.join('');
						
						// reset the plugin
						if (that.settings.reset)
							that.reset();
						
						// fire complete callback
						that.settings.complete(pin);
					}
					
				}));	

				field.on('keydown', $.proxy(function(e){
					
					// fire keydown callback
					that.settings.keydown(e, $(this), nr);
					
					// when user goes back
					if ((e.keyCode == 37 || e.keyCode == 8) && nr > 0) // arrow back, backspace
					{
						that.resetField(nr);

						// set focus to previous input
						that.focus(nr-1);
						
						e.preventDefault();
						e.stopPropagation(); 						
					}
					
				}));
			},
			
			// get the id for a given input number 
			_getFieldId : function (nr)
			{
				return this.element.id + '_' + this._name + '_' + nr;
			},
			
			// get the input field object
			_getField : function(nr)
			{
				return $('#' + this._getFieldId(nr));
			},
			
			// focus on the input field object
			focus : function(nr)
			{
				this.enableField(nr);	// make sure its enabled
				this._getField(nr).focus();
			},
			
			// reset the saved value and input fields
			reset : function()
			{
				this._values = new Array(this.settings.fields);
				
				this._container.children('input').each(function(index){

					$(this).val('');

					if (index > 0)
						$(this)
							.prop('readonly', true)
							.removeClass('invalid');
				});
		
				// focus on first field
				if (this.settings.autofocus)
					this.focus(0);
			},
			
			// reset a single field
			resetField : function(nr)
			{
				this._values[nr] = '';
				this._getField(nr)
					.val('')
					.prop('readonly',true)
					.removeClass('invalid');
			},
			
			// disable all fields
			disable : function()
			{
				
				//console.log('disable all fields');
				this._container.children('input').each(function(index){
					$(this).prop('readonly', true);
				});
			},
			
			// disable specified field
			disableField : function(nr)
			{
				this._getField(nr).prop('readonly', true);
				
			},
			
			// enable all fields
			enable : function()
			{
				this._container.children('input').each(function(index){
					$(this).prop('readonly', false);
				});				
				
			},
			
			// enable specified field
			enableField : function(nr)
			{
				this._getField(nr).prop('readonly', false);
				
			}			
		});

		// A really lightweight plugin wrapper around the constructor,
		$.fn[pluginName] = function (options) {
		  var plugin;
		  this.each(function() {
			plugin = $.data(this, 'plugin_' + pluginName);
			if (!plugin) {
			  plugin = new Plugin(this, options);
			  $.data(this, 'plugin_' + pluginName, plugin);
			}
		  });
		  return plugin;
		};

		
} )( jQuery, window, document );