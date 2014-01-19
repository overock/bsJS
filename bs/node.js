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
	} ),
	bs.$method( 'file', function( $end, $path, $v, $opition ){
		var t0, t1, dir, i, j, k;
		if($v){
			dir = $path.split( t0 = $path.lastIndexOf('\\') == -1 ? '/' : '\\' ), t1 = dir.slice( 0, -1 );
			do t1.pop(); while( !fs.existsSync( t1.join(t0) ) )
			for( i = t1.length, j = dir.length ; i < j ; i++ ){
				k = dir.slice( 0, i ).join(t0);
				if( !fs.existsSync( k ) ) fs.mkdirSync( k );
			}
			if( !$end ) return fs.writeFileSync( $path, $v );
			fs.writeFile( $path, $v, function( $e ){return $end( $e );});
		}else{
			if( !fs.existsSync( $path ) ) return null;
			if( !$end ) return  fs.readFileSync( $path );
			fs.readFile( $path, function( $e, $d ){return $end( $e || $d );});
		}
	} ),
	bs.$method( 'stream', function( $path, $open, $err ){
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
	var form, mime, clone, portStart, staticHeader, err, Upfile, bodyParser,
		currsite, sessionName, id, cookie, clientCookie, ckParser, next, pause,
		head, method, response, application, session, rq, rp, getData, postData, postFile, data;
	mime = require('./mime'), staticHeader = {'Content-Type':0},
	err = function( $code, $v ){rp.writeHead( $code, (staticHeader['Content-Type'] = 'text/html', staticHeader) ), rp.end( $v || '' );},
	clone = function( $v ){
		var t0, k;
		t0 = {};
		for( k in $v )if( $v.hasOwnProperty( k ) ) t0[k] = $v[k];
		return t0;
	},
	clientCookie = null,
	ckParser = function(){
		var t0, t1, i;
		clientCookie = {};
		if( t0 = rq.headers.cookie ){
			t0 = t0.split(';'), i = t0.length;
			while( i-- ) t0[i] = bs.$trim( t0[i].split('=') ), clientCookie[t0[i][0]] = t0[i][1];
		}
	},
	Upfile = function Upfile( $name, $file ){
		this.name = $name,
		this.file = $file;
	},
	Upfile.prototype.save = function( $path ){
		bs.$file( null, $path, this.file );
	},
	bodyParser = function bodyParser( $req, $buf ){
		var i, j, k, t0,
			bboundary, blen, bline, bbuf,
			mkey, mfi, mfn, rawSt, rawEd, ret;

		ret = {
			data:{}, file:{}
		},
		t0 = $req.headers['content-type'],
		bboundary = new Buffer( '--' + t0.substr( t0.lastIndexOf( '=' ) + 1) ),
		i = 0, j = $buf.length;

		while( i < j ){
			if( $buf[i] == bboundary[0] && $buf[i+1] == bboundary[1] ){
				blen = i+bboundary.length,
				t0 = $buf.slice(i, blen);

				if( t0.toString() == bboundary.toString() ){
					rawEd = i - 2;
					if( rawSt ){
						if( mfn )
							bbuf = new Buffer(rawEd - rawSt),
							$buf.copy( bbuf, 0, rawSt, rawEd ),
							ret.file[mkey] = new Upfile( mfn, bbuf );
						else ret.data[mkey] = bs.$unescape( $buf.slice( rawSt, rawEd ).toString() );

						rawSt = 0, mkey = null, mfn = null;
					}

					bline = 0,
					k = i;
					while( k < j ){
						if( $buf[k] === 13 && $buf[k+1] === 10 ){
							bline++;
							if( bline == 2 ){
								t0 = $buf.slice(i, k).toString();
								if( t0.indexOf('filename') > -1 )
									mfi = t0.split( ';' ),
									mkey = mfi[1].substring( mfi[1].indexOf( '"' )+1, mfi[1].lastIndexOf( '"' ) ),
									mfn = mfi[2].substring( mfi[2].indexOf( '"' )+1, mfi[2].lastIndexOf( '"' ) );
								else if( t0.indexOf('name') > -1 )
									mkey = t0.substring( t0.indexOf( '"' )+1, t0.lastIndexOf( '"' ) );
							}else if( bline == 3 ){
								t0 = $buf.slice(i, k).toString();
								if( t0 ) rawSt = k + 4;
								else if( mkey ) rawSt = k + 2;
								break;
							}
							i = k + 2;
						}
						k++;
					}
					i++;
				}else i++;
			}else i++;
		}
		return ret;
	},
	bs.$method( 'ck', (function(){
		return function( $k, $v, $path, $expire, $domain ){
			var t0, t1;
			if( $v === undefined ) return bs.$unescape(clientCookie[$k]||'');
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
	})() ),
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
			pause:function(){pause = 1;},
			next:function(){next();},
			site:function(){return currsite;},
			exit:function( $html ){err( 200, $html );},
			flush:function(){
				var t0, k;
				for(k in cookie) head[head.length] = ['Set-Cookie', cookie[k]];
				head.push( flush[0], flush[1], ( t0 = response.join(''), flush[2][1] = Buffer.byteLength( t0, 'utf8' ), flush[2] ) ),
				rp.writeHead( 200, head ), rp.end( t0 );
			},
			application:function(){
				var i, j, k, v;
				i = 0, j = arguments.length;
				while( i < j ){
					k = arguments[i++], v = arguments[i++];
					if( v === undefined ) return application[k];
					else if( v === null ) delete application[k];
					else application[k] = v;
				}
				return v;
			},
			session:function(){
				var t0, t1, i, j, k, v;
				i = 0, j = arguments.length;
				while( i < j ){
					k = arguments[i++], v = arguments[i++];
					if( v === undefined ) return session ? session[k] : null;
					else if( v === null && session ) delete session[k];
					else{
						if( !session ){
							t0 = currsite.session
							while( t0[t1 = bs.$crypt( 'sha256', ''+bs.$ex( 1000,'~',9999 ) + (id++) + bs.$ex( 1000,'~',9999 ) )] );
							bs.$ck( sessionName, t1 );
							session = t0[t1] = {__t:Date.now()};
						}
						session[k] = v;
					}
				}
				return v;
			},
			head:function( $k, $v ){head[head.length] = [$k, $v];},
			method:function(){return method;},
			request:function( $k ){return $k ? rq[$k] : rq;},
			response:function(){
				var i = 0, j = arguments.length;
				while( i < j ) response[response.length] = arguments[i++];
			},
			get:function( $k ){return getData[$k];},
			post:function( $k ){return postData[$k];},
			file:function( $k ){return postFile[$k];},
			data:function( $k, $v ){return $v === undefined ? data[$k] : data[$k] = $v;},
			redirect:function( $url, $isClient ){
				if( $isClient ) rp.writeHead( 200, {'Content-Type':'text/html; charset=utf-8'} ), rp.end( '<script>location.href="' + $url + '";</script>');
				else rp.writeHead( 301, {Location:$url} ), rp.end();
			}
		};
	})() ),
	bs.$class( 'form', function( $fn, bs ){
		var key, i;
		key = 'encoding,keepExtensions,postMax,fileMax,upload,'.split(',');
		for( i in key ) key[key[i]] = 1;
		$fn.$ = function(){
			var i, j, k, v;
			i = 0, j = arguments.length;
			while( i < j ){
				k = arguments[i++], v = arguments[i++];
				if( key[k] ){
					if( v === undefined ) return this[k];
					else if( v === null ) delete this[k];
					else this[k] = v;
				}
			}
		},
		$fn.parse = function( $end ){
			var t0 = new Buffer(''), self = this;
			rq.on( 'data', function( $v ){
				t0 = Buffer.concat([t0, $v]);
				//t0 += $v;
				if( t0.length > self.postMax ) t0 = null, this.pause(), err( 413, 'too large post' );
			} ).on( 'end', function(){
				var type;
				if( t0 === null ) return rp.end();
				type = rq.headers['content-type'];
				if( type.indexOf( 'x-www-form-urlencoded' ) > -1 ){
					postData = bs.$cgiparse( t0.toString() );
					postFile = null, $end();
				}else if( type.indexOf( 'multipart' ) > -1 ){
					t0 = bodyParser(rq, t0),
					postData = t0.data,
					postFile = t0.file;
					/*postFile.ffile.save('/__app/test/c'+postFile.ffile.name);
					postFile.ff2.save('/__app/test/c'+postFile.ff2.name);*/
					console.log(postData), console.log(postFile);
					$end();
				}
			} );
		};
	} ),
	bs.$class( 'site', function( $fn, bs ){
		var ports, tEnd, f, runRule, defaultRouter, pass, cache, defaultTmpl;
		ports = {},
		portStart = function( $https, $sites, $port ){
			var rqListener;
			rqListener = function( $rq, $rp ){
				var t0, t1, t2, i, j, k, v;
				t0 = URL.parse( 'http://'+$rq.headers.host+$rq.url ), t1 = t0.hostname, i = 0, j = $sites.length;
				while( i < j ){
					k = $sites[i++], v = $sites[i++];
					if( k == t1 ) currsite = v, fileRoot[site = t0.hostname] = v.root, cache = v.cache, pause = 0,
						rq = $rq, rp = $rp, application = v.application, v.request( t0, $rq, $rp );
				}
			};
			HTTP.createServer( rqListener ).on('error', function($e){console.log($e);}).listen( $port );
			console.log( 'http:' + $port + ' started' );
			if( $https ){
				HTTPS.createServer( $https, rqListener ).on('error', function($e){console.log($e);}).listen( $https.port );
				console.log( 'https:' + $https.port + ' started' );
			}
			
		},
		f = function( $path ){
			if( cache ) return f[$path] || ( f[$path] = bs.$file( null, $path ).toString() );
			return bs.$file( null, $path ).toString();
		},
		tEnd = function( $data ){bs.WEB.response( $data ), bs.WEB.next();},
		runRule = function( $v ){
			switch( typeof $v ){
			case'string':return new Function( 'bs', f( bs.$path( $v ) ) )(bs);
			case'function':return $v();
			case'object':if( $v.splice ) return $v[0][$v[1]]();
			}
		},
		defaultRouter = ['template', '@.html'],
		pass = function(){pause = 0, process.nextTick( next );},
		defaultTmpl = function( $url, $template, $data, $end ){bs.$jpage( $template, $data, null, $end, this.cache ? $url : 0 );},
		$fn.start = function(){
			var start, t0, self = this, k;
			this.rulesArr = [];
			for( k in this.rules ) this.rulesArr[this.rulesArr.length] = k;
			this.rulesArr.sort( function( a, b ){return a.length - b.length;} );
			start = function(){
				var domain, port, i, j, https;
				if( self.https ){
					https = {},
					https.key = f( bs.$path( self.https.key, self.root ) ),
					https.cert = f( bs.$path( self.https.cert, self.root ) );
					https.port = self.https.port || 443;
				}
				currsite = self, fileRoot[site = self.__k] = self.root, cache = self.cache, application = self.application, pause = 0,
				i = 0, j = self.url.length;
				next = function(){
					next = null, self.isStarted = 0;
					while( i < j ){
						domain = self.url[i++], port = self.url[i++];
						if( !ports[port] ) portStart( https, ports[port] = [], port );
						if( ports[port].indexOf( domain ) == -1 ) ports[port].push( domain, self );
					}
				},
				runRule( self.siteStart );
				if( !pause ) pass();
			};			
			if( this.db.length ) t0 = this.db.slice(0), t0.unshift( start ), bs.$importdbc.apply( null, t0 );
			else start();
		},
		$fn.index = 'index', $fn.cache = 1, $fn.sessionTime = 1000 * 60 * 20,
		$fn.$constructor = function( $sel ){
			var self = this, router, nextstep, onData, file, path, currRule, idx;
			this.form = bs.form( $sel ),
			this.form.$( 'encoding', 'utf-8', 'keepExtensions', 1, 'fileMax', 2 * 1024 * 1024, 'postMax', 5 * 1024 * 1024 ),
			this.url = [], this.isStarted = 0,
			this.mime = clone( mime ), this.template = defaultTmpl,
			this.rules = {'':defaultRouter}, this.application = {}, this.session = {}, this.db = [],
			this.request = function( $url, $rq, $rp ){
				var t0, i, j;
				path = $url.pathname.substr(1);
				if( path.indexOf( '..' ) > -1 || path.indexOf( './' ) > -1 ) err( 404, 'no file<br>'+ path );
				else if( !path || path.substr( path.length - 1 ) == '/' ) file = self.index;
				else{
					( i = path.lastIndexOf( '/' ) + 1 ) ? ( file=path.substr(i), path=path.substring(0,i) ) : ( file=path, path='' );
					if( ( i = file.lastIndexOf( '.' ) ) > -1 && file.charAt(0) != '@' ) return ( t0 = self.mime[file.substr( i + 1 )] ) ? 
						bs.$stream( bs.$path( path+file ),
							function(){$rp.writeHead( 200, ( staticHeader['Content-Type'] = t0, staticHeader ) ), this.pipe( $rp );},
							function( $e ){err( 404, 'no file<br>'+path+file);}
						) : err( 404, 'no file<br>'+path+file);
				}
				head.length = response.length = 0, this.retry = 1,
				getData = bs.$cgiparse( $url.query ), ckParser(), data = {}, cookie = {};
				if( session = self.session[t0 = bs.$ck(sessionName)] ){
					session.__t - Date.now() > self.sessionTime ? ( delete self.session[t0], session = null ) : ( session.__t = Date.now() );
				}
				( method = $rq.method ) == 'GET' ? ( postData = postFile = null, process.nextTick( router ) ) : this.form.parse( router );
			},
			router = function(){
				try{
					next = function(){
						var t0, i;
						t0 = self.rulesArr, i = t0.length, next = nextstep;
						while( i-- )if( path.indexOf( t0[i] ) > -1 ) return currRule = self.rules[t0[i]], idx = 0, next();
						err( 500, '<h1>server error</h1><div>Error: no matched rules '+path+file );
					};
					runRule( self.pageStart );
					if( !pause ) pass();
				}catch($e){
					err( 500, '<h1>server error</h1><div>Error: '+$e+'</div>router' );
				}
			},
			nextstep = function(){
				var t0, i, j;
				if( idx < currRule.length ){
					//try{
						i = currRule[idx++], j = currRule[idx++];
						if( typeof j == 'string' ) j = j.replace( '@', '@'+file ), j = j.charAt(0) == '/' ? j.substr(1) : ( path + j ), t0 = bs.$path( j );
						switch( i ){
						case'template':self.template( t0, f(t0), null, tEnd ); break;
						case'static':bs.WEB.response( f(t0) ); break;
						case'script':new Function( 'bs', f(t0) )(bs); break;
						case'require':require( t0 )(bs); break;
						case'function':runRule( j ); break;
						default: pass();
						}
						if( !pause ) pass();
					/*}catch($e){
						console.log( t0,'::', $e );
						if( self.retry-- ) head.length = response.length = 0, data = {}, cookie = {}, path = path + file + '/', file = self.index, router();
						else err( 500, '<h1>server error</h1><div>Error: '+$e+'</div>path: '+path+'<br>file: '+file+'<br>rule: '+i+'(idx:'+idx+')<br>target :'+j );
					}*/
				}else{
					next = bs.WEB.flush;
					runRule( self.pageEnd );
					if( !pause ) pass();
				}
			};
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
					case'https':this.https = v; break;
					case'db': this.db[this.db.length] = v; break;
					case'url':
						v = bs.$trim( v.split(':') );
						if( this.url.indexOf( v[0] ) == -1 ) this.url.push( v[0], parseInt( v[1] || '8001' ) );
						break;
					case'cache':this.cache = v; break;
					case'root':this.root = bs.$path( v, 'root' ); break;
					case'sessionTime':case'template':case'index':this[k] = v; break;
					case'siteStart':case'pageStart':case'pageEnd':this[k] = typeof v == 'string' ? v + ( v.indexOf('.js') == -1 ? '.js' : '' ) : v; break;
					case'upload':this.form.$( k, v ); break;
					case'postMax':case'fileMax':this.form.$( k, v * 1024 * 1024 ); break;
					default:if( k.charAt(0) == '.' ) this.mime[k.substr(1)] = v;
					}
				}
			}
			return this[k];
		},
		$fn.router = (function(){
			var key, i;
			key = 'template,static,script,require,function'.split(','), i = key.length;
			while( i--) key[key[i]] = 1;
			return function(){
				var i, j, k, v, m, n;
				i = 0, j = arguments.length;
				while( i < j ){
					k = arguments[i++], v = arguments[i++];
					if( v === null ) delete this.rules[k];
					else if( v !== undefined ){
						if( v.splice ){
							for( m = 0, n = v.length ; m < n ; m += 2 ) if( !key[v[m]] ) return bs.$error( 'invalid router type:'+v[m] );
							this.rules[k] = v;
						}else bs.$error( 'invalid router:'+v );
					}
				}
				return v;
			};
		})(),
		$fn.stop = function(){
			var domain, port, i, j;
			i = 0, j = this.url.length;
			while( i < j ){
				domain = this.url[i++], port = this.url[i++];
				if( ports[port] && ( k = ports[port].indexOf( domain ) ) > -1 ) ports[port].splice( k, 2 );
			}
		};
	} );
})( HTTP, HTTPS, URL );
(function(){
	var type, i, db;
	type = 'execute,recordset,stream,transation'.split(','); for( i in type ) type[type[i]] = 1;
	db = {};
	bs.$method( 'importdbc', function( $end ){
		var path, i, j, k, dbcnext, arg;
		i = 1, j = arguments.length, path = bs.$import.path || bs.PLUGIN_REPO, arg = arguments,
		( dbcnext = function(){
			if( i < j ) k = arg[i++], !db[k] ? bs.$js( dbcnext, path + 'dbc_' + k+'.js' ) : dbcnext(); else $end();
		} )();
	} ),
	bs.$method( 'registerdbc', function( $name, $obj ){
		$obj.require = require( $obj.require ),
		db[$name] = $obj;
	}),
	bs.$class( 'sql', function( $fn, bs ){
		var key, i, toDB, r0, r1;
		key = 'db,type,query'.split(','); for( i in key ) key[key[i]] = 1;
		$fn.$constructor = function(){this.type = 'recordset';},
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
		r0 = /[']/g, r1 = /--/g,
		toDB = function( $v ){
			return typeof $v == 'string' ? $v.replace( r0, "''" ).replace( r1, '' ) : $v;
		},
		$fn.run = function( $end ){
			var end, t0, t1, i, j, k;
			t0 = {}, i = 1, j = arguments.length;
			while( i < j ) t0[k = arguments[i++]] = toDB( arguments[i++] );
			if( i = this.query.splice ){
				this.type = 'transaction';
				t1 = this.query.slice(0);
				while( i-- ) t1[i] = bs.$tmpl( t1[i], t0 );
				t0 = t1;
			}else t0 = bs.$tmpl( this.query, t0 );
			console.log( t0 );
			return bs.db( this.db )[this.type]( t0, $end );
		};
	} ),
	bs.$class( 'db', (function(){
		return function( $fn, bs ){
			$fn.$constructor = function( $sel ){
				$sel = $sel.split('@');
				if( !db[$sel[1]] ) return bs.$error( 'no db connector for ' + $sel[1] );
				this.__db = new db[$sel[1]](), $sel = $sel[0];
			},
			$fn.$ = function(){return this.__db.$( arguments );},
			$fn.open = function(){return this.__db.open();},
			$fn.close = function(){return this.__db.close();};
			$fn.execute = function( $query ){return this.__db.execute( $query );},
			$fn.recordset = function( $query, $end ){this.__db.recordset( $query, $end );},
			$fn.stream = function( $query, $end ){this.__db.stream( $query, $end );};
			$fn.transation = function( $query, $end ){this.__db.transation( $query, $end );};
		};
	})() );
})();
	
};