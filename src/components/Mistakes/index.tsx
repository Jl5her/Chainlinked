import constants from '../../constants';
import './Mistakes.scss';

type MistakeProps = {
    totalStrikes: number;
}

const Mistakes = ({ totalStrikes }: MistakeProps) => {
    const remaining = constants.MAX_STRIKES - totalStrikes;
    if (remaining <= 0) return <p className='mistake-text'></p>;

    return <p className="mistake-text">Mistakes remaining:
        <span className="mistakes">
            {Array.from({ length: remaining }).map((_, index) => (
                <span key={`mistake-${index}`} className="mistake-bubble"></span>
            ))}
        </span>
    </p>
}

export default Mistakes;