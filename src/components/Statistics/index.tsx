import { Game } from "chainlinked";
import "./Statistics.scss";

type StatisticsProps = {
    games: Game[];
}

const Statistics = ({ games }: StatisticsProps) => {

    const played = games.length;
    const wins = games.filter((g) => g.mistakesRemaining > 0 && g.words.find(w => !w.revealed) == null).length;
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
        <ul className="stats">
            <li>
                <span>{games.length}</span>
                <label>Played</label>
            </li>
            <li>
                <span>{winPercentage}</span>
                <label>Win %</label>
            </li>
            <li>
                <span>{currentStreak}</span>
                <label>Current Streak</label>
            </li>
            <li>
                <span>{maxStreak}</span>
                <label>Max Streak</label>
            </li>
        </ul>
    </div>
}

export default Statistics