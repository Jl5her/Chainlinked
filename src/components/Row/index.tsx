import { Word } from "chainlinked";
import "./Row.scss";
import { useMemo } from "react";

type RowProps = {
    word: Word;
    currentGuess: string
    mistakesRemaining: number
}

type LetterProps = {
    word: Word;
    letter: string;
    index: number;
    currentGuess: string;
    mistakesRemaining: number;
}

const Letter = ({ word, letter, index, currentGuess, mistakesRemaining }: LetterProps) => {
    const className = useMemo(() => {
        let classList = ['letter'];

        if (word.revealed || index === 0) {
            classList.push('revealed');
        }

        if (index > 0 && index <= word.strikes) {
            classList.push('incorrect');
        }

        if (word.revealed && index > 0) {
            classList.push('correct');
        }

        if (classList.length === 1 && mistakesRemaining <= 0) {
            classList.push('gameOver');
        }

        return classList.join(' ');
    }, [word, index, mistakesRemaining]);

    const shownLetter = useMemo(() => {
        // If the word has been revealed, show all the letters.
        if (word.revealed) return letter;

        // If the game is over, show all the letters.
        if (mistakesRemaining <= 0) return letter;

        // Regardless of the state of the word, show the first letter.
        if (index === 0) return letter;

        // If the word has not been unlocked, don't show any letters.
        if (!word.unlocked) return '';

        // If the word has been unlocked, show the letter if it has been guessed incorrectly.
        if (index <= word.strikes) return letter;

        return currentGuess.split('')[index - 1 - word.strikes];
    }, [word, letter, index, currentGuess, mistakesRemaining])

    return <div key={`word-${word.text}-letter-${index}`} className={className}>
        {shownLetter}
    </div>

}

const Row = ({ word, currentGuess, mistakesRemaining }: RowProps) => {

    // const lettersShown = useMemo(() => {
    //     if (word.revealed) {
    //         return word.text.split('');
    //     }
    //     return word.text.split('').filter((letter, index) => index === 0 || index <= word.strikes);
    // }, [word]);

    // const remainingLetters = useMemo(() => word.revealed ? 0 : word.text.length - 1 - word.strikes, [word])

    return (
        <div className={`word ${word.revealed ? 'revealed' : ''}`}>
            {word.text.split('').map((letter, index) =>
                <Letter
                    key={`word-${word.text}-letter-${index}`}
                    word={word}
                    letter={letter}
                    index={index}
                    mistakesRemaining={mistakesRemaining}
                    currentGuess={currentGuess} />
            )}
        </div>
    )
}

export default Row;