import BadWordsFilter from 'bad-words';
import { Game } from 'chainlinked';
import Papa from 'papaparse';
import seedrandom from 'seedrandom';

var filter = new BadWordsFilter();

// Load the CSV file and parse it
const loadData = async (): Promise<{ [key: string]: string[] }> => {
    const c1_to_c2: { [key: string]: string[] } = {};

    const response = await fetch('/LADECv1-2019.csv');
    const csvText = await response.text();

    Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
            results.data
                .filter(shouldInclude)
                .forEach(({ c1, c2 }: any) => {
                    if (!c1_to_c2[c1]) {
                        c1_to_c2[c1] = [];
                    }

                    c1_to_c2[c1].push(c2);
                });
        }
    });

    return c1_to_c2;
};

const shouldInclude = (row: any): boolean => {
    const { c1, c1len, c2, c2len, isPlural, correctParse, isCommonstim } = row;

    if (c1len > 7 || c2len > 7) {
        return false;
    }

    if (isPlural === "1" || correctParse === "no" || isCommonstim === "0") {
        return false;
    }

    if (c1.includes(' ') || c2.includes(' ')) {
        return false;
    }

    if (filter.isProfane(c1) || filter.isProfane(c2)) {
        return false;
    }

    return true;
}

// Function to generate a sequence
export const generateGame = async (length: number, gameKey?: string): Promise<Game> => {

    if (gameKey === undefined) {
        gameKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    const rng = seedrandom(gameKey);

    const c1_to_c2: { [key: string]: string[] } = await loadData();

    const skipList: string[] = [];
    const sequence: string[] = [];

    while (sequence.length < length) {
        if (sequence.length === 0) {
            // Pick a starting word
            const choices = Object.keys(c1_to_c2).filter(e => !skipList.includes(e));
            const choice = choices[Math.floor(rng() * choices.length)];
            skipList.push(choice);
            sequence.push(choice);
        }

        const lastWord = sequence[sequence.length - 1];
        const c2Values = (c1_to_c2[lastWord] || []).filter(c2 => !skipList.includes(c2));

        if (c2Values.length === 0) {
            skipList.push(lastWord);
            sequence.pop();
            continue;
        }

        const choice = c2Values[Math.floor(rng() * c2Values.length)];
        skipList.push(choice);
        sequence.push(choice);
    }

    var game: Game = {

        words: sequence.map(word => ({
            guesses: [],
            text: word,
            revealed: false,
            unlocked: false,
            strikes: 0
        })),
        mistakesRemaining: 4,

        gameKey: gameKey
    };

    game.words[0].revealed = true;
    game.words[1].unlocked = true;

    return game;
};