import './Mistakes.scss';

type MistakeProps = {
    remaining: number;
}

const Mistakes = ({ remaining }: MistakeProps) => {
    return <p className="mistake-text">Mistakes remaining:
        <span className="mistakes">
            {Array.from({ length: remaining }).map((_, index) => (
                <span key={`mistake-${index}`} className="mistake-bubble"></span>
            ))}
        </span>
    </p>
}

export default Mistakes;