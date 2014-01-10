var bs = require( './bs/bsjs' )( __dirname );
bs.$importer( function(){
	bs.site( 'bsplugin' ).$(
		'url', 'js.bsplugin.com:8001',
		'url', '127.0.0.1:8001',
		'https', {key:'./key.pem',cert:'./cert.pem',port:4430},
		'root', './noderoot/pluginjs/',
		'db', 'mysql',
		'cache', 0,
		'template', function( $url, $template, $data, $end ){
			bs.$jpage( $template, $data, null, $end, this.cache ? $url : 0 );
		},
		'siteStart', function(){
			if( bs.$os( 'hostname' ) == 'hika' ) bs.db( 'd@mysql' ).$( 'url', 'localhost:3306', 'id', 'root', 'pw', '1234', 'db', 'hika01' );
			else bs.db( 'd@mysql' ).$( 'url', '10.0.0.1:3306', 'id', 'hika01', 'pw', 'projectbs00', 'db', 'hika01' );
			bs.sql( 'login' ).$( 'db', 'd@mysql', 'query', "select email,nick,thumb from member where email='@email@' and pw='@pw@'" );
		}
	);
	bs.site('bsplugin').start();
}, 'jpage', 'last' );