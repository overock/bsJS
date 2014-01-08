module.exports = function( bs ){
var HTTP = require('http'), HTTPS = require('https'), URL = require('url'), site, fileRoot = {};
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
					try{new Function( 'bs', $v )(bs);}catch( $e ){console.log( $e );}
					$load();
				}, $data );
			}else try{new Function( 'bs', $data )(bs);}catch( $e ){console.log( $e );};
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
			}else return bs.$file( $end && function($v){return $v.toString();}, bs.$path( $url.split('?')[0] ) ).toString();
		};
	})(),
	bs.$method( 'get', function( $end, $path ){return http( 'GET', $end, bs.$url( $path, arguments ) );} ),
	bs.$method( 'post', function( $end, $path ){return http( 'POST', $end, bs.$url($path), arguments );} ),
	bs.$method( 'put', function( $end, $path ){return http( 'PUT', $end, bs.$url($path), arguments );} ),
	bs.$method( 'delete', function( $end, $path ){return http( 'DELETE', $end, bs.$url($path), arguments );} );
})( HTTP, URL ),
(function( HTTP, HTTPS, URL ){
	var form, mime, clone, portStart, staticHeader, err,
		sessionName, id, cookie, clientCookie, ckParser, next,
		head, method, response, application, rq, rp, getData, postData, postFile, data;
		
	mime = require('./mime'), form = require( 'formidable' ),
	clone = function( $v ){
		var t0, k;
		t0 = {};
		for( k in $v )if( $v.hasOwnProperty( k ) ) t0[k] = $v[k];
		return t0;
	},
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
			redirect:function( $url, $isClient ){
				if( $isClient ) rp.writeHead( 200, {'Content-Type':'text/html; charset=utf-8'} ), rp.end( '<script>location.href="' + $url + '";</script>');
				else rp.writeHead( 301, {Location:$url} ), rp.end();
			},
			exit:function( $html ){rp.writeHead( 200, {'Content-Type':'text/html; charset=utf-8'} ), rp.end( $html );}
		};
	})() ),
	err = function( $code, $v ){rp.writeHead( $code, (staticHeader['Content-Type'] = 'text/html', staticHeader) ), rp.end( $v || '' );};
	bs.$class( 'site', function( $fn, bs ){
		var ports, tEnd, f, runRule, defaultRouter, pass, sort;
		ports = {},
		portStart = function( $https, $sites, $port ){
			var rqListener;
			rqListener = function( $rq, $rp ){
				var t0, t1, i, j, k, v;
				t0 = URL.parse( 'http://'+$rq.headers.host+$rq.url ), t1 = t0.hostname, i = 0, j = $sites.length;
				while( i < j ){
					k = $sites[i++], v = $sites[i++];
					if( k == t1 ) v.request( t0, $rq, $rp );
				}
			};
			if( $https )
				HTTPS.createServer( $https, rqListener ).on('error', function($e){console.log($e);}).listen( $port );
			else
				HTTP.createServer( rqListener ).on('error', function($e){console.log($e);}).listen( $port );
			console.log( $port + ' started' );
		},
		f = function( $path ){return f[$path] || ( f[$path] = bs.$file( null, $path ).toString() );},
		tEnd = function( $data ){bs.WEB.response( $data ), bs.WEB.next();},
		runRule = function( $v ){
			switch( typeof $v ){
			case'string':return new Function( 'bs', f( bs.$path( $v ) ) )(bs);
			case'function':return $v();
			case'object':if( $v.splice ) return $v[0][$v[1]]();
			}
		},
		defaultRouter = ['template', '@.html'],
		pass = function(){process.nextTick( next );},
		$fn.constructor = function(){
			var self = this, router, nextstep, onData, file, path, currRule, idx;
			this.form = new form.IncomingForm, this.form.encoding = 'utf-8', this.form.keepExtensions = true;
			this.url = [], this.isStarted = 0, this.retry = 0,
			this.mime = clone( mime ), this.index = 'index',
			this.fileMax = 2 * 1024 * 1024, this.postMax = .5 * 1024 * 1024,
			this.rules = {'':defaultRouter}, this.application = {}, this.db = [],
			this.request = function( $url, $rq, $rp ){
				var t0, i, j;
				rq = $rq, rp = $rp, site = $url.hostname, fileRoot[site] = self.root, getData = bs.$cgiparse( $url.query ), postData = postFile = null, path = $url.pathname.substr(1);
				if( path.indexOf( '..' ) > -1 || path.indexOf( './' ) > -1 ) err( 404, 'no file<br>'+ path );
				else if( !path || path.substr( path.length - 1 ) == '/' ) file = self.index;
				else{
					if( i = path.lastIndexOf( '/' ) + 1 ) file = path.substr( i ), path = path.substring( 0, i );
					else file = path, path = '';
					if( ( i = file.indexOf( '.' ) ) > -1 && file.charAt(0) != '@' ){
						if( t0 = self.mime[file.substr( i + 1 )] ) bs.$stream( bs.$path( path+file ),
								function(){$rp.writeHead( 200, ( staticHeader['Content-Type'] = t0, staticHeader ) ), this.pipe( $rp );},
								function( $e ){err( 404, 'no file<br>'+path+file);}
							);
						else err( 404, 'no file<br>'+path+file);
						return;
					}
				}
				ckParser(), head.length = response.length = 0, data = {}, cookie = {}, application = this.application, this.retry = 1;
				( method = $rq.method ) == 'GET' ? process.nextTick( router ) : form.parse( $rq, onData );
			},
			onData = function( $e, $data, $file ){
				if( $e ) return err( 500, 'post Error' + $e );
				postData = $data, postFile = $file, router();
			},
			router = function(){
				try{
					next = function(){
						var t0, i;
						t0 = self.rulesArr, i = t0.length, next = nextstep;
						while( i-- ) if( path.indexOf( t0[i] ) > -1 ) return currRule = self.rules[t0[i]], idx = 0, next();
						err( 500, '<h1>server error</h1><div>Error: no matched rules '+path+file );
					};
					if( !runRule( self.pageStart ) ) pass();
				}catch($e){
					err( 500, '<h1>server error</h1><div>Error: '+$e+'</div>router' );
				}
			},
			nextstep = function(){
				var t0, i, j;
				if( idx < currRule.length ){
					try{
						i = currRule[idx++], j = currRule[idx++];
						if( typeof j == 'string' ) j = j.replace( '@', file ), j = j.charAt(0) == '/' ? j.substr(1) : ( path + j ), t0 = bs.$path( j );
						switch( i ){
						case'template':self.template( t0, f(t0), data, tEnd ); break;
						case'static':bs.WEB.response( f(t0) ), pass(); break;
						case'script':if( !( new Function( 'bs', f(t0) )(bs) ) ) pass(); break;
						case'require':if( !require( t0 )(bs) ) pass(); break;
						case'function':if( !runRule( j ) ) pass(); break;
						default: pass();
						}
						return;
					}catch($e){
						if( self.retry-- ) head.length = response.length = 0, data = {}, cookie = {}, path = path + file + '/', file = self.index, router();
						else err( 500, '<h1>server error</h1><div>Error: '+$e+'</div>path: '+path+'<br>file: '+file+'<br>rule: '+i+'(idx:'+idx+')<br>target :'+j );
					}
				}else{
					next = bs.WEB.flush;
					if( !runRule( self.pageEnd ) ) pass();
				}
			};
		},
		$fn.router = function(){
			/*			
			bs.site( 'bsplugin' ).router(
				'', [
					'template', '/head.html',
					'script', '@.js',
					'template', '@.html',
					'static','/foot.html'
				],
				'json', ['require', '@']
			);
			*/
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
					case'https':
						v.key = f( bs.$path( v.sslkey, 'root' ) ),
						v.cert = f( bs.$path( v.sslcert, 'root' ) ),
						this.https = v; break;
					case'db': this.db[this.db.length] = v; break;
					case'url':
						v = v.split(':');
						if( this.url.indexOf( v[0] ) == -1 ) this.url.push( v[0], parseInt( v[1] || '8001' ) );
						break;
					case'root':this.root = bs.$path( v, 'root' ); break;
					case'template':case'index':this[k] = v; break;
					case'siteStart':case'pageStart':case'pageEnd':this[k] = typeof v == 'string' ? v + ( v.indexOf('.js') == -1 ? '.js' : '' ) : v; break;
					case'upload':this.upload = bs.$path( v, 'root' ); break;
					case'postMax':case'fileMax':this[k] = v * 1024 * 1024; break;
					default:
						if( k.charAt(0) == '.' ) this.mime[k.substr(1)] = v;
					}
				}
			}
			return this[k];
		},
		sort = function( a, b ){return a.length - b.length;},
		$fn.start = function(){
			var start, t0, self = this;
			this.form.maxFieldsSize = this.postMax;
			if( this.upload ) this.form.uploadDir = this.upload;
			this.rulesArr = [];
			for( k in this.rules ) this.rulesArr[this.rulesArr.length] = k;
			this.rulesArr.sort( sort );
			start = function(){
				var domain, port, i, j
				i = 0, j = self.url.length;
				runRule( self.siteStart );
				while( i < j ){
					domain = self.url[i++], port = self.url[i++];
					if( !ports[port] ) portStart( self.https, ports[port] = [], port );
					if( ports[port].indexOf( domain ) == -1 ) ports[port].push( domain, self );
				}
			};			
			if( this.db.length ) t0 = this.db.slice(0), t0.unshift( start ), bs.$importdbc.apply( null, t0 );
			else start();
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
})( HTTP, HTTPS, URL );
(function(){
	var type, i, db;
	type = 'execute,recordset,stream'.split(','); for( i in type ) type[type[i]] = 1;
	db = {};
	bs.$method( 'importdbc', function( $end ){
		var path, i, j, dbcnext, arg;
		i = 1, j = arguments.length, path = bs.$import.path || bs.PLUGIN_REPO, arg = arguments,
		( dbcnext = function(){i < j ? bs.$js( dbcnext, path + 'dbc_' + arg[i++]+'.js' ) : $end(); } )();
	} ),
	bs.$method( 'registerdbc', function( $name, $obj ){db[$name] = $obj;} ),
	bs.$class( 'sql', function( $fn, bs ){
		var key, i;
		key = 'db,type,query'.split(','); for( i in key ) key[key[i]] = 1;
		$fn.constructor = function(){this.type = 'recordset';},
		$fn.$ = function(){
			var i, j, k, v, t0;
			i = 0, j = arguments.length;
			while( i < j ){
				k = arguments[i++], v = arguments[i++];
				if( k === null ) return this.destroyer();
				if( key[k] ){
					if( v === undefined ) return this[k];
					if( k != 'type' || type[v] ) this[k] = v;
				}
			}
		},
		$fn.run = function(){
			var end, t0, i, j, k;
			t0 = {}, i = 0, j = arguments.length;
			while( i < j ) k = arguments[i++], typeof k == 'function' ? end = k : t0[k] = arguments[i++];
			return bs.db( this.db ).$( this.type, bs.$tmpl( this.query, t0 ), end );
		};
	} ),
	bs.$class( 'db', (function(){
		return function( $fn, bs ){
			$fn.constructor = function( $sel ){
				$sel = $sel.split('@'), this.__db = new db[$sel[1]], $sel = $sel[0];
			},
			$fn.$ = function(){return this.__db.$( arguments );},
			$fn.open = function(){return this.__db.open();},
			$fn.close = function(){return this.__db.close();};
		};
	})() );
})();

};