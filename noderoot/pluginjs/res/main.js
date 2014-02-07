bs( function(){
	bs.WIN.dblselect(0);
	bs.css('/res/main3.css');
	if( bs.WIN.is('#back') ) bs.Dom('#back').S( 'down', site.back = function(e){bs.back();} );
} );
var site = {
logined:function(nick){
	bs.WIN.on( 'keydown', 'plugin', function(e){
		var t0 = document.activeElement;
		if( t0 && ( t0 = t0.tagName.toLowerCase() ) == 'input' || t0 == 'textarea' ) return;
		if( e.key('1') ) bs.go( '/member/' );
		else if( site.back && e.key('b') ) site.back();
	} );
	return '<div id="topLogined">'+
		'<a id="topLogined0" href="/member/" class="TS2"><span class="batch">&#xf170;</span> ' + nick + '<sup>1</sup></a> &nbsp; '+
		'<a href="/member/setting" class="batch">&#xf04e</a> &nbsp '+
		'<a id="topLogined1" href="/logout" class="batch">&#xf165;</a>'+
		'</div>';
},
header:function(){
	var lend, isJoin, login, jend, jcancel, jheight;
	//login
	lend = function(){bs.Dom('#topMember').S( 'display', 'none' );},
	bs.Dom('#Llogin').S('down', login = function(e){
		if( bs.Dom('#Llogin').downed ) return;
		bs.Dom('#Llogin').downed = 1;
		bs.Dom('#Lalert').S( 'html', '' ),
		bs.post( function(t0){
			if( t0 ){
				t0 = JSON.parse(t0);
				if( t0.result == 'ok' ) bs.Dom('#topMember').S( 'html', site.logined(t0.contents.nick) );
				else bs.Dom('#Lalert').S( 'html', 'loginFailed:' + t0.contents );
			}else bs.Dom('#Lalert').S( 'html', 'loginFailed: no response' );
			bs.Dom('#Llogin').downed = 0;
		}, '/login', 'email', bs.Dom('#Lemail').S('@value'), 'pw', bs.md5(bs.Dom('#Lpw').S('@value')) );
	}),
	bs.Dom('#Ljoin').S( 'down', function(){
		if( isJoin ) return;
		isJoin = 1,
		bs.ANI.tween( bs.Dom('#topMember').S( 'opacity', 1, 'this' ), 'opacity', 0, 'time', .5, 'end', lend ),
		bs.Dom('#topJoin').S( 'display', 'block' );
		if( !jheight ) jheight = bs.Dom('#topJoin').S('h');
		bs.ANI.tween( bs.Dom('#topJoin').S( 'height', 0, 'this' ), 'height', jheight, 'time', .7, 'ease', 'bounceOut', 'end', jend );
	} ),
	bs.Dom( bs.Dom('#Lemail').S('@value') ? '#Lpw' : '#Lemail' ).S('f'),
	bs.Dom('#Lpw').S( 'keydown', function(e){if( e.key('enter') || e.key('space') ) e.prevent(), login();} ),
	//join
	jend = function(){bs.Dom('#Jemail').S('f');},
	jcancel = function(){isJoin = 0, bs.Dom('#join').S( 'display', 'none' );},
	bs.Dom('#Jcancel').S( 'down', function(){
		bs.ANI.tween( bs.Dom('#topMember').S( 'display', 'block', 'this' ), 'opacity', 1, 'time', .3 ),
		bs.ANI.tween( bs.Dom('#topJoin' ), 'height', 0, 'time', .2, 'end', jcancel );
	} ),
	bs.Dom('#Jjoin').S( 'down', function(){
		if( bs.Dom('#Jjoin').downed ) return;
		bs.Dom('#Jjoin').downed = 1;
		bs.Dom('#Jalert').S( 'html', '' );
		if( !bs.$test( '@email', '#Jemail|' ) ){
			return bs.Dom('#Jalert').S( 'html', 'invalid [email]' ), setTimeout( jend, 1 );
		}else if( !bs.test( '@pass', '#Jpw|' ) || !bs.test( '@range|6|16', '#Jpw|' ) ){
			return bs.Dom('#Jalert').S( 'html', 'invalid [pw]' ), setTimeout( function(){bs.Dom('#Jpw').S( '@value', '', 'f' );}, 1 );
		}else if( bs.Dom('#Jpw').S('@value') != bs.Dom('#Jpwc').S('@value') ){
			return bs.Dom('#Jalert').S( 'html', 'not equal [isPw]' ), setTimeout( function(){bs.Dom('#Jpwc').S( '@value', '', 'f' );}, 1 );
		}else if( !bs.test( '@alphanum', '#Jnick|' ) || !bs.test( '@range|4|10', '#Jnick|' ) ){
			return bs.Dom('#Jalert').S( 'html', 'invalid [nick]' ), setTimeout( function(){bs.Dom('#Jnick').S( '@value', '', 'f' );}, 1 );
		}else if( t0 = bs.trim(bs.Dom('#Jthumb').S('@value')) ){
			if( !bs.test( '@url', t0 ) ) return bs.Dom('#Jalert').S( 'html', 'invalid [thumb]' ), setTimeout( function(){bs.Dom('#Jthumb').S( '@value', '', 'f' );}, 1 );
		}
		bs.post( function(t0){
			if( t0 ){
				t0 = JSON.parse(t0);
				if( t0.result == 'ok' ){
					bs.ANI.tween( bs.Dom('#topMember').S( 'html', site.logined(t0.contents.nick), 'display', 'block', 'this' ), 'opacity', 1, 'time', .3 ),
					bs.ANI.tween( bs.Dom('#topJoin'), 'height', 0, 'time', .2, 'end', jcancel );
				}else bs.Dom('#Jalert').S( 'html', 'joinFailed:' + t0.contents );
			}else bs.Dom('#Jalert').S( 'html', 'joinFailed: no response' );
			bs.Dom('#Jjoin').downed = 0;
		}, '/join',
			'email', bs.Dom('#Jemail').S('@value'), 'pw', bs.md5(bs.Dom('#Jpw').S('@value')),
			'nick', bs.Dom('#Jnick').S('@value'), 'thumb', bs.Dom('#Jthumb').S('@value') || ''
		);
	}),
	bs.Dom('#Jthumb').S( 'blur', function(e){if( e.value ) bs.Dom('#Jimg').S('@src', e.value );},
		'keydown', function(e){bs.Dom('#Jimg').S('@src', e.value );} );
},
mi:function(){
	var height, isAdd, acancel, list;
	bs.Dom('#Padd').S( 'down', function(){
		if( isAdd ) return;
		isAdd = 1,
		bs.Dom('#Padd').S( 'display', 'none' );
		bs.Dom('#miAdd').S( 'display', 'block' );
		if( !height ) height = bs.Dom('#miAdd').S('h');
        bs.ANI.tween( bs.Dom('#miAdd').S( 'height', 0, 'this' ), 'height', height, 'time', .7, 'ease', 'bounceOut' );
	} ),
	acancel = function(){
		isAdd = 0,
		bs.Dom('#miAdd').S( 'display', 'none' ),
		bs.Dom('#Padd').S( 'display', 'block' );
	},
	bs.Dom('#Acancel').S( 'down', function(){
		bs.ANI.tween( bs.Dom('#miAdd' ), 'height', 0, 'time', .2, 'end', acancel );
	} ),
	bs.Dom('#Aadd').S( 'down', function( $e ){
		var t0;
		if( bs.Dom('#Aadd').downed ) return;
		bs.Dom('#Aadd').downed = 1;
		bs.Dom('#Aalert').S( 'html', '' );
		if( !bs.$test( '@range|5|100', '#Atitle|' ) ){
			return bs.Dom('#Aalert').S( 'html', 'invalid [title]' ), setTimeout( function(){bs.Dom('#Atitle').S('f');}, 1 );
		}else if( !bs.test( '@range|3|100', '#Auname|' ) ){
			return bs.Dom('#Aalert').S( 'html', 'invalid [uname]' ), setTimeout( function(){bs.Dom('#Auname').S('f');}, 1 );
		}else if( t0 = bs.Dom('#Aimg').S('@src') ){
			bs.Dom('#Athumb').S('@value', t0.indexOf('/res/thumb/default.png') == -1 ? t0 : '' )
		}
		bs.post( function(t0){
			if( t0 ){
				t0 = JSON.parse( t0 );
				if( t0.result == 'ok' ) list( function(){bs.ANI.tween( bs.Dom('#miAdd' ), 'height', 0, 'time', .2, 'end', acancel );});
				else bs.Dom('#Aalert').S( 'html', 'addFailed:'+ t0.contents );
			}else bs.Dom('#Aalert').S( 'html', 'addFailed: no response' );
			bs.Dom('#Atitle').S( '@value', '' ), bs.Dom('#Auname').S( '@value', '' ),
			bs.Dom('#Adescription').S( '@value', '' ), bs.Dom('#Akeyword').S( '@value', '' ),
			bs.Dom('#Athumb').S( '@value', '' ), bs.Dom('#Aimg').S( '@src', site.R+'/res/member/title.png' );
			bs.Dom('#Aadd').downed = 0;
		}, '/member/add', 
			'type', bs.Dom('#Atype').S('@value'), 'uname', bs.Dom('#Auname').S('@value'),
			'title', bs.Dom('#Atitle').S('@value'), 'description', bs.Dom('#Adescription').S('@value'),
			'cat', bs.Dom('#Acat').S('@value'), 'keyword', bs.Dom('#Akeyword').S('@value'),
			'thumb', bs.Dom('#Athumb').S('@value')
		);
	} ),
	bs.Dom('#Athumb').S( 'blur', function(e){if( e.value ) bs.Dom('#Aimg').S('@src', e.value );},
		'keydown', function(e){if( e.key('enter') || e.key('space') ) e.prevent(), bs.Dom('#Aimg').S( '@src', e.value );} ),
	( list = function(f){
		bs.post( function(t0){
			var t1, i, j;
			if( t0 ){
				t0 = JSON.parse(t0);
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
					bs.Dom('#miList').S( 'html', t1 + '</table>' );
				}
			}
			if( f ) f();
		}, '/member/' );
	} )();
},
viewr:0,
view:function(){
	var r, ver, detail, add, version, depend, isFreezed;
	r = site.viewr,
	//start
	bs.post( function(t0){
		t0 = JSON.parse(t0);
		if( t0.result == 'ok' ){
			t0 = t0.contents;
			if( t0.thumb ) bs.Dom('#mvTop0').S( '@src', t0.thumb );
			bs.Dom('#mvTop1').S( 'html', t0.uname ),
			bs.Dom('#mvTop2').S( 'html', t0.title ),
			bs.Dom('#mvTop3').S( 'html', t0.cat ),
			bs.Dom('#mvTop4').S( 'html', t0.type ),
			bs.Dom('#mvTop5').S( 'html', t0.regdate ),
			bs.Dom('#mvTop6').S( 'html', t0.contents ),
			ver();
		}else return bs.back();
	}, '/member/view', 'r', r ),
	//base function
	ver = function( d, id ){
		if( ver.isRun ) return;
		ver.isRun = 1;
		bs.post( function(t0){
			var t1, i, j;
			bs.Dom('#mvVersions').S( 'html', '' ),
			t1 = bs.Dom('mvTop0').S('@src'),
			version = t0 = JSON.parse(t0).contents;
			for( i = 0, j = t0.length ; i < j ; i++ )
				bs.Dom(
				'<div id="V'+i+'" class="mvVersions0 BRLR10">'+
					'<img onerror="this.src=\''+site.R+'/res/thumb/default.png\'" src="'+t1+'">'+
					'<div class="mvVersions1">Version '+t0[i].version+'</div>'+
					'<div class="mvVersions2 O8">UPDATED : '+t0[i].editdate+'</div>'+
					(t0[i].freezedate ? '<div class="mvVersions3 O8">FREEZE : '+t0[i].freezedate+'</div>':'<div class="mvVersions4 O8">WARM<br>&nbsp;</div>' )+
				'</div>').S( '<', '#mvVersions', 'this' )[0].onmousedown = detail;
			ver.isRun = 0;
			if( d ) d(id);
		}, '/member/ver', 'r', r );
	},
	detail = function(t0){
		bs.Dom('#Vidx').S( '@value', t0 = typeof t0 == 'number' ? t0 : this.id.substr(1) ),
		t0 = version[t0],
		isFreezed = t0.freezedate;
		bs.Dom('#Dname').S('display', isFreezed ? 'none' : 'block' ),
		bs.Dom('#Dsearch').S('display', isFreezed ? 'none' : 'block' ),
		bs.Dom('#Vupdate').S('display', isFreezed ? 'none' : 'block' ),
		bs.Dom('#Vfreeze').S('display', isFreezed ? 'none' : 'block' ),
		bs.Dom('#Vver').S( 'html', 'v.'+t0.version ), bs.Dom('#Vvr').S( '@value', t0.ver_rowid ),
		bs.Dom('#Vcode').S( '@value', t0.code || '' ), bs.Dom('#Vcontents').S( '@value', t0.contents || '' ),
		bs.Dom('#mvDetail').S( 'display', 'block' ),
		bs.go('#detail');
		depend();
	},
	depend = function(){
		bs.$post( function(t0){
			var t1, t2, i, j, drs;
			t1 = 'no dependency';
			if( t0 ){
				t0 = JSON.parse(t0), t0 = t0.contents, j = t0.length;
				if( j ){
					for( t1 = '', i = 0 ; i < j ; i++ ){
						t2 = bs.Dom('<div class="mvDetail3"></div>' ).S( '<', '#Vdependency', 'this' );
						if( isFreezed ) t2.S( '>', (function(dr){
							var d;
							d = bs.Dom('<div class="mvDetail2 ADD FL"><span class="batch">&#xF14D;</span></div>'),
							d[0].onmousedown = function(){
								if( drs[dr] ) return;
								drs[dr] = 1;
								bs.post( function(t0){
									if( t0 ){
										t0 = JSON.parse(t0);
										if( t0.result == 'ok' ) depend();
									}
									drs[dr] = 0;
								}, '/member/dDel', 'dr', dr );
							};
							return d;
						})(t0[i].depend_rowid) );
						t2.S( '>', '<div class="FL">'+t0[i].uname+' ('+t0[i].version+')</div>',
							'>', '<div class="CLEAR mvDetail4"></div>' );
					}
					return drs = {};
				}
			}
			bs.Dom('#Vdependency').S( 'html', t1 );
		}, '/member/dList', 'vr', bs.Dom('#Vvr').S('@value') );
	},
	//version add
	bs.Dom('#Vadd').S( 'down', add = function(){
		if( bs.Dom('#Vadd').downed ) return;
		bs.Dom('#Vadd').downed = 1;
		bs.post( function(t0){
			if( t0 ) t0 = JSON.parse( t0 ), t0.result == 'ok' ? ver() : bs.Dom('#Aalert').S( 'html', 'addFailed:'+ t0.contents );
			else bs.Dom('#Aalert').S( 'html', 'addFailed: no response' );
			bs.Dom('#Vadd').downed = 0;
		}, '/member/vAdd', 'version', parseFloat( bs.Dom('#Vversion').S('@value') ), 'r', r );
	} ),
	bs.Dom('#Vversion').S( 'keydown', function(e){if( e.key('enter') ) add(), this.value = '';} ),
	//detail edit	
	bs.Dom('#Vtab0').S( 'down', function(){
		bs.Dom('#Vtab0').S( 'class+', 'mvTabOn' ), bs.Dom('#Vtab1').S( 'class-', 'mvTabOn' ),
		bs.Dom('#Vcode').S( 'display', 'block' ), bs.Dom('#Vcontents').S( 'display', 'none' );
	} ),
	bs.Dom('#Vtab1').S( 'down', function(){
		bs.Dom('#Vtab0').S( 'class-', 'mvTabOn' ), bs.Dom('#Vtab1').S( 'class+', 'mvTabOn' ),
		bs.Dom('#Vcode').S( 'display', 'none' ), bs.Dom('#Vcontents').S( 'display', 'block' );
	} ),
	bs.Dom('#Vupdate').S( 'down', function(){
		if( bs.Dom('#Vupdate').downed ) return;
		bs.Dom('#Vupdate').downed = 1;
		bs.post( function(t0){
			if( t0 ){
				t0 = JSON.parse(t0);
				if( t0.result == 'ok' ) bs.Dom('#Valert').S( 'html', 'updateOK' );
				else bs.Dom('#Valert').S( 'html', 'updateFailed:'+ t0.contents );
				ver(), detail.call(bs.Dom('#Vidx')[0]);
			}else bs.Dom('#Valert').S( 'html', 'updateFailed: no response' );
			bs.Dom('#Vupdate').downed = 0;
		}, '/member/vUp', 'vr', bs.Dom('#Vvr').S('@value'), 'code', bs.Dom('#Vcode').S('@value'), 'contents', bs.Dom('#Vcontents').S('@value') );
	} );
	bs.Dom('#Vfreeze').S( 'down', function(){
		if( bs.Dom('#Vfreeze').downed ) return;
		bs.Dom('#Vfreeze').downed = 1;
		bs.post( function(t0){
			if( t0 ){
				t0 = JSON.parse(t0);
				if( t0.result == 'ok' ){
					bs.Dom('#Valert').S( 'html', 'freezeOK' );
					ver(), versionDetail( bs.Dom('#Vidx').S('@value') );
				}else bs.Dom('#Valert').S( 'html', 'freezeFailed:'+ t0.contents );
			}else bs.Dom('#Valert').S( 'html', 'freezeFailed: no response' );
			bs.Dom('#Vfreeze').downed = 0;
		}, '/member/vFrz', 'vr', bs.Dom('#Vvr').S('@value') );
	} );
	(function(){
		function f0(t){return function(){bs.Dom(t).S( 'color', '#fff' );};}
		function f1(t){return function(){bs.Dom(t).S( 'color', '#ddd' );};}
		function f2(t){
			return function(e){
				var i;
				if( e.key('tab') ) e.prevent(),
					bs.Dom(t).S( '@value', e.value.substring( 0, i = bs.Dom(t).S('cursorPos').start ) + '\t' + e.value.substr(i) ),
					setTimeout( function(){bs.Dom(t).S( 'f', null, 'cursorPos', i + 1 );},1);
			};
		}
		function f3(t){
			return function(){if( bs.Dom(t).S('height') || 0 != this.scrollHeight ) bs.Dom('#Vcode').S( 'height', this.scrollHeight );};
		}
		bs.Dom('#Vcode').S( 'focus', f0('#Vcode'), 'blur', f1('#Vcode'), 'keydown', f2('#Vcode'), 'scroll', f3('#Vcode') );
		bs.Dom('#Vcontents').S( 'focus', f0('#Vcontents'), 'blur', f1('#Vcontents'), 'keydown', f2('#Vcontents'), 'scroll', f3('#Vcontents') );
	})();
	//dependency	
	bs.Dom( '#Dsearch' ).S( 'down', function(){
		if( bs.Dom('#Dsearch').downed ) return;
		bs.Dom('#Dsearch').downed = 1;
		bs.post( function(t0){
			var t1, i, j;
			if( t0 ){
				t0 = JSON.parse(t0);
				if( t0.result == 'ok' ){
					t0 = t0.contents, j = t0.length;
					if( j ){
						for( t1 = '', i = 0 ; i < j ; i++ )
							t1 += '<option value="'+t0[i].ver_rowid+'">'+t0[i].version+'</option>';
						bs.Dom('#Dver').S( 'html', '<select id="Dversion">' + t1 + '</select>' ),
						bs.Dom('#Ddetail').S( 'display', 'block' );
						bs.Dom('#Dadd').downed = 0;
					}else bs.Dom('#Dname').S( '@value', 'no freezed version' );
				}else bs.Dom('#Dname').S( '@value', 'invalid name' );
			}else bs.Dom('#Dname').S( '@value', 'invalid name' );
			bs.Dom('#Dsearch').downed = 0;
		}, '/member/search', 'title', bs.Dom('#Dname').S('@value'), 'r', r );
	} );
	bs.Dom( '#Dadd' ).S( 'down', function(){
		if( bs.Dom('#Dadd').downed ) return;
		bs.Dom('#Dadd').downed = 1;
		bs.post( function(t0){
			var t1, i, j;
			if( t0 ){
				t0 = JSON.parse(t0);
				if( t0.result == 'ok' ) depend(); else bs.Dom('#Dname').S( '@value', t0.contents );
			}else bs.Dom('#Dname').S( '@value', 'error' );
			bs.Dom('#Dadd').downed = 0;
			bs.Dom('#Dver').S( 'html', '' ),
			bs.Dom('#Dname').S( '@value', '' ),
			bs.Dom('#Ddetail').S( 'display', 'none' );
		}, '/member/dAdd', 'vr1', bs.Dom('#Vvr').S('@value'), 'vr2', bs.Dom('#Dversion').S('@value'), 'r', r );
	} );
	bs.Dom('#Dadd').downed = 1;
}

};