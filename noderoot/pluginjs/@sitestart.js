if( bs.os( 'hostname' ) == 'hika' ) bs.Db( 'd', 'mysql' ).S( 'url', 'localhost:3306', 'id', 'root', 'pw', '1234', 'db', 'hika01' );
else bs.Db( 'd', 'mysql' ).S( 'url', '10.0.0.1:3306', 'id', 'hika01', 'pw', 'projectbs00', 'db', 'hika01' );
bs.Sql.load('@sql.js');
bs.SITE.application( 
	'post', function(isSession){
		var t0, i, j, k, v;
		if( isSession && !bs.session('id') ) return bs.response(JSON.stringify({result:'fail', contents:'no session'})), 0;
		if( bs.SITE.method() != 'POST' ) return bs.response(JSON.stringify({result:'fail',contents:'invaild try'})), 0;
		t0 = [], i = 1, j = arguments.length;
		while( i < j ){
			k = arguments[i++];
			if( ( v = bs.SITE.post(k) ) === undefined ) return bs.response(JSON.stringify({result:'fail', contents:'no data:' + k})), 0;
			switch( arguments[i++] ){
			case'i':t0[k] = parseInt( v, 10 ); break;
			case'f':t0[k] = parseFloat(v);break;
			case's':t0[k] = v; break;
			default: return bs.response(JSON.stringify({result:'fail', contents:'invalid type:' + k + ',' + v})), 0;
			}
			t0[t0.length] = k, t0[t0.length] = t0[k];
		}
		return t0;
	},
	'db', (function(){
		var arg = [], end;
		function END( rs, e ){
			var t0 = rs ? {result:'ok', contents:rs} : {result:'fail', contents:JSON.stringify(e)}, t1;
			if( end ) t1 = end( t0, rs, e );
			if( !t1 ) bs.response(JSON.stringify(t0)), bs.SITE.pass();
		}
		return function( query, post, e ){
			var t0, i, j;
			end = e, arg.length = 0, arg[0] = END;
			for( i = 0, j = post.length ; i < j ; i++ ) arg[arg.length] = post[i];
			t0 = bs.Sql(query), t0.run.apply( t0, arg );
			bs.SITE.pause();
		};
	})(),
	'root', (function(){
		return bs.os('hostname') == 'hika' ? '' : 'http://projectbs.github.io/bsJS/noderoot/pluginjs';
	})()
);
bs.Sql('cat').run( function(rs){
	bs.application( 'cat', rs );
	bs.Sql('type').run( function(rs){
		bs.application( 'type', rs );
		bs.SITE.pass();
	} );
} );
bs.SITE.pause();