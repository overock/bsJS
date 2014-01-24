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
		if( bs.dom('#Llogin').downed ) return;
		bs.dom('#Llogin').downed = 1;
		bs.dom('#Lalert').$( 'html', '' ),
		bs.$post( function( t0 ){
			if( t0 ){
				t0 = JSON.parse(t0);
				if( t0.result == 'ok' ) bs.dom('#topMember').$('html', site.logined( t0.contents.nick ) );
				else bs.dom('#Lalert').$('html', 'loginFailed:' + t0.contents);
			}else bs.dom('#Lalert').$('html', 'loginFailed: no response');
			bs.dom('#Llogin').downed = 0;
		}, '/login', 'email', bs.dom('#Lemail').$('@value'), 'pw', bs.$md5(bs.dom('#Lpw').$('@value')));
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
		if( bs.dom('#Jjoin').downed ) return;
		bs.dom('#Jjoin').downed = 1;
		bs.dom('#Jalert').$( 'html', '' );
		if( !bs.$test( '@email', '#Jemail|' ) ){
			return bs.dom('#Jalert').$('html', 'invalid [email]'), setTimeout( jend, 1 );
		}else if( !bs.$test( '@pass', '#Jpw|' ) || !bs.$test( '@range|6|16', '#Jpw|' ) ){
			return bs.dom('#Jalert').$('html', 'invalid [pw]'), setTimeout( function(){bs.dom('#Jpw').$('@value','','f');}, 1 );
		}else if( bs.dom('#Jpw').$('@value') != bs.dom('#Jpwc').$('@value') ){
			return bs.dom('#Jalert').$('html', 'not equal [isPw]'), setTimeout( function(){bs.dom('#Jpwc').$('@value','','f');}, 1 );
		}else if( !bs.$test( '@alphanum', '#Jnick|' ) || !bs.$test( '@range|4|10', '#Jnick|' ) ){
			return bs.dom('#Jalert').$('html', 'invalid [nick]'), setTimeout( function(){bs.dom('#Jnick').$('@value','','f');}, 1 );
		}else if( t0 = bs.$trim( bs.dom('#Jthumb').$('@value') ) ){
			if( !bs.$test( '@url', t0 ) ) return bs.dom('#Jalert').$('html', 'invalid [thumb]'), setTimeout( function(){bs.dom('#Jthumb').$('@value','','f');}, 1 );
		}
		bs.$post( function( t0 ){
			if( t0 ){
				t0 = JSON.parse(t0);
				if( t0.result == 'ok' ){
					bs.ANI.tween( bs.dom('#topMember').$( 'html', site.logined( t0.contents.nick ), 'display', 'block', 'this' ), 'opacity', 1, 'time', .3 ),
					bs.ANI.tween( bs.dom('#topJoin' ), 'height', 0, 'time', .2, 'end', jcancel );
				}else bs.dom('#Jalert').$('html', 'joinFailed:' + t0.contents);
			}else bs.dom('#Jalert').$('html', 'joinFailed: no response');
			bs.dom('#Jjoin').downed = 0;
		}, '/join',
			'email', bs.dom('#Jemail').$('@value'), 'pw', bs.$md5(bs.dom('#Jpw').$('@value')),
			'nick', bs.dom('#Jnick').$('@value'), 'thumb', bs.dom('#Jthumb').$('@value') || ''
		);
	}),
	bs.dom('#Jthumb').$( 'blur', function( $e ){if( $e.value ) bs.dom('#Jimg').$('@src', $e.value );},
		'keydown', function( $e ){bs.dom('#Jimg').$('@src', $e.value );} );
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
		if( bs.dom('#Aadd').downed ) return;
		bs.dom('#Aadd').downed = 1;
		bs.dom('#Aalert').$( 'html', '' );
		if( !bs.$test( '@range|5|100', '#Atitle|' ) ){
			return bs.dom('#Aalert').$('html', 'invalid [title]'), setTimeout( function(){bs.dom('#Atitle').$('f');}, 1 );
		}else if( !bs.$test( '@range|3|100', '#Auname|' ) ){
			return bs.dom('#Aalert').$('html', 'invalid [uname]'), setTimeout( function(){bs.dom('#Auname').$('f');}, 1 );
		}else if( t0 = bs.dom('#Aimg').$('@src') ){
			bs.dom('#Athumb').$('@value', t0.indexOf('/res/thumb/default.png') == -1 ? t0 : '' )
		}
		bs.$post( function( t0 ){
			if( t0 ){
				t0 = JSON.parse( t0 );
				if( t0.result == 'ok' ) list( function(){bs.ANI.tween( bs.dom('#miAdd' ), 'height', 0, 'time', .2, 'end', acancel );});
				else bs.dom('#Aalert').$( 'html', 'addFailed:'+ t0.contents );
			}else bs.dom('#Aalert').$( 'html', 'addFailed: no response' );
			bs.dom('#Atitle').$('@value', '' ), bs.dom('#Auname').$('@value', ''),
			bs.dom('#Adescription').$('@value', ''), bs.dom('#Akeyword').$('@value', ''),
			bs.dom('#Athumb').$('@value', ''), bs.dom('#Aimg').$('@src',site.R+'/res/member/title.png');
			bs.dom('#Aadd').downed = 0;
		}, '/member/add', 
			'type', bs.dom('#Atype').$('@value'), 'uname', bs.dom('#Auname').$('@value'),
			'title', bs.dom('#Atitle').$('@value'), 'description', bs.dom('#Adescription').$('@value'),
			'cat', bs.dom('#Acat').$('@value'), 'keyword', bs.dom('#Akeyword').$('@value'),
			'thumb', bs.dom('#Athumb').$('@value')
		);
	} ),
	bs.dom('#Athumb').$( 'blur', function( $e ){if( $e.value ) bs.dom('#Aimg').$('@src', $e.value );},
		'keydown', function( $e ){if( $e.key('enter') || $e.key('space') ) $e.prevent(), bs.dom('#Aimg').$('@src', $e.value );} ),
	( list = function( $f ){
		bs.$post( function( t0 ){
			var t1, i, j;
			if( t0 ){
				t0 = JSON.parse( t0 );
				if( t0.result == 'ok' && ( t0 = t0.contents, j = t0.length ) ){
					t1 = '<table cellspacing="0" border="0" cellpadding="0"><colgroup>'+
						'<col id="miListT0"/><col id="miListT1"/><col id="miListT2"/><col id="miListT3"/><col id="miListT4"/><col/></colgroup>';
					for( i = 0 ; i < j ; i++ ) t1 += '<tr id="miListT5"><td></td>'+
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
					bs.dom('#miList').$( 'html', t1 + '</table>' );
				}
			}
			if( $f ) $f();
		}, '/member/' );
	} )();
},
viewr:0,
view:function(){
	var r, ver, detail, add, version, depend, isFreezed;
	r = site.viewr,
	//start
	bs.$post( function( t0 ){
		t0 = JSON.parse( t0 );
		if( t0.result == 'ok' ){
			t0 = t0.contents;
			if( t0.thumb ) bs.dom('#mvTop0').$( '@src', t0.thumb );
			bs.dom('#mvTop1').$( 'html', t0.uname ),
			bs.dom('#mvTop2').$( 'html', t0.title ),
			bs.dom('#mvTop3').$( 'html', t0.cat ),
			bs.dom('#mvTop4').$( 'html', t0.type ),
			bs.dom('#mvTop5').$( 'html', t0.regdate ),
			bs.dom('#mvTop6').$( 'html', t0.contents ),
			ver();
		}else return bs.$back();
	}, '/member/view', 'r', r ),
	//base function
	ver = function( $d, $id ){
		if( ver.isRun ) return;
		ver.isRun = 1;
		bs.$post( function( t0 ){
			var t1, i, j;
			bs.dom('#mvVersions').$('html',''),
			t1 = bs.dom('mvTop0').$( '@src' ),
			version = t0 = JSON.parse( t0 ).contents;
			for( i = 0, j = t0.length ; i < j ; i++ )
				bs.dom(
				'<div id="V'+i+'" class="mvVersions0 BRLR10">'+
					'<img onerror="this.src=\''+site.R+'/res/thumb/default.png\'" src="'+t1+'">'+
					'<div class="mvVersions1">Version '+t0[i].version+'</div>'+
					'<div class="mvVersions2 O8">UPDATED : '+t0[i].editdate+'</div>'+
					(t0[i].freezedate ? '<div class="mvVersions3 O8">FREEZE : '+t0[i].freezedate+'</div>':'<div class="mvVersions4 O8">WARM<br>&nbsp;</div>' )+
				'</div>').$( '<', '#mvVersions', 'this' )[0].onmousedown = detail;
			ver.isRun = 0;
			if( $d ) $d( $id );
		}, '/member/ver', 'r', r );
	},
	detail = function( t0 ){
		bs.dom('#Vidx').$( '@value', t0 = typeof t0 == 'number' ? t0 : this.id.substr(1) ),
		t0 = version[t0],
		isFreezed = t0.freezedate;
		bs.dom('#Dname').$('display', isFreezed ? 'none' : 'block' ),
		bs.dom('#Dsearch').$('display', isFreezed ? 'none' : 'block' ),
		bs.dom('#Vupdate').$('display', isFreezed ? 'none' : 'block' ),
		bs.dom('#Vfreeze').$('display', isFreezed ? 'none' : 'block' ),
		bs.dom('#Vver').$( 'html', 'v.'+t0.version ), bs.dom('#Vvr').$( '@value', t0.ver_rowid ),
		bs.dom('#Vcode').$( '@value', t0.code || '' ), bs.dom('#Vcontents').$( '@value', t0.contents || '' ),
		bs.dom('#mvDetail').$( 'display', 'block' ),
		bs.$go('#detail');
		depend();
	},
	depend = function(){
		bs.$post( function( t0 ){
			var t1, t2, i, j, drs;
			t1 = 'no dependency';
			if( t0 ){
				t0 = JSON.parse( t0 ), t0 = t0.contents, j = t0.length;
				if( j ){
					for( t1 = '', i = 0 ; i < j ; i++ ){
						t2 = bs.dom('<div class="mvDetail3"></div>' ).$( '<', '#Vdependency', 'this' );
						if( isFreezed ) t2.$( '>', (function( dr ){
							var d;
							d = bs.dom('<div class="mvDetail2 ADD FL"><span class="batch">&#xF14D;</span></div>'),
							d[0].onmousedown = function( $e ){
								if( drs[dr] ) return;
								drs[dr] = 1;
								bs.$post( function( t0 ){
									if( t0 ){
										t0 = JSON.parse( t0 );
										if( t0.result == 'ok' ) depend();
									}
									drs[dr] = 0;
								}, '/member/dDel', 'dr', dr );
							};
							return d;
						})(t0[i].depend_rowid) );
						t2.$( '>', '<div class="FL">'+t0[i].uname+' ('+t0[i].version+')</div>',
							'>', '<div class="CLEAR mvDetail4"></div>' );
					}
					return drs = {};
				}
			}
			bs.dom('#Vdependency').$( 'html', t1 );
		}, '/member/dList', 'vr', bs.dom('#Vvr').$( '@value' ) );
	},
	//version add
	bs.dom('#Vadd').$( 'down', add = function( $e ){
		if( bs.dom('#Vadd').downed ) return;
		bs.dom('#Vadd').downed = 1;
		bs.$post( function(t0){
			if( t0 ) t0 = JSON.parse( t0 ), t0.result == 'ok' ? ver() : bs.dom('#Aalert').$( 'html', 'addFailed:'+ t0.contents );
			else bs.dom('#Aalert').$( 'html', 'addFailed: no response' );
			bs.dom('#Vadd').downed = 0;
		}, '/member/vAdd', 'version', parseFloat( bs.dom('#Vversion').$('@value') ), 'r', r );
	} ),
	bs.dom('#Vversion').$( 'keydown', function( $e ){if( $e.key('enter') ) add(), this.value = '';} ),
	//detail edit	
	bs.dom('#Vtab0').$( 'down', function( $e ){
		bs.dom('#Vtab0').$( 'class+', 'mvTabOn' ), bs.dom('#Vtab1').$( 'class-', 'mvTabOn' ),
		bs.dom('#Vcode').$( 'display', 'block' ), bs.dom('#Vcontents').$( 'display', 'none' );
	} ),
	bs.dom('#Vtab1').$( 'down', function( $e ){
		bs.dom('#Vtab0').$( 'class-', 'mvTabOn' ), bs.dom('#Vtab1').$( 'class+', 'mvTabOn' ),
		bs.dom('#Vcode').$( 'display', 'none' ), bs.dom('#Vcontents').$( 'display', 'block' );
	} ),
	bs.dom('#Vupdate').$( 'down', function( $e ){
		if( bs.dom('#Vupdate').downed ) return;
		bs.dom('#Vupdate').downed = 1;
		bs.$post( function(t0){
			if( t0 ){
				t0 = JSON.parse( t0 );
				if( t0.result == 'ok' ) bs.dom('#Valert').$( 'html', 'updateOK' );
				else bs.dom('#Valert').$( 'html', 'updateFailed:'+ t0.contents );
				ver(), detail.call( bs.dom('#Vidx')[0] );
			}else bs.dom('#Valert').$( 'html', 'updateFailed: no response' );
			bs.dom('#Vupdate').downed = 0;
		}, '/member/vUp', 'vr', bs.dom('#Vvr').$('@value'), 'code', bs.dom('#Vcode').$('@value'), 'contents', bs.dom('#Vcontents').$('@value') );
	} );
	bs.dom('#Vfreeze').$( 'down', function(){
		if( bs.dom('#Vfreeze').downed ) return;
		bs.dom('#Vfreeze').downed = 1;
		bs.$post( function( t0 ){
			if( t0 ){
				t0 = JSON.parse( t0 );
				if( t0.result == 'ok' ){
					bs.dom('#Valert').$( 'html', 'freezeOK' );
					ver(), versionDetail( bs.dom('#Vidx').$('@value') );
				}else bs.dom('#Valert').$( 'html', 'freezeFailed:'+ t0.contents );
			}else bs.dom('#Valert').$( 'html', 'freezeFailed: no response' );
			bs.dom('#Vfreeze').downed = 0;
		}, '/member/vFrz', 'vr', bs.dom('#Vvr').$('@value') );
	} );
	(function(){
		function f0(t){return function($e){bs.dom(t).$( 'color', '#fff' );};}
		function f1(t){return function($e){bs.dom(t).$( 'color', '#ddd' );};}
		function f2(t){
			return function($e){
				var i;
				if( $e.key('tab') ) $e.prevent(),
					bs.dom(t).$( '@value', $e.value.substring( 0, i = bs.dom(t).$( 'cursorPos' ).start ) + '\t' + $e.value.substr( i ) ),
					setTimeout( function(){bs.dom(t).$( 'f', null, 'cursorPos', i + 1 );},1);
			};
		}
		function f3( t ){
			return function( $e ){if( bs.dom(t).$( 'height' ) || 0 != this.scrollHeight ) bs.dom('#Vcode').$( 'height', this.scrollHeight );};
		}
		bs.dom('#Vcode').$( 'focus', f0('#Vcode'), 'blur', f1('#Vcode'), 'keydown', f2('#Vcode'), 'scroll', f3('#Vcode') );
		bs.dom('#Vcontents').$( 'focus', f0('#Vcontents'), 'blur', f1('#Vcontents'), 'keydown', f2('#Vcontents'), 'scroll', f3('#Vcontents') );
	})();
	//dependency	
	bs.dom( '#Dsearch' ).$( 'down', function( $e ){
		if( bs.dom('#Dsearch').downed ) return;
		bs.dom('#Dsearch').downed = 1;
		bs.$post( function( t0 ){
			var t1, i, j;
			if( t0 ){
				t0 = JSON.parse( t0 );
				if( t0.result == 'ok' ){
					t0 = t0.contents, j = t0.length;
					if( j ){
						for( t1 = '', i = 0 ; i < j ; i++ )
							t1 += '<option value="'+t0[i].ver_rowid+'">'+t0[i].version+'</option>';
						bs.dom('#Dver').$( 'html', '<select id="Dversion">' + t1 + '</select>' ),
						bs.dom('#Ddetail').$( 'display', 'block' );
						bs.dom('#Dadd').downed = 0;
					}else bs.dom('#Dname').$( '@value', 'no freezed version' );
				}else bs.dom('#Dname').$( '@value', 'invalid name' );
			}else bs.dom('#Dname').$( '@value', 'invalid name' );
			bs.dom('#Dsearch').downed = 0;
		}, '/member/search', 'title', bs.dom('#Dname').$('@value'), 'r', r );
	} );
	bs.dom( '#Dadd' ).$( 'down', function( $e ){
		if( bs.dom('#Dadd').downed ) return;
		bs.dom('#Dadd').downed = 1;
		bs.$post( function( t0 ){
			var t1, i, j;
			if( t0 ){
				t0 = JSON.parse( t0 );
				if( t0.result == 'ok' ) depend(); else bs.dom('#Dname').$( '@value', t0.contents );
			}else bs.dom('#Dname').$( '@value', 'error' );
			bs.dom('#Dadd').downed = 0;
			bs.dom('#Dver').$( 'html', '' ),
			bs.dom('#Dname').$('@value', '' ),
			bs.dom('#Ddetail').$( 'display', 'none' );
		}, '/member/dAdd', 'vr1', bs.dom('#Vvr').$('@value'), 'vr2', bs.dom('#Dversion').$('@value'), 'r', r );
	} );
	bs.dom('#Dadd').downed = 1;
}

};