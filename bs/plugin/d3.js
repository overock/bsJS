bs( function(){
    bs.factory( 'plane', function( $cls ){
        var ani, key, ANI;
        bs.c( '.PLANE' ).$( 'position', 'absolute'),
		bs.c( '.PLANE img' ).$( 'width', '100%', 'height','100%'),
		ANI = bs.ANI.ani,
		(function(){
			var t0, i;
			t0 = 'x,y,z,width,height,src,world,@'.split(','),
				key = {}, i = t0.length;
			while( i-- ) key[t0[i]] = 1;
		})(),
		ani = function( $time ){
			var div = this.div,zIndex,tx,tz,tScale
			var world = this.world, pan = world.pan, tilt = world.tilt,farclip = world.farclip, w = world.width,h = world.height
			var dx, sz, sin = Math.sin(pan) , cos = Math.cos(pan)
			dx = this.x -  world.camx,sz = this.z -  world.camz
			// 카메라를 중심으로 플랜의 위치를 구함
			tx = cos * dx + sin * sz, tz = -sin * dx + cos * sz;
			tScale = w / tz *.5// 대충거리로...크기비율을 결정
			if (tz < 0.1 || tz > farclip) div.$('display', 'none')
			else{
				zIndex = parseInt(tz * 100000 - tz * 100)  // 안겹치게...제트축만들고... 혹시나 살짝빼서 또 겹치는걸 없앰
				div.$(
					'display','block','z-index', parseInt(100 * tScale),
					'margin-left', (tx - this.width / 4)*tScale*2 +w/2,
					'margin-top', tilt - tScale * world.camy - (tScale  + this.height * tScale ) / 2+h/2,
					'width', tScale + this.width * tScale, 'height', tScale  + this.height * tScale,
					'opacity', (farclip - tz) > farclip/5 ? 1 : (farclip - tz + farclip/5) / farclip
				)
			}
		},
		$cls.init = function( $key ){},
		$cls.$ = function(){
			var t0, i, j, k, v;
			if( ( t0 = arguments[0] ).charAt(0) == '@' ){
				if( this[t0] ) t0 = this[t0];
				else ( t0 = this[t0] = {
					ANI:ani,
					div:bs.d('<div class="PLANE"></div>').$('display','none','this'),
					img:bs.d('<img '+'src="'+this.src+'"/>'),
					world : bs.world(this.world).$(this['@']),
					width:100, height:100
				}).div.$( '>', t0.img);
				bs.world(this.world).$(this['@'],'div').$('>',t0.div); // 지정된 월드에 박는다.
				i = 1, j = arguments.length;
				if( j == 1 ) return t0;
				while( i < j ){
					k = arguments[i++], v = arguments[i++];
					if( key[k] ) t0[k] = v;
					else if( k == 'div' ) return t0.div;
					else if( k == 'img' ) return t0.img;
					else t0.div.$( k, v );
				};
				ANI(t0);
			}else{
				i = 0, j = arguments.length;
				while( i < j ){
					if( !key[k = arguments[i++]] ) throw 1;
					this[k] = arguments[i++];
				}
			}
		};
    } );
} );