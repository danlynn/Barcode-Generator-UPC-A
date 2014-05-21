# A pure html/css/js UPC-A barcode generator

![sample barcode image](http://danlynn.github.io/Barcode-Generator-UPC-A/images/SampleBarcode.png)

This project is a light-weight pure html, css, & javascript solution for creating UPC-A barcode 
images on a webpage.  It consists of just a javascript and a css file to be included
into your own project.

Based on original work by rexfeng: http://cssdeck.com/labs/css-barcode-upc-a-generator 2012 

Try it out: http://danlynn.github.io/Barcode-Generator-UPC-A/example/

## How to include into your webpage

First include the following css and js files into the head of your page.  Note 
that jquery is required:

```html
<head>
  <link rel="stylesheet" href="../barcode_gen_upc_a.css">
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"></script>
  <script type="text/javascript" src="../barcode_gen_upc_a.js"></script>
</head>
```

Next, add a div container to your page where you would like to have the UPC-A 
barcode inserted.  Note that the id of the div will be passed to the javascript 
in the next step:

```html
<body>
  <div id="upc-container"></div>
</body>
```

Then simply execute the following javascript once your page is loaded.

```javascript
BarcodeGenUPCA('#upc-container', '46105217653');
```

If you want to dynamically change the barcode later then simply store the new
BarcodeGenUPCA instance into a variable and call the set_barcode_number() method
as many times as you like:

```javascript
var barcode_gen_upca = new BarcodeGenUPCA('#upc-container', '46105217653');

$('#button-a').click(function() {
  barcode_gen_upca.set_barcode_number('40000000197');
});

$('#button-b').click(function() {
  barcode_gen_upca.set_barcode_number('40000000198');
});
```

![sample invalid barcode image](http://danlynn.github.io/Barcode-Generator-UPC-A/images/SampleBadBarcode.png)

Furthermore, you can react to invalid barcode number in your page by calling the
valid() method.  Note that the rendered barcode itself will automagically react
to being asigned an invalid barcode number by placing a red line over the barcode
and replacing the numbers underneath the image with "* -NOT- VALID *".  The valid()
method will verify that a barcode_number is either 11 or 12 numeric digits.  If
it is 12 digits then the 12th (check-digit) will be verified against the first
11 digits.

```javascript
if (!BarcodeGenUPCA.valid(barcode_number))
  console.log('Bad barcode number!');
```

## Configuration Options

Currently the only configuration option that can be passed into the options hash
when constructing the BarcodeGenUPCA instance is 'display_outer_digits'.  A true
value (the default) will cause the UPC-A image to display the outer digits 
(number-system on left, check-digit on right).  A false value will hide them.

![sample barcode image](http://danlynn.github.io/Barcode-Generator-UPC-A/images/SampleBarcode.png) | ![sample barcode image without outer digits](http://danlynn.github.io/Barcode-Generator-UPC-A/images/SampleNoOuterBarcode.png)

```javascript
BarcodeGenUPCA('#upc-container-left', '46105217653');
BarcodeGenUPCA('#upc-container-right', '46105217653', {display_outer_digits: false});
```
