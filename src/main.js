require('../node_modules/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.css');

var SDK = require('blocksdk');
var sdk = new SDK(null, null, true); // 3rd argument true bypassing https requirement: not prod worthy

var address, width, height, zoom, link, jsonloc;

function debounce(func, wait, immediate) {
	var timeout;
	return function () {
		var context = this,
			args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

function paintSettings() {
	document.getElementById('text-input-id-0').value = jsonloc;
	// document.getElementById('text-input-id-1').value = address;
	// document.getElementById('slider-id-01').value = width;
	// document.getElementById('slider-id-02').value = height;
	// document.getElementById('slider-id-03').value = zoom;
}

// function paintSliderValues () {
// 	document.getElementById('slider-id-01-val').innerHTML = document.getElementById('slider-id-01').value;
// 	document.getElementById('slider-id-02-val').innerHTML = document.getElementById('slider-id-02').value;
// 	document.getElementById('slider-id-03-val').innerHTML = document.getElementById('slider-id-03').value;
// }

function paintMap() {
	jsonloc = document.getElementById('text-input-id-0').value;
	// address = document.getElementById('text-input-id-1').value;
	// width = document.getElementById('slider-id-01').value;
	// height = document.getElementById('slider-id-02').value;
	// zoom = document.getElementById('slider-id-03').value;
	// link = document.getElementById('text-input-id-2').value;
	// if (!address) {
	// 	return;
	// }


	var bl1 = "%%[var @dataurl set @dataurl = HTTPGet(\"";
	var bl2 = "{{.datasource MSContent source = @dataurl type = variable}}{{.data}} { \"target\": \"@dataurl\",\"filter\": \"uid == [contactKey]\"}";
	var bl3 = "{{/data}} {{.datasource contacts type = nested}} {{.data}} {\"target\": \"MSContent.content\"} {{/data}}";
	var bl4 = "{{#if uid == [contactKey]}} <img src = \"{{url}}\"> {{/if}} {{/datasource}} {{/datasource}}";

	var content = bl1 + jsonloc + "\")" + bl2 + bl3 + bl4;

	var url = 'https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500';
	sdk.setContent(content);
	sdk.setData({
		//address: address,
		// width: width,
		// height: height,
		// zoom: zoom,
		// link: link,
		jsonloc: jsonloc
	});
	localStorage.setItem('jsonlocationforblock', jsonloc);
}

sdk.getData(function (data) {
	//address = data.address || '';
	// width = data.width || 400;
	// height = data.height || 300;
	// zoom = data.zoom || 15;
	// link = data.link || '';
	jsonloc = data.jsonloc || localStorage.getItem('jsonlocationforblock');
	paintSettings();
	paintSliderValues();
	paintMap();
});

document.getElementById('workspace').addEventListener("input", function () {
	debounce(paintMap, 500)();
	paintSliderValues();
});