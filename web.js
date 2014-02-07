var bs = require('./bs/bsjs');
bs.Site('bsplugin').S(
	'url', 'js.bsplugin.com:8001',
	'url', '127.0.0.1:8001',
	'root', './noderoot/pluginjs/',
	'cache', 0,
	'siteStart', '@sitestart.js'
	//'https', {key:'./key.pem',cert:'./cert.pem',port:4430},
);
bs.Site('bsplugin').plugin( 'mysql', 'last' );
bs.Site('bsplugin').plugin( 'static', 'last' );
bs.Site('bsplugin').plugin( 'cookie', 'last' );
bs.Site('bsplugin').plugin( 'session', 'last' );
bs.Site('bsplugin').plugin( 'i18n', 'last', '@locale.js' );
bs.Site('bsplugin').plugin( 'form', 'last' );
bs.Site('bsplugin').plugin( 'router', 'last',
	'member', [
		'function', function(){
			if( !bs.WEB.session('id') ) bs.WEB.redirect('/'), bs.WEB.pause();
		},
		'template', '@.html'
	]
);
bs.Site('bsplugin').start();