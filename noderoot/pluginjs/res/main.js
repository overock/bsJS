bs( function(){
	bs.css('font-face@batch /res/batch');
} );
var site = {
post:function( $url ){
	var i, j;
	for( i = 2, j = arguments.length ; i < j ; i += 2 ) arguments[i-1] = bs.dom(arguments[i]).$('@value');
	return bs.$post.apply(null, arguments );
},
header:function(){
	var isJoin, lend, jend, jcancel, jover, jout, jheight;
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
	bs.dom( bs.dom( '#Lemail' ).$( '@value' ) ? '#Lpw' : '#Lemail' ).$('f'),
	lend = function( $e ){
		bs.dom( '#personal' ).$( 'display', 'none' );
	},
	bs.dom( '#Ljoin' ).$( 'down', function( $e ){
		if( isJoin ) return;
		isJoin = 1,
		bs.ANI.tween( bs.dom( '#personal' ).$( 'opacity', 1, 'this' ), 'opacity', 0, 'time', .5, 'end', lend ),
		bs.dom( '#join' ).$( 'display', 'block' );
		if( !jheight ) jheight = bs.dom( '#join' ).$( 'h' );
		bs.ANI.tween( bs.dom( '#join' ).$( 'height', 0, 'this'), 'height', jheight, 'time', .7, 'ease', 'bounceOut', 'end', jend );
	} ),
	//join
	jend = function(){bs.dom( '#Jemail' ).$('f');},
	jcancel = function(){isJoin = 0, bs.dom( '#join' ).$( 'display', 'none' );},
	jover = function( $e ){bs.dom( '#'+this.id ).$( 'color', '#8ABDE0' );},
	jout = function( $e ){bs.dom( '#'+this.id ).$( 'color', '#fff' );},
	bs.dom('#Jcancel').$( 'mouseover', jover, 'mouseout', jout, 'down', function( $e ){
		bs.ANI.tween( bs.dom( '#personal' ).$( 'display', 'block', 'this' ), 'opacity', 1, 'time', .3 ),
		bs.ANI.tween( bs.dom( '#join' ), 'height', 0, 'time', .2, 'end', jcancel );
	} ),
	bs.dom( '#Jjoin' ).$( 'mouseover', jover, 'mouseout', jout, 'down', function( $e ){
		var t0;
		bs.dom('#Jalert').$('html');
		if( !bs.$test( '@email', '#Jemail|' ) ){
			bs.dom('#Jalert').$('html', 'invalid [email]');
			setTimeout( jend, 1 );
			return;
		}
		if( !bs.$test( '@pass', '#Jpw|' ) || !bs.$test( '@range|6|16', '#Jpw|' ) ){
			bs.dom('#Jalert').$('html', 'invalid [pw]');
			setTimeout( function(){bs.dom( '#Jpw' ).$('@value','','f');}, 1 );
			return;
		}else if( bs.dom('#Jpw').$('@value') != bs.dom('#Jpwc').$('@value') ){
			bs.dom('#Jalert').$('html', 'not equal [isPw]');
			setTimeout( function(){bs.dom( '#Jpwc' ).$('@value','','f');}, 1 );
			return;
		}else if( !bs.$test( '@alphanum', '#Jnick|' ) || !bs.$test( '@range|4|10', '#Jnick|' ) ){
			bs.dom('#Jalert').$('html', 'invalid [nick]');
			setTimeout( function(){bs.dom( '#Jnick' ).$('@value','','f');}, 1 );
			return;
		}
		if( t0 = bs.$post( null, '/join',
			'email', bs.dom('#Jemail').$('@value'), 'pw', bs.$md5(bs.dom('#Jpw').$('@value')),
			'nick', bs.dom('#Jnick').$('@value'), 'thumb', bs.dom('#Jthumb').$('@value')
		) ){
			t0 = JSON.parse(t0);
			if( t0.result == 'ok' ){
				bs.ANI.tween( bs.dom( '#personal' ).$( 'html', '<a href="/member/">' + t0.contents.nick + '</a> <a href="/logout">logout</a>', 'display', 'block', 'this' ), 'opacity', 1, 'time', .3 ),
				bs.ANI.tween( bs.dom( '#join' ), 'height', 0, 'time', .2, 'end', jcancel );
			}else bs.dom('#Jalert').$('html', 'joinFailed:' + t0.contents);
		}else bs.dom('#Jalert').$('html', 'joinFailed: no response');
	});
}

};