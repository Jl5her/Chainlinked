import { MouseEventHandler } from 'react';
import './Keyboard.scss';

type KeyboardProps = {
    onKeyPress: (key: string) => void;
}

const Keyboard = ({ onKeyPress }: KeyboardProps) => {

    const handleKeyPress: MouseEventHandler<HTMLButtonElement> = (event) => {
        const key = (event.currentTarget as HTMLButtonElement).getAttribute('data-key');
        if (key !== null) {
            onKeyPress(key);
        }
    }

    return (
        <div className="Keyboard" role="group">
            <div className="Keyboard-row">
                <button type="button" data-key="q" className="Key" onClick={handleKeyPress}>
                    q
                </button>
                <button type="button" data-key="w" className="Key" onClick={handleKeyPress}>
                    w
                </button>
                <button type="button" data-key="e" className="Key" onClick={handleKeyPress}>
                    e
                </button>
                <button type="button" data-key="r" className="Key" onClick={handleKeyPress}>
                    r
                </button>
                <button type="button" data-key="t" className="Key" onClick={handleKeyPress}>
                    t
                </button>
                <button type="button" data-key="y" className="Key" onClick={handleKeyPress}>
                    y
                </button>
                <button type="button" data-key="u" className="Key" onClick={handleKeyPress}>
                    u
                </button>
                <button type="button" data-key="i" className="Key" onClick={handleKeyPress}>
                    i
                </button>
                <button type="button" data-key="o" className="Key" onClick={handleKeyPress}>
                    o
                </button>
                <button type="button" data-key="p" className="Key" onClick={handleKeyPress}>
                    p
                </button>

            </div>
            <div className="Keyboard-row">
                <div data-testid="spacer" className="Key Spacer">

                </div>
                <button type="button" data-key="a" className="Key" onClick={handleKeyPress}>
                    a
                </button>
                <button type="button" data-key="s" className="Key" onClick={handleKeyPress}>
                    s
                </button>
                <button type="button" data-key="d" className="Key" onClick={handleKeyPress}>
                    d
                </button>
                <button type="button" data-key="f" className="Key" onClick={handleKeyPress}>
                    f
                </button>
                <button type="button" data-key="g" className="Key" onClick={handleKeyPress}>
                    g
                </button>
                <button type="button" data-key="h" className="Key" onClick={handleKeyPress}>
                    h
                </button>
                <button type="button" data-key="j" className="Key" onClick={handleKeyPress}>
                    j
                </button>
                <button type="button" data-key="k" className="Key" onClick={handleKeyPress}>
                    k
                </button>
                <button type="button" data-key="l" className="Key" onClick={handleKeyPress}>
                    l
                </button>
                <div data-testid="spacer" className="Key Spacer">
                </div>

            </div>
            <div className="Keyboard-row">
                <button type="button" data-key="Enter" className="Key-Enter" onClick={handleKeyPress}>
                    enter
                </button>
                <button type="button" data-key="z" className="Key" onClick={handleKeyPress}>
                    z
                </button>
                <button type="button" data-key="x" className="Key" onClick={handleKeyPress}>
                    x
                </button>
                <button type="button" data-key="c" className="Key" onClick={handleKeyPress}>
                    c
                </button>
                <button type="button" data-key="v" className="Key" onClick={handleKeyPress}>
                    v
                </button>
                <button type="button" data-key="b" className="Key" onClick={handleKeyPress}>
                    b
                </button>
                <button type="button" data-key="n" className="Key" onClick={handleKeyPress}>
                    n
                </button>
                <button type="button" data-key="m" className="Key" onClick={handleKeyPress}>
                    m
                </button>
                <button type="button" data-key="Backspace" className="Key Backspace" onClick={handleKeyPress}>
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" className="game-icon" data-testid="icon-backspace">
                        <path fill="var(--color-tone-1)" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
                    </svg>
                </button>
            </div>
        </div>

    )
}

export default Keyboard;