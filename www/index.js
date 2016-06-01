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
		
		var fileName = file.name.split(".");
		var fileExtention = fileName[fileName.length - 1].toLowerCase();

		var zipFileReader = new FileReader();
		var pdeFileReader = new FileReader();

		zipFileReader.onload = function (event) {

			var zipFile = new JSZip(event.target.result);

			var postList = new Object();

			for ( var pdeFileName in zipFile.files) {

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
					var redirect_url = "/" + data+ "/" + location.search;
					if (document.referrer) {
						var referrer = "referrer=" + encodeURIComponent(document.referrer);
						redirect_url = redirect_url + (location.search ? '&' : '?') + referrer;
					}
					location.href = redirect_url;

				}
			});
		}
		
		pdeFileReader.onload = function (event) {

			var postData = new Object();
			postData.content = event.target.result;
						
			$.ajax({
				url:"/pdeFile",
				type:"post",
				data:JSON.stringify(postData),
				contentType: "application/json",
				success: function(data) {
					var redirect_url = "/pde/" + data + ".pde" + location.search;
					if (document.referrer) {
						var referrer = "referrer=" + encodeURIComponent(document.referrer);
						redirect_url = redirect_url + (location.search ? '&' : '?') + referrer;
					}
					location.href = redirect_url;

				}
			});
			
		}
		
		
		if(fileExtention=="zip")
			zipFileReader.readAsArrayBuffer(file);
		if(fileExtention=="pde")
			pdeFileReader.readAsText(file);

		event.preventDefault();
		event.stopPropagation();

		return false;
	}

	droppable.bind("drop", handleDroppedFile);
});
