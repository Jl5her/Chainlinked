import { Game } from "chainlinked";
import "./Statistics.scss";
import constants from "../../constants";

type StatisticsProps = {
    games: Game[];
}

const Statistics = ({ games }: StatisticsProps) => {
    const getTotalStrikes = (game: Game) => {
        return game.words.reduce((total, word) => total + word.strikes, 0);
    }

    const played = games.filter(g => getTotalStrikes(g) === constants.MAX_STRIKES || g.words.find(w => !w.revealed) == null).length;
    const wins = games.filter((g) => getTotalStrikes(g) < constants.MAX_STRIKES && g.words.find(w => !w.revealed) == null).length;
    const winPercentage = Math.round(100 * (wins / played));

    // Each game's gameKey is the date it was played. Determine the current streak by checking how many days in a row the user has played.
    const currentStreak = games.reduce((streak, game, index) => {
        if (index === 0) return 1;
        const prevGame = games[index - 1];
        const prevDate = new Date(prevGame.gameKey);
        const currentDate = new Date(game.gameKey);
        const diff = currentDate.getTime() - prevDate.getTime();
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        if (diffDays === 1) {
            return streak + 1;
        }
        return streak;
    }, 0);

    // Using the same logic for current streak, find the longest streak of consecutive games played
    const maxStreak = games.reduce((streak, game, index) => {
        if (index === 0) return 1;
        const prevGame = games[index - 1];
        const prevDate = new Date(prevGame.gameKey);
        const currentDate = new Date(game.gameKey);
        const diff = currentDate.getTime() - prevDate.getTime();
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        if (diffDays === 1) {
            return streak + 1;
        }
        return streak;
    }, 0);


    return <div className="statistics">
        <h2 className="stats-title">Statistics</h2>
        <div className="stats">
            <div>
                <span>{played}</span>
                <label>Played</label>
            </div>
            <div>
                <span>{winPercentage}</span>
                <label>Win %</label>
            </div>
            <div>
                <span>{currentStreak}</span>
                <label>Current Streak</label>
            </div>
            <div>
                <span>{maxStreak}</span>
                <label>Max Streak</label>
            </div>
        </div>
    </div>
}

export default Statistics