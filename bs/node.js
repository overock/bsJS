module.exports = function( bs ){
var HTTP = require('http'), URL = require('url'), site, fileRoot = {};
bs.$method( 'os', (function(){
	var os = require('os');
	return function( $k ){return os[$k]();};
})() ),
(function(){
	var query = require('querystring');
	bs.$method( 'escape', function( $val ){return query.escape( $val );} ),
	bs.$method( 'unescape', function( $val ){return query.unescape( $val );} ),
	bs.$method( 'cgiparse', function( $val ){return query.parse( $val );} ),
	bs.$method( 'cgistringify', function( $val ){return query.stringify( $val );} );
})();
bs.$method( 'crypt', (function(){
	var crypto = require('crypto');
	return function( $type, $v ){
		var t0;
		switch( $type ){
		case'sha256': return t0 = crypto.createHash('sha256'), t0.update( $v ), t0.digest('hex');
		}
	};
})() ),
(function( HTTP, URL ){
	var fs, p, http, arr2obj;
	fs = require('fs'), p = require('path'),
	bs.$method( 'path', function( $path, $context ){
		var t0;
		if( $path.substr(0,5) == 'http:' || $path.substr(0,5) == 'https:' ) return $path;
		if( $context == 'root' ){
			if( !(t0 = bs.__root) ) throw new Error('Root is not set');
		}else if( $context ) t0 = $context;
		else t0 = fileRoot[site];
		return p.resolve( t0, $path );
	} );
	bs.$method( 'stream', function( $path, $open, $err ){ //파일스트림을 출력한다.
		var t0;
		if( !fs.existsSync( $path ) ){
			if( $err ) $err();
			return null;
		}
		t0 = fs.createReadStream( $path );
		if( $open ) t0.once( 'open', $open );
		if( $err ) t0.once( 'error', $err );
		return t0;
	} ),
	bs.$method( 'file', function( $end, $path, $v, $opition ){ //파일처리
		if( !fs.existsSync( $path ) ) return null;
		if( !$end ) return  fs.readFileSync( $path );
		fs.readFile( $path, function( $e, $d ){return $end( $e || $d );});
	} ),
	bs.$method( 'js', (function(){
		var js = function( $data, $load, $end ){
			var t0, i;
			if( $load ){
				if( $data.charAt($data.length-1)=='=' ) $data += 'bs.__callback.'+(i='c'+(id++)), jc[i] = function(){delete jc[i],$end.apply(null,arguments);};
				bs.$get( function( $v ){
					try{
						new Function( 'bs', $v )(bs);
					}catch( $e ){
						console.log( $e );
					}
					$load();
				}, $data );
			}else try{
				new Function( 'bs', $data )(bs);
			}catch( $e ){
				console.log( $e );
			};
		};
		return function( $end ){
			var i, j, arg, load;
			arg = arguments, i = 1, j = arg.length;
			if( $end ) ( load = function(){i < j ? js( bs.$path( arg[i++] ), load, $end ) : $end();} )();
			else while( i < j ) js( bs.$file( null, bs.$path( arg[i++] ) ) );
		};
	})() ),
	arr2obj = function( $arg ){
		var t0, i, j;
		t0 = {}, i = 0, j = $arg.length;
		while( i < j ) typeof $arg[i] == 'string' && $arg[i].charAt(0) != '@' ? t0[$arg[i++]] = $arg[i++] : i += 2;
		return t0;
	},
	http = (function(){
		var htop, maxSize;
		htop = {},maxSize = 2 * 1024 * 1024;
		return function( $type, $end, $url, $arg ){
			var t0, t1, response;
			if( $url.substr( 0, 5 ) == 'http:' || $url.substr( 0, 6 ) == 'https:' ){
				if( !$end ) return console.log( 'http need callback!' ), null;
				response = function( rs ){
					var t0 = '';
					rs.on( 'data', function($v){
						t0 += $v;
						if( t0.length > maxSize ){
							t0 = '', this.pause(), rs.writeHead(413), rs.end( 'Too Large' ), $end( null );
						}
					} ).on( 'end', function(){
						if( !t0 ) rs.end(), $end( null );
						else $end( t0, rs );t0='';
					} );
				},
				t0 = URL.parse($url), htop.hostname = t0.hostname, htop.method = $type, htop.port = t0.port, htop.path = t0.path;
				if( $type == 'GET' ){
					htop.headers = arr2obj( bs.$cgi.header ),
					t0 = HTTP.request( htop, response );
				}else{
					t1 = bs.$cgi( $arg ),
					htop.headers = arr2obj( bs.$cgi.header ),
					htop.headers['Content-Type'] = 'application/x-www-form-urlencoded',
					htop.headers['Content-Length'] = Buffer.byteLength( t1 ),
					t0 = HTTP.request( htop, response ),
					t0.write( t1 );
				}
				t0.on('error', function($e){$end( null, $e );}),
				t0.end();
			}else return bs.$file( $end, $url );
		};
	})(),
	bs.$method( 'get', function( $end, $path ){http( 'GET', $end, bs.$url( $path, arguments ) );} ),
	bs.$method( 'post', function( $end, $path ){http( 'POST', $end, bs.$url($path), arguments );} ),
	bs.$method( 'put', function( $end, $path ){http( 'PUT', $end, bs.$url($path), arguments );} ),
	bs.$method( 'delete', function( $end, $path ){http( 'DELETE', $end, bs.$url($path), arguments );} );
})( HTTP, URL ),
(function( HTTP, URL ){
	var form, mime, clone, portStart, sort, staticHeader, err,
		sessionName, id, cookie, clientCookie, ckParser, next,
		head, method, response, rq, rp, getData, postData, postFile, data;
		
	mime = require('./mime'), form = require( 'formidable' ),
	clone = function( $v ){
		var t0, k;
		t0 = {};
		for( k in $v )if( $v.hasOwnProperty( k ) ) t0[k] = $v[k];
		return t0;
	},
	sort = function( a, b ){return a.length - b.length;},
	staticHeader = {'Content-Type':0},
	clientCookie = null,
	ckParser = function(){
		var t0, t1, i;
		clientCookie = {};
		if( t0 = rq.headers.cookie ){
			t0 = t0.split(';'), i = t0.length;
			while( i-- ) t0[i] = bs.$trim( t0[i].split('=') ), clientCookie[t0[i][0]] = t0[i][1];
		}
	},
	bs.$method( 'ck', (function(){
		return function( $k, $v, $path, $expire, $domain ){
			var t0, t1;
			if( $v === undefined ) return clientCookie[$k];
			if( $k.charAt(0) == '@' ) t0 = 1, $k = $k.substr(1);
			t0 = $k + '=' + ( bs.$escape($v) || '' ) + 
				';Path=' + ( $path || '/' ) + 
				( t0 ? ';HttpOnly' : '' ) + 
				( $domain ? ';Domain=' + $domain : '' );
			if( $v === null ) (t1 = new Date).setTime( t1.getTime() - 86400000 ),
				t0 += ';expires=' + t0.toUTCString() + ';Max-Age=0';
			else if( $expire ) (t1 = new Date).setTime( t1.getTime() + $expire * 86400000 ),
				t0 += ';expires=' + t1.toUTCString() + ';Max-Age=' + ( $expire * 86400 );
			cookie[$k] = t0;
		};
	})() );
	bs.$static( 'WEB', (function(){
		var flush;
		head = [], response = [],
		sessionName = '__bsNode', id = 0,
		flush = {
			0:['Server', 'projectBS on node.js'],
			1:['Content-Type', 'text/html; charset=utf-8'],
			2:['Content-Length', 0]
		};
		return {
			next:function(){next();},
			flush:function(){
				var t0, k;
				for(k in cookie) head[head.length] = ['Set-Cookie', cookie[k]];
				head.push( flush[0], flush[1], ( t0 = response.join(''), flush[2][1] = Buffer.byteLength( t0, 'utf8' ), flush[2] ) ),
				rp.writeHead( 200, head ), rp.end( t0 );
			},
			application:function( $k, $v ){return $v === undefined ? application[$k] : application[$k] = $v;},
			session:function( $k, $v ){
				var t0;
				t0 = bs.$ck( sessionName );
				if( $v === undefined ){
					if( t0 && ( t0 = session[t0] ) ) return t0[$k];
				}else{
					if( !t0 ) bs.$ck( '@'+sessionName, t0 = bs.$crypt( 'sha256', ''+bs.$ex( 1000,'~',9999 ) + (id++) + bs.$ex( 1000,'~',9999 ) ) );
					if( !session[t0] ) session[t0] = {};
					return session[t0][$k] = $v;
				}
			},
			head:function( $k, $v ){head[head.length] = [$k, $v];},
			method:function(){return method;},
			request:function( $k ){return $k ? rq[$k] : rq;},
			response:function(){
				var i, j;
				for( i = 0, j = arguments.length ; i < j ; i++ ) response[response.length] = arguments[i];
			},
			get:function( $k ){return getData[$k];},
			post:function( $k ){return postData[$k];},
			file:function( $k ){return postFile[$k];},
			data:function( $k, $v ){return $v === undefined ? data[$k] : data[$k] = $v;},
			redirect:function( $url ){rp.writeHead( 301, {Location:$url} ), rp.end();}
		};
	})() ),
	err = function( $code, $v ){rp.writeHead( $code, (staticHeader['Content-Type'] = 'text/html', staticHeader) ), rp.end( $v || '' );};
	bs.$class( 'site', function( $fn, bs ){
		var ports, tEnd, f, retry;
		ports = {},
		portStart = function( $sites, $port ){
			HTTP.createServer( function( $rq, $rp ){
				var t0, t1, i, j, k, v;
				t0 = URL.parse( 'http://'+$rq.headers.host+$rq.url ), t1 = t0.hostname, i = 0, j = $sites.length;
				while( i < j ){
					k = $sites[i++], v = $sites[i++];
					if( k == t1 ) v.request( t0, $rq, $rp );
				}
			} ).on('error', function($e){console.log($e);}).listen( $port );
			console.log( $port + ' started' );
		},
		f = function( $path ){return f[$path] || ( f[$path] = bs.$file( null, $path ).toString() );},
		tEnd = function( $data ){bs.WEB.response( $data ), bs.WEB.next();},
		$fn.constructor = function(){
			var self = this, router, nextstep, onData, file, path, currRule, idx;
			this.form = new form.IncomingForm, this.form.encoding = 'utf-8', this.form.keepExtensions = true;
			this.url = [], this.isStarted = 0,
			this.mime = clone( mime ), this.index = 'index', this.config = 'config',
			this.fileMax = 2 * 1024 * 1024, this.postMax = .5 * 1024 * 1024,
			this.rules = {};
			this.request = function( $url, $rq, $rp ){
				var t0, i, j;
				rq = $rq, rp = $rp, site = $url.hostname, fileRoot[site] = self.root, getData = bs.$cgiparse( $url.query ), postData = postFile = null, path = $url.pathname.substr(1);
				if( path.indexOf( '..' ) > -1 || path.indexOf( './' ) > -1 ) err( 404, 'no file<br>'+ path );
				else if( !path || path.substr( path.length - 1 ) == '/' ) file = self.index;
				else{
					if( i = path.lastIndexOf( '/' ) + 1 ) file = path.substr( i ), path = path.substring( 0, i );
					else file = path, path = '';
					if( ( i = file.indexOf( '.' ) ) > -1 ){
						if( t0 = self.mime[file.substr( i + 1 )] ) bs.$stream( bs.$path( path+file ),
								function(){$rp.writeHead( 200, ( staticHeader['Content-Type'] = t0, staticHeader ) ), this.pipe( $rp );},
								function( $e ){err( 404, 'no file<br>'+path+file);}
							);
						else err( 404, 'no file<br>'+path+file);
						return;
					}
				}
				ckParser(), head.length = response.length = 0, data = {}, cookie = {}, retry = 1;
				( method = $rq.method ) == 'GET' ? router() : form.parse( $rq, onData );
			},
			onData = function( $e, $data, $file ){
				if( $e ) return err( 500, 'post Error' + $e );
				postData = $data, postFile = $file, router();
			},
			router = function(){
				var t0, i;
				if( retry && self.config ) new Function( 'bs', f( bs.$path( self.config+'.js' ) ) )(bs);
				t0 = self.rulesArr, i = t0.length;
				while( i-- ) if( path.indexOf( t0[i] ) > -1 ) return currRule = self.rules[t0[i]], idx = 0, ( next = nextstep )();
				err( 500, '<h1>server error</h1><div>Error: no matched rules '+path+file );
			},
			nextstep = function(){
				var t0, i, j;
				if( idx < currRule.length ){
					try{
						i = currRule[idx++], j = currRule[idx++];
						if( typeof j == 'string' ) j = j.replace( '@', file ), j = j.charAt(0) == '/' ? j.substr(1) : ( path + j ), t0 = bs.$path( j );
						switch( i ){
						case'template':self.template( t0, f(t0), data, tEnd ); break;
						case'static':bs.WEB.response( f(t0) ), nextstep(); break;
						case'script':if( ! ( new Function( 'bs', f(t0) )(bs) ) ) nextstep(); break;
						case'require':if( !require( t0 )(bs) ) nextstep(); break;
						case'function':if( typeof j == 'function' ){if( !j() ) nextstep();}else if( j.splice ){if( !j[0][j[1]]() ) nextstep();}break;
						default:nextstep();
						}
					}catch($e){
						if( retry-- ) head.length = response.length = 0, data = {}, cookie = {}, path = path + file + '/', file = self.index, router();
						else err( 500, '<h1>server error</h1><div>Error: '+$e+'</div>path: '+path+'<br>file: '+file+'<br>rule: '+i+'(idx:'+idx+')<br>target :'+j );
					}
				}else bs.WEB.flush();
			};
		},
		$fn.router = function(){
			var i, j, k, v;
			i = 0, j = arguments.length;
			while( i < j ){
				k = arguments[i++], v = arguments[i++];
				if( v === null ) delete this.rules[k]; else if( v !== undefined ) this.rules[k] = v;
			}
			return v;
		},
		$fn.$ = function(){
			var t0, i, j, k, v;
			i = 0, j = arguments.length;
			while( i < j ){
				k = arguments[i++], v = arguments[i++];
				if( k === null ){
					if( this.isStarted ) this.stop();
					this.destroyer();
					return null;
				}else if( v !== undefined ){
					switch( k ){
					case'url':
						v = v.split(':');
						if( this.url.indexOf( v[0] ) == -1 ) this.url.push( v[0], parseInt( v[1] || '8001' ) );
						break;
					case'root':this.root = bs.$path( v, 'root' ); break;
					case'init':case'template':case'config':case'index':this[k] = v; break;
					case'upload':this.upload = bs.$path( v, 'root' ); break;
					case'postMax':case'fileMax':this[k] = v * 1024 * 1024; break;
					case'table':case'rules': for( t0 in v ) if( v.hasOwnProperty( t0 ) ) this['_'+k][t0] = v[t0]; break;
					default:
						if( k.charAt(0) == '.' ) this.mime[k.substr(1)] = v;
					}
				}
			}
			return this[k];
		},
		$fn.start = function(){
			var domain, port, i, j;
			this.form.maxFieldsSize = this.postMax;
			if( this.upload ) this.form.uploadDir = this.upload;
			this.rulesArr = [];
			for( k in this.rules ) this.rulesArr[this.rulesArr.length] = k;
			this.rulesArr.sort( sort );
			i = 0, j = this.url.length;
			switch( typeof this.init ){
			case'string': new Function( 'bs', bs.$file( null, bs.$path( this.init, this.root ) ) )(bs); break;
			case'function': this.init(); break;
			}
			while( i < j ){
				domain = this.url[i++], port = this.url[i++];
				if( !ports[port] ) portStart( ports[port] = [], port );
				if( ports[port].indexOf( domain ) == -1 ) ports[port].push( domain, this );
			}
		},
		$fn.stop = function(){
			var domain, port, i, j;
			i = 0, j = this.url.length;
			while( i < j ){
				domain = this.url[i++], port = this.url[i++];
				if( ports[port] && ( k = ports[port].indexOf( domain ) ) > -1 ) ports[port].splice( k, 2 );
			}
		};
	} );
	bs.site.load = function(){
	};
})( HTTP, URL );
bs.$class( 'sql', function( $fn, bs ){
	$fn.$ = function(){
		var i, j, k, v, t0;
		i = 0, j = arguments.length;
		while( i < j ){
			k = arguments[i++], v = arguments[i++];
			if( v === undefined ) return this[k];
			if( k == 'run' ){
				t0 = v ? bs.$tmpl( this.query, v ) : this.query;
				if( this.type == 'record' ) return bs.db( this.db ).$( 'record', t0, arguments[i++] );
				return bs.db( this.db ).$( 'rs', t0, arguments[i++] );
			}else this[k] = v;
		}
	};
} ),
bs.$class( 'db', (function(){
	var db = {
		mysql:(function(){
			var d, mysql;
			return d = function(){},
			d.prototype.open = function(){
				var t0;
				t0 = this;
				if( !this.__conn ) this.__conn = ( mysql || ( mysql = require( 'mysql' ) ) ).createConnection( this ),
					this.__conn.on( 'error', function( $e ){if( $e.code === 'PROTOCOL_CONNECTION_LOST') t0._conn = null;} );
				return this.__conn;
			},
			d.prototype.close = function(){this.__conn.destroy();},
			d.prototype.$ = function( $arg ){
				var t0, t1, i, j, k, v;
				i = 0, j = $arg.length;
				while( i < j ){
					k = $arg[i++], v = $arg[i++];
					if( k == null ){
						if( this.__conn ) this.close();
						return delete db[this.sel];
					}
					if( v === undefined ) return k == 'url' ? this.host + ':' + this.port :
						k == 'id' ? this.user :
						k == 'pw' ? this.password :
						k == 'db' ? this.database :
						k == 'open' ? this.open() :
						k == 'close' ? this.close() :
						k == 'rollback' ? this.__conn && this.__conn.rollback() :
						k == 'commit' ? this.__conn && this.__conn.commit() : 0;
					else switch( k ){
						case'url':v = v.split(':'), this.host = v[0], this.port = v[1]; break;
						case'id':this.user = v; break;
						case'pw':this.password = v; break;
						case'db':this.database = v; break;
						default:
							t0 = this.open();
							switch( k ){
							case'ex':return t0.query( v );
							case'rs':return t1 = arguments[i++], t0.query( v, function( e, r ){e ? t1( null, e ) : t1( r );} );
							case'record':return t1 = arguments[i++], t0.query( v ).on('result', function( r ){t1( r );} );
							}
							throw 1;
					}
				}
			}, d;
		})()
	};
	return function( $fn, bs ){
		$fn.constructor = function( $sel ){
			var i, type;
			if( i = $sel.indexOf( '@' ) ) $sel = $sel.substring( 0, i ), type = $sel.substr( i );
			this.__db = new db[$type||'mysql'];
		},
		$fn.$ = function(){return this.__db.$( arguments );},
		$fn.open = function(){return this.__db.open();},
		$fn.close = function(){return this.__db.close();};
	};
})() );
};