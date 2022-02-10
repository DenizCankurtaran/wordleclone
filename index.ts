const prompts = require('prompts');
const { readFileSync } = require('fs');
const chalk = require('chalk');

const getMessage = (randomWord: string, guesses: Array<String>) => {
	let message = guesses.map(word => {
		const row = []
		for (let i = 0; i < word.length; i++) {
			let currentChar = word.charAt(i);
			if (currentChar === randomWord.charAt(i)) row.push(chalk.bgGreen(currentChar))
			else if (randomWord.includes(currentChar)) row.push(chalk.bgYellow(currentChar))
			else row.push(chalk.bgGray(currentChar))
		}
		return row.join(' ')
	});
	
	for (let i = 0; i < 5 - guesses.length; i++  ) {
		let row = Array(5).fill(0).map(() => chalk.bgGray(' ')).join(' ');
		message.push(row);
	}
	return '\n' + message.join('\n') + '\n';
}

const round = async (randomWord: string, guesses: Array<String>, words: Array<String>) => {
	const response = await prompts({
		type: 'text',
		name: 'guess',
		message: getMessage(randomWord, guesses),
		validate: (guess: string) => words.includes(guess) ? true : 'invalid word'
	});
	return response.guess
}

const game = async () => {

	const data = readFileSync('words.txt', 'utf8');
	const words = data.toString().split('\n');
	const randomIndex = Math.floor(Math.random() * words.length);

	const randomWord = words[randomIndex];
	console.log(randomWord);

	const guesses: Array<String> = [];
	let tries = 0;
	while (true) {
		let guess: string = await round(randomWord, guesses, words)
		tries++;
		if (guess === randomWord) {
			console.log(chalk.green('Correct. The word was: ' + randomWord));
			break;
		} else if (tries > 5) {
			console.log(chalk.red('Wrong. The word was: ' + randomWord));
			break;
		} else guesses.push(guess)
	}

}
game();