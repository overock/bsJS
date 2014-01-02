var bs = require( './bs/bsjs' )( __dirname );
bs.site('bsplugin').$(
	'url', 'js.bsplugin.com', 
	'root', './noderoot/pluginjs/',
	'rules', {
		'/':[
			'absolute', 'head.bs',
			'tail', 'JS',
			'url',
			'absolute','foot.bs'
		],
		'/json':[
			'url'
		]
	}
);
bs.site('bsplugin').start();