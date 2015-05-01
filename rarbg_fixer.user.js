// ==UserScript==
// @name		rarbg fixer
// @namespace		rarbg fixer
// @homepage    	https://github.com/azev/rarBG-Fixer
// @description		-
// @updateURL		https://github.com/azev/rarBG-Fixer/raw/master/rarbg_fixer.user.js
// @downloadURL		https://github.com/azev/rarBG-Fixer/raw/master/rarbg_fixer.user.js
// @author		Azev
// @version		4.0
// @grant		none
// @icon		http://www.rarbg.to/favicon.ico
// @includ		http*://*rarbg.com/*
// @includ		http*://*rarbg.to/*
// ==/UserScript==

// http://wiki.greasespot.net/Metadata_Block

/* OPTIONS */
var FADE				= 0.6; // dimmed opacity
var AGE_THRESHOLD 		= 180; // old torrent in days
var THUMB_SIZE	 		= 200; // thumbnail size (width)
var FIXED_NAV			= true; // navigation pages fixed at bottom
var DIRECT_THUMBS		= true; // show thumbnails directly
var HIDE_RECOMMENDED	= true; // hide 'recommended'
var HIDE_DDL_ADS 		= true; // hide 'direct download' (ads)
var css 				= '';


var elms, i, releaseDate, ageThreshold, imgtag, url, thumbCover ;
ageThreshold = new Date();
ageThreshold.setDate(ageThreshold.getDate() - AGE_THRESHOLD); // days
//document.body.innerHTML += '<div id="poster"></div>';

function addCss(css){
	var style = document.createElement('style');
	if (style.styleSheet)
	    style.styleSheet.cssText=css;
	else 
	    style.appendChild(document.createTextNode(css));
	document.getElementsByTagName('head')[0].appendChild(style);
}


/* add torrage link */
var anchor, hash;
elms = document.getElementsByTagName('a');
for (i=0; i < elms.length; i++) {
	
	if ( elms[i].getAttribute('href') !== null){
		//console.log( elms[i].getAttribute('href') );
		
		if ( elms[i].getAttribute('href').indexOf('magnet:') !== -1 ){
			anchor = document.createElement('A');
			hash = (/:([0-9a-fA-F]{40})/.exec( elms[i].getAttribute('href') )[1].toUpperCase() );
			url = 'http://torcache.net/torrent/' + hash + '.torrent';
			anchor.setAttribute('href', url);
			anchor.style.display = 'block';
			anchor.style.padding = '10px';
			anchor.style.color = '#3c0';
			anchor.innerHTML = 'DOWNLOAD FROM TORCACHE.NET';
			elms[i].parentNode.appendChild(anchor);
			//elms[i].href='#';
		}
		
	}
}

/* hide iframes */
elms = document.getElementsByTagName("iframe");
for (i=0; i < elms.length; i++) {
	elms[i].style.display = 'none';
	elms[i].src = 'about:blank';
}

/* hide direct download links (ads) */
if (HIDE_DDL_ADS) {
	elms = document.getElementsByTagName("a");
	for (i=0; i < elms.length; i++) {
		if ( elms[i].outerHTML.indexOf('direct') !=-1 ){
			elms[i].parentNode.parentNode.style.display = 'none';
			elms[i].href='#';
		}
	}
}

/* dim old torrents */
elms = document.getElementsByClassName("lista");
for (i=0; i < elms.length; i++) {
	if (elms[i].innerHTML.search(/^(\d+)(-|\/)(\d+)(?:-|\/)(?:(\d+)\s+(\d+):(\d+)(?::(\d+))?(?:\.(\d+))?)$/)===0) {
		releaseDate = new Date(elms[i].innerHTML.replace(' ', 'T') );
		if (releaseDate < ageThreshold)
			elms[i].parentNode.style.opacity = FADE;
	}	
}

/* hide 'recommended' covers */
if (HIDE_RECOMMENDED) {
	if (  document.documentElement.innerHTML.indexOf('Recommended torrents') !=-1 ){
		elms = document.getElementsByClassName("lista");
		for (i=5; i <= 12; i++) {
				elms[i].style.display = 'none';
		}
	}
	elms = document.getElementsByTagName("b");
	for (i=0; i < elms.length; i++) {
		if ( elms[i].innerHTML.indexOf('Recommended torrents :') !=-1 ) elms[i].style.display = 'none';
	}
}

	
	
/* embedded cover */
if ( (DIRECT_THUMBS) && (document.URL.indexOf('/torrent/')==-1) ) {
	var thumbCover, thumbLarge;
    document.body.innerHTML += '<div id="poster"></div>';
    elms = document.getElementsByTagName("a");
    for (i=0; i < elms.length; i++) {
        if ( elms[i].getAttribute("onmouseover")!==null){
			if ( elms[i].getAttribute("onmouseover").search(/dyncdn.me(.+)\jpg/)>0) {
				url = elms[i].getAttribute("href");
				
				// small cover
				thumbCover = /dyncdn.me(.+)\jpg/.exec( elms[i].getAttribute("onmouseover") )[0];
				
				// large cover				
				thumbLarge = thumbCover.replace('/static/over/', '/posters2/$/');
				thumbLarge = thumbLarge.replace('$', /\/over\/(.)/.exec(thumbCover)[1]);
				
				imgtag = '<a href="' + url + '"> <img width="' + THUMB_SIZE + '" src="http://' + thumbLarge + '"></a>';
				elms[i-1].parentNode.innerHTML = imgtag;
			}
		}	
	}
}

/* css mod */

css += '.lista { background: #eee;  border: none;  word-wrap: break-word;}';
css += '.header5 { padding: 3px;}';
css += '.lista-rounded { border: 1px solid #aaa; }';
css += '.lista2t td {padding: 5px;}';
css += 'body {margin: auto; background: #eee}';
css += "#poster {position: fixed; top: 20px; right: 20px; border: dashed 1px #333; padding: 3px}";
css += "td {width: 100px}";

if (FIXED_NAV) css += "#pager_links {position: fixed; margin:0; bottom: 0; right: 0; left: 0; height: 50px; background: #fff; border-top: 1px solid #333}";

addCss(css);
