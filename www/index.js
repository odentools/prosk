$(function () {
	var droppable = $("#droppable");

	if (!window.FileReader) {
		console.log("File API がサポートされていません。");
		return false;
	}

	var cancelEvent = function (event) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	}

	droppable.bind("dragenter", cancelEvent);
	droppable.bind("dragover", cancelEvent);

	var handleDroppedFile = function (event) {
		// ファイルは複数ドロップされる可能性がありますが, ここでは 1 つ目のファイルを扱います.
		var file = event.originalEvent.dataTransfer.files[0];
		var type = file.type;

		var fileReader = new FileReader();

		fileReader.onload = function (event) {

			var zipFile = new JSZip(event.target.result);

			//zipFileLoaded["pde/HT14A039.pde"]

			console.log(zipFile);

			var postList = new Object();


			for ( var pdeFileName in zipFile.files) {

				//console.log(pdeFileName);

				var postData = new Object();


				postData.userId = pdeFileName.substr(0,8);
				postData.userName = pdeFileName.split("_")[0];
				postData.content = zipFile.files[pdeFileName].asText();

				postList[postData.userId]=postData;
			}

			$.ajax({
				url:"/pdeList",
				type:"post",
				data:JSON.stringify(postList),
				contentType: "application/json",
				success: function(data) {
					var redirect_url = "/" + data + location.search;
					if (document.referrer) {
						var referrer = "referrer=" + encodeURIComponent(document.referrer);
						redirect_url = redirect_url + (location.search ? '&' : '?') + referrer;
					}
					location.href = redirect_url;

				}
			});
		}

		fileReader.readAsArrayBuffer(file);

		event.preventDefault();
		event.stopPropagation();

		return false;
	}

	droppable.bind("drop", handleDroppedFile);
});
