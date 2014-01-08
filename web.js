var bs = require( './bs/bsjs' )( __dirname );
bs.$importer( function(){
	bs.site( 'bsplugin' ).$(
		'url', 'js.bsplugin.com',
		'url', '192.168.56.101',
		'https', {key:'./key.pem',cert:'./cert.pem'},
		'root', './noderoot/pluginjs/',
		'db', 'mysql',
		'template', function( $url, $template, $data, $end ){
			bs.$jpage( $template, $data, null, $end, $url );
		},
		'siteStart', function(){
			if( bs.$os( 'hostname' ) == 'tony-VirtualBox' ) bs.db( 'local@mysql' ).$( 'url', 'localhost:3306', 'id', 'root', 'pw', '1234', 'db', 'hika01' );
			else bs.db( 'local@mysql' ).$( 'url', '10.0.0.1:3306', 'id', 'hika01', 'pw', 'projectbs00', 'db', 'hika01' );
			bs.sql( 'list' ).$( 'db', 'local', 'query', 'select k,v from web,user where user_rowid=rowid and userid=@userid@' );
		}
	);
	bs.site('bsplugin').start();
}, 'jpage', 'last' );