module.exports = function(bs){
var HTTP = require('http'), HTTPS = require('https'), URL = require('url'), fn = bs.fn, FS_ROOTS = {root:bs.root()}, none = function(){};
(function( HTTP, URL, FS_ROOTS ){ //core
	var os = require('os'), query = require('querystring'), crypto = require('crypto'), fs = require('fs'), p = require('path'),
		http, mk;
	fn( 'site', (function(){
		var I, fn;
		bs.__SITE = {},
		fn = ( I = function(){} ).prototype,
		fn.NEW = fn.init = fn.S = fn.start = fn.request = fn.route = fn.flush = none;
		return function( name, f ){
			var cls, fn, t0, k;
			f( t0 = {}, bs ), 
			cls = function(){this.NEW();},
			fn = cls.prototype = new I;
			for( k in t0 ) if( t0.hasOwnProperty(k) ) fn[k] = t0[k];
			bs.__SITE[name] = cls;
		};
	})() ),
	fn( 'db', (function(){
		var I, fn;
		bs.__DB = {},
		fn = ( I = function(){} ).prototype,
		fn.S = fn.execute = fn.recordset = fn.stream = fn.transation = fn.open = fn.close = none;
		return function( name, f ){
			var cls, fn, t0, k;
			f( t0 = {}, bs ),
			cls = function(){},
			fn = cls.prototype = new I;
			for( k in t0 ) if( t0.hasOwnProperty(k) ){
				if( k == 'require' ) fn[k] = require(t0[k]);
				else fn[k] = t0[k];
			}
			bs.__DB[name] = cls;
		};
	})() ),
	fn( 'os', function(k){return os[k]();} ),
	fn( 'escape', function(v){return query.escape(v);} ),
	fn( 'unescape', function(v){return query.unescape(v);} ),
	fn( 'qparse', function(v){return query.parse(v);} ),
	fn( 'qstringify', function(v){return query.stringify(v);} ),
	fn( 'crypt', function( type, v ){
		var t0;
		switch(type){
		case'sha256': return t0 = crypto.createHash('sha256'), t0.update(v), t0.digest('hex');
		}
	} ),
	fn( 'db2html', (function(){
		var r0 = /[<]/g, r1 = /\n|\r\n|\r/g;
		return function(str){return str.replace( r0, '&lt;' ).replace( r1, '<br/>' );};
	})() ),
	fn( 'path', function( path, context ){
		if( path.substr(0,5) == 'http:' || path.substr(0,5) == 'https:' ) return path;
		return p.resolve( FS_ROOTS[context || bs.SITE.__k], path );
	} ),
	fn( 'file', function( end, path, v ){
		var t0, t1, dir, i, j, k;
		if( v ){
			dir = path.split( t0 = path.lastIndexOf('\\') == -1 ? '/' : '\\' ), t1 = dir.slice( 0, -1 );
			do t1.pop(); while( !fs.existsSync(t1.join(t0)) )
			for( i = t1.length, j = dir.length ; i < j ; i++ ){
				k = dir.slice( 0, i ).join(t0);
				if( !fs.existsSync(k) ) fs.mkdirSync(k);
			}
			if( !end ) return fs.writeFileSync( path, v );
			fs.writeFile( path, v, function(e){return end( e ? null : 1, e );} );
		}else{
			if( !fs.existsSync(path) ) return null;
			if( !end ) return fs.readFileSync(path);
			fs.readFile( path, function( e, d ){return end( d || null, e );});
		}
	} ),
	fn( 'stream', function( path, open, e ){
		var t0;
		if( !fs.existsSync(path) ){
			if( e ) e();
			return null;
		}
		t0 = fs.createReadStream(path);
		if( open ) t0.once( 'open', open );
		if( e ) t0.once( 'error', e );
		return t0;
	} ),
	fn( 'js', (function(){
		var id = 0, c = bs.__callback = {}, js = function( data, load, end ){
			var t0, i;
			if( load ){
				if( data.charAt( data.length - 1 )=='=' ) data += 'bs.__callback.' + ( i = 'c' + (id++) ), c[i] = function(){delete c[i], end.apply( null, arguments );};
				bs.get( function(v){
					var t0;
					if( v.indexOf('module.exports') > -1 || v.indexOf('exports') > -1 ) end( ( t0 = new module.constructor, t0.paths = module.paths, t0._compile(v), t0.exports ) );
					else try{new Function( 'bs', v )( bs );}catch(e){bs.err( 0, e.toString() );}
					load();
				}, data );
			}else if( data.indexOf('module.exports') > -1 || data.indexOf('exports') > -1 ) end( ( t0 = new module.constructor, t0.paths = module.paths, t0._compile(data), t0.exports ) );
			else try{new Function( 'bs', data )( bs );}catch(e){bs.err( 0, e );}
		};
		return function(end){
			var i, j, arg, load;
			arg = arguments, i = 1, j = arg.length;
			if( end ) ( load = function(){i < j ? js( bs.path(arg[i++]), load, end ) : end();} )();
			else while( i < j ) js(bs.file( null, bs.path(arg[i++]) ));
		};
	})() ),
	http = (function(){
		var op = {}, maxSize = 2 * 1024 * 1024, h = bs.param.header, head = function(){
			var t0 = {}, i = 0, j = h.length;
			while( i < j ) t0[h[i++]] = h[i++];
			return t0;
		};
		return function( type, end, url, arg ){
			var t0, t1, response;
			if( url.substr( 0, 5 ) == 'http:' || url.substr( 0, 6 ) == 'https:' ){
				if( !end ) return bs.err( 0, 'http need callback!' ), null;
				response = function(rs){
					var t0 = '';
					rs.on( 'data', function(v){
						t0 += v;
						if( t0.length > maxSize ) this.pause(), rs.writeHead(413), rs.end('Too Large'), end( null, 'Too Large' );
					} ).on( 'end', function(){
						if( !t0 ) rs.end(), end( null, 'No data' );
						else end( t0, rs );
					} );
				},
				t0 = URL.parse(url), op.hostname = t0.hostname, op.method = type, op.port = t0.port, op.path = t0.path, op.headers = head(h),
				op.headers['Content-Type'] = ( type == 'GET' ? 'text/plain' : 'application/x-www-form-urlencoded' ) + '; charset=UTF-8',
				op.headers['Content-Length'] = type == 'GET' ? 0 : Buffer.byteLength( t1 = bs.param(arg) ),
				( t0 = HTTP.request( op, response ) ).on( 'error', function(e){end( null, e );} );
				if( type != 'GET' ) t0.write(t1);
				t0.end();
			}else return bs.file( end && function(v){return v.toString();}, bs.path(url.split('?')[0]) ).toString();
		};
	})(),
	mk = function(m){return function( end, url ){return http( m, end, bs.url(url), arguments );};},
	fn( 'get', function( end, path ){return http( 'GET', end, bs.url( path, arguments ) );} ),
	fn( 'post', mk('POST') ), fn( 'put', mk('PUT') ), fn( 'delete', mk('DELETE') ),
	fn( 'ck', function( k, v, expire, path ){return bs.SITE._( 'cookie', k, v, expire, path );} ),
	fn( 'session', (function(){
		var arg = arguments;
		arg[0] = 'session';
		return function(){
			var i, j;
			i = 0, j = arguments.length, arg.length = j + 1;
			while( i < j ) arg[i+1] = arguments[i];
			return bs.SITE._.apply( bs.SITE, arg );
		}
	})() );
})( HTTP, URL, FS_ROOTS ),
(function(){ //db
	var type, i;
	type = 'execute,recordset,stream,transation'.split(','); for( i in type ) type[type[i]] = 1;
	bs.cls( 'Db', function( fn, bs ){
		fn.NEW = function( sel, type ){
			if( !bs.__DB[type] ) return bs.err( 0, 'no db connector for ' + type );
			this.__db = new bs.__DB[type]();
		},
		fn.S = function(){return this.__db.S( arguments );},
		fn.open = function(){return this.__db.open();},
		fn.close = function(){return this.__db.close();};
		fn.execute = function(q){return this.__db.execute(q);},
		fn.recordset = function( q, end ){this.__db.recordset( q, end );},
		fn.stream = function( q, end ){this.__db.stream( q, end );};
		fn.transation = function( q, end ){this.__db.transation( q, end );};
	} ),
	bs.cls( 'Sql', function( fn, bs ){
		var key, i, r0 = /[']/g, r1 = /--/g, toDB = function(v){return typeof v == 'string' ? v.replace( r0, "''" ).replace( r1, '' ) : v;};
		key = 'db,type,query'.split(','); for( i in key ) key[key[i]] = 1;
		fn.NEW = function(){this.type = 'recordset';},
		fn.S = function(){
			var i, j, k, v, t0;
			i = 0, j = arguments.length;
			while( i < j ){
				k = arguments[i++], v = arguments[i++];
				if( k === null ) return this.END();
				if( key[k] ){
					if( v === undefined ) return this[k];
					if( k != 'type' || type[v] ) this[k] = v;
				}else return bs.err( 0, 'undefined key ' + k );
			}
		},
		fn.run = function(end){
			var t0, t1, i, j, k;
			t0 = {}, i = 1, j = arguments.length;
			while( i < j ) t0[k = arguments[i++]] = toDB(arguments[i++]);
			if( i = this.query.splice ){
				this.type = 'transaction';
				t1 = this.query.slice(0);
				while( i-- ) t1[i] = bs.tmpl( t1[i], t0 );
				t0 = t1;
			}else t0 = bs.tmpl( this.query, t0 );
			console.log( t0, this.type );
			return bs.Db(this.db)[this.type]( t0, end );
		},
		fn['@load'] = function(path){
			var t0, t1, db, k;
			try{
				t0 = JSON.parse(bs.file( null, bs.path(path)).toString());
				for( db in t0 ) for( k in t0[db] ) bs.Sql(k).S( 'db', db, 'query', t0[db][k].splice ? t0[db][k].join('') : t0[db][k] );
			}catch(e){
				bs.err( 0, e.toString() );
			}
		};
	} );
})(),
(function( HTTP, HTTPS, URL ){
	var mime = require('./mime'), staticHeader = {'Content-Type':0},
	err = function( code, v ){bs.SITE._rp.writeHead( code, (staticHeader['Content-Type'] = 'text/html', staticHeader) ), bs.SITE._rp.end( v || '' );},
	fs = function(path){
		if( bs.SITE.cache ) return fs[path] || ( fs[path] = bs.file( null, path ).toString() );
		return bs.file( null, path ).toString();
	},
	runRule = function( v, site ){
		if( site ) site._pause = 0;
		switch( typeof v ){
		case'string':new Function( 'bs', fs(bs.path(v)) )(bs); break;
		case'function':v(); break;
		case'object':if( v.splice ) return v[0][v[1]]();
		}
		if( site ) site.go();
	};
	bs.cls( 'Site', function( fn, bs ){
		var slice = Array.prototype.slice, 
		listen = function( https, sites, port ){
			var f = function( rq, rp ){
				var t0, t1, t2, i, j, k, v;
				t0 = URL.parse( 'http://' + rq.headers.host + rq.url ), t1 = t0.hostname, i = 0, j = sites.length;
				while( i < j ){
					k = sites[i++], v = sites[i++];
					if( k == t1 ) v.onRequest( t0, rq, rp );
				}
			};
			HTTP.createServer(f).on('error', function(e){bs.err( 0, e );}).listen(port);
			console.log( 'http:' + port + ' started' );
			if( https ){
				HTTPS.createServer( https, f ).on('error', function(e){bs.err(e);}).listen(https.port);
				console.log( 'https:' + https.port + ' started' );
			}
		},
		flush = {
			0:['Server', 'projectBS on node.js'],
			1:['Content-Type', 'text/html; charset=utf-8'],
			2:['Content-Length', 0]
		};
		fn.isStarted = 0, fn.index = 'index', fn._cache = 1,
		fn.NEW = function(sel){
			var k;
			this._urls = [], this._module = [], this.startModule = [], this.requestModule = [], this.methodModule = [], this.routerModule = [], this.flushModule = [];
			this._application = {}, this._head = [], this._response = [], this.mime = {};
			for( k in mime ) if( mime.hasOwnProperty(k) ) this.mime[k] = mime[k];
		},
		fn.S = function(){
			var t0, i, j, k, v;
			i = 0, j = arguments.length;
			while( i < j ){
				k = arguments[i++], v = arguments[i++];
				if( k === null ){
					if( this.isStarted ) this.stop();
					this.END();
					return null;
				}else if( v !== undefined ){
					switch( k ){
					case'url':v.indexOf(':') == -1 ? this._urls.push( bs.trim(v), 8001 ) : ( v = bs.trim(v.split(':')), this._urls.push( v[0], parseInt(v[1]) ) ); break;
					case'siteStart':case'pageStart':case'pageEnd':this['_' + k] = typeof v == 'string' ? v + ( v.indexOf('.js') == -1 ? '.js' : '' ) : v; break;
					case'root':FS_ROOTS[this.__k] = this._root = bs.path( v, 'root' ); break;
					case'https':case'cache':this['_' + k] = v; break;
					default:if( k.charAt(0) == '@' ) this.mime[k.substr(1)] = v;
					}
				}
			}
		},
		fn.start = function(){
			var self = this, start, t0, t1, i, j;
			start = function(){
				var t0 = self._module, t1, t2, i, j;
				bs.SITE = self;
				for( i = 0, j = t0.length ; i < j ; i++ ){
					t1 = t0[i];
					if( bs.__SITE[t1[0]] ){
						t0[t1[0]] = t2 = new bs.__SITE[t1[0]], t2.site = self;
						if( t1.length > 2 ) t2.init( slice.call( t1, 2 ) );
						if( t2.start !== none ) self.startModule[self.startModule.length] = t2;
						if( t2.request !== none ) self.requestModule[self.requestModule.length] = t2;
						if( t2.route !== none ) self.routerModule[self.routerModule.length] = t2;
						if( t2.flush !== none ) self.flushModule[self.flushModule.length] = t2;
					}
				}
				for( t0 = self.startModule, i = 0, j = t0.length ; i < j ; i++ ) t0[i].start();
				self.next( function(){
					var https, domain, port, i, j;
					if( self._https ) https = {
						key:fs(bs.path( self._https.key)),
						cert:fs(bs.path( self._https.cert)),
						port:self._https.port || 443
					};
					self.isStarted = 1, i = 0, j = self._urls.length;
					while( i < j ){
						domain = self._urls[i++], port = self._urls[i++];
						if( !listen[port] ) listen( https, listen[port] = [], port );
						if( listen[port].indexOf(domain) == -1 ) listen[port].push( domain, self );
					}
				} );
				runRule( self._siteStart, self );
			};
			this.onRequestNext = function(){for( var t0 = self.routerModule, i = 0, j = t0.length ; i < j ; i++ ) t0[i].route();},
			this.onRequestModule = function(){
				if( self.rqIdx == self.rqLen ) self.onRequestNext();
				else{
					self._pause = 0;
					self.requestModule[self.rqIdx++].request( self._url, self._rq, self._rp, self._path, self._file, self.mime );
					self.go();
				}
			}
			t0 = this._module;
			if( t0 && ( j = t0.length ) ){
				for( i = 0, t1 = [start] ; i < j ; i++ ) if( !bs.__SITE[t0[i][0]] ) t1.push( t0[i][0], t0[i][1] );
				if( t1.length > 1 ) return bs.plugin.apply( null, t1 );
			}
			start();
		},
		fn.onRequest = function( url, rq, rp ){
			var self = this, t0, t1, i, j, k;
			//path
			t0 = this._path = url.pathname.substr(1), this._file = '';
			if( t0.indexOf( '..' ) > -1 || t0.indexOf( './' ) > -1 ) return err( 404, 'no file<br>'+ t0 );
			if( !t0 || t0.substr( t0.length - 1 ) == '/' ) this._file = this.index;
			else if( i = t0.lastIndexOf( '/' ) + 1 ) this._file = t0.substr(i), this._path = t0.substring( 0, i );
			else this._file = t0, this._path = '';
			//init
			this._url = url, this._rq = rq, this._rp = rp, this._method = rq.method,
			this._get = bs.qparse(url.query), this._post = this._upload = null, this._data = {},
			this._head.length = this._response.length = this._flushed = this._pause = 0,
			//request module
			this.rqIdx = 0, this.rqLen = this.requestModule.length, this.next(this.onRequestModule), this.go();
		};
		fn.flush = function(){
			var self = bs.SITE, t0, i, j, k;
			if( self._flushed ) return;
			self._flushed = 1;
			for( t0 = self.flushModule, i = 0, j = t0.length ; i < j ; i++ ) t0[i].flush( self._head, self._response );
			self._head.push( flush[0], flush[1], ( t0 = self._response.join(''), flush[2][1] = Buffer.byteLength( t0, 'utf8' ), flush[2] ) ),
			self._rp.writeHead( 200, self._head ), self._rp.end(t0);
		},
		fn.stop = function(){
			var domain, port, i, j;
			i = 0, j = this.url.length;
			while( i < j ){
				domain = this.url[i++], port = this.url[i++];
				if( listen[port] && ( k = listen[port].indexOf(domain) ) > -1 ) listen[port].splice( k, 2 );
			}
		},
		fn.plugin = function( name, ver/*,init args*/ ){
			if( this._module[name] ) bs.err( 0 );
			this._module.push( arguments ), this._module[name] = 1;
		},
		//bs.SITE method
		fn.next = function(f){this._next = f;},
		fn.pause = function(){this._pause = 1;},
		fn.pass = function(){this._pause = 0, process.nextTick(this._next);},
		fn.go = function(){if( !this._pause ) this.pass();},
		fn.exit = function(html){this._pause = 1, err( 200, html );},
		fn.application = function(){
			var i, j, k, v;
			i = 0, j = arguments.length;
			while( i < j ){
				k = arguments[i++], v = arguments[i++];
				if( v === undefined ) return this._application[k];
				else if( v === null ) delete this._application[k];
				else this._application[k] = v;
			}
			return v;
		},
		fn.head = function( k, v ){this._head[this._head.length] = [k, v];},
		fn.method = function(){return this._method;},
		fn.request = function(k){return this._rq[k]},
		fn.requestHeader = function(k){return this._rq.headers[k];},
		fn.response = function(){
			var i = 0, j = arguments.length;
			while( i < j ) this._response[this._response.length] = arguments[i++];
		},
		fn.url = function(){return this._url;},
		fn.path = function(){return this._path;},
		fn.file = function(){return this._file;},
		fn.get = function(k){return this._get[k];},
		fn.post = function(k){return this._post[k];},
		fn.upload = function(k){return this._upload[k];},
		fn.data = function( k, v ){return v === undefined ? this._data[k] : ( this._data[k] = v );},
		fn.redirect = function( url, isClient ){
			this.pause();
			if( isClient ) this._rp.writeHead( 200, {'Content-Type':'text/html; charset=utf-8'} ), this._rp.end( '<script>location.href="' + url + '";</script>');
			else this._rp.writeHead( 301, {Location:url} ), this._rp.end();
		},
		fn._ = function(name){
			var t0;
			if( !( t0 = this._module[name] ) ) return bs.err(0);
			return t0.S(arguments); 
		};
	} ),
	bs.site( 'static', function( fn, bs ){
		fn.NEW = function(){
			this.cache = [];
		},
		fn.init = function(arg){
			for( var i = 0, j = arg.length ; i < j ; i++ ) this.cache[this.cache.length] = arg[i];
		},
		fn.request = function( url, rq, rp, path, file, mime ){
			var i;
			if( ( i = file.lastIndexOf( '.' ) ) > -1 && file.charAt(0) != '@' ){
				this.site.pause();
				return ( t0 = mime[file.substr( i + 1 )] ) ? 
					bs.stream( bs.path( path + file ),
						function(){rp.writeHead( 200, ( staticHeader['Content-Type'] = t0, staticHeader ) ), this.pipe(rp);},
						function(e){err( 404, 'no file<br>' + path + file );}
					) : err( 404, 'no file<br>' + path + file );
			}
		};
	} ),
	bs.site( 'cookie', function( fn, bs ){
		fn.request = function( url, rq, rp ){
			var t0, i;
			this.server = {}, this.client = {};
			if( t0 = rq.headers.cookie ){
				t0 = t0.split(';'), i = t0.length;
				while( i-- ) t0[i] = bs.trim(t0[i].split('=')), this.client[t0[i][0]] = t0[i][1];
			}
		},
		fn.flush = function( head, response ){
			var k;
			for( k in this.server ) head[head.length] = ['Set-Cookie', this.server[k]];
		},
		fn.S = function(arg){
			var k = arg[1], v = arg[2], expire = arg[3], path = arg[4], t0, t1;
			if( v === undefined ) return bs.unescape( this.client[k] || '' );
			if( k.charAt(0) == '@' ) t0 = 1, k = k.substr(1);
			t0 = k + '=' + ( bs.escape(v) || '' ) + 
				';Path=' + ( path || '/' ) + 
				( t0 ? ';HttpOnly' : '' ); 
			if( v === null ) ( t1 = new Date ).setTime( t1.getTime() - 86400000 ),
				t0 += ';expires=' + t1.toUTCString() + ';Max-Age=0';
			else if( expire ) (t1 = new Date).setTime( t1.getTime() + expire * 86400000 ),
				t0 += ';expires=' + t1.toUTCString() + ';Max-Age=' + ( expire * 86400 );
			return this.server[k] = t0;
		};
	} ),
	bs.site( 'session', function( fn, bs ){
		var KEY = '__bsNode', id = 0;
		fn.time = 60000 * 20;
		fn.init = function(arg){
			var i, j;
			while( i < j ){
				k = arg[i++], v = arg[i++];
				if( k == 'time' ) this.time = v * 60000;
			}
		},
		fn.request = function( url, rq, rp ){
			var t0;
			if( this.curr = this[t0 = this.site._( 'cookie', KEY )] ) Date.now() - this.curr.__t > this.time ? ( delete this[t0], this.curr = null ) : ( this.curr.__t = Date.now() );
		},
		fn.S = function(arg){
			var i, j, k, v;
			i = 1, j = arg.length;
			while( i < j ){
				k = arg[i++], v = arg[i++];
				if( k == 'time' ) this.time = v * 60000;
				else if( v === undefined ) return this.curr ? this.curr[k] : null;
				else if( v === null && this.curr ) delete this.curr[k];
				else{
					if( !this.curr ){
						while( this[t1 = bs.crypt( 'sha256', '' + bs.rand( 1000, 9999 ) + (id++) + bs.rand( 1000, 9999 ) )] );
						bs.ck( KEY, t1 );
						this.curr = this[t1] = {__t:Date.now()};
					}
					this.curr[k] = v;
				}
			}
		};
	} ),
	bs.site( 'router', function( fn, bs ){
		var defaultRule, key, i;
		key = 'template,static,script,require,function'.split(','), i = key.length;
		while( i--) key[key[i]] = 1;
		defaultRule = ['template', '@.html'],
		fn.NEW = function(){
			this.rules = {'':defaultRule};
		},
		fn.init = function(arg){
			var self = this, site = this.site, i, j, k, v, m, n;
			i = 0, j = arg.length;
			while( i < j ){
				k = arg[i++], v = arg[i++];
				if( k == 'template' ) this.template = v;
				else if( v.splice ){
					for( m = 0, n = v.length ; m < n ; m += 2 ) if( !key[v[m]] ) return bs.err( 0, 'invalid router type:' + v[m] );
					this.rules[k] = v;
				}else bs.err( 0, 'invalid router:' + v );
			}
			this.onRoute = function(){
				var t0, i;
				site.next(self.onRouteNext), t0 = self.rulesArr, i = t0.length;
				while( i-- )if( site._path.indexOf(t0[i]) > -1 ) return self.currRule = self.rules[t0[i]], self.idx = 0, site.pass();
				err( 500, '<h1>server error</h1><div>Error: no matched rules ' + site._path + site._file );
			},
			this.onRouteNext = function(){
				var t0, t1, i, j, r0, k, l;
				if( self.idx < self.currRule.length ){
					//try{
						i = self.currRule[self.idx++], j = self.currRule[self.idx++];
						if( typeof j == 'string' ) j = j.replace( '@', '@' + site._file ), j = j.charAt(0) == '/' ? j.substr(1) : ( site._path + j ), t0 = bs.path(j);
						site._pause = 0;
						switch(i){
						case'template':self.template( site, t0, fs(t0) ); break;
						case'static':site.response(fs(t0)); break;
						case'script':new Function( 'bs', fs(t0) )(bs); break;
						case'require':require(t0)(bs); break;
						case'function':runRule(j); break;
						default: self.pass();
						}
						site.go();
						/*
					}catch(e){
						if( site._file != site.index ) site._path = site._path + ( site._file || '' ) + '/', site._file = site.index, self.onRoute();
						else{
							r0 = /at /g,
							t0 = '<h1>Server error</h1>'+
								'<hr><b>path, file:</b><br>[' + site._path + '], [' + site._file +']'+
								'<hr><b>rule: </b>'+i+'(idx:'+site._idx+') <b>target: </b>'+j+
								'<hr><b>error:</b><br>',
							t1 = Object.getOwnPropertyNames(e), k = t1.length;
							while( k-- ) t0 += '<b>' + t1[k] +'</b>: '+( e[t1[k]].replace ? e[t1[k]].replace( r0, '<br>at ' ) : e[t1[k]] )+'<br>';
							err( 500, t0 );
						}
					}
					*/
				}else site.next(site.flush), runRule( site.pageEnd, site );
			};
			return v;
		},
		fn.start = function(){
			this.rulesArr = [];
			for( i in this.rules ) if( this.rules.hasOwnProperty(i) ) this.rulesArr[this.rulesArr.length] = i;
			this.rulesArr.sort( function( a, b ){return a.length - b.length;} );
		},
		fn.route = function(){
			var site = this.site;
			site.next( this.onRoute );
			try{
				runRule( site._pageStart, site );
			}catch(e){
				err( 500, '<h1>server error</h1><div>Error: ' + e + '</div>router' );
			}
		},
		fn.template = function( site, url, template ){
			bs.jpage.cache = site.cache,
			site.response(bs.jpage( template, null, null, url ));
		};
	} ),
	bs.site( 'i18n', function( fn, bs ){
		var countryCode = require('./i18n');
		fn.NEW = function(){
			this.arg = [];
		},
		fn.init = function(arg){
			for( var i = 0, j = arg.length ; i < j ; i++ ) this.arg[this.arg.length] = arg[i];
		},
		fn.start = function(){
			var i, j;
			if( j = this.arg.length ) for( i = 0 ; i < j ; i++ ) runRule( this.arg[i] );
		},
		fn.request = function( url, rq, rp ){
			var lang, t0, i, j;
			lang = 0;
			if( countryCode[t0 = rq.headers.lang] ) lang = t0;
			else if( t0 = rq.headers['accept-language'] ){
				t0 = t0.split(';');
				for( i = 0, j = t0.length ; i < j ; i++ ){
					t1 = t0[i].split(','), k = t1.length;
					while( k-- ){
						if( countryCode[t1[k]] ){
							lang = t1[k];
							break;
						}
					}
					if( lang ) break;
				}
			}
			this.v = this[lang||this.lang];
		},
		fn.S = function(arg){
			var t0, t1, d1, i, j, k, v, m, n;
			i = 1, j = arg.length;
			while( i < j ){
				k = arg[i++], v = arg[i++];
				if( k.charAt(0) == '@' ){
					if( this.lang ) return bs.err( 0, 'default already exist:' + this.lang );
					if( !countryCode[k = k.substr(1)] ) return bs.err( 0, 'invaild locale:' + k );
					this[this.lang = k] = v;
				}else if( countryCode[k] ){
					var t0, i, j;
					if( !this.lang ) return bs.err( 0, 'default undefined' );
					t0 = this[this.lang];
					for( m in t0 ) if( t0.hasOwnProperty(m) ){
						if( !( m in v ) ) return bs.err( 0, 'no key: data[' + m +']' );
						t1 = t0[m], d1 = v[m];
						for( n in t1 ) if( t1.hasOwnProperty(n) ){
							if( !( n in d1 )  ) return bs.err( 0, 'no key: data[' + m +'][' + n + ']' );
						}
					}
					this[k] = v;
				}else return this.v[k][v];
			}
		};
	} );
	bs.site( 'form', function( fn, bs ){
		var key, i, parser, Upfile;
		key = 'encoding,keepExtensions,postMax,fileMax,upload'.split(',');
		for( i in key ) key[key[i]] = 1;
		fn.encoding = 'utf-8', fn.keepExtensions = 1, fn.fileMax = 2 * 1024 * 1024, fn.postMax = 5 * 1024 * 1024,
		fn.init = function(arg){
			var i, j, k, v;
			i = 0, j = arg.length;
			while( i < j ){
				k = arg[i++], v = arg[i++];
				if( key[k] ){
					if( v === undefined ) return this[k];
					else if( v === null ) delete this[k];
					else this[k] = v;
				}
			}
		},
		fn.request = function( url, rq, rp ){
			var self = this, site = this.site, t0;
			if( rq.method == 'GET' ) return;
			t0 = new Buffer(''), site.pause();
			rq.on( 'data', function(v){
				t0 = Buffer.concat([t0, v]);
				if( t0.length > self.postMax ) t0 = null, this.pause(), err( 413, 'too large post' );
			} ).on( 'end', function(){
				var type;
				if( t0 === null ) return rp.end();
				type = rq.headers['content-type'];
				if( type.indexOf('x-www-form-urlencoded') > -1 ){
					site._post = bs.qparse(t0.toString());
					site._upload = null;
				}else if( type.indexOf('multipart') > -1 ){
					t0 = parser( rq, t0 ),
					site._post = t0.data, site._upload = t0.file;
				}
				site.pass();
			} );
		},
		Upfile = function( name, file ){
			this.name = name,
			this.file = file;
		},
		Upfile.prototype.save = function(path){
			bs.file( null, bs.path(path), this.file );
		},
		parser = function( rq, buf ){
			var i, j, k, t0, bboundary, blen, bline, bbuf, mkey, mfi, mfn, rawSt, rawEd, ret;
			ret = {data:{}, file:{}},
			t0 = rq.headers['content-type'],
			bboundary = new Buffer( '--' + t0.substr( t0.lastIndexOf( '=' ) + 1) ),
			i = 0, j = buf.length;
			while( i < j ){
				if( buf[i] == bboundary[0] && buf[i+1] == bboundary[1] ){
					blen = i+bboundary.length,
					t0 = buf.slice(i, blen);
					if( t0.toString() == bboundary.toString() ){
						rawEd = i - 2;
						if( rawSt ){
							if( mfn )
								bbuf = new Buffer(rawEd - rawSt),
								buf.copy( bbuf, 0, rawSt, rawEd ),
								ret.file[mkey] = new Upfile( mfn, bbuf );
							else ret.data[mkey] = bs.unescape( buf.slice( rawSt, rawEd ).toString() );
							rawSt = 0, mkey = null, mfn = null;
						}
						bline = 0, k = i;
						while( k < j ){
							if( buf[k] === 13 && buf[k+1] === 10 ){
								bline++;
								if( bline == 2 ){
									t0 = buf.slice(i, k).toString();
									if( t0.indexOf('filename') > -1 )
										mfi = t0.split( ';' ),
										mkey = mfi[1].substring( mfi[1].indexOf( '"' )+1, mfi[1].lastIndexOf( '"' ) ),
										mfn = mfi[2].substring( mfi[2].indexOf( '"' )+1, mfi[2].lastIndexOf( '"' ) );
									else if( t0.indexOf('name') > -1 )
										mkey = t0.substring( t0.indexOf( '"' )+1, t0.lastIndexOf( '"' ) );
								}else if( bline == 3 ){
									t0 = buf.slice(i, k).toString();
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
		};
	} );
})( HTTP, HTTPS, URL );
fn( 'jpage', (function(){
	var jp = function(v){this.v = v;}, cache={}, b = '<%', e = '%>', err = [], line = [],
	r0=/\\/g, r1=/["]|\n|\r\n|\r/g, r2=/at /g, r3=/["]|[<]|\t|[ ][ ]|\n|\r\n|\r/g, r4 = /\n|\r\n|\r/g, r5=/[<]|\t|[ ][ ]/g,
	toCode = function(_0){switch(_0){case'"':return'\\"'; case'\n':case'\r\n':case'\r':return'\\n'; default:return _0;}},
	toHtml = function(_0){switch(_0){case'"':return'\\"'; case'<':return'&lt;';case'\t':return'&nbsp; &nbsp; ';
		case'  ':return'&nbsp; '; case'\n':case'\r\n':case'\r':return'<br>'; default:return _0;}},
	jpage = function( s, data, renderer, id ){
		var str, t0, t1, i, j, k, v, m, importer, render;
		if( !( jpage.cache && ( v = cache[id] ) ) ){
			if( s instanceof jp ) v = s.v;
			else{
				str = ( s.substr( 0, 2 ) == '#T' ? ( s = bs.Dom(s).S('@text') ) : s.substr( s.length - 5 ) == '.html' ? bs.get( null, s ) : s ).split(b);
				v = 'try{', i = 0, j = str.length;
				while( i < j ){
					t0 = str[i++];
					if( ( k = t0.indexOf(e) ) > -1 ) t1 = t0.substring( 0, k ), t0 = t0.substr( k + 2 ), 
						v += '$$E[$$E.length]="<%' + t1.replace( r0, '\\\\' ).replace( r3, toHtml ) + '%>";' +
							( t1.charAt(0) == '=' ? 'ECHO(' + t1.substr(1) + ')' : t1 ) + 
							';$$L[0]+=' + t1.split(r2).length + ';';
					v += 'ECHO($$E[$$E.length]="' + t0.replace( r0, '\\\\' ).replace( r1, toCode ) + '"),$$L[0]+=' + t0.split(r4).length + ';';
				}
				v += '}catch(e){return e;}';
			}
			t0 = s.v ? s : new jp(v);
			if( jpage.cache && id ) cache[id] = v;
		}
		t1 = '', importer = function(url){render(jpage( url, data, null, jpage.cache ? url : 0 ));},
		render = renderer ? function(v){t1 += v, renderer(v);} : function(v){t1 += v;};
		try{
			line[0] = err.length = 0, i = new Function( 'ECHO,IMPORT,$$E,$$L,$,bs', v )( render, importer, err, line, data, bs );
			if( !( i instanceof Error ) ) i = 0;
		}catch(e){i = e;}
		if( i ){
			str = '<h1>Invalid template error: bs.jpage</h1><hr>';
			if( m = err.length ) str += '<b>code: </b>error occured line number - '+line[0]+'<br>'+err[err.length-1]+'<hr>';
			j = Object.getOwnPropertyNames(i), k = j.length;
			while( k-- ) str += '<b>' + j[k] +'</b>: '+( i[j[k]].replace ? i[j[k]].replace( r2, '<br>at ' ) : i[j[k]] )+'<br>';
			str += '<hr><b>template:</b><br>';
			k = s.replace ? s.split(r4) : s.v.split(r4);
			for( i = 0, j = k.length ; i < j ; i++ ) str += '<div'+( m && ( i + 1 == line[0] )?' style="background:#faa"' : '' ) + '><b>' + ( i + 1 ) + ':</b> ' + k[i].replace( r5, toHtml ) + '</div>';
			return str;
		}
		return t1;
	};
	jpage.cache = 1;
	return jpage;
})() );

};