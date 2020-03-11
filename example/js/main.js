require.config({
  baseUrl: 'js',

  paths: {
    'jquery': 'https://code.jquery.com/jquery-3.4.1',
    'vendor': '../..'    // where barcode_gen_upc_a.js can be found
  }
});

require(['index']);
