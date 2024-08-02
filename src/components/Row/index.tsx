import { Word } from "chainlinked";
import { forwardRef, useMemo } from "react";
import "./Row.scss";
import constants from "../../constants";

type RowProps = {
    word: Word;
    currentGuess: string
    totalStrikes: number;
}

type LetterProps = {
    word: Word;
    letter: string;
    index: number;
    currentGuess: string;
    totalStrikes: number;
}

const Letter = ({ word, letter, index, currentGuess, totalStrikes }: LetterProps) => {
    const className = useMemo(() => {
        let classList = ['letter'];

        if (word.revealed || index === 0) {
            classList.push('revealed');
        }

        if (index > 0 && index <= word.strikes) {
            classList.push('incorrect');
        } else if (word.revealed && index > 0) {
            classList.push('correct');
        }

        if (classList.length === 1 && totalStrikes >= constants.MAX_STRIKES) {
            classList.push('gameOver');
        }

        return classList.join(' ');
    }, [word, index, totalStrikes]);

    const shownLetter = useMemo(() => {
        // If the word has been revealed, show all the letters.
        if (word.revealed) return letter;

        // If the game is over, show all the letters.
        if (totalStrikes >= constants.MAX_STRIKES) return letter;

        // Regardless of the state of the word, show the first letter.
        if (index === 0) return letter;

        // If the word has not been unlocked, don't show any letters.
        if (!word.unlocked) return '';

        // If the word has been unlocked, show the letter if it has been guessed incorrectly.
        if (index <= word.strikes) return letter;

        return currentGuess.split('')[index - 1 - word.strikes];
    }, [word, letter, index, currentGuess, totalStrikes])

    return <div key={`word-${word.text}-letter-${index}`} className={className}>
        {shownLetter}
    </div>

}

const Row = forwardRef<HTMLDivElement, RowProps>(({ word, currentGuess, totalStrikes }: RowProps, ref) => {
    return <div ref={ref} className={`word ${word.revealed ? 'revealed' : ''}`}>
        {word.text.split('').map((letter, index) =>
            <Letter
                key={`word-${word.text}-letter-${index}`}
                word={word}
                letter={letter}
                index={index}
                totalStrikes={totalStrikes}
                currentGuess={currentGuess} />
        )}
    </div>
})

export default Row;