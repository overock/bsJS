var bs = require( './bs/bsjs' );
bs.Site( 'bsplugin' ).S(
	'url', 'js.bsplugin.com:8001',
	'url', '127.0.0.1:8001',
	'root', './noderoot/pluginjs/',
	'db', 'mysql',
	'cache', 0,
	'i18n', '@locale.js',
	'siteStart', '@sitestart.js'
	/*
	'https', {key:'./key.pem',cert:'./cert.pem',port:4430},
	'template', function( $url, $template, $data, $end ){
		bs.$jpage( $template, $data, null, $end, this.cache ? $url : 0 );
	}
	*/
);
bs.Site( 'bsplugin' ).router(
	'member', [
		'function', function(){
			if( !bs.WEB.session('id') ) bs.WEB.redirect('/'), bs.WEB.pause();
		},
		'template', '@.html'
	]
);
bs.Site('bsplugin').start();