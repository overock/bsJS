bs( function(){
	bs.WIN.dblselect(0);
	bs.$css( '/res/main3.css' );
	if( bs.WIN.is( '#back' ) ) bs.dom('#back').$( 'down', site.back = function($e){bs.$back();} );
} );
var site = {
logined:function( $nick ){
	bs.WIN.on( 'keydown', 'plugin', function( $e ){
		var t0 = document.activeElement;
		if( t0 && ( t0 = t0.tagName.toLowerCase() ) == 'input' || t0 == 'textarea' ) return;
		if( $e.key('1') ) bs.$go( '/member/' );
		else if( site.back && $e.key('b') ) site.back();
	} );
	return '<div id="topLogined">'+
		'<a id="topLogined0" href="/member/" class="TS2"><span class="batch">&#xf170;</span> ' + $nick + '<sup>1</sup></a> &nbsp; '+
		'<a href="/member/setting" class="batch">&#xf04e</a> &nbsp '+
		'<a id="topLogined1" href="/logout" class="batch">&#xf165;</a>'+
		'</div>';
},
header:function(){
	var lend, isJoin, login, jend, jcancel, jheight;
	//login
	lend = function( $e ){bs.dom('#topMember').$( 'display', 'none' );},
	bs.dom('#Llogin').$('down', login = function( $e ){
		var t0 = bs.$post(null, '/login', 'email', bs.dom('#Lemail').$('@value'), 'pw', bs.$md5(bs.dom('#Lpw').$('@value')));
		bs.dom('#Lalert').$( 'html', '' );
		if( t0 ){
			t0 = JSON.parse(t0);
			if( t0.result == 'ok' ) bs.dom('#topMember').$('html', site.logined( t0.contents.nick ) );
			else bs.dom('#Lalert').$('html', 'loginFailed:' + t0.contents);
		}else bs.dom('#Lalert').$('html', 'loginFailed: no response');
	}),
	bs.dom('#Ljoin').$( 'down', function( $e ){
		if( isJoin ) return;
		isJoin = 1,
		bs.ANI.tween( bs.dom('#topMember').$( 'opacity', 1, 'this' ), 'opacity', 0, 'time', .5, 'end', lend ),
		bs.dom('#topJoin').$( 'display', 'block' );
		if( !jheight ) jheight = bs.dom('#topJoin').$( 'h' );
		bs.ANI.tween( bs.dom('#topJoin').$( 'height', 0, 'this'), 'height', jheight, 'time', .7, 'ease', 'bounceOut', 'end', jend );
	} ),
	bs.dom( bs.dom('#Lemail').$( '@value' ) ? '#Lpw' : '#Lemail').$('f'),
	bs.dom('#Lpw').$( 'keydown', function( $e ){if( $e.key('enter') || $e.key('space') ) $e.prevent(), login();} ),
	//join
	jend = function(){bs.dom('#Jemail').$('f');},
	jcancel = function(){isJoin = 0, bs.dom('#join').$( 'display', 'none' );},
	bs.dom('#Jcancel').$( 'down', function( $e ){
		bs.ANI.tween( bs.dom('#topMember').$( 'display', 'block', 'this' ), 'opacity', 1, 'time', .3 ),
		bs.ANI.tween( bs.dom('#topJoin' ), 'height', 0, 'time', .2, 'end', jcancel );
	} ),
	bs.dom('#Jjoin').$( 'down', function( $e ){
		var t0;
		bs.dom('#Jalert').$( 'html', '' );
		if( !bs.$test( '@email', '#Jemail|' ) ){
			return bs.dom('#Jalert').$('html', 'invalid [email]'), setTimeout( jend, 1 );
		}else if( !bs.$test( '@pass', '#Jpw|' ) || !bs.$test( '@range|6|16', '#Jpw|' ) ){
			return bs.dom('#Jalert').$('html', 'invalid [pw]'), setTimeout( function(){bs.dom('#Jpw').$('@value','','f');}, 1 );
		}else if( bs.dom('#Jpw').$('@value') != bs.dom('#Jpwc').$('@value') ){
			return bs.dom('#Jalert').$('html', 'not equal [isPw]'), setTimeout( function(){bs.dom('#Jpwc').$('@value','','f');}, 1 );
		}else if( !bs.$test( '@alphanum', '#Jnick|' ) || !bs.$test( '@range|4|10', '#Jnick|' ) ){
			return bs.dom('#Jalert').$('html', 'invalid [nick]'), setTimeout( function(){bs.dom('#Jnick').$('@value','','f');}, 1 );
		}else if( t0 = bs.dom('#Jimg').$('@src') ){
			bs.dom('#Jthumb').$('@value', t0.indexOf('/res/thumb/default.png') == -1 ? t0 : '' )
		}
		if( t0 = bs.$post( null, '/join',
			'email', bs.dom('#Jemail').$('@value'), 'pw', bs.$md5(bs.dom('#Jpw').$('@value')),
			'nick', bs.dom('#Jnick').$('@value'), 'thumb', bs.dom('#Jthumb').$('@value') || ''
		) ){
			t0 = JSON.parse(t0);
			if( t0.result == 'ok' ){
				bs.ANI.tween( bs.dom('#topMember').$( 'html', site.logined( t0.contents.nick ), 'display', 'block', 'this' ), 'opacity', 1, 'time', .3 ),
				bs.ANI.tween( bs.dom('#topJoin' ), 'height', 0, 'time', .2, 'end', jcancel );
			}else bs.dom('#Jalert').$('html', 'joinFailed:' + t0.contents);
		}else bs.dom('#Jalert').$('html', 'joinFailed: no response');
	}),
	bs.dom('#Jthumb').$( 'blur', function( $e ){if( $e.value ) bs.dom('#Jimg').$('@src', $e.value );},
		'keydown', function( $e ){if( $e.key('enter') || $e.key('space') ) $e.prevent(), bs.dom('#Jimg').$('@src', $e.value );} );
},
mi:function(){
	var height, isAdd, acancel, list;
	bs.dom('#Padd').$( 'down', function(){
		if( isAdd ) return;
		isAdd = 1,
		bs.dom('#Padd').$( 'display', 'none' );
		bs.dom('#miAdd').$( 'display', 'block' );
		if( !height ) height = bs.dom('#miAdd').$( 'h' );
        bs.ANI.tween( bs.dom('#miAdd').$( 'height', 0, 'this' ), 'height', height, 'time', .7, 'ease', 'bounceOut' );
	} ),
	acancel = function(){
		isAdd = 0,
		bs.dom('#miAdd').$( 'display', 'none' ),
		bs.dom('#Padd').$( 'display', 'block' );
	},
	bs.dom('#Acancel').$( 'down', function( $e ){
		bs.ANI.tween( bs.dom('#miAdd' ), 'height', 0, 'time', .2, 'end', acancel );
	} ),
	bs.dom('#Aadd').$( 'down', function( $e ){
		var t0;
		bs.dom('#Aalert').$( 'html', '' );
		if( !bs.$test( '@range|5|100', '#Atitle|' ) ){
			return bs.dom('#Aalert').$('html', 'invalid [title]'), setTimeout( function(){bs.dom('#Atitle').$('f');}, 1 );
		}else if( !bs.$test( '@range|5|100', '#Auname|' ) ){
			return bs.dom('#Aalert').$('html', 'invalid [uname]'), setTimeout( function(){bs.dom('#Auname').$('f');}, 1 );
		}else if( t0 = bs.dom('#Aimg').$('@src') ){
			bs.dom('#Athumb').$('@value', t0.indexOf('/res/thumb/default.png') == -1 ? t0 : '' )
		}
		t0 = bs.$post( null, '/member/add', 
			'type', bs.dom('#Atype').$('@value'), 'uname', bs.dom('#Auname').$('@value'),
			'title', bs.dom('#Atitle').$('@value'), 'description', bs.dom('#Adescription').$('@value'),
			'cat', bs.dom('#Acat').$('@value'), 'keyword', bs.dom('#Akeyword').$('@value'),
			'thumb', bs.dom('#Athumb').$('@value')
		);
		if( t0 ){
			t0 = JSON.parse( t0 );
			if( t0.result == 'ok' ){
				list();
				bs.ANI.tween( bs.dom('#miAdd' ), 'height', 0, 'time', .2, 'end', acancel );
			}else bs.dom('#Aalert').$( 'html', 'addFailed:'+ t0.contents );
		}else bs.dom('#Aalert').$( 'html', 'addFailed: no response' );
		bs.dom('#Atitle').$('@value', '' ), bs.dom('#Auname').$('@value', ''),
		bs.dom('#Adescription').$('@value', ''), bs.dom('#Akeyword').$('@value', ''),
		bs.dom('#Athumb').$('@value', ''), bs.dom('#Aimg').$('@src',site.R+'/res/member/title.png');
	} ),
	bs.dom('#Athumb').$( 'blur', function( $e ){if( $e.value ) bs.dom('#Aimg').$('@src', $e.value );},
		'keydown', function( $e ){if( $e.key('enter') || $e.key('space') ) $e.prevent(), bs.dom('#Aimg').$('@src', $e.value );} ),
	( list = function(){
		var t0, t1, i, j;
		t0 = JSON.parse( bs.$post( null, '/member/' ) );
		if( t0.result == 'ok' && ( t0 = t0.contents, j = t0.length ) ){
			t1 = '<table cellspacing="0" border="0" cellpadding="0"><colgroup>'+
				'<col id="miListT0"/><col id="miListT1"/><col id="miListT2"/><col id="miListT3"/><col id="miListT4"/><col/></colgroup>';
			for( i = 0 ; i < j ; i++ ) console.log( j ), t1 += '<tr id="miListT5"><td></td>'+
				'<td><img src="' + ( t0[i].thumb || site.R+'/res/thumb/default.png' ) + '" class="THB0"></td>'+
				'<td id="miListT6">'+
					'<a href="/member/view?r='+t0[i].plugin_rowid+'">'+t0[i].title+'</a>'+
					'<div id="miListT7" class="BR15 FL">'+t0[i].uname+'</div>'+
					'<div id="miListT8" class="BR15">---</div>'+
				'</td>'+
				'<td class="miListT9">'+t0[i].type.charAt(0).toUpperCase()+t0[i].type.substr(1)+'</td>'+
				'<td class="miListT9">'+t0[i].cat+'</td>'+
				'<td id="miListT10">'+t0[i].regdate+'</td>'+
				'</tr>';
			console.log( site.R );
			bs.dom('#miList').$( 'html', t1 + '</table>' );
		}
	} )();
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
		bs.dom('#Vinfo').$( 'html',
			'<table cellspacing="0" border="0" cellpadding="0" style="width:980px;">'+
			'<colgroup><col style="width:50px"/><col style="width:450px"/><col style="width:150px"/><col style="width:150px"/><col/></colgroup>'+
			'<tr style="text-align:center"><td></td><td style="text-align:left;font-weight:normal;font-size:20px;height:130px">&nbsp;'+t0.title+
                '<div style="background:#757dae;border-radius:15px;margin:5px auto;padding:4px 10px 4px 10px;color:#fff;font-size:12px;">UniqueName : '+t0.uname+'</div>' +
                '<div style="background:#81acb3;border-radius:15px;margin:5px auto;padding:4px 10px 4px 10px;color:#fff;font-size:12px;">Keyward : '+'키워드,키워드,키워드'+'</div>'+
                '</td>'+
                '<td style="font-size:12px;font-weight:normal;color:#bfbec6">'+t0.type.charAt(0).toUpperCase()+t0.type.substr(1)+'</td><td style="font-size:12px;font-weight:normal;color:#bfbec6">'+t0.cat+'</td><td >'+t0.regdate+'</td></tr>'+
               '</table>'+
                '<div style="background:#eee;padding:20px 55px 20px 55px;line-height:24px;margin-top:20px;border-radius:10px">'+t0.contents+'</div>'
		);
		bs.dom('#Vtitle').$( 'html', t0.uname );
		ver();
	}else return bs.$back();
	
	function ver(){
		var t0, t1, i, j;
		for( t0 = JSON.parse( bs.$post( null, '/member/ver', 'r', r ) ), bs.dom('#Vversions').$('html',''), version = t0 = t0.contents, i = 0, j = t0.length ; i < j ; i++ ){
//			bs.dom('<div id="v'+i+'" class="Vver">'+
//				'<div class="Vver0">'+t0[i].version+'</div>'+
//				'<div class="Vver1">last updated<br>'+t0[i].editdate+'</div>'+
//				(t0[i].freezedate ? '<div class="Vver2">freezed<br>'+t0[i].freezedate+'</div>':'<div class="Vver3">warm<br>&nbsp;</div>' )+
//				'</div>').$( '<', '#Vversions', 'down', function(){versionDetail( this.id.substr(1) );} );
            bs.dom('<div id="v'+i+'" class="Vver">'+
                    '<div style="position:absolute"><img src="../res/draft/index_Bthumb_'+bs.$ex(1, '~',5)+'.png" width="175" style="border-top-right-radius:10px;border-top-left-radius:10px;box-shadow: 0px 0px 15px rgba(0,0,0,.5);"></div>'+
				'<div class="Vver0">Version '+t0[i].version+'</div>'+
				'<div class="Vver1">UPDATED : '+t0[i].editdate+'</div>'+
				(t0[i].freezedate ? '<div class="Vver2">FREEZE : '+t0[i].freezedate+'</div>':'<div class="Vver3">WARM<br>&nbsp;</div>' )+
				'</div>').$( '<', '#Vversions', 'down', function(){versionDetail( this.id.substr(1) );} );

        }

	}
	function versionDetail( $v ){
		var t0;
		bs.dom('#Vidx').$( '@value', $v );
		$v = version[$v];
		bs.dom('#Vupdate').$('display', $v.freezedate ? 'none' : 'block' );
		bs.dom('#Vfreeze').$('display', $v.freezedate ? 'none' : 'block' );
		bs.dom('#Vver').$( 'html', 'v.'+$v.version );
		bs.dom('#Vvr').$( '@value', $v.ver_rowid );
		bs.dom('#Vcode').$( '@value', $v.code || '' );
		bs.dom('#Vcontents').$( '@value', $v.contents || '' );
		bs.dom('#Vdetail').$( 'display', 'block' );
	}
	bs.dom('#Vupdate').$( 'down', function( $e ){
		var t0;
		t0 = bs.$post( null, '/member/vUp', 'vr', bs.dom('#Vvr').$('@value'), 'code', bs.dom('#Vcode').$('@value'), 'contents', bs.dom('#Vcontents').$('@value') );
		if( t0 ){
			t0 = JSON.parse( t0 );
			if( t0.result == 'ok' ) bs.dom('#Valert').$( 'html', 'updateOK' );
			else bs.dom('#Valert').$( 'html', 'updateFailed:'+ t0.contents );
			ver(), versionDetail( bs.dom('#Vidx').$('@value') );
		}else bs.dom('#Valert').$( 'html', 'updateFailed: no response' );
	} );
	bs.dom('#Vfreeze').$( 'down', function(){
		var t0;
		t0 = bs.$post( null, '/member/vFrz', 'vr', bs.dom('#Vvr').$('@value') );
		if( t0 ){
			t0 = JSON.parse( t0 );
			if( t0.result == 'ok' ){
				bs.dom('#Valert').$( 'html', 'freezeOK' );
				ver(), versionDetail( bs.dom('#Vidx').$('@value') );
			}else bs.dom('#Valert').$( 'html', 'freezeFailed:'+ t0.contents );
		}else bs.dom('#Valert').$( 'html', 'freezeFailed: no response' );
	} );
	bs.dom('#Vversion').$( 'keydown', function( $e ){if( $e.key('enter') ) vadd(), this.value = '';} );
	bs.dom('#Vadd').$( 'down', vadd = function( $e ){
		var t0;
		t0 = bs.$post( null, '/member/vAdd', 'version', parseFloat( bs.dom('#Vversion').$('@value') ), 'r', r );
		if( t0 ) t0 = JSON.parse( t0 ), t0.result == 'ok' ? ver() : bs.dom('#Aalert').$( 'html', 'addFailed:'+ t0.contents );
		else bs.dom('#Aalert').$( 'html', 'addFailed: no response' );
	} );
}

};