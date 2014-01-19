bs( function(){
	bs.css('font-face@batch /res/batch');
	bs.css('.add').$( 'text-shadow', '1px 1px 0 #000', 'border-radius', 20, 'gradientBegin', '#C79FB4', 'gradientEnd', '#AF7695' );
	bs.css('.add:hover').$( 'gradientBegin', '#65BCAD', 'gradientEnd', '#294952' );
	bs.css('.addBack').$( 'gradientBegin', '#659CAD', 'gradientEnd', '#FFFFFF' );

    bs.css('.pmEdit').$( 'text-shadow', '1px 1px 0 #000', 'border-radius', 5, 'gradientBegin', '#C79FB4', 'gradientEnd', '#AF7695' );
    bs.css('.pmEdit:hover').$( 'gradientBegin', '#65BCAD', 'gradientEnd', '#294952' );

    bs.css('#add').$( 'gradientBegin', '#AF7695', 'gradientEnd', '#FFFFFF' );

	bs.css('.tab').$(  'text-shadow', '1px 1px 0 #000', 'border-radius', 5, 'gradientBegin', '#C79FB4', 'gradientEnd', '#AF7695' );
    bs.css('.tab:hover').$( 'gradientBegin', '#767EAF', 'gradientEnd', '#AAAFD1' );
	bs.css('.VtabOn').$( 'gradientBegin', '#65BCAD', 'gradientEnd', '#294952');
	
	bs.css('.tableHead').$( 'text-shadow', '1px 1px 0 #000', 'gradientBegin', '#767EAF', 'gradientEnd', '#AAAFD1' );
	bs.css('.tableHeadL').$( 'border-radius', '15px 0 0 15px' );
	bs.css('.tableHeadR').$( 'border-radius', '0 15px 15px 0' );
	bs.css('#menu').$( 'text-shadow', '1px 1px 0 #000' );

    bs.css('#back').$( 'text-shadow', '1px 1px 0 #000', 'border-radius', 30, 'gradientBegin', '#C79FB4', 'gradientEnd', '#AF7695' );
    bs.css('#back:hover').$( 'gradientBegin', '#65BCAD', 'gradientEnd', '#294952' );

    bs.css('#pmModify').$( 'text-shadow', '1px 1px 0 #000', 'border-radius', 30, 'gradientBegin', '#AF7695', 'gradientEnd', '#C79FB4' );
    bs.css('#pmModify:hover').$( 'gradientBegin', '#65BCAD', 'gradientEnd', '#294952' );



    bs.css('.Vver').$( 'float','left','width',175,'height',175,'font-size',11,'text-align','left','cursor','pointer','color','#54597c','margin',10,'border-radius',5)
    bs.css('.Vver0').$('font-size',12,'font-weight','normal','position','absolute','margin-top',112,'background','#AF7695','padding','11px 15px 6px 10px','color','#fff','font-weight','bold' )
    bs.css('.Vver1').$('font-size',12,'width',165,'height',28,'background','#AF7695','position','relative','color','#fff','padding','12px 0px 0px 10px','opacity',0.8 )
    bs.css('.Vver2').$( 'color','#fff','background','#65BCAD','height',20,'font-weight','bold','margin-top',105,'position','relative','padding','7px 15px 3px 10px','opacity',0.8 )
    bs.css('.Vver3').$( 'color','#fff','background','#22284f','height',20,'font-weight','bold','margin-top',105,'position','relative','padding','7px 15px 3px 10px','opacity',0.8)




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
	return '<div id="Llogined"><a href="/member/" id="Llogined0"><span class="batch">&#xf170;</span> ' + $nick + '<sup>1</sup></a> &nbsp; '+
		'<a href=""class="batch">&#xf04e</a> &nbsp &nbsp;<a href="/logout" id="Llogined1" class="batch">&#xf165;</a></div>';
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
		term:bs.DETECT.device =='tablet' || bs.DETECT.device=='mobile' ? 30 : 10,
		init:function(){
			var i;
			this.div.length = i = bs.DETECT.device =='tablet' || bs.DETECT.device=='mobile' ? 15 : 30;
			while( i-- ) this.div[i] = bs.dom('<div><img src="../res/index/icon/b'+bs.$ex(1, '~', 5)+'.png" width="100%"></div>' ).$( 'position','absolute', 'visibility', 'hidden', '<', '#visualEffect', 'this' );
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
				var s = bs.$ex( 50, '~', 100 );
				var d = this.div.length ? this.div[--this.div.length] : bs.dom('<div><img src="../res/index/icon/b'+bs.$ex(1, '~', 5)+'.png" width="100%"></div>' ).$( 'position','absolute', '<', '#visualEffect', 'this' );
				d.$( 'visibility', 'visible', 'background', 'rgb('+bs.$ex(100,'~',200)+','+bs.$ex(100,'~',150)+','+bs.$ex(100, '~',200)+')',
						'width',1, 'height',1, 'border-radius', 10, 'left',this.x+ bs.$ex( -10, '~', 10 ) ,'top',this.y+bs.$ex( -10, '~', 10 ), 'opacity', 0.4
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
},
viewr:0,
view:function(){
	var version, vadd, tab = 0, r = site.viewr;
	bs.dom('#Vtab0').$( 'down', function( $e ){
		console.log('aaa');
		bs.dom('#Vtab0').$( 'class+', 'VtabOn' );
		bs.dom('#Vtab1').$( 'class-', 'VtabOn' );
		bs.dom('#Vcode').$( 'display', 'block' );
		bs.dom('#Vcontents').$( 'display', 'none' );
	} );
	bs.dom('#Vtab1').$( 'down', function( $e ){
		bs.dom('#Vtab0').$( 'class-', 'VtabOn' );
		bs.dom('#Vtab1').$( 'class+', 'VtabOn' );
		bs.dom('#Vcode').$( 'display', 'none' );
		bs.dom('#Vcontents').$( 'display', 'block' );
	} );
	function k0(t){
		return function($e){
			var i;
			if( $e.key('tab') ) $e.prevent(),
				bs.dom(t).$( '@value', $e.value.substring( 0, i = bs.dom(t).$( 'cursorPos' ).start ) + '\t' + $e.value.substr( i ) ),
				setTimeout( function(){bs.dom(t).$( 'f', null, 'cursorPos', i + 1 );},1);
		};
	}
	bs.dom('#Vcode').$(
		'focus', function($e){bs.dom('#Vcode').$( 'color', '#444' );},
		'blur', function($e){bs.dom('#Vcode').$( 'color', '#222' );},
		'keydown', k0('#Vcode')
	);
	bs.dom('#Vcontents').$(
		'focus', function( $e ){bs.dom('#Vcontents').$( 'color', '#444' );},
		'blur', function( $e ){bs.dom('#Vcontents').$( 'color', '#222' );},
		'keydown', k0('#Vcontents')
	);
	function s0( t ){
		return function( $e ){if( bs.dom(t).$( 'height' ) || 0 != this.scrollHeight ) bs.dom('#Vcode').$( 'height', this.scrollHeight );};
	}
	bs.dom('#Vcode').$( 'scroll', s0('#Vcode') );
	bs.dom('#Vcontents').$( 'scroll', s0('#Vcontents') );
	var t0 = JSON.parse( bs.$post( null, '/member/view', 'r', r ) );
	if( t0.result == 'ok' ){
		t0 = t0.contents,
		bs.dom( '#Vinfo' ).$( 'html',
			'<table cellspacing="0" border="0" cellpadding="0" style="width:980px">'+
			'<colgroup><col style="width:50px"/><col style="width:450px"/><col style="width:150px"/><col style="width:150px"/><col/></colgroup>'+
			'<tr style="text-align:center"><td></td><td style="text-align:left;font-weight:normal;font-size:20px;height:130px">&nbsp;'+t0.title+
                '<div style="background:#757dae;border-radius:15px;margin:5px auto;padding:4px 10px 4px 10px;color:#fff;font-size:12px;">UniqueName : '+t0.uname+'</div>' +
                '<div style="background:#81acb3;border-radius:15px;margin:5px auto;padding:4px 10px 4px 10px;color:#fff;font-size:12px;">Keyward : '+'키워드,키워드,키워드'+'</div>'+
                '</td>'+
                '<td style="font-size:12px;font-weight:normal;color:#bfbec6">'+t0.type.charAt(0).toUpperCase()+t0.type.substr(1)+'</td><td style="font-size:12px;font-weight:normal;color:#bfbec6">'+t0.cat+'</td><td >'+t0.regdate+'</td></tr>'+
                '<tr><td colspan="5" style="background:#eee;padding:20px 55px 20px 55px;line-height:24px">'+t0.contents+'</td></tr></table>'
		);
		bs.dom( '#Vtitle' ).$( 'html', t0.uname );
		ver();
	}else return bs.$back();
	
	function ver(){
		var t0, t1, i, j;
		for( t0 = JSON.parse( bs.$post( null, '/member/ver', 'r', r ) ), bs.dom('#Vversions').$('html',''), version = t0 = t0.contents, i = 0, j = t0.length ; i < j ; i++ ){
//			bs.dom( '<div id="v'+i+'" class="Vver">'+
//				'<div class="Vver0">'+t0[i].version+'</div>'+
//				'<div class="Vver1">last updated<br>'+t0[i].editdate+'</div>'+
//				(t0[i].freezedate ? '<div class="Vver2">freezed<br>'+t0[i].freezedate+'</div>':'<div class="Vver3">warm<br>&nbsp;</div>' )+
//				'</div>' ).$( '<', '#Vversions', 'down', function(){versionDetail( this.id.substr(1) );} );
            bs.dom( '<div id="v'+i+'" class="Vver">'+
                    '<div style="position:absolute;"><img src="../res/draft/index_Bthumb_'+bs.$ex(1, '~',5)+'.png" width="175"></div>'+
				'<div class="Vver0">Version '+t0[i].version+'</div>'+
				'<div class="Vver1">UPDATED : '+t0[i].editdate+'</div>'+
				(t0[i].freezedate ? '<div class="Vver2">FREEZE : '+t0[i].freezedate+'</div>':'<div class="Vver3">WARM<br>&nbsp;</div>' )+
				'</div>' ).$( '<', '#Vversions', 'down', function(){versionDetail( this.id.substr(1) );} );

        }

	}
	function versionDetail( $v ){
		var t0;
		bs.dom( '#Vidx' ).$( '@value', $v );
		$v = version[$v];
		bs.dom( '#Vupdate' ).$('display', $v.freezedate ? 'none' : 'block' );
		bs.dom( '#Vfreeze' ).$('display', $v.freezedate ? 'none' : 'block' );
		bs.dom( '#Vver' ).$( 'html', 'v.'+$v.version );
		bs.dom( '#Vvr' ).$( '@value', $v.ver_rowid );
		bs.dom( '#Vcode' ).$( '@value', $v.code || '' );
		bs.dom( '#Vcontents' ).$( '@value', $v.contents || '' );
		bs.dom( '#Vdetail' ).$( 'display', 'block' );
	}
	bs.dom( '#Vupdate' ).$( 'down', function( $e ){
		var t0;
		t0 = bs.$post( null, '/member/vUp', 'vr', bs.dom('#Vvr').$('@value'), 'code', bs.dom('#Vcode').$('@value'), 'contents', bs.dom('#Vcontents').$('@value') );
		if( t0 ){
			t0 = JSON.parse( t0 );
			if( t0.result == 'ok' ) bs.dom( '#Valert' ).$( 'html', 'updateOK' );
			else bs.dom( '#Valert' ).$( 'html', 'updateFailed:'+ t0.contents );
			ver(), versionDetail( bs.dom( '#Vidx' ).$('@value') );
		}else bs.dom( '#Valert' ).$( 'html', 'updateFailed: no response' );
	} );
	bs.dom( '#Vfreeze' ).$( 'down', function(){
		var t0;
		t0 = bs.$post( null, '/member/vFrz', 'vr', bs.dom( '#Vvr' ).$('@value') );
		if( t0 ){
			t0 = JSON.parse( t0 );
			if( t0.result == 'ok' ){
				bs.dom( '#Valert' ).$( 'html', 'freezeOK' );
				ver(), versionDetail( bs.dom( '#Vidx' ).$('@value') );
			}else bs.dom( '#Valert' ).$( 'html', 'freezeFailed:'+ t0.contents );
		}else bs.dom( '#Valert' ).$( 'html', 'freezeFailed: no response' );
	} );
	bs.dom( '#Vversion' ).$( 'keydown', function( $e ){if( $e.key('enter') ) vadd(), this.value = '';} );
	bs.dom( '#Vadd' ).$( 'down', vadd = function( $e ){
		var t0;
		t0 = bs.$post( null, '/member/vAdd', 'version', parseFloat( bs.dom( '#Vversion' ).$('@value') ), 'r', r );
		if( t0 ) t0 = JSON.parse( t0 ), t0.result == 'ok' ? ver() : bs.dom( '#Aalert' ).$( 'html', 'addFailed:'+ t0.contents );
		else bs.dom( '#Aalert' ).$( 'html', 'addFailed: no response' );
	} );
}

};