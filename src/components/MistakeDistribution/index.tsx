import { Game } from "chainlinked";
import "./MistakeDistribution.scss";

interface MistakeDistributionProps {
    games: Game[];
}

const MistakeDistribution = ({ games }: MistakeDistributionProps) => {

    // Calculate the distribution of mistakes remaining on games into buckets max remaining mistakes. Include in each bucket the percentage of the max it is.
    // First filtering out games that are not complete, then mapping the mistakes remaining to an array of mistakes.
    const mistakes = games
        .filter(g => g.mistakesRemaining === 0 || g.words.find(w => !w.revealed) == null)
        .map(g => g.mistakesRemaining);

    const maxMistakes = Math.max(...mistakes);
    const mistakeDistribution = Array(Math.max(4, maxMistakes) + 1).fill(0);
    mistakes.forEach(m => {
        mistakeDistribution[m] += 1;
    });

    const maxCount = Math.max(...mistakeDistribution);

    const getWidth = (count: number) => {
        const percentage = Math.round(100 * (count / maxCount));
        return `calc(${Math.max(7, percentage)}% + 8px)`
    }

    return <div className="distribution">
        <h2 className="mistakes-title">Mistake Distribution</h2>
        <div className="mistakeDistribution">
            {/* repeat make a loop of the length of mistakeDistribution (minimum 5) */}
            {mistakeDistribution.map((mistakes, index) => {
                return <div className="graphContainer">
                    <label>{index}</label>
                    <div className="graph">
                        <div className="bar" style={{ width: getWidth(mistakes) }}>
                            <span>{mistakes}</span>
                        </div>
                    </div>
                </div>
            })}
        </div>
    </div>
}

export default MistakeDistribution