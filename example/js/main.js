require.config({
  baseUrl: 'js',      // base url used in paths below '' => www dir

  paths: {
    'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery',
    'vendor': '../..'    // where barcode_gen_upc_a.js can be found
  }
  
});

require(['index']);
