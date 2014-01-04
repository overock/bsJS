bs.$register( 'static', 'fb', (function(){
	var fb, toStr;
	toStr = function(){return Array.prototype.join.call( this, ',' );};
	fb = function(){
		var t0, i, j;
		i = 0, j = arguments.length;
		if( j == 1 ) return fb.res[arguments[0]];
		t0 = {length:j, toString:toStr};
		while( i < j ) t0[i] = fb.res[arguments[i]], i++;
		return t0;
	};
	if( bs.site ){
		fb.authUrl = function( $appid, $redirect ){
			return 'http://www.facebook.com/dialog/oauth?client_id='+$appid+'&redirect_uri='+$redirect;
		},
		fb.token = function( $str ){
		}
	}else{
		fb.start = function( $appid, $conn, $disconn, $clear ){
			var res, logined;
			res = function( $res ){
				if( $res.status == 'connected' ){
					if( !logined ) logined = 1, FB.api( '/me', function( $res0 ){
						FB.api( $res0.id + '/picture', function( $res1 ){
							$res0.url = $res1.data.url, fb.res = $res0
							if( typeof $clear == 'function' ) $clear( $res.status, $conn, $disconn );
							$conn( $res0, $conn, $disconn );
						} );
					} );
				}else if( logined || logined === undefined ){
					if( typeof $clear == 'function' ) $clear( $res.status, $conn, $disconn );
					logined = 0, $disconn( $res.status, $conn, $disconn );
				}
			};
			if( !window.fbAsyncInit ) window.fbAsyncInit = function(){
				FB.init({appId:$appid,status:true,cookie:true,xfbml:true }),
				FB.Event.subscribe('auth.authResponseChange', res ),
				FB.getLoginStatus( res );
			};
			if( !bs.WIN.is( '#facebook-jssdk' )	) bs.$js( function(){}, '//connect.facebook.net/en_US/all.js' );
		},
		fb.login = function(){FB.login();}, fb.logout = function(){FB.logout();};
	}
	return fb;
})(), 1.0 );