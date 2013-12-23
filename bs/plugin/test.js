bs( function(){
	var rules, set, rule, group;
	group = {},
	rules = {
		ip:parseRule('/^((([0-9]{1,2})|(1[0-9]{2})|(2[0-4][0-9])|(25[0-5]))\\.){3}(([0-9]{1,2})|(1[0-9]{2})|(2[0-4][0-9])|(25[0-5]))$/'),
		url:parseRule('/^https?:\\/\\/[-\\w.]+(:[0-9]+)?(\\/([\\w\\/_.]*)?)?$/'),
		email:parseRule('/^(\\w+\\.)*\\w+@(\\w+\\.)+[A-Za-z]+$/'),
		korean:parseRule('/^[ㄱ-힣]+$/'),
		japanese:parseRule('/^[ぁ-んァ-ヶー一-龠！-ﾟ・～「」“”‘’｛｝〜−]+$/'),
		alpha:parseRule('/^[a-z]+$/'),
		ALPHA:parseRule('/^[A-Z]+$/'),
		num:parseRule('/^[0-9]+$/'),
		alphanum:parseRule('/^[a-z0-9]+$/'),
		'1alpha':parseRule('/^[a-z]/'),
		'1ALPHA':parseRule('/^[A-Z]/'),
		float:function( $v ){return '' + parseFloat( $v ) === $v;},
		int:function( $v ){return '' + parseInt( $v, 10 ) === $v;},
		length:function( $v, $a ){return $v.length === +$a[0];},
		range:function( $v, $a ){return $v = $v.length, +$a[0] <= $v && $v <= +$a[1];},
		indexOf:function( $v, $a ){
			var i, j;
			i = $a.length;
			while( i-- ) if( $v.indexOf( $a[i] ) == -1 ) j = 1;
			return j ? 0 : 1;
		},
		ssn:(function(){
			var r, key;
			r = /\s|-/g, key = [2,3,4,5,6,7,8,9,2,3,4,5];
			return function( $v ){
				var t0, v, i;
				v = $v.replace( r, '' );
				if( v.length != 13 ) return;
				for( t0 = i = 0 ; i < 12 ; i++ ) t0 += key[i] * v.charAt(i);
				return parseInt( v.charAt(12) ) == ( ( 11 - ( t0 % 11 ) ) % 10);
			};
		})(),
		biz:(function(){
			var r, key;
			r = /\s|-/g, key = [1,3,7,1,3,7,1,3,5,1];
			return function( $v ){
				var t0, t1, v, i;
				v = $v.replace( r, '' );
				if( v.length != 10 ) return;
				for( t0 = i = 0 ; i < 8 ; i++ ) t0 += key[i] * v.charAt(i);
				t1 = "0" + ( key[8] * v.charAt(8) ), t1 = t1.substr( t1.length - 2 ),
				t0 += parseInt( t1.charAt(0) ) + parseInt( t1.charAt(1) );
				return parseInt( v.charAt(9) ) == ( 10 - ( t0 % 10)) % 10;
			};
		})()
	},
	set = {};
	function arg( k, $v, $list ){
		$v = bs.$trim( $v.substring(0,k).split('|') ),
		$list[$list.length++] = parseRule( $v.shift() ),
		$list[$list.length++] = $v;
	}
	function parse( $data ){
		var s, t0, t1, t2, i, j, k, l;
		s = {}, $data = $data.split('\n'), l = $data.length;
		while( l-- ){
			t0 = $data[l].split('='), t1 = {length:0};
			while( ( j = 0, k = t0[1].indexOf( 'AND' ) ) > -1 || ( j = 1, k = t0[1].indexOf( 'OR' ) ) > -1 )
				arg( k, t0[1], t1 ), t1[t1.length++] = j ? ( (k += 2), 'OR' ) : ( (k += 3), 'AND' ), t0[1] = t0[1].substr( k );
			arg( t0[1].length, t0[1], t1 ), t2 = bs.$trim( t0[0].split( ',' ) ), i = t2.length;
			while( i-- ) s[t2[i]] = t1;
		}
		return rule = s;
	}
	function parseRule( k ){
		if( typeof k == 'function' ) return k;
		if( k.charAt(0) == '/' && k.charAt(k.length - 1) == '/' ){
			k = new RegExp( k.substring( 1, k.length - 1 ) );
			return function( $val ){return k.test( $val );};
		}else if( rules[k] ) return rules[k];
		else return function( $val ){ return $val === k; };
	}
	function val( $val ){
		if( typeof $val == 'function' ) return $val();
		if( $val.indexOf( '|' ) > -1 ){
			$val = bs.$trim($val.split('|'));
			return bs.$trim( bs.d( $val[0] ).$( $val[1] || '@value' ) );
		}else return bs.$trim( $val );
	}
	(function(){
		var t0, i;
		t0 = 'group,set,rule'.split(','), i = t0.length;
		while( i-- ) test[t0[i]] = 1;
	})();
	function test( $rule ){
		var t0, t1, t2, i, j, k, l, v, m, n;
		i = 1, j = arguments.length;
		if( test[$rule] ){
			if( $rule == 'group' ) group[arguments[1]] = Array.prototype.slice.call( arguments, 2 );
			else if( $rule == 'set' ) while( i < j ){
				k = arguments[i++], v = arguments[i++]
				if( v.substr(0,2) == '#T' ) set[k] = parse( bs.d( v ).$('@text') );
				else if( v.substr(v.length-5) == '.html' ) set[k] = parse( bs.$get( null, v ) );
				else set[k] = parse( v );
			}else if( $rule == 'rule' ) while( i < j ) rules[arguments[i++]] = parseRule(arguments[i++]);
			return;
		}else if( !$rule ){
			if( !(t0 = rule) ) throw 'no prevRule';
		}else if( $rule.charAt(0) == '@' ){ //rule
			t0 = $rule.substr(1).split('|');
			if( !( t1 = rules[t0[0]] ) ) throw 'no rule';
			t0 = t0.slice(1);
			while( i < j ) if( !t1( val( arguments[i++] ), t0 ) ) return;
			return 1;
		}else if( set[$rule] ) t0 = set[$rule];
		else if( $rule.substr(0,2) == '#T' ) t0 = parse( bs.d( $rule ).$('@text') );
		else if( $rule.substr($rule.length-5) == '.html' ) t0 = parse( bs.$get( null, $rule ) );
		else t0 = parse( $rule );
		//ruleset
		while( i < j ){
			k = arguments[i++];
			if( k.charAt(0) == '@' ){//group
				if( !(t1 = group[k.substr(1)]) ) throw 'no group';
				m = 0, n = t1.length;
				while( m < n ){
					if( !( t2 = t0[t1[m++]] ) ) throw 'no rule';
					k = 0, l = t2.length, v = val( t1[m++] );
					while( k < l ){
						if( !t2[k++]( v, t2[k++] ) ){
							if( t2[k++] != 'OR' ) return;
						}else if( t2[k++] == 'OR' ) break;
					}
				}
			}else{
				if( !( t2 = t0[k] ) ) throw 'no rule';
				k = 0, l = t2.length, v = val( arguments[i++] );
				while( k < l ){
					if( !t2[k++]( v, t2[k++] ) ){
						if( t2[k++] != 'OR' ) return;
					}else if( t2[k++] == 'OR' ) break;
				}
			}
		}
		return 1;
	}
	bs.$test = test;
} );