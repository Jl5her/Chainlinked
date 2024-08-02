const BadWordsFilter = require('bad-words');
const Papa = require('papaparse');
const seedrandom = require('seedrandom');
const fs = require('fs')

var filter = new BadWordsFilter();

// Load the CSV file and parse it
const loadData = async ()=> {
    const c1_to_c2 = {};

    const text = fs.readFileSync('./public/assets/LADECv1-2019.csv', 'utf8');

    Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            results.data
                .filter(shouldInclude)
                .forEach(({ c1, c2 }) => {
                    if (!c1_to_c2[c1]) {
                        c1_to_c2[c1] = [];
                    }

                    c1_to_c2[c1].push(c2);
                });
        }
    });

    return c1_to_c2;
};

const shouldInclude = (row) => {
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
const generateGame = async (length, gameKey = undefined) => {

    if (gameKey === undefined) {
        gameKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    const rng = seedrandom(gameKey);

    const c1_to_c2 = await loadData();

    const skipList = [];
    const sequence = [];

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

    var game = {
        words: sequence.map(word => ({
            guesses: [],
            text: word,
            revealed: false,
            unlocked: false,
            strikes: 0
        })),
        gameKey: gameKey
    };

    game.words[0].revealed = true;
    game.words[1].unlocked = true;

    return game;
};

const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
const todayKey = new Date(Date.now() - tzoffset).toISOString().split('T')[0]

generateGame(7, todayKey).then(game => {
    game.words.forEach((element, index) => {
        console.log(`Word ${index}: ${element.text}`);
    });
})