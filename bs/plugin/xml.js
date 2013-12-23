bs( function(){
	console.log( '$xml' );
	var type, parser, t;
	t = /^\s*|\s*$/g;
	function _xml( $node ){
		var node, r, n, t0, t1, i, j;
		node = $node.childNodes, r = {};
		for( i = 0, j = node.length ; i < j ; i++ ){
			t0 = type ? node[i] : node.nextNode();
			if( t0.nodeType == 3 ) r.value = (type ? t0.textContent : t0.text).replace( t, '' );
			else{
				n = t0.nodeName, t0 = _xml( t0 );
				if( t1 = r[n] ){
					if( t1.length === undefined ) r[n] = {length:2,0:t1,1:t0};
					else r[n][t1.length++] = t0;
				}else r[n] = t0;
			}
		}
		if( t0 = $node.attributes ) for( i = 0, j = t0.length ; i < j ; i++ ) r['$'+t0[i].name] = t0[i].value;
		return r;
	}
	function xml0( $data, $end ){
		var r, t0, t1, nn, i, j;
		t0 = $data.childNodes, r = {}, i = 0, j = t0.length;
		if( $end ){
			( nn = function(){
				var k, t1;
				for( var k = 0 ; i < j && k < 5000 ; i++, k++ ) t1 = type ? t0[i] : t0.nextNode(), r[t1.nodeName] = _xml( t1 );
				i < j ? setTimeout( nn, 16 ) : $end( r );
			} )();
		}else{
			for( ; i < j ; i++ ) t1 = type ? t0[i] : t0.nextNode(), r[t1.nodeName] = _xml( t1 );
			return r;
		}
	}
	function filter( $data ){
		if( $data.substr( 0, 20 ).indexOf( '<![CDATA[' ) > -1 ) $data = $data.substring( 0, 20 ).replace( '<![CDATA[', '' ) + $data.substr( 20 );
		if( $data.substr( $data.length - 5 ).indexOf( ']]>' ) > -1 ) $data = $data.substring( 0, $data.length - 5 ) + $data.substr( $data.length - 5 ).replace( ']]>', '' );
		return $data.replace( t, '' );
	}
	if( DOMParser ){
		type = 1, parser = new DOMParser;
		bs.$xml = function( $end, $data ){return xml0( parser.parseFromString( filter( $data ), "text/xml" ), $end );};
	}else{
		type = 0, parser = (function(){
			var t0, i, j;
			t0 = 'MSXML2.DOMDocument', t0 = ['Microsoft.XMLDOM', 'MSXML.DOMDocument', t0, t0+'.3.0', t0+'.4.0', t0+'.5.0', t0+'.6.0'],
			i = t0.length;
			while( i-- ){
				try{ new ActiveXObject( j = t0[i] ); }catch( $e ){ continue; }
				break;
			}
			return function(){return new ActiveXObject( j );};
		})();
		bs.$xml = function xml( $end, $data ){
			var p = parser();
			p.loadXML( filter( $data ) );
			return xml0( p, $end );
		};
	}
} );