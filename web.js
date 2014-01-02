var bs = require( './bs/bsjs' )( __dirname );
bs.site( 'bsplugin' ).$(
	'url', 'js.bsplugin.com',
	'url', '192.168.56.101', 
	'root', './noderoot/pluginjs/'
);
bs.site( 'bsplugin' ).rules(
	'', [
		'absolute', 'head',
		'tail', 'JS',
		'url',
		'absolute','foot'
	],
	'json', [
		'url'
	]
);
bs.site('bsplugin').start();