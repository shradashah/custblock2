require('../node_modules/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.css');

var SDK = require('blocksdk');
var sdk = new SDK(null, null, true); // 3rd argument true bypassing https requirement: not prod worthy

var jsonloc, default_content, content, bl1, l2, bl3, bl4;

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
}

function paintMap() {
	jsonloc = document.getElementById('text-input-id-0').value;

	bl1 = "%%[var @dataurl set @dataurl = HTTPGet(\"";
	bl2 = "{{.datasource MSContent source = @dataurl type = variable}}{{.data}} { \"target\": \"@dataurl\",\"filter\": \"uid == [contactKey]\"}";
	bl3 = "{{/data}} {{.datasource contacts type = nested}} {{.data}} {\"target\": \"MSContent.content\"} {{/data}}";
	bl4 = "{{#if uid == [contactKey]}} <img src =\"{{url}}\" height=300 width=500> {{/if}} {{/datasource}} {{/datasource}}";

	content = bl1 + jsonloc + "\")]%% " + bl2 + bl3 + bl4;

	default_content = "<p><h4><b>Content Recommendation Powered by Hux&copy;</b></p>";
	sdk.setSuperContent(default_content, (newSuperContent) => {});
	sdk.setContent(content);
	sdk.setData({
		jsonloc: jsonloc
	});
	localStorage.setItem('jsonlocationforblock', jsonloc);
}

sdk.getData(function (data) {
	jsonloc = data.jsonloc || localStorage.getItem('jsonlocationforblock');
	paintSettings();
	paintMap();
});

document.getElementById('workspace').addEventListener("input", function () {
	debounce(paintMap, 500)();
});