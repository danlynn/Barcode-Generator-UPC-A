/**
 * The BarcodeGenUPCA class is used to add barcode images to web pages using 
 * only html, css, and javascript.  It currently supports only UPC-A barcodes.
 * 
 * Dependencies:
 *    jQuery - for rendering to DOM
 *    
 * Regarding scanning barcodes from a smartphone screen, see:
 *    http://www.barcode2mobile.com/FieldTest.html
 * 
 * Learn more about barcodes:
 *    http://www.barcodeisland.com/upca.phtml
 *    http://www.barcodefaq.com/BarcodeMatch/index.html
 *    
 * Based on original example by rexfeng:
 *    http://cssdeck.com/labs/css-barcode-upc-a-generator
 */

/**
 * Construct a new instance of a BarcodeGenUPCA to be displayed in the element 
 * specified by 'container' id.  If a 'barcode_number' is provided then the 
 * actual barcode image will be rendered.  The 'options' allow for the barcode 
 * to be customized. If no 'barcode_number' is provided then the image will not 
 * be rendered until one is assigned by calling set_barcode_number().
 * 
 * @param container {string} id of element to contain UPC image
 * @param barcode_number {string} optional initial value
 * @param options {Hash} optional options hash to over-ride default values
 * @constructor
 */
var BarcodeGenUPCA = function(container, barcode_number, options) {
  this.container = container;
  if (options)
    $.extend(this.options, options);
  if (barcode_number)
    this.set_barcode_number(barcode_number);
};


BarcodeGenUPCA.prototype = {
  
  container: null, // DOM id of container to render barcode within
  
  barcode_number: null, // 12 digit human-readable barcode
  
  options: {
    display_outer_digits: true
  },

  /**
   * Assign a value to be displayed in this barcode.  The 12th digit is a check
   * digit which will be calculated from the 11 digit 'barcode_number'.  The 
   * barcode image will be updated with this value.  If the barcode has not been
   * added to the DOM yet then it will be added to 'this.container'.
   * 
   * @param barcode_number {string} 11 digit barcode
   */
  set_barcode_number: function(barcode_number) {
    if (barcode_number.length == 11 && this.valid(barcode_number))
      barcode_number += this.get_check_digit(barcode_number);
    this.barcode_number = barcode_number;
    this.render();
  },
  
  // TODO: convert to use classes instead of ids in order to support multiple barcodes per page
  /**
   * Render this instance's 'barcode_number' as an image into the 'container' 
   * element specified when constructed.  If the optional 'barcode_number' arg 
   * is specified then it will over-ride the 'this.barcode_number' instance 
   * attribute value - this is handy for displaying error states.
   * 
   * @param barcode_number {string} optionally over-ride 'barcode_number' 
   *                      instance attribute
   */
  render: function() {
    var self = this;
    var barcode_number = self.valid(self.barcode_number) ? self.barcode_number : '00000000000';
    var elements = ['l1','l2','l3','l4','l5','l6','r1','r2','r3','r4','r5','r6'];
    if (elements.some(function(val) {return $(self.container).find("#" + val).size() == 0}))
      $(self.container).html(self.barcode_template);
    elements.forEach(function(val, i) {
      $(self.container).find("#" + val).html(self.upc_a[barcode_number[i]]);
    });
    if (self.valid(self.barcode_number))
      $('#red-strike').hide();
    else {
      barcode_number = '*-NOT-VALID*'
      $('#red-strike').show();
    }
    if (self.options.display_outer_digits)
      $('#number-system').text(barcode_number.slice(0,1));
    $('#l-digits').text(barcode_number.slice(1,6));
    $('#r-digits').text(barcode_number.slice(6,11));
    if (self.options.display_outer_digits)
      $('#check-digit').text(barcode_number.slice(11,12));
    
  },

  /**
   * Calculate and return the check-digit for the specified 11 digit 
   * 'barcode_number'.  If 'barcode_number' is not numeric and exactly 11 digits
   * long then null is returned indicating an error.
   * 
   * @param barcode_number {string} 11 digit barcode number
   * @returns {number} calculated check-digit - null if 'barcode_number' invalid
   */
  get_check_digit: function(barcode_number) {
    if (!/^\d{11}$/.test(barcode_number))
      return null;
    var checksum_s1 = 0; //init odd holder
    var checksum_s2 = 0; //init even holder
    barcode_number.split('').forEach(function(val, i) {
      if (i % 2 == 0)
        checksum_s1 += parseInt(val);
      else
        checksum_s2 += parseInt(val);
    });
    var s3_string = (checksum_s1 * 3 + checksum_s2).toString();
    var s3_last = s3_string.substring(s3_string.length - 1);
    return s3_last == '0' ? 0 : 10 - parseInt(s3_last);
  },

  /**
   * Validate that the specified 'barcode_number' is numeric and either 11 or 12
   * digits long.  If 'barcode_number' is 12 digits long then the 12th digit is
   * verified to be the valid check digit for the first 11 digits.
   * 
   * @param barcode_number {string} 11 or 12 digit barcode number to be validated
   * @returns {boolean} true if valid - else false
   */
  valid: function(barcode_number) {
    if (/^\d{11,12}$/.test(barcode_number))
      if (barcode_number.length == 12)
        return barcode_number.slice(11,12) == this.get_check_digit(barcode_number.slice(0,11))
      else
        return true;
    return false;
  },
  
  // define barcode graphics
  // Why the html comments are needed: http://css-tricks.com/fighting-the-space-between-inline-block-elements/
  upc_a: {
    0: '<div class="m o"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m e"></div>',
    
    1: '<div class="m o"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m e"></div>',
    
    2: '<div class="m o"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div>',
    
    3: '<div class="m o"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m e"></div>',
    
    4: '<div class="m o"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div>',
    
    5: '<div class="m o"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m e"></div>',
    
    6: '<div class="m o"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div>',
    
    7: '<div class="m o"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div>',
    
    8: '<div class="m o"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div>',
    
    9: '<div class="m o"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m o"></div><!--\
     --><div class="m e"></div><!--\
     --><div class="m e"></div>'
  },
  
  barcode_template: '\
    <div id="upc-a"><!--\
    --><div id="red-strike"></div><!--\
    --><div id="upc-wrap"><!--\
      --><div class="m e long"></div><!--\
      --><div class="m o long"></div><!--\
      --><div class="m e long"></div><!--\
      --><div class="l"><!--\
        --><div id="l1"></div><!--\
        --><div id="l2"></div><!--\
        --><div id="l3"></div><!--\
        --><div id="l4"></div><!--\
        --><div id="l5"></div><!--\
        --><div id="l6"></div><!--\
      --></div><!--\
      --><div class="m o long"></div><!--\
      --><div class="m e long"></div><!--\
      --><div class="m o long"></div><!--\
      --><div class="m e long"></div><!--\
      --><div class="m o long"></div><!--\
      --><div class="r"><!--\
        --><div id="r1"></div><!--\
        --><div id="r2"></div><!--\
        --><div id="r3"></div><!--\
        --><div id="r4"></div><!--\
        --><div id="r5"></div><!--\
        --><div id="r6"></div><!--\
      --></div><!--\
      --><div class="m e long"></div><!--\
      --><div class="m o long"></div><!--\
      --><div class="m e long"></div><!--\
    --></div><!--\
    --><div id="number-system" class="digits">*</div><!--\
    --><div id="l-digits" class="digits">00000</div><!--\
    --><div id="r-digits" class="digits">00000</div><!--\
    --><div id="check-digit" class="digits">*</div>\
    </div>'
    
};
