bs.$register( 'method', 'innerhtml', (function(){console.log( 'innerhtml' );
	return function(  $sel  ) {
		var 	t0, t1, t2,
			n0, n1, n2,
			div, tag, parent,
			trim = /^\s*|\s*$/g;

		div = document.createElement( 'div' );
		tag = {
			thead : [ 0, '<table>', '</table>' ],
			tfoot : [ 0, '<table>', '</table>' ],
			tbody : [ 0, '<table>', '</table>' ],
			caption : [ 0, '<table>', '</table>' ],
			colgroup : [ 0, '<table>', '</table>' ],
			tr :	 [ 1, '<table><tbody>', '</tbody></table>' ],
			col : [ 1, '<table><tbody></tbody><colgroup>', '</colgroup></table>' ],
			td : [ 2, '<table><tbody><tr>', '</tr></tbody></table>' ],
			option : [ 0, '<select>', '</select>' ]
		};

		if( typeof $sel != 'string' || ( t0 = $sel.replace( trim, '' ) ), t0.charAt(0) != '<' ) return console.log('임시 필터링');

		n0 = t0.indexOf(' '),
		n1 = t0.indexOf('>'),
		n2 = t0.indexOf('/');

		t1 = ( n0 != -1 && n0 < n1 ) ? t0.substring( 1, n0 ) : ( n2 != -1 && n2 < n1 ) ? t0.substring( 1, n2 ) : t0.substring( 1, n1 );
		if( tag[t1] ) {
			div.innerHTML = tag[t1][1] + $sel + tag[t1][2];
			t2 = div.childNodes[0];
			if( tag[t1][0] ) for( h = 0; h < tag[t1][0]; h++ ) t2 = t2.childNodes[0];
			parent = t2; 
		}else {
			div.innerHTML = $sel;
			parent = div; 
		}
		return bs.dom( bs.$reverse( parent.childNodes ) );



		//t2 = t1 != -1 && t1 < t0.indexOf('>') ? t0.substring( 1, t1 ) : t0.indexOf('/') != -1 && t0.indexOf('/') < t0.indexOf('>') ? t0.substring( 1, t0.indexOf('/') ) : t0.substring( 1, t0.indexOf('>') );






		//t1 = $sel.indexOf(' ') != -1 && $sel.indexOf(' ') < $sel.indexOf('>') ? $sel.substring(1, $sel.indexOf(' ')) : $sel.substring(1, $sel.indexOf('>'));<div style=""/>

		//$sel.toLowerCase().replace( bs.$trim, '' );
		// console.log(bs.$trim($sel))
		// console.log($sel.replace( trim, '' ))
		// console.log($sel)
		/*
		사용자가 입력시에 div의 자식으로 innerHTML가능한 요소라면 
		그냥 내가 return bs.dom('태그 문자열'); 하고

		아니라면 여기서 새롭게 해결한 뒤에 return하면 되려나
		한마디로 일단은 bs.dom을 고치는 것이 아니라

		bs.dom을 태울지 말지를 innerhtml 메소드가 먼저 판단할 수 있는 그런 상황으로 만들어놓고
		bs.dom내부에 결합 시키면 되지 않을까 
		*/
		//console.log(bs.$domfromhtml)
	};
})(), 1.0 );
