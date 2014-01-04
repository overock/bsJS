var bs = require( './bs/bsjs' )( __dirname );
bs.$importer( function(){
	bs.site( 'bsplugin' ).$(
		'url', 'js.bsplugin.com',
		'url', '192.168.56.101', 
		'root', './noderoot/pluginjs/',
		'template', function( $url, $template, $data, $end ){
			bs.$jpage( $template, $data, null, $end, $url );
		},
		'init', function(){
			bs.fb( 'a' ).$(
				'appid', '617106348337323',
				'secret', '528687bfaef64539a2be45a9c52ab95f',
				'redirect', 'http://js.bsplugin.com/FB/',
				'login', function( $data ){
					console.log( 'login', $data );
				},
				'logout', function( $mode, $data ){
					console.log( 'fb_logout', $mode, $data );
				}
			);
		}
	);
	bs.site( 'bsplugin' ).router(
		'', [
			'static', '/head.html',
			'script', '@.js',
			'template', '@.html',
			'static','/foot.html'
		],
		'FB', ['function', [bs.fb('a'),'start']],
		'json', ['require', '@']
	);
	bs.site('bsplugin').start();
}, 'jpage', 'last', 'fb', 'last' );