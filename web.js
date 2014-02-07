var bs = require('./bs/bsjs');
bs.Site('bsplugin').S(
	'url', 'js.bsplugin.com:8001',
	'url', '127.0.0.1:8001',
	'root', './noderoot/pluginjs/',
	'db', 'mysql',
	'cache', 0,
	'siteStart', '@sitestart.js'
	//'https', {key:'./key.pem',cert:'./cert.pem',port:4430},
);
bs.Site('bsplugin').add( 'mysql', 'last' );
bs.Site('bsplugin').add( 'static', 'last' );
bs.Site('bsplugin').add( 'cookie', 'last' );
bs.Site('bsplugin').add( 'session', 'last' );
bs.Site('bsplugin').add( 'i18n', 'last', '@locale.js' );
bs.Site('bsplugin').add( 'form', 'last' );
bs.Site('bsplugin').add( 'router', 'last',
	'member', [
		'function', function(){
			if( !bs.WEB.session('id') ) bs.WEB.redirect('/'), bs.WEB.pause();
		},
		'template', '@.html'
	]
);
bs.Site('bsplugin').start();