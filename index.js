;(function() {
	'use strict';

	var fs 		= require('fs'),
		prompt 	= require('prompt'),
		_		= require('lodash'),
		asciimo = require('asciimo').Figlet;

	var ignore = [], words = [], score = 0, userName = '';

	fs.readFile('/usr/share/dict/words', function(err, data) {
		if (err)
			return console.log(err);

		// Split into array.
		data = data.toString().split('\n');

		// Filter words with atleast length of 5 and max of 10.
		data.forEach(function(word) {
			if (word.length >= 5 
				&& word.indexOf("'s") == -1
				&& /^[a-zA-Z]*$/.test(word)
				&& word.length <= 10) {
				words.push(word.toString('utf8'));
			}
		});

		// `words` ready to go!
		prompt.start();

		asciimo.write('dictaNoob', 'Colossal', function(art) {
			console.log(art.red);
			prompt.get({
				properties: {
					name: {
						description: 'Your good name'.red,
						required: true,
						type: 'string'
					}
				}
			}, function(err, result) {
				if (err) {
					// Exit app. deal with it.
					return false;
				}

				userName = result.name;

				playGame();
			});
		});
	});

	var playGame = function() {
		var word = getWord();
		if (null === word) {
			// OK. Game is over!
			console.log('Congratulations! You have played a complete game!'.green);
		}

		var size = word.length,	// string length
			pad  = 0,	// words to skip
			wordSet = [],
			wordPad = [];

		pad = Math.floor(size / 2);

		var points 	= [],
			k 		= 0;

		for (k; k < pad; k++) {
			points.push(_.random(0, size));
		}

		// Just keep unique! bonus for you!
		points = _.uniq(points);

		// Split characters.
		wordSet = word.split('');

		var userInputIndex = [];

		points.sort().forEach(function(p) {
			wordSet[p] = '_';
			userInputIndex.push({
				name: p,
				description: 'Word at position: '.red + p.toString().red,
				required: true,
				pattern: /^[a-zA-Z]$/,
    			message: 'It must be only alphabet.'
			});
		});

		// Join the words by `.`
		wordSet = wordSet.join('.');

		// Print the word.
		console.log(wordSet.green);

		prompt.get(userInputIndex, function(err, input) {
			wordSet = wordSet.split('.');
			Object.keys(input).forEach(function(k) {
				wordSet[k] = input[k];
			});

			var userWord = wordSet.join('');
			console.log('YOU: '.red + userWord.green);
			console.log(' WE: '.red + word.green);

			if (userWord == word) {
				score += 10;
				console.log('%s! You made it! You made it dude! Its correct!!'.yellow, userName);
			} else {
				score -= 5;
				console.log('%s, Duh! badluck! :-('.yellow, userName);
			}

			console.log('Your Score: '.red, score);

			prompt.get([{
				description: 'Would you like to play again?'.red,
				message: 'Type "Y" or "N"',
				name: 'play',
				required: true,
				conform: function(v) {
					if (v == 'Y' || v == 'N')
						return true;

					return false;
				}
			}], function(err, ok) {
				if (err) {
					// May be some error or Ctrl + c.
					return gameOver();
				}

				
				if (ok.play == 'Y') {
					playGame();
				} else {
					gameOver();
				}
			});
		});
	};

	var gameOver = function() {
		asciimo.write('Game over', 'Marquee', function(art) {
			console.log(art.white);	
		});
	};

	var getWord = function() {

		if (words.length == ignore.length) {
			return null;
		}

		var key = _.random(words.length);

		// If word is not in ignore list.
		if (ignore.indexOf(key) == -1) {
			var word = words[key];
			ignore.push(key);
			return word;
		}

		// Word found in ignore list.
		return getWord();
	}
})();