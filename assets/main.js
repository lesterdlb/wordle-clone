import { words } from './words.js';

const Game = {
	currentAttempt: 0,
	currentWord: '',
	answer: '',
	history: [],
};

const deleteKey = 'backspace';
const enterKey = 'enter';

// CSS
const filledClass = 'filled';
const correctClass = 'correct';
const absentClass = 'absent';
const presentClass = 'present';
const errorClass = 'error-message visible';

// UI
const errors = document.getElementById('errors');
const attempts = document.getElementsByClassName('attempt');
const keyboard = document.getElementsByClassName('keyboard')[0];

// Events handlers
const handleKey = key => {
	if (Game.history.length > 5) return;

	if (key.toLowerCase() === deleteKey) {
		deleteLetter();
		return;
	}
	if (key.toLowerCase() === enterKey) {
		checkAttempt();
		return;
	}
	if (/^[a-z]$/i.test(key)) {
		writeLetter(key);
	}
};

const onKeyboardClick = event => {
	if (event.target.type === 'submit' && Game.currentAttempt < 6) {
		event.target.blur(); // Ignore Focus
		if (event.target.classList.contains('delete')) {
			handleKey(deleteKey);
			return;
		}
		if (event.target.classList.contains(enterKey)) {
			handleKey(enterKey);
			return;
		}
		handleKey(event.target.innerHTML);
	}
};

const handleErrorClick = event => event.target.parentNode.removeChild(event.target);

//Events
keyboard.addEventListener('click', onKeyboardClick);
document.addEventListener('keydown', event => handleKey(event.key));

// Keyboard
const highlightKeyboardLetter = (letter, className) => {
	const element = [...keyboard.querySelectorAll('.key')].filter(e => {
		return e.textContent.includes(letter.toUpperCase());
	});
	element[0].classList.add(className);
};

const disableKeyboard = () => [...keyboard.children].forEach(b => (b.disabled = true));

// Generic functions
const writeLetter = letter => {
	if (Game.currentWord.length > 4) return;

	const element = attempts[Game.currentAttempt].children[Game.currentWord.length];
	element.innerHTML = letter;
	element.classList.add(filledClass);

	Game.currentWord += letter.toLowerCase();
};

const deleteLetter = () => {
	if (Game.currentWord.length === 0) return;

	const element = attempts[Game.currentAttempt].children[Game.currentWord.length - 1];
	element.innerHTML = '';
	element.classList.remove(filledClass);

	Game.currentWord = Game.currentWord.slice(0, Game.currentWord.length - 1);
};

const highlightCurrentWord = () => {
	[...Game.currentWord].forEach((char, index) => {
		const letter = attempts[Game.currentAttempt].children[index];
		if (char === Game.answer[index]) {
			letter.classList.add(correctClass);
			highlightKeyboardLetter(char, correctClass);
		} else if (Game.answer.includes(char)) {
			letter.classList.add(presentClass);
			highlightKeyboardLetter(char, presentClass);
		} else {
			letter.classList.add(absentClass);
			highlightKeyboardLetter(char, absentClass);
		}
	});
};

const checkAttempt = loading => {
	if (Game.history.length > 6) return;

	if (Game.currentWord.length < 5) {
		addErrorMessage('There are not enough letters! 💡');
		return;
	}

	if (!words.includes(Game.currentWord)) {
		addErrorMessage('The word is not in the dictionary!  🤔');
		return;
	}

	highlightCurrentWord();

	!loading && Game.history.push(Game.currentWord);

	if (Game.currentWord === Game.answer) {
		alert('Victory! 😃');
		Game.currentAttempt = 6;
		disableKeyboard();
		return;
	}

	Game.currentAttempt++;
	Game.currentWord = '';

	if (Game.currentAttempt > 5) {
		alert('Defeat 😔');
		disableKeyboard();
	}
};

const addErrorMessage = error => {
	const element = document.createElement('div');
	element.className = errorClass;
	element.textContent = error;
	element.addEventListener('click', handleErrorClick);

	errors.appendChild(element);

	setTimeout(() => element.remove(), 3000);
};

const loadGame = () => {
	Game.answer = words[Math.floor(Math.random() * words.length)];

	console.log(`Answer = ${Game.answer} 😆`);
};

loadGame();
