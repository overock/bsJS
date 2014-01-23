(function(){
var ko, en;
ko = {
	common:{back:'이전으로'},
	top:{
		recent:'신규등록' ,hot:'인기항목', updated:'업데이트', category:'카테고리',
		search:'검색', email:'이메일', login:'로그인', join:'가입'
	},
	join:{
		email:'이메일',pw:'패스워드를 입력하세요(6~12자리)',pw2:'패스워드를 다시한번 입력하세요',
		nick:'사용할 닉네임을 입력하세요(6~10자리)',thumb:'썸네일 URL',rthumb:'권장 사이즈'
	},
	mi:{
		title:'님의 플러그인', add:'새로운 플러그인 등록하기', noplugin:'등록된 플러그인이 없습니다. 아직은..',
		title0:'제 목'
	},
	miAdd:{
		title:'설명용 제목(5~100자)',unique:"식별이름(소문자만 5~30)",type:"타입",category:"카테고리",keyword:"키워드(,단위로 입력하세요)",
		description:'플러그인 설명',thumb:'썸네일 URL',rthumb:'권장 사이즈',
		date:'업로드 날짜',
		modify:'플러그인 정보 수정'
	},
	mv:{
		caution:'기존보다 높은 버전만 등록가능!<br>FREEZE 되면 수정할 수 없음!!',
		version:'숫자만 가능 1,0.3,1.5..',
		addNewVersion:'새 버전 추가',
		dependName:'플러그인이름',
		dependSearch:'플러그인검색',
		dependAdd:'의존성추가'
	}
},

en = {
	common:{back:'Back'},
	top:{
		recent:'Recent' ,hot:'Hot', updated:'Updated', category:'category',
		search:'search', email:'email', login:'login', join:'join'
	},
	join:{
		email:'E-Mail',pw:'PassWord(6~12)',pw2:'PassWord(confirm)',
		nick:'Nickname(4~10)',thumb:'Thumb URL',rthumb:'Recommand Thumb size'
	},
	mi:{
		title:"'s Plugins", add:'Add New Plugin', noplugin:'No Registered Plugin..',
		title0:'TITLE'
	},
	miAdd:{
		title:'TITLE(for explain 5~100)',unique:'UNIQUE NAME(5~30)',type:'TYPE',category:'CATEGORY',keyword:'KEYWORD',
		description:'Description',thumb:'Thumb URL',rthumb:'Recommand Thumb size',
		date:'Date',
		modify:'Modify This Plugin Info'
	},
	mv:{
		caution:'Register only higher version!<br>Can`t update after FREEZE!!',
		version:'only number 1,0.3,1.5..',
		addNewVersion:'Add New Version',
		dependName:'Plugin Name',
		dependSearch:'Search',
		dependAdd:'Add Dependency'
	}
},
bs.WEB.i18nAddDefault( 'en', en ),
bs.WEB.i18nAdd( 'ko', ko );
})();