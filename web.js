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
				'redirect', 'http://js.bsplugin.com/',
				'login', function( $data ){
					bs.WEB.data( 'login', "bs.dom('#login').$( 'html', '<img src=\"" + $data.url +"\"><a href=\"" + $data.link + "\" target=\"_blank\">" + $data.name + "</a>" );
					bs.WEB.next();
				},
				'logout', function( $data ){
					bs.WEB.data( 'login', "bs.dom('#login').$( 'html', '<a href=\""+ $data + "\" target=\"_blank\">login</a>' );" );
					console.log( 'fb_logout', $data );
					bs.WEB.next();
				}
			);
		},
		'config', function(){
			bs.fb('a').start();
			return 1;
		}
	);
	bs.site( 'bsplugin' ).router(
		'', [
			'template', '/head.html',
			'script', '@.js',
			'template', '@.html',
			'static','/foot.html'
		],
		'json', ['require', '@']
	);
	bs.site('bsplugin').start();
}, 'jpage', 'last', 'fb', 'last' );