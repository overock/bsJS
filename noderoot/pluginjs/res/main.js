bs( function(){
	bs.css('font-face@batch /res/batch');
	bs.css('.add').$( 'text-shadow', '1px 1px 0 #000', 'border-radius', 30, 'gradientBegin', '#AF7695', 'gradientEnd', '#C79FB4' );
	bs.css('.add:hover').$( 'gradientBegin', '#65BCAD', 'gradientEnd', '#294952' );
	bs.css('.addBack').$( 'gradientBegin', '#659CAD', 'gradientEnd', '#FFFFFF' );

    bs.css('#add').$( 'gradientBegin', '#AF7695', 'gradientEnd', '#FFFFFF' );

	bs.css('.tab').$( 'text-shadow', '1px 1px 0 #000', 'border-radius', '15px 15px 0 0', 'gradientBegin', '#917d68', 'gradientEnd', '#bd9d84' );
	bs.css('.tab:hover').$( 'gradientBegin', '#bd9d84', 'gradientEnd', '#917d68' );
	
	bs.css('.tableHead').$( 'text-shadow', '1px 1px 0 #000', 'gradientBegin', '#AF7695', 'gradientEnd', '#C79FB4' );
	bs.css('.tableHeadL').$( 'border-radius', '15px 0 0 15px' );
	bs.css('.tableHeadR').$( 'border-radius', '0 15px 15px 0' );
	bs.css('#menu').$( 'text-shadow', '1px 1px 0 #000' );
	bs.css('.Vver').$('border', '1px solid #bfbec6' );
//	bs.css('.Vver:hover').$( 'gradientBegin', '#C79FB4', 'gradientEnd', '#ffffff', 'color', '#fff' );


	if( bs.$domquery( '#back' ) ) bs.dom( '#back' ).$( 'down', site.back = function($e){bs.$back();} );
} );
var site = {
back:0,
post:function( $url ){
	var i, j;
	for( i = 2, j = arguments.length ; i < j ; i += 2 ) arguments[i-1] = bs.dom(arguments[i]).$('@value');
	return bs.$post.apply(null, arguments );
},
logined:function( $nick ){
	bs.WIN.on( 'keydown', 'plugin', function( $e ){
		var t0 = document.activeElement;
		if( t0 && ( t0 = t0.tagName.toLowerCase() ) == 'input' || t0 == 'textarea' ) return;
		if( $e.key('1') ) bs.$go( '/member/' );
		else if( site.back && $e.key('b') ) site.back();
	} );
	return '<div id="Llogined"><a href="/member/" id="Llogined0"><span class="batch">&#xf170;</span> ' + $nick + '<sup>1</sup></a> &nbsp; &nbsp; '+
		'<a href="/logout" id="Llogined1" class="batch">&#xf165;</a></div>';
},
header:function(){
	var isJoin, login, lend, jend, jcancel, jover, jout, jheight;
	lend = function( $e ){bs.dom( '#personal' ).$( 'display', 'none' );},
	bs.dom('#Llogin').$('down', login = function( $e ){
		var t0 = bs.$post(null, '/login', 'email', bs.dom('#Lemail').$('@value'), 'pw', bs.$md5(bs.dom('#Lpw').$('@value')));
		bs.dom('#Lalert').$( 'html', '' );
		if( t0 ){
			t0 = JSON.parse(t0);
			if( t0.result == 'ok' ) bs.dom('#personal').$('html', site.logined( t0.contents.nick ) );
			else bs.dom('#Lalert').$('html', 'loginFailed:' + t0.contents);
		}else bs.dom('#Lalert').$('html', 'loginFailed: no response');
	}),
	bs.dom( bs.dom( '#Lemail' ).$( '@value' ) ? '#Lpw' : '#Lemail' ).$('f'),
	bs.dom('#Lpw').$( 'keydown', function( $e ){if( $e.key('enter') || $e.key('space') ) $e.prevent(), login();} ),
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
				bs.ANI.tween( bs.dom( '#personal' ).$( 'html', site.logined( t0.contents.nick ), 'display', 'block', 'this' ), 'opacity', 1, 'time', .3 ),
				bs.ANI.tween( bs.dom( '#join' ), 'height', 0, 'time', .2, 'end', jcancel );
			}else bs.dom('#Jalert').$('html', 'joinFailed:' + t0.contents);
		}else bs.dom('#Jalert').$('html', 'joinFailed: no response');
	});
},
mainVisual:function(){
	var game, d3;
	d3 = bs.DETECT.transform3D;
	game = {
		x:0, y:0, vx:0, vy:0, v:1, rv:.5, w:0, h:0, tcheck:0, div:{length:0}, rz:0,
		term:bs.DETECT.device =='tablet' || bs.DETECT.device=='mobile' ? 70 : 10,
		init:function(){
			var i;
			this.div.length = i = bs.DETECT.device =='tablet' || bs.DETECT.device=='mobile' ? 15 : 30;
			while( i-- ) this.div[i] = bs.dom('<div></div>' ).$( 'position','absolute', 'visibility', 'hidden', '<', '#visualEffect', 'this' );
			this.w = 980, this.h = 980, this.x = this.w/2, this.y = this.h/2;

			bs.dom( '#visualEffect' ).$( 'top', 45, 'position', 'absolute', 'top', -290, 'width', this.w, 'height', this.h, 'overflow', 'hidden', 'down', function( $e ){
				game.vx = ( $e.lx - game.x )*.1, game.vy = ($e.ly - game.y)*.1;
			} );
			bs.dom( '<div></div>' ).$( '@id', 'a', 'position', 'absolute', 'background', '#950',
					'left', 0, 'top', 0, 'width', 1, 'height', 1, 'border-radius',5,
					'<', '#visualEffect'
			);
		},
		end:function( $target ){
			game.div[game.div.length++] = $target.$('visibility', 'hidden', 'this');
		},
		ANI:function( $time ){
			bs.dom('#a').$( 'left', this.x, 'top', this.y );
			game.rz += .3;
			bs.dom( '#visualEffect' ).$( 'transform', (d3 ? 'rotateZ' : 'rotate') + '(' + game.rz + 'deg)' );
			if( $time > this.tcheck ){
				this.tcheck = $time + this.term;
				var s = bs.$ex( 10, '~', 60 );
				var d = this.div.length ? this.div[--this.div.length] : bs.dom('<div></div>' ).$( 'position','absolute', '<', '#visualEffect', 'this' );
				d.$( 'visibility', 'visible', 'background', 'rgb('+bs.$ex(100,'~',200)+','+bs.$ex(100,'~',150)+','+bs.$ex(100, '~',200)+')',
						'width',1, 'height',1, 'border-radius', 10, 'left',this.x+ bs.$ex( -10, '~', 10 ) ,'top',this.y+bs.$ex( -10, '~', 10 ), 'opacity', 0.3
				);
				bs.ANI.tween( d,
						'left', bs.$ex( -600, '~', 600 ) + this.x, 'top', bs.$ex( -600, '~', 600 ) + this.y,
						'border-radius', s, 'width', s, 'height',s, 'opacity', 0,
						'time', bs.$ex( 2, '~f', 3 ), 'end', this.end
				);
			}
		}
	};
	game.init();
	bs.ANI.ani( game );
}

};