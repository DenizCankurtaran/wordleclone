const prompts = require('prompts');
const { readFileSync } = require('fs');
const chalk = require('chalk')

const data = readFileSync('words.txt', 'utf8');
const words = data.toString().split('\n');
const randomIndex = Math.floor(Math.random() * words.length);

let running = true;

const round = async (randomWord: string, tries: Array<String>) => {
	console.log(tries,tries.map(word => {
			const row = []
			for (let i = 0; i < word.length; i++) {
				console.log(word, word.charAt(i), randomWord.charAt(i));

				if (word.charAt(i) === randomWord.charAt(i)) row.push('🟩')
				else if (randomWord.includes(word.charAt(i))) row.push('🟨')
				else row.push('⬜️')
			}
			return row.join('')
		}) );

	const response = await prompts({
		type: 'text',
		name: 'guess',
		message: tries.length < 1 ? '⬜️⬜️⬜️⬜️⬜️' : '\n' + tries.map(word => {
			const row = []
			for (let i = 0; i < word.length; i++) {
				console.log(word, word.charAt(i), randomWord.charAt(i));

				if (word.charAt(i) === randomWord.charAt(i)) row.push('🟩')
				else if (randomWord.includes(word.charAt(i))) row.push('🟨')
				else row.push('⬜️')
			}
			return row.join('')
		}).join('\n'),
		validate: (guess: string) => words.includes(guess) ? true : 'invalid word'
	});

	console.log(response);
	return response.guess
}

const game = async () => {
	const randomWord = words[randomIndex];
	console.log(randomWord);

	const tries: Array<String> = []
	while (running) {
		let guess: string = await round(randomWord, tries)
		if (guess === randomWord) running = false;
		else tries.push(guess)

	}
}
game();