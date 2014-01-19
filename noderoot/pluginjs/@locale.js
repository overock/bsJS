(function(){
var ko, en

ko = {
	top:{
		recent:'신규등록' ,hot:'인기항목', updated:'업데이트', category:'카테고리',
		search:'검색', email:'이메일', login:'로그인', join:'가입'
	}
},

en = {
	top:{
		recent:'Recent' ,hot:'Hot', updated:'Updated', category:'category',
		search:'search', email:'email', login:'login', join:'join'
	}
},

bs.WEB.i18nAdd( 0, 'ko', ko ),
bs.WEB.i18nAdd( 1, 'en', en );
})();