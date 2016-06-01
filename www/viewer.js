var pde = {};

$(document).ready(function () {

	paintStudents();
	
	openFrameAll();
});




function aryMatch(ary1, ary2) {
	var matchCount = 0;
	var loopCount = 0;
	for (var i = 0, leni = ary1.length; i < leni; i++) {
		if (ary1[i].substring(0, 2) == "//" || ary1[i] == "") {
			continue;
		}
		loopCount++;
		for (var j = 0, lenj = ary2.length; j < lenj; j++) {
			if (ary1[i] == ary2[j]) {
				matchCount++;
				break;
			}
		}
	}
	return (matchCount / loopCount).toFixed(2);
}

function copyCheck() {
	
	var functionList = $("#functionList").val().split(",");
	for (var i = 0, leni = functionList.length; i < leni; i++) {
		functionList[i] = functionList[i].replace(/ /g, "");
	}

	for (var i in pde) {
		var matchList = "";
		var returnMessage = "";
		for (var j in pde) {
			if (i != j) {
				var matchRate = aryMatch(pde[i].aryNoSpace, pde[j].aryNoSpace);
				if (matchRate > 0.4) {
					matchList += j + ": " + matchRate + "\n";
				}
			}
		}
  
		// コメントチェック
		if (pde[i].ary[0].substring(0, 2) != "//") {
			returnMessage += "先頭行のコメントがありません\n\n";
		}
  
		// 必須関数チェック
		var functionCheck = false;
		for (var j = 0, lenj = functionList.length; j < lenj; j++) {
			if (pde[i].noSpaceTxt.toLowerCase().indexOf(functionList[j].toLowerCase()) == -1) {
				if (functionCheck == false) {
					returnMessage += "必須関数がありません\n";
					functionCheck = true;
				}
				returnMessage += functionList[j] + "\n";
			}
		}

		if (functionCheck == true) {
			returnMessage += "\n";
		}
  
		// コピペチェック
		if (matchList != "") {
			returnMessage += "類似の回答があります\n";
			returnMessage += matchList + "\n\n";
		}

		$("#" + i + '-count').html(returnMessage);
	}

}

function paintStudents() {

	$("#StudentTable table").empty();
	for (var i = 0, leni = studentList.length; i < leni; i++) {
		$("#StudentTable table").append($('<tr>').append('<td>' + studentList[i].id + '<br>' + studentList[i].name + '<br>' + '<button type="button" onclick="openFrame(\''+studentList[i].id+'\')">開く/再読み込み</button><button type="button" onclick="closeFrame(\''+studentList[i].id+'\')">閉じる</button>' + '<td>' + '<iframe height="0px" width="0px" id="'+ studentList[i].id + '"></iframe>' + '<td>' + "<textarea id=\"" + studentList[i].id + '-txt' + "\" cols=40 rows=20 disabled></textarea>" + '<td>' + "<textarea id=\"" + studentList[i].id + '-count' + "\" cols=40 rows=20 disabled></textarea>"));
		var forCount = i;
		(function (i) {

			$.get("./pde/" + studentList[i].id + ".pde", function (result) {
				pde[studentList[i].id] = {};
				pde[studentList[i].id].txt = result;
				pde[studentList[i].id].noSpaceTxt = result.replace(/\s/g, "");

				// 行毎に配列に格納
				pde[studentList[i].id].ary = pde[studentList[i].id].txt.split(/\r\n|\r|\n/);

				// 行頭の空白を削除
				for (var j = 0, lenj = pde[studentList[i].id].ary.length; j < lenj; j++) {
					pde[studentList[i].id].ary[j] = jQuery.trim(pde[studentList[i].id].ary[j]);
				}

				pde[studentList[i].id].aryNoSpace = [];
				//行内の空白を削除し格納
				for (var j = 0, lenj = pde[studentList[i].id].ary.length; j < lenj; j++) {
					pde[studentList[i].id].aryNoSpace[j] = pde[studentList[i].id].ary[j].replace(/\s/g, "")
				}

				$("#" + studentList[i].id + '-txt').html(pde[studentList[i].id].txt);

			});
		})(forCount);
	}


}


function openFrame(id){
	$("#"+id)[0].src= "pde.html?pde=" + id;
	$("#"+id)[0].width = "500px";
	$("#"+id)[0].height = "500px";
}

function closeFrame(id){
	$("#"+id)[0].src= "";
	$("#"+id)[0].width = "0px";
	$("#"+id)[0].height = "0px";
}


function openFrameAll(){
	for (var i = 0, leni = studentList.length; i < leni; i++) {
		openFrame(studentList[i].id);
	}
}

function closeFrameAll(){
	for (var i = 0, leni = studentList.length; i < leni; i++) {
		closeFrame(studentList[i].id);
	}
}
