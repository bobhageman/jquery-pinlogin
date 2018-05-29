# jQuery Pinlogin
jQuery plugin to create a cross-device pincode login experience. 

The number of pincode input fields are configurable. After entering a complete pin code the 'complete' callback will be fired which gives you the possibility to do any further processing. No form or hidden input fields are used to give you the freedom of choice how to handle the pincode input.

Lightly inspired by [bootstrap-pincode-input](https://github.com/fkranenburg/bootstrap-pincode-input) from fkranenburg

## Demo
A screenshot of the plugins input fields:
![screenshot](https://gitlab.com/b.hageman/jquery-pinlogin/raw/master/demo/example.png)

For a working example go to:
[site]https://www.mybo.nu/static/jquery-pinlogin/

## Install

### NPM
todo

### Manually by inluding scripts

1. Include jQuery:

	```html
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	```

2. Include plugin's code:

	```html
	<script src="jquery.pinlogin.min.js"></script>
	```

2. Include plugin's css:

	```html
	<link href="jquery.pinlogin.css" rel="stylesheet" type="text/css" />
	```	
	
3. Call the plugin:

	```javascript
	$("#element").pinlogin({
		fields: 5,
		complete : function(pin){
			alert ('Awesome! You entered: ' + pin);
						
			// further processing here
		}
	});
	```


## Usage

### fields 
Number. Default `5`

The amount of input fields where the user needs to enter a pin code.   

### placeholder
String. Default `•`   

Contains the placeholder that's displayed instead of the entered digits. You can use special characters, but if you do make sure your HTML page is properly encoded. For example UTF8:

	```html
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	```

### autofocus
Boolean. Default `true`.   

When the plugin is loaded, automatically focus on the first input field.   

### hideinput
Boolean. Default `true`.   

Hides or displays the user entered digits in the input field. When enabled, the caharacter in `placeholder` immediately replaces the entered digit.   

### complete

Callback function that will fire when all input fields are filled.   

Passed parameters:   
* ```pin``` String. The entered pincode.   

```javascript
   $('#element').pinlogin({
		complete : function(pin){
			console.log('You entered: ' + pin);
    }});
```

### invalid

Callback function that will fire when user enters an invalid character in a pincode field.   

Passed parameters:   
* ```field``` Element. The jQuery object of the field that's invalid.   
* ```nr``` Number. The number of the field that's invalid (start counting at 0).   

```javascript
   $('#element').pinlogin({
		invalid : function(field, nr){
			console.log('The field with nr : ' + nr + ' contains an invalid character');
    }});
```

### keydown

Callback function that will fire when user presses the key, and right before it reaches the pincode field.   

Passed parameters:   
* ```e``` Event. The 'keydown' event.   
* ```field``` Element. The jQuery object of the field that's getting the keydown.   
* ```nr``` Number. The number of the field that's getting the keydown (start counting at 0).   

```javascript
   $('#element').pinlogin({
		keydown : function(e, field, nr){
			console.log('The field with nr : ' + nr + ' is about to get a value');
    }});
```

## License

[MIT License](https://opensource.org/licenses/mit-license) © Bob Hageman




