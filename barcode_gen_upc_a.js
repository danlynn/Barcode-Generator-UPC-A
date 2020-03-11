/**
 * The BarcodeGenUPCA class is used to add barcode images to web pages using 
 * only html, css, and javascript.  It currently supports only UPC-A barcodes.
 * 
 * Dependencies:
 *    jQuery - for rendering to DOM and extending classes
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

define(['jquery'], function($) {
    
  /**
   * Construct a new instance of a BarcodeGenUPCA to be displayed in the element 
   * specified by 'container' id.  If a 'barcode_number' is provided then the 
   * actual barcode image will be rendered.  The 'options' allow for the barcode 
   * to be customized. If no 'barcode_number' is provided then the image will not 
   * be rendered until one is assigned by calling set_barcode_number().
   * 
   * @param container {string} id of element to contain UPC image
   * @param [barcode_number] {string} initial value
   * @param [options] {Object} options hash to over-ride default values
   * @param [options.display_outer_digits=true] {boolean} determines whether the 
   *            outer digits are displayed
   * @constructor
   */
  var BarcodeGenUPCA = function(container, barcode_number, options) {
    this.container = container;
    if (options)
      $.extend(this.options, options);
    if (barcode_number)
      this.set_barcode_number(barcode_number);
  };
  
  
  // ---- instance methods ----
  BarcodeGenUPCA.prototype = {
  
    /**
     * DOM ref of container to render barcode within (eg: '#my-container')
     * @type {string}
     * @instance
     */
    container: null,
  
    /**
     * 12 digit human-readable barcode
     * @type {string}
     * @instance
     */
    barcode_number: null,
  
    /**
     * Configuration options
     * @instance
     * @property display_outer_digits {boolean} determines whether the outer 
      *            digits are displayed
     */
    options: {
      display_outer_digits: true
    },
  
    /**
     * Assign a value to be displayed in this barcode.  If provided, the 12th 
     * digit is a check-digit which will be calculated from the 11 digit 
     * 'barcode_number'.  The barcode image will be updated with this value.  If 
     * the barcode has not been added to the DOM yet then it will be added to 
     * 'this.container'.
     * 
     * @param barcode_number {string} 11 (or optionally 12) digit barcode
     */
    set_barcode_number: function(barcode_number) {
      if (barcode_number.length == 11 && BarcodeGenUPCA.valid(barcode_number))
        barcode_number += BarcodeGenUPCA.get_check_digit(barcode_number);
      this.barcode_number = barcode_number;
      this.render();
    },
    
    /**
     * Render this instance's 'barcode_number' as an image into the 'container' 
     * element specified when constructed.  Normally this is called internally 
     * when the barcode_number is changed by set_barcode_number() method.  But, 
     * it may be useful when a page refresh is needed.
     */
    render: function() {
      var self = this;
      var $container = $(self.container);
      var barcode_number = BarcodeGenUPCA.valid(self.barcode_number) ? self.barcode_number : '000000000000';
      var elements = ['l1','l2','l3','l4','l5','l6','r1','r2','r3','r4','r5','r6'];
      if (elements.some(function(val) {return $container.find("#" + val).length == 0}))
        $container.html(BarcodeGenUPCA.barcode_template);
      elements.forEach(function(val, i) {
        $container.find("." + val).html(BarcodeGenUPCA.upc_a_digits[barcode_number[i]]);
      });
      if (BarcodeGenUPCA.valid(self.barcode_number))
        $container.find('.red-strike').hide();
      else {
        barcode_number = '*-NOT-VALID*';
        $container.find('.red-strike').show();
      }
      if (self.options.display_outer_digits)
        $container.find('.number-system').text(barcode_number.slice(0,1));
      $container.find('.l-digits').text(barcode_number.slice(1,6));
      $container.find('.r-digits').text(barcode_number.slice(6,11));
      if (self.options.display_outer_digits)
        $container.find('.check-digit').text(barcode_number.slice(11,12));
      
    }
  };
  
  
  // ---- class methods/attributes ----
  $.extend(BarcodeGenUPCA, {
    /**
     * Calculate and return the check-digit for the specified 11 digit 
     * 'barcode_number'.  If 'barcode_number' is not numeric and exactly 11 digits
     * long then null is returned indicating an error.
     * 
     * @param barcode_number {string} 11 digit barcode number
     * @returns {number} calculated check-digit - null if 'barcode_number' invalid
     * @function BarcodeGenUPCA.get_check_digit
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
     * @function BarcodeGenUPCA.valid
     */
    valid: function(barcode_number) {
      if (/^\d{11,12}$/.test(barcode_number))
        if (barcode_number.length == 12)
          return barcode_number.slice(11,12) == BarcodeGenUPCA.get_check_digit(barcode_number.slice(0,11));
        else
          return true;
      return false;
    },
    
    /**
     * HTML templates for UPC-A barcode digit images.  The strange html comment 
     * syntax below is required in order to render properly in some browsers.
     * @see http://css-tricks.com/fighting-the-space-between-inline-block-elements/
     * @memberof BarcodeGenUPCA
     * @private
     */
    upc_a_digits: {
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
  
    /**
     * Template of barcode html that will be inserted in 'container'.
     * @memberof BarcodeGenUPCA
     * @private
     */
    barcode_template: '<!--\
      --><div class="upc-wrap"><!--\
        --><div class="upc-a"><!--\
          --><div class="red-strike"></div><!--\
          --><div class="upc-bars"><!--\
            --><div class="m e long"></div><!--\
            --><div class="m o long"></div><!--\
            --><div class="m e long"></div><!--\
            --><div class="l"><!--\
              --><div class="l1 short"></div><!--\
              --><div class="l2 short"></div><!--\
              --><div class="l3 short"></div><!--\
              --><div class="l4 short"></div><!--\
              --><div class="l5 short"></div><!--\
              --><div class="l6 short"></div><!--\
            --></div><!--\
            --><div class="m o long"></div><!--\
            --><div class="m e long"></div><!--\
            --><div class="m o long"></div><!--\
            --><div class="m e long"></div><!--\
            --><div class="m o long"></div><!--\
            --><div class="r"><!--\
              --><div class="r1 short"></div><!--\
              --><div class="r2 short"></div><!--\
              --><div class="r3 short"></div><!--\
              --><div class="r4 short"></div><!--\
              --><div class="r5 short"></div><!--\
              --><div class="r6 short"></div><!--\
            --></div><!--\
            --><div class="m e long"></div><!--\
            --><div class="m o long"></div><!--\
            --><div class="m e long"></div><!--\
          --></div><!--\
          --><div class="upc-digits"><!--\
            --><div class="number-system digits">*</div><!--\
            --><div class="l-digits digits">00000</div><!--\
            --><div class="r-digits digits">00000</div><!--\
            --><div class="check-digit digits">*</div><!--\
          --></div><!--\
        --></div><!--\
      --></div>'
    
  });
  
  return BarcodeGenUPCA;
  
});
