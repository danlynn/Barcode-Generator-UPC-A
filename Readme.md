# UPC-A Barcode Generator

![sample barcode image](http://danlynn.github.io/Barcode-Generator-UPC-A/images/SampleBarcode.png)

## Introduction

This project is a light-weight pure html, css, & javascript solution for creating UPC-A barcode 
images on a webpage.  It consists of just a javascript and a css file to be included
into your own project.  

The javascript file is wrapped as an AMD module.  If you aren't using require.js 
or similar dependency management frameworks then try using the non-AMD release. The 
release description includes instructions and examples on how to include it 
into your project. 

**Non-AMD Relase:** [http://github.com/danlynn/Barcode-Generator-UPC-A/releases/tag/non-amd-release]

**Based on original work by rexfeng:** [http://cssdeck.com/labs/css-barcode-upc-a-generator](http://cssdeck.com/labs/css-barcode-upc-a-generator) 

**Try the demo:** [http://danlynn.github.io/Barcode-Generator-UPC-A/example/](http://danlynn.github.io/Barcode-Generator-UPC-A/example/)

**API Docs:** [http://danlynn.github.io/Barcode-Generator-UPC-A/docs/BarcodeGenUPCA.html](http://danlynn.github.io/Barcode-Generator-UPC-A/docs/BarcodeGenUPCA.html)

## How to include into your webpage using bower

The code can be included into your project by either checking out this repo or
by using [bower](http://bower.io).  We'll cover installation using bower below.
But, if you don't want to use bower then you can easily adapt these instructions
for cloning this repo and copying the css and js files manually into your
project.

First, install using bower. Note that jquery is a dependency and it is also 
automatically installed (if not already installed as a bower package).

```console
$ bower install Barcode-Generator-UPC-A
bower cached        git://github.com/danlynn/Barcode-Generator-UPC-A.git#0.1.0
bower validate      0.1.0 against git://github.com/danlynn/Barcode-Generator-UPC-A.git#*
bower cached        git://github.com/jquery/jquery.git#2.1.1
bower validate      2.1.1 against git://github.com/jquery/jquery.git#>=1.7.2
bower install       Barcode-Generator-UPC-A#0.1.0
bower install       jquery#2.1.1

Barcode-Generator-UPC-A#0.1.0 www/vendor/bower_components/Barcode-Generator-UPC-A
└── jquery#2.1.1
```

Next, make sure that your require.js config includes the bower_components dir.

```javascript
require.config({
    baseUrl: 'js',
    paths: {
      'bower': 'bower_components'
    }
});
require(['index'])
```

Include the css file into the head of your page.  It can be found inside the
Barcode-Generator-UPC-A bower package.

```html
<head>
  <link rel="stylesheet" href="../bower_components/Barcode-Generator-UPC-A/barcode_gen_upc_a.css">
  <script src="js/require.min.js" data-main="js/main"></script>
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

## Validation

![sample invalid barcode image](http://danlynn.github.io/Barcode-Generator-UPC-A/images/SampleBadBarcode.png)

You can check for an invalid barcode number in your page by calling the
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

![sample barcode image](http://danlynn.github.io/Barcode-Generator-UPC-A/images/SampleBarcode.png) ![sample barcode image without outer digits](http://danlynn.github.io/Barcode-Generator-UPC-A/images/SampleNoOuterBarcode.png)

```javascript
BarcodeGenUPCA('#upc-container-left', '46105217653');
BarcodeGenUPCA('#upc-container-right', '46105217653', {display_outer_digits: false});
```
