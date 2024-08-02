type ButtonProps = {
    label?: string;
}

const RandomGameButton = ({ label }: ButtonProps) => {
    const randomGame = () => {
        // navigate to ?gameKey=randomGameKey where randomGameKey is a random string of 10 characters
        const randomGameKey = Math.random().toString(36).substring(2, 12);
        window.location.search = `gameKey=${randomGameKey}`;
    }

    return <button className="button" onClick={randomGame}>
        {label ? <span>{label}</span> : <></>}
        <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="32.000000pt" height="32.000000pt" viewBox="0 0 32.000000 32.000000" preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,32.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                <path d="M68 288 c-38 -17 -68 -35 -68 -39 0 -5 14 -41 32 -80 28 -63 34 -70 55 -64 21 5 23 2 21 -27 -3 -31 -1 -33 52 -50 30 -10 68 -19 85 -21 28 -2 31 2 47 53 10 30 19 68 21 85 2 28 -2 31 -53 47 -52 17 -56 21 -79 73 -13 30 -29 55 -35 54 -6 0 -41 -14 -78 -31z m105 -50 c15 -34 26 -62 24 -63 -9 -7 -120 -55 -122 -53 -14 19 -54 123 -48 125 4 2 31 14 58 27 28 14 52 25 55 25 3 1 18 -27 33 -61z m119 -77 c9 -8 -27 -136 -38 -136 -23 1 -125 29 -129 36 -13 20 19 68 56 84 21 10 39 22 39 27 0 10 60 1 72 -11z" />
                <path d="M120 260 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                <path d="M50 230 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                <path d="M100 210 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                <path d="M150 190 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                <path d="M90 160 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                <path d="M200 110 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
            </g>
        </svg>
    </button>
}

export default RandomGameButton;