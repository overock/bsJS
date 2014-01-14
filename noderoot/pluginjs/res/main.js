var site = {
post:function( $url ){
	var i, j;
	for( i = 2, j = arguments.length ; i < j ; i += 2 ) arguments[i-1] = bs.dom(arguments[i]).$('@value');
	return bs.$post.apply(null, arguments );
},
header:function(){
	 //login
	bs.dom('#Llogin').$('down', function ($e) {
		var t0 = bs.$post(null, '/login', 'email', bs.dom('#Lemail').$('@value'), 'pw', bs.$md5(bs.dom('#Lpw').$('@value')));
		bs.dom('#Lalert').$( 'html', '' );
		if( t0 ){
			t0 = JSON.parse(t0);
			if( t0.result == 'ok' ) bs.dom('#personal').$('html', '<a href="/member/">' + t0.contents.nick + '</a> <a href="/logout">logout</a>');
			else bs.dom('#Lalert').$('html', 'loginFailed:' + t0.contents);
		}else bs.dom('#Lalert').$('html', 'loginFailed: no response');
	}),
	bs.dom( '#Ljoin' ).$( 'down', function( $e ){bs.dom('#personal').$('display', 'none'), bs.dom('#join').$('display', 'block');} ),
	//join
	bs.dom( '#Jjoin' ).$( 'down', function( $e ){
		var t0 = bs.$post(null, '/join',
			'email', bs.dom('#Jemail').$('@value'), 'pw', bs.$md5(bs.dom('#Jpw').$('@value')),
			'nick', bs.dom('#Jnick').$('@value'), 'thumb', bs.dom('#Jthumb').$('@value')
		);
		if( t0 ){
			t0 = JSON.parse(t0);
			if( t0.result == 'ok' ) bs.dom('#join').$('display', 'none'),
				bs.dom('#personal').$('display', 'block', 'html', '<a href="/member/">' + t0.contents.nick + '</a>'),
				bs.dom('#menuLogin').$('html', '<a href="/member/">' + t0.contents.nick + '</a> <a href="/logout">logout</a>');
			else bs.dom('#Jalert').$('html', 'joinFailed:' + t0.contents);
		}else bs.dom('#Jalert').$('html', 'joinFailed: no response');
	}),
	bs.dom('#Jcancel').$( 'down', function( $e ){bs.dom('#join').$('display', 'none'), bs.dom('#personal').$('display', 'block');} );
}

};