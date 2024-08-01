import { Game, Word } from "chainlinked";
import { useCallback, useEffect, useState } from "react";
import { generateGame } from "./Game";

const loadGame = (gameKey: string): Game | null => {
    const savedGames = localStorage.getItem('chainlink-games');
    const games = savedGames !== null ? JSON.parse(savedGames).games : [];

    return games.find((g: Game) => g.gameKey === gameKey);
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

    // const loadGame = (game: Game) => {
    //     // set states for the game.
    //     setWords(game.data.words);
    //     setMistakesRemaining(game.data.mistakesRemaining);
    // }

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

    const saveGame = useCallback((game: Game) => {
        const savedGames = localStorage.getItem('chainlink-games');
        const games = savedGames !== null ? JSON.parse(savedGames).games : [];

        let index = games.findIndex((g: Game) => g.gameKey === game.gameKey);
        if (index !== -1) {
            games[index] = game;
        } else {
            games.push(game);
        }

        localStorage.setItem('chainlink-games', JSON.stringify({ games }));
    }, [words])

    const saveState = useCallback(() => {
        saveGame({
            words,
            mistakesRemaining,
            gameKey
        })
    }, [saveGame, gameKey, words, mistakesRemaining])

    const saveWords = useCallback((newWords: Word[]) => {
        setWords(newWords);
        saveGame({
            words: newWords,
            mistakesRemaining,
            gameKey
        });
    }, []);

    const submitWord = useCallback(() => {
        let currentWord = words.find(w => !w.revealed && w.unlocked);
        if (currentWord) {
            setCurrentGuess('');
            const isCorrect = currentWord.text.substring(currentWord.strikes + 1).toLowerCase() === currentGuess.toLowerCase();

            // Check if the word is correct
            if (isCorrect) {
                console.log("Correct!")
                let index = words.findIndex(w => w.text === currentWord!.text);

                let newWords = words.map((w => w.text === currentWord!.text ? { ...w, revealed: true } : w));

                if (index < words.length - 1) {
                    newWords = newWords.map((w, i) => i === index + 1 ? { ...w, unlocked: true } : w);
                }

                saveWords(newWords);
            } else {
                console.log("Incorrect!");
                let newWords = words.map(w => w.text === currentWord!.text ? { ...w, strikes: w.strikes + 1 } : w);
                saveWords(newWords);
                setMistakesRemaining(prev => prev - 1);
            }
        }

        // saveState();
    }, [words, currentGuess])

    const handleKeyPress = useCallback((key: string) => {
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
    }, [words, currentGuess, submitWord])

    return {
        words,
        mistakesRemaining,
        submitWord,
        handleKeyPress,
        currentGuess
    }
}

export default useChainlink;