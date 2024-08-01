import { Game, Word } from "chainlinked";
import { useCallback, useEffect, useState } from "react";
import { generateGame } from "./Game";

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
    const [mistakesRemaining, setMistakesRemaining] = useState(loadGame(gameKey)?.mistakesRemaining ?? 4);
    const [currentGuess, setCurrentGuess] = useState('')

    const createGame = useCallback(async (gameKey: string) => {
        var game = await generateGame(7, gameKey);
        saveGame(game);

        let loadedGame = loadGame(gameKey);
        setWords(loadedGame?.words ?? [])
        setMistakesRemaining(loadedGame?.mistakesRemaining ?? 4)
    }, [])

    // Attempt to load game when the game key changes
    useEffect(() => {
        const savedGames = localStorage.getItem('chainlink-games');
        const games = savedGames !== null ? JSON.parse(savedGames).games : [];

        let game = games.find((g: Game) => g.gameKey === gameKey);
        if (game === undefined) {
            game = createGame(gameKey);
            return;
        }

        // loadGame(game);
    }, [gameKey, createGame])

    const saveState = useCallback((newWords: Word[] | null = null, newMistakes: number | null = null) => {
        if (newWords !== null) {
            setWords(newWords);
        } else {
            newWords = words;
        }

        if (newMistakes != null) {
            setMistakesRemaining(newMistakes);
        } else {
            newMistakes = mistakesRemaining;
        }

        saveGame({
            words: newWords,
            mistakesRemaining: newMistakes,
            gameKey
        });
    }, [gameKey, words, mistakesRemaining]);

    const submitWord = useCallback(() => {
        if (mistakesRemaining <= 0) return;

        let currentWord = words.find(w => !w.revealed && w.unlocked);
        if (currentWord) {
            setCurrentGuess('');
            const isCorrect = currentWord.text.substring(currentWord.strikes + 1).toLowerCase() === currentGuess.toLowerCase();

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

                saveState(newWords, mistakesRemaining - 1);
            }
        }
    }, [words, currentGuess, mistakesRemaining, saveState])

    const handleKeyPress = useCallback((key: string) => {
        if (mistakesRemaining <= 0) return;

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
    }, [words, currentGuess, submitWord, mistakesRemaining])

    return {
        words,
        mistakesRemaining,
        submitWord,
        handleKeyPress,
        currentGuess
    }
}

export default useChainlink;