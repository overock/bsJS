bs.$register( 'method', 'jpage', (function(){
	var jp, jpage, r0, r1, r2, s, e, cache;
	jp = function( $v ){this.v = $v}, cache = {},
	r0 = /\\/g, r1 = /["]/g, r2 = /\r\n|\r|\n/g, s = '<%', e = '%>',
	jpage = function( $str, $data, $render, $end, $id ){
		var t0, t1, i, j, k, v, importer, render;
		if( !( v = cache[$id] ) ){
			if( $str instanceof jp ) v = $str.v;
			else{
				$str = ( $str.substr(0,2) == '#T' ? bs.dom( $str ).$('@text') : $str.substr($str.length-5) == '.html' ? bs.$get( null, $str ) : $str ).split( s );
				i = 0, j = $str.length, v = '';
				while( i < j ){
					t0 = $str[i++];
					if( ( k = t0.indexOf( e ) ) > -1 ) t1 = t0.substring( 0, k ), t0 = t0.substr( k + 2 ), v += t1.charAt(0) == '=' ? 'ECHO(' + t1.substr(1) + ');' : t1;
					v += 'ECHO("' + t0.replace( r0, '\\\\' ).replace( r1, '\\"' ).replace( r2, '\\n' ) + '");';
				}
			}
			t0 = $str.v ? $str : new jp(v);
			if( $id ) cache[$id] = v;
		}
		t1 = '',
		importer = function( $url ){jpage( $url, $data, null, render, $url );};
		if( $render ){
			new Function( 'ECHO, $$, bs, IMPORT', v )( render = function( $v ){t1 += $v, $render( $v );}, $data, bs, importer );
			if( $end ) $end( t1 );
		}else if( $end ){
			new Function( 'ECHO, $$, bs, IMPORT', v )( render = function( $v ){t1 += $v;}, $data, bs, importer );
			$end( t1 );
		}
		return t0;
	};
	return jpage;
})(), 1.0 );