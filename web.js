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
			
			bs.sql( 'cat' ).$( 'db', 'd@mysql', 'query', "select cat_rowid,title from cat" );
			
			bs.sql( 'login' ).$( 'db', 'd@mysql', 'query', "select member_rowid,email,nick,thumb from member where email='@email@' and pw='@pw@'" );
			bs.sql( 'join' ).$( 'db', 'd@mysql', 'query', "insert into member(email,pw,nick,thumb)values('@email@','@pw@','@nick@','@thumb@')" );
			
			bs.sql( 'Plist' ).$( 'db', 'd@mysql', 'query', 
				"select p.plugin_rowid,t.title type,p.title,p.uname,p.thumb,c.title cat,regdate from plugin p,plugintype t, cat c "+
				"where p.plugintype_rowid=t.plugintype_rowid and p.cat_rowid=c.cat_rowid and p.member_rowid=@id@ limit @p@,@rpp@" );
			bs.sql( 'Padd' ).$( 'db', 'd@mysql', 'query', 
				"insert into plugin(member_rowid,plugintype_rowid,uname,title,contents,cat_rowid,thumb)values("+
				"@id@,@type@,'@uname@','@title@','@description@',@cat@,'@thumb@')"
			);
			bs.sql( 'Pview' ).$( 'db', 'd@mysql', 'query', 
				"select p.plugin_rowid,t.title type,p.title,p.uname,p.thumb,c.title cat,regdate from plugin p,plugintype t, cat c "+
				"where p.plugintype_rowid=t.plugintype_rowid and p.cat_rowid=c.cat_rowid and p.plugin_rowid=@r@" );
			
			
			bs.sql( 'cat' ).run( function( $rs ){
				bs.WEB.application( 'cat', $rs );
				bs.WEB.next();
			} );
			bs.WEB.pause();
		}
	);
	bs.site('bsplugin').start();
}, 'jpage', 'last' );