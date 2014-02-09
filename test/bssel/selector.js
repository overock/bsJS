/*
	bs selector 백승현
	http://css4-selectors.com/browser-selector-test/
	http://kimblim.dk/css-tests/selectors/
*/
var bssel = (function(){
'use strict';
var isQS = ( typeof document.querySelector == 'function' ), // <= IE8

    // https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType
    DOCUMENT_NODE = 9,
    ELEMENT_NODE = 1,
    TEXT_NODE = 3;

    // :hover
    window.onmouseover = function(e) {
        e = e || window.event;
        var t = e.srcElement || e.target;
        while(t) {
            t.hovering = true;
            t = t.parentNode;
        }
    };
    window.onmouseout = function(e) {
        e = e || window.event;
        var t = e.srcElement || e.target;
        while(t) {
            t.hovering = false;
            t = t.parentNode;
        }
    };

var trim = (function(){
	var dotrim = (function(){
		var r0 = /^\s*|\s*$/g;
		return function(str){
			return typeof String.prototype.trim == 'function' ? str.trim() : str.replace(r0, '');
		};
	})();
	return function(t){
		var i;
		if( t.splice ){
			for( i=t.length; i--; ) t[i] = dotrim( t[i] );
			return t;
		}
		return dotrim(t);
	}
})();
var uniqArray = function(arr) {
	var _ret = [], _len = arr.length, i, j;
	for (i = 0; i < _len; i++) {
		for (j = i + 1; j < _len; j++)
			if (arr[i] === arr[j]) j = ++i;
		_ret.push(arr[i]);
	}
	return _ret;
};
var echo = function(target, filter, parentName) {
	var k;
	if (parentName && (typeof parentName != "string" || typeof parentName == "string" && (parentName.split(".").length + parentName.split("]").length) > 3)) return;
	if (!filter) filter = "";
	if (target === null || target === undefined) {
		console.log(((parentName) ? parentName + "." : "") + target);
		return;
	}
	if (typeof target != "object") {
		if (typeof target == filter || filter === "")
			console.log(((parentName) ? parentName + "." : "") + target + "["+ typeof target +"]");
		return;
	}
	(target instanceof Array) ? console.log(((parentName) ? parentName + ":" : "") + "[Array["+ target.length + "]]") : console.log(((parentName) ? parentName + ":" : "") + "[Object]");
	for (k in target) {
		if (target instanceof Array) {
			if (typeof target[k] == "object")
				echo(target[k], filter, ((parentName) ? parentName + "[" : "[") + k + ((parentName) ? "]" : "]"));
			else if (typeof target[k] == filter || filter === "")
				console.log(((parentName) ? parentName + "[" : "[") + k + ((parentName) ? "]" : "]") + ":" + target[k] + " ("+ typeof target[k] +")");
		} else {
			if (typeof target[k] == "object")
				echo(target[k], filter, ((parentName) ? parentName + "." : "")+k);
			else if (typeof target[k] == filter || filter === "")
				console.log(((parentName) ? parentName + "." : "") + k + ":" + target[k] + " ("+ typeof target[k] +")");
		}
	}
};
var CSSSelectors = {
	'CSS1': {
		'Type': ['E'],
		'ID': ['E#ElementID'],
		'Class': ['E.classname'],
		'Descendant combination': ['E F'],
		'User action pseudo-class': ['E:active'],
		'Link history pseudo-class': ['E:link']
	},
	'CSS2': {
		'Universal': ['*'],
		'User action pseudo-class': ['E:hover', 'E:focus'],
		'Dir pseudo-class': ['E:dir(ltr)'],
		'Lang pseudo-class': ['E:lang(en)'],
		'Attribute': ['E[foobar]', 'E[foo=\'bar\']', 'E[foo~=\'bar\']', 'E[foo|=\'en\']'],
		'Structural pseudo-class': ['E:first-child'],
		'Child combination': ['E > F'],
		'Adjacent sibling combination': ['E + F']
	},
	'CSS3': {
		'Negation pseudo-class': ['E:not(s)'],
		'Target pseudo-class': ['E:target'],
		'Scope pseudo-class': ['E:scope'],
		'Enabled and Disabled pseudo-class': ['E:enabled', 'E:disabled'],
		'Selected-option pseudo-class': ['E:checked'],
		'Structural pseudo-class': ['E:root', 'E:empty', 'E:last-child', 'E:only-child', 'E:first-of-type', 'E:last-of-type', 'E:only-of-type', 'E:nth-child(n)', 'E:nth-last-child(n)', 'E:nth-of-type(n)', 'E:nth-last-of-type(n)'],
		'Attribute': ['E[foo^=\'bar\']', 'E[foo$=\'bar\']', 'E[foo*=\'bar\']'],
		'General sibling combinator': ['E ~ F']
	},
	'CSS4': {
		'Negation pseudo-class': ['E:not(s1, s2)'],
		'Matches-any pseudo-class': ['E:matches(s1, s2)'],
		'Local link pseudo-class': ['E:local-link'],
		'Time-dimensional pseudo-class': ['E:current'],
		'Indeterminate-value pseudo-class': ['E:indeterminate'],
		'Default option pseudo-class': ['E:default'],
		'Validity pseudo-class': ['E:in-range', 'E:out-of-range'],
		'Optionality pseudo-class': ['E:required', 'E:optional'],
		'Mutability pseudo-class': ['E:read-only', 'E:read-write'],
		'Structural pseudo-class': ['E:nth-match(n of selector)'],
		'Grid-Structural pseudo-class': ['E:column(selector)', 'E:nth-column(n)', 'E:nth-last-column(n)'],
		'Attribute case-sensitivity': ['E[foo=\'bar\' i]'],
		'Reference combination': ['E /foo/ F'],
		'Subject of a selector with Child combinator': ['E! > F'],
		'Hyperlink pseudo-class': ['E:any-link'],
		'Dir pseudo-class': ['E:dir(*)']
	}
};
//var CSSSelectors = {'CSS1': {'Type': ['E'],'ID': ['E#ElementID'],'Class': ['E.classname'],'Descendant combination': ['E F'],'User action pseudo-class': ['E:active'],'Link history pseudo-class': ['E:link']},'CSS2': {'Universal': ['*'],'User action pseudo-class': ['E:hover','E:focus'],'Dir pseudo-class': ['E:dir(ltr)'],'Lang pseudo-class': ['E:lang(en)'],'Attribute': ['E[foobar]','E[foo=\'bar\']','E[foo~=\'bar\']','E[foo|=\'en\']'],'Structural pseudo-class': ['E:first-child'],'Child combination': ['E > F'],'Adjacent sibling combination': ['E + F']},'CSS3': {'Negation pseudo-class': ['E:not(s)'],'Target pseudo-class': ['E:target'],'Scope pseudo-class': ['E:scope'],'Enabled and Disabled pseudo-class': ['E:enabled','E:disabled'],'Selected-option pseudo-class': ['E:checked'],'Structural pseudo-class': ['E:root','E:empty','E:last-child','E:only-child','E:first-of-type','E:last-of-type','E:only-of-type','E:nth-child(n)','E:nth-last-child(n)','E:nth-of-type(n)','E:nth-last-of-type(n)'],'Attribute': ['E[foo^=\'bar\']','E[foo$=\'bar\']','E[foo*=\'bar\']'],'General sibling combinator': ['E ~ F']},'CSS4': {'Negation pseudo-class': ['E:not(s1, s2)'],'Matches-any pseudo-class': ['E:matches(s1, s2)'],'Local link pseudo-class': ['E:local-link'],'Time-dimensional pseudo-class': ['E:current'],'Indeterminate-value pseudo-class': ['E:indeterminate'],'Default option pseudo-class': ['E:default'],'Validity pseudo-class': ['E:in-range','E:out-of-range'],'Optionality pseudo-class': ['E:required','E:optional'],'Mutability pseudo-class': ['E:read-only','E:read-write'],'Structural pseudo-class': ['E:nth-match(n of selector)'],'Grid-Structural pseudo-class': ['E:column(selector)','E:nth-column(n)','E:nth-last-column(n)'],'Attribute case-sensitivity': ['E[foo=\'bar\' i]'],'Reference combination': ['E /foo/ F'],'Subject of a selector with Child combinator': ['E! > F'],'Hyperlink pseudo-class': ['E:any-link'],'Dir pseudo-class': ['E:dir(*)']}};
var DETECT;
(function(){
	var k, kk, i;
	if( !isQS ) return;
	DETECT = {};
	for( k in CSSSelectors ){
		DETECT[k] = {};
		for( kk in CSSSelectors[k] ){
			DETECT[k][kk] = [];
			for( i=0; i < CSSSelectors[k][kk].length; i++ ){
				try{document.querySelector(CSSSelectors[k][kk][i]),DETECT[k][kk].push(1);}catch(e){DETECT[k][kk].push(0);}
			};
		}
	}
	//console.log(DETECT);
})();

var finder = (function(){
	var bsel, parseQuery, compareEl, r0;

	parseQuery = function(s){
		var tokens, token, key, i, t0;
		tokens = [];
		token = '';
		i = s.length;
		while( i-- ){
			key = s.charAt(i);
			if( key == '[' ) t0 = 0; else if( key == ']' ) t0 = 1;
			if( key != ' ' && key != ']' && key != '>' && key != '+' ) token = key + token;

			if( key == ' ' && t0 ) token = key + token;
			else if( key == ' ' || key == '>' || key == '+' ){
				if( ( token = trim(token) ) != '' ) tokens.push(token);
				if( tokens[tokens.length-1] != ' ' )tokens.push(key);
				token = '';
			}else if( key == '.' || key == ':' || key == '[' || !i ){
				tokens.push(token);
				token = '';
			}
		}
		console.log(tokens);
		return tokens;
	},
	compareEl = (function(){
		var r0;
		r0 = /"|'/g, //"
		function _hasCls(key, clsNm){
			var i;
			if( !clsNm ) return 0;
			clsNm = trim( clsNm.split(' ') );
			for( i = clsNm.length; i--; )	if( key == clsNm[i] ) return 1;
			return 0;
		};
		return function(el, token){
			var key, val, opIdx, op, i;
			if( ( key = token.charAt(0) ) == '#' ){
				//console.log("ID");
				key = token.substr(1);
				if( key == el.id ) return 1;
			}else if( key == '.' ){
				//console.log('#class');
				key = token.substr(1);
				return _hasCls( key, el.className );
			}else if( key == '[' ){
				//console.log('#attr');
				// TODO:IE7 에서 A, SCRIPT, UL, LI 등의 요소에 기본 type 속성이 생성되어있는 문제 처리
				key = token.substr(1);
				opIdx = key.indexOf('=');
				op = opIdx > -1 ? key.charAt(opIdx-1) : null;
				val = key.split('=');
				key = opIdx > -1 ? op == '~' || op == '|' || op == '^' || op == '$' || op == '*' ? val[0].substring(0, opIdx-1) : val[0] : key;
				val = opIdx > -1 ? val[1].replace(r0, ''):null;
				if( key = el.getAttribute(key) ){
					//console.log(op, key,val)
					if( opIdx == -1 ){
						if( key !== null ) return 1;
					}else{
						if( op == '~' ){
							key = key.split(' ');
							for( i = key.length; i--; ){
								//console.log(key[i])
								if( key[i] == val ) return 1;
							}
						}else if( op == '|' ){
							key = key.split('-');
							for( i = key.length; i--; ){
								//console.log(key[i])
								if( key[i] == val ) return 1;
							}
						}else{
							if( key == val ) return 1;
						}
					}
				}
			}else if( key == ':' ){
				// TODO:pseudo 처리
				key = token.substr(1);
				switch(key){
				case'link':
					if( el.tagName == 'A' && el.getAttribute('href') !== null ) return 1;
					break;
				case'active':
				case'visited':
				case'first-line':
				case'first-letter':break;
				case'first-child':
					return el.childNodes[0];
					break;
				case'hover':
                    return el.hovering;
					break;
				case'focus':
					// TODO;
					break;
				}
			}else{ // TAG 처리
				if( token == '*' || token.toUpperCase() == el.tagName ) return 1;
			}
			return 0;
		};
	})();
	return function($s){
		var ret, el, els, pel, sel, sels, oSel, t0, i, j, k, m, n,
			key, hit, pIdx, aIdx, attrs, token, tokens, ntoken;
		console.log('@@@', $s);
		document.getElementById('selector').value = $s;
		if(isQS) console.log( 'native:', document.querySelectorAll($s) );
		oSel = [],
		//sels = trim( $s.replace( r0, ' ' ).split(',') );
		sels = trim( $s.split(',') );
		for( i = sels.length; i--; ){
			oSel.push( parseQuery( sels[i] ) );
		}
		//console.log(oSel);
		// TODO:native 처리
		ret = [];
		if( els = document.getElementsByTagName('*') ){
			//console.log(els);
			for( i = 0, j = els.length; i < j; i++ ){
				els[i].className = els[i].className.replace('selected','');
				hit = 0;
				pel = null;
				for( k = oSel.length; k--; ){
					tokens = oSel[k];
					el = els[i];
					for( m = 0, n = tokens.length; m < n; m++ ){
						token = tokens[m];
						key = token.charAt(0);
						if( ( key = token.charAt(0) ) == ' ' ){ // loop parent
							m++;
							while( el = el.parentNode ){
								if( hit = compareEl(el, tokens[m]) ) break;
							}
						}else if( key == '>' ){ // immediate parent
							m++;
							hit = compareEl(el = el.parentNode, tokens[m]);
                        }else if( key == '+' ){ // has nextsibling element
                            m++;
                            // pass textnode
                            while( el = el.previousSibling ) {
                                if(el.nodeType === ELEMENT_NODE) {
                                    break;
                                }
                            }
                            if(hit = el && compareEl(el, tokens[m]) ) break;
                        }else{
							hit = compareEl(el, token);
						}
						if( !hit ) break; // 여긴 AND 연산
						//console.log(key);
					}
					if( hit ) break; // 여긴 OR 연산
				}
				//console.log(hit.length, attrs.length)
				if( hit ) ret.push(els[i]);
			}
		}
		//echo(ret[0]);
		console.log('bssel:',ret);
		for(var i=0; i<ret.length; i++){
			ret[i].className = ret[i].className ? ret[i].className + ' selected': 'selected';
		}
	}
})();
	return finder;
})();













//
//function querySelectorAll(element, selector) {
//    if(element.querySelectorAll) { // Morden Browser
//        return element.querySelectorAll(selector);
//    }
//    else { // low versioning IE only
//        var a=element.all, c=[], selector = selector.replace(/\[for\b/gi, '[htmlFor').split(','), i, j, s=document.createStyleSheet();
//        for (i=selector.length; i--;) {
//            s.addRule(selector[i], 'k:v');
//            for (j=a.length; j--;) a[j].currentStyle.k && c.push(a[j]);
//            s.removeRule(0);
//        }
//        return c;
//    }
//}

