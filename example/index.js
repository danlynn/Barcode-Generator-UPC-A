$(document).ready(function() {
  
  var barcode_gen_upca = new BarcodeGenUPCA('#upc-container', '00000000000');
  $('input[name=barcodenum]').focus();
  
	$('input[name=barcodenum]').keyup(function() {
		var barcode_number = $('input[name=barcodenum]').val();
    barcode_gen_upca.set_barcode_number(barcode_number);
		if (barcode_gen_upca.valid(barcode_number)) {
      $('#entered_bc').text(barcode_number);
      $('#calc_check').text(barcode_gen_upca.barcode_number.slice(11,12));
      $('#all_digits').text(barcode_gen_upca.barcode_number);
      $('#result').show();
		} else {
      $('#result').hide();
		}
	});
});
