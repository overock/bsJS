(function(){
var ko, en;
ko = {
	top:{
		recent:'신규등록' ,hot:'인기항목', updated:'업데이트', category:'카테고리',
		search:'검색', email:'이메일', login:'로그인', join:'가입'
	},
	join:{
		email:'이메일',pw:'패스워드를 입력하세요(6~12자리)',pw2:'패스워드를 다시한번 입력하세요',
		nick:'사용할 닉네임을 입력하세요',thumb:'섬네일 URL',rthumb:'권장 사이즈'
	},
	pluginAdd:{
		title:'타이틀',unique:"식별이름",type:"타입",category:"카테고리",keyword:"키워드(,단위로 입력하세요)",
		description:'플러그인 설명',thumb:'섬네일 URL',rthumb:'권장 사이즈',
		addPlugin:'새로운 플러그인 등록하기',date:'업로드 날짜',addNewVersion:'새 버전 추가',
		backList:'내 플러그인 보기',modify:'플러그인 정보 수정'
	}
},

en = {
	top:{
		recent:'Recent' ,hot:'Hot', updated:'Updated', category:'category',
		search:'search', email:'email', login:'login', join:'join'
	},
	join:{
		email:'E-Mail',pw:'PassWord(6~12)',pw2:'PassWord(confirm)',
		nick:'Nickname(4~10)',thumb:'Thumb URL',rthumb:'Recommand Thumb size'
	},
	pluginAdd:{
		title:'TITLE',unique:'UNIQUE NAME',type:'TYPE',category:'CATEGORY',keyword:'KEYWORD',
		description:'Description',thumb:'Thumb URL',rthumb:'Recommand Thumb size',
		addPlugin:'Add New Plugin',date:'Date',addNewVersion:'Add New Version',
		backList:'VIew My Plugin LIST',modify:'Modify This Plugin Info'
	}
},

bs.WEB.i18nAdd( 0, 'ko', ko ),
bs.WEB.i18nAdd( 1, 'en', en );
})();