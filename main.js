var app = {};

app.url = 'http://api.lyricsnmusic.com/songs';
app.key = function(){
	var key = "d70fcbedbb1bc88d8e4eb73b8d639d";
	return key
}

app.init = function(){
	$('.buttonDiv').on('click', function(){
		$('form').trigger('submit');
	});
	$('form').on('submit', function(e){
		e.preventDefault();
		if ($('.para')) {
			$('.resultsBox').empty();
		}
		var paraNum = $('select option:selected').val();
		var searchVal = $('.search').val().toLowerCase();
		app.getWords(paraNum, searchVal);
	});
}

app.getWords = function(paraVal, searchVal){
	var query = {
		api_key: app.key,
		artist: searchVal,
	}
	$.ajax({
		url: app.url,
		type : 'GET',
		dataType: 'jsonp',
		data: query,
		success: function(data) { 
			var storeArray = []
			for (var i = 0; i < data.data.length; i++) {
				//loop over each array item
				var snippet = data.data[i].snippet
				var lyrics = snippet.split('\r\n');
				lyrics.pop();
				//filter through lyrics array here
				for (var x = 0; x < lyrics.length; x++) {	
					var lastChar = lyrics[x].length - 1;
					var charCode = lyrics[x].charCodeAt(lastChar);
					if (charCode < 65 || charCode > 122) {
						lyrics[x] = lyrics[x].substr(0, lastChar);
					};
					if (!(lyrics[x] === '' || lyrics[x].charAt(0) === '[')) {
						storeArray.push(lyrics[x]);
					};
				};
			};
			if (storeArray.length === 0) {
				app.searchError();
				return;
			}
			var lyricsArray = app.removeDup(storeArray);
			console.log(lyricsArray);
			for (var i = 0; i < paraVal; i++) {
				app.insertParagraph(lyricsArray)
			};
		},
	});
};
app.removeDup = function(arr){
	var tempObj = {};
	var j = 1;
	for (var i = 0; i < arr.length; i++) {
		tempObj[arr[i]] = j;
		j++
	};
	var final = [];
	for (var key in tempObj) {
		final.push(key);
	} 	
	return final;
};
app.insertParagraph = function(arr){
	//empty array needed to push random array items into new sentence array
	var para = $('<div>').addClass('para');
	var paraText = $('<p>');
	for (var i = 0; i < 15; i++) {
		//loop through array and push 
		var phraseArray = []; 
		var num = Math.floor(Math.random()*arr.length);
		var lastChar = arr[num].length - 1
		var charCode = arr[num].charCodeAt(lastChar);
		if (charCode < 65 || charCode > 122) {
			var phrase = $('<span>').addClass('phrase').html(arr[num] + '  ');
		}
		else {
			var phrase = $('<span>').addClass('phrase').html(arr[num] + '.  ');
		}
		paraText.append(phrase);
		para.append(paraText);
	};
	$('.resultsBox').append(para);
};

app.searchError = function(){
	var para = $('<div>').addClass('para');
	var paraText = $('<p>').html("Hmmmm, that's not right. Check your search you savage!");
	para.append(paraText);
	$('.resultsBox').append(para);
};


$(function() {
	app.init();
});