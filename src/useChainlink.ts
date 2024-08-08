import { Game, Word } from "chainlinked";
import { createRef, useCallback, useEffect, useMemo, useState } from "react";
import { generateGame } from "./Game";
import constants from "./constants";
import wordExists from "word-exists";

const loadGame = (gameKey: string): Game | null => {
    const savedGames = localStorage.getItem('chainlink-games');
    const games = savedGames !== null ? JSON.parse(savedGames).games : [];

    return games.find((g: Game) => g.gameKey === gameKey);
}

const saveGame = (game: Game) => {
    const savedGames = localStorage.getItem('chainlink-games');
    const games = savedGames !== null ? JSON.parse(savedGames).games : [];

    let index = games.findIndex((g: Game) => g.gameKey === game.gameKey);
    if (index !== -1) {
        games[index] = game;
    } else {
        games.push(game);
    }

    localStorage.setItem('chainlink-games', JSON.stringify({ games }));
}

const useChainlink = (gameKey: string) => {
    const [words, setWords] = useState(loadGame(gameKey)?.words || []);
    const [currentGuess, setCurrentGuess] = useState('')

    // Map words to dictionary text to createRefs 
    const wordRefs = useMemo(() => {
        return words.reduce((acc, word) => {
            acc[word.text] = createRef();
            return acc;
        }, {} as { [key: string]: React.RefObject<HTMLDivElement> })
    }, [words])

    const alertRef = createRef<HTMLDivElement>();

    const totalStrikes = useMemo(() => {
        return words.reduce((acc, word) => acc + word.strikes, 0);
    }, [words])

    const createGame = useCallback(async (gameKey: string) => {
        var game = await generateGame(7, gameKey);
        saveGame(game);

        let loadedGame = loadGame(gameKey);
        setWords(loadedGame?.words ?? [])
    }, [])

    const showAlert = useCallback((alertMessage: string) => {
        const newAlert = document.createElement('span');
        newAlert.classList.add('alert');
        newAlert.textContent = alertMessage;
        alertRef?.current?.appendChild(newAlert);

        setTimeout(() => {
            newAlert.remove();
        }, 2.3 * 1000);
    }, [alertRef])

    // Attempt to load game when the game key changes
    useEffect(() => {
        const savedGames = localStorage.getItem('chainlink-games');
        const games = savedGames !== null ? JSON.parse(savedGames).games : [];

        let game = games.find((g: Game) => g.gameKey === gameKey);
        if (game === undefined) {
            createGame(gameKey);
        }
    }, [gameKey, createGame])

    const saveState = useCallback((newWords: Word[] | null = null) => {
        if (newWords !== null) {
            setWords(newWords);
        } else {
            newWords = words;
        }

        saveGame({
            words: newWords,
            gameKey
        });
    }, [gameKey, words]);

    const submitWord = useCallback(() => {
        if (totalStrikes >= constants.MAX_STRIKES) return;

        let currentWord = words.find(w => !w.revealed && w.unlocked);
        if (currentWord) {
            let currentWordRemaining = currentWord.text.substring(currentWord.strikes + 1)
            if (currentGuess.length !== currentWordRemaining.length) {
                return;
            }

            setCurrentGuess('');

            const guessWord = currentWord.text.substring(0, currentWord.strikes + 1) + currentGuess;

            if (!wordExists(guessWord)) {
                showAlert('Not in word list')
                return;
            }

            const isCorrect = currentWordRemaining.toLowerCase() === currentGuess.toLowerCase();

            // Check if the word is correct
            if (isCorrect) {
                let index = words.findIndex(w => w.text === currentWord!.text);

                let newWords = words.map((w => w.text === currentWord!.text ? { ...w, revealed: true } : w));

                if (index < words.length - 1) {
                    newWords = newWords.map((w, i) => i === index + 1 ? { ...w, unlocked: true } : w);
                }

                saveState(newWords);
            } else {
                let index = words.findIndex(w => w.text === currentWord!.text);
                let newWords = words.map(w => w.text === currentWord!.text ? { ...w, strikes: w.strikes + 1 } : w);

                if (currentWord.strikes + 1 >= currentWord.text.length - 1) {
                    newWords = newWords.map(w => w.text === currentWord!.text ? { ...w, revealed: true } : w);
                    if (index < newWords.length - 1) {
                        newWords = newWords.map((w, i) => i === index + 1 ? { ...w, unlocked: true } : w);
                    }
                }

                let wordRef = wordRefs[currentWord.text].current;
                wordRef?.classList.add('shake');

                setTimeout((ref) => {
                    ref?.classList.remove('shake');
                }, 1000, wordRef);

                saveState(newWords);
            }
        }
    }, [words, totalStrikes, currentGuess, saveState, wordRefs, showAlert])

    const handleKeyPress = useCallback((key: string) => {
        if (totalStrikes >= constants.MAX_STRIKES) return;

        let currentWord = words.find(w => !w.revealed && w.unlocked);
        if (!currentWord) return;

        if (key === 'Enter') {
            // Check mistakes, and length of currentWord
            submitWord()
        }

        if (key === 'Backspace') {
            setCurrentGuess(prev => prev.slice(0, prev.length - 1));
            return;
        }

        if (/^[A-Za-z]$/.test(key)) {
            // if (currentGuess.length < currentWord.length) {
            if (currentGuess.length < currentWord!.text.length - currentWord!.strikes - 1) {
                setCurrentGuess(prev => prev + key);
                return;
            }
        }
    }, [words, totalStrikes, currentGuess, submitWord])

    return {
        words,
        alertRef,
        wordRefs,
        showAlert,
        submitWord,
        handleKeyPress,
        currentGuess
    }
}

export default useChainlink;