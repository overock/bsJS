var bs = require( './bs/bsjs' )( __dirname );
bs.$importer( function(){
	bs.site( 'bsplugin' ).$(
		'url', 'js.bsplugin.com',
		'url', '192.168.56.101', 
		'root', './noderoot/pluginjs/',
		'template', function( $url, $template, $data, $end ){
			bs.$jpage( $template, $data, null, $end, $url );
		}
	);
	bs.site( 'bsplugin' ).rules(
		'', [
			'absolute', 'head',
			'relative', '@',
			'template', '@T',
			'absolute','foot'
		],
		'json', [
			'relative', '@',
			'template', '@'		
		]
	);
	bs.site('bsplugin').start();
}, 'jpage', 'last' );