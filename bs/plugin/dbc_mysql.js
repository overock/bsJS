bs.$registerdbc( 'mysql', (function(){
	var d;
	d = function(){},
	d.require =  'mysql';
	d.prototype.open = function(){
		var t0;
		t0 = this;
		if( !this.__conn ){
			this.__conn = d.require.createConnection( this ),
			this.__conn.on( 'error', function( $e ){if( $e.code === 'PROTOCOL_CONNECTION_LOST') t0._conn = null;} ),
			this.__conn.connect();
		}
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
			}
		}
	},
	d.prototype.execute = function( $query ){return this.open().query( $query );},
	d.prototype.recordset = function( $query, $end ){this.open().query( $query, function( e, r ){e ? $end( null, e ) : $end( r );});},
	d.prototype.stream = function( $query, $end ){this.open().query( $query ).on('result', $end );},
	d.prototype.transation = function( $query, $end ){
		var conn = this.open();
		conn.beginTransaction( function($e){
			var next, i, j;
			if( $e ) $end( null, $e );
			i = 0, j = $query.length, next = function( $rs ){
				if( i < j ){
					conn.query( $query[i++], function( $e, $rs ){
						if( $e ) conn.rollback( function(){$end( null, $e );} );
						next( $rs );
					} );
				}else{
					conn.commit( function($e){
						if( $e ) conn.rollback( function(){$end( null, $e );} );
						$end( $rs );
					} );
				}
			}, next();
		} );
	};
	return d;
})() );