{
	
"d":{
	"cat":	"select*from cat",
	"type":	"select*from plugintype",
	"login":"select member_rowid,email,nick,thumb from member where email='@email@' and pw='@pw@'",
	"join":	"insert into member(email,pw,nick,thumb)values('@email@','@pw@','@nick@','@thumb@'",
	"Plist":["select p.plugin_rowid,t.title type,p.title,p.uname,p.thumb,c.title cat,DATE_FORMAT(regdate,'%Y.%m.%d %H:%i')regdate from plugin p,plugintype t, cat c ",
			 "where p.plugintype_rowid=t.plugintype_rowid and p.cat_rowid=c.cat_rowid and p.member_rowid=@id@ order by regdate desc limit @p@,@rpp@"],
	"Padd":	["insert into plugin(member_rowid,plugintype_rowid,uname,title,contents,cat_rowid,thumb)values(",
			 "@id@,@type@,'@uname@','@title@','@description@',@cat@,'@thumb@')"],
	"Pview":["select p.plugin_rowid,t.title type,p.title,p.contents,p.uname,p.thumb,c.title cat,DATE_FORMAT(regdate,'%Y.%m.%d %H:%i')regdate from plugin p,plugintype t, cat c ",
			 "where p.plugintype_rowid=t.plugintype_rowid and p.cat_rowid=c.cat_rowid and p.plugin_rowid=@r@"],
	"Dlist":"select d.depend_rowid,v.version,p.uname from depend d,ver v,plugin p where p.plugin_rowid=v.plugin_rowid and v.ver_rowid=d.ver_rowid1 and d.ver_rowid1=@vr@ order by p.uname",
	"Dadd":	"insert into depend(ver_rowid1,ver_rowid2)values(@vr1@,@vr2@)",
	"Ddel":	"delete from depend where depend_rowid=@dr@",
	"Vlist":"select ver_rowid,version,DATE_FORMAT(freezeDate,'%y.%m.%d %H:%i')freezedate,DATE_FORMAT(editdate,'%y.%m.%d %H:%i')editdate,code,contents from ver where plugin_rowid=@r@ order by version desc",
	"Vsearch":"select v.ver_rowid,v.version from plugin p,ver v where p.plugin_rowid=v.plugin_rowid and p.uname='@title@' and p.plugin_rowid<>@r@ and v.freezedate is null order by v.version",
	"Vadd":	"insert into ver(plugin_rowid,version)values(@r@,@version@)",
	"Vupdate":"update ver set code='@code@',contents='@contents@',editdate=CURRENT_TIMESTAMP()where ver_rowid=@vr@",
	"Vfreezable":"select freezedate,(select max(i.version)from ver i where i.plugin_rowid=v.plugin_rowid and i.freezedate is not NULL)<version k from ver v where ver_rowid=@vr@",
	"Vfreeze":"update ver set freezeDate=CURRENT_TIMESTAMP()where ver_rowid=@vr@",
	"VfreezeDetail":["select p.uname,v.version,t.title,v.code ",
					 "from ver v,plugin p,plugintype t ",
					 "where v.plugin_rowid=p.plugin_rowid and p.plugintype_rowid=t.plugintype_rowid and ver_rowid=@vr@"]
}

}