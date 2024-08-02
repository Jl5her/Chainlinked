import { HowToPlayModal, Keyboard, Mistakes, ModalRef, RandomGameButton, Row } from "./components";
import { Word } from "chainlinked";
import useChainlink from "./useChainlink";
import { createRef, useEffect, useMemo } from "react";
import './App.scss';
import GameOverModal from "./components/GameOverModal";
import constants from "./constants";

const App = () => {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  const todayKey = new Date(Date.now() - tzoffset).toISOString().split('T')[0]

  const howToPlay = createRef<ModalRef>();
  const gameOver = createRef<ModalRef>();

  const isMobileDevice = window.navigator.maxTouchPoints > 2;
  var url = new URLSearchParams(window.location.search);
  const gameKey = url.get('gameKey') ?? todayKey;

  const { words, wordRefs, currentGuess, handleKeyPress } = useChainlink(gameKey);

  const totalStrikes = useMemo(() => {
    return words?.reduce((acc, word) => acc + word.strikes, 0);
  }, [words]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) return;
    handleKeyPress(event.key);
  };

  useEffect(() => {
    if (totalStrikes >= constants.MAX_STRIKES) {
      gameOver.current?.open();
    }

    const gameWon = words != null && words.length > 0 && words.every((word) => word.revealed) && totalStrikes < constants.MAX_STRIKES;
    if (gameWon) {
      gameOver.current?.open();
    }
  }, [words, gameOver, totalStrikes])

  return <>
    <HowToPlayModal ref={howToPlay} />
    <GameOverModal ref={gameOver}
      words={words}
      gameKey={gameKey} />

    <div className="App">
      <div className="gameBar">
        <button
          className="button"
          onClick={() => howToPlay.current?.open()}>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="24.000000pt" height="24.000000pt" viewBox="0 0 24.000000 24.000000" preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,24.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
              <path d="M71 206 c-87 -48 -50 -186 49 -186 51 0 100 49 100 99 0 75 -83 124 -149 87z m104 -31 c33 -32 33 -78 0 -110 -49 -50 -135 -15 -135 55 0 41 39 80 80 80 19 0 40 -9 55 -25z" />
              <path d="M90 165 c-17 -20 -5 -32 15 -15 26 22 43 -4 20 -30 -10 -11 -15 -23 -12 -27 10 -9 47 27 47 47 0 37 -47 53 -70 25z" />
              <path d="M110 70 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
            </g>
          </svg>
        </button>

        <button className="button" onClick={() => { gameOver.current?.open(); }}>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="50.000000pt" height="50.000000pt" viewBox="0 0 50.000000 50.000000" preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,50.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
              <path d="M340 230 l0 -230 70 0 70 0 0 230 0 230 -70 0 -70 0 0 -230z m120 0 l0 -210 -50 0 -50 0 0 210 0 210 50 0 50 0 0 -210z" />
              <path d="M20 165 l0 -165 70 0 70 0 0 165 0 165 -70 0 -70 0 0 -165z m120 0 l0 -145 -50 0 -50 0 0 145 0 145 50 0 50 0 0 -145z" />
              <path d="M180 110 l0 -110 70 0 70 0 0 110 0 110 -70 0 -70 0 0 -110z m120 0 l0 -90 -50 0 -50 0 0 90 0 90 50 0 50 0 0 -90z" />
            </g>
          </svg>
        </button>

        <RandomGameButton />
      </div>

      <div className="title">
        <div>
          <h1>Chain Linked</h1>
          <p className="datestring">{gameKey}</p>
        </div>
        <p>Chain the words together.</p>
      </div>

      <div className="Game">
        {words.length === 0 ? <div className="lds-ripple"><div></div><div></div></div> : <></>}
        {words.map((word: Word, index: number) =>
          <Row
            key={`word-${index}`}
            ref={wordRefs[word.text]}
            word={word}
            totalStrikes={totalStrikes}
            currentGuess={currentGuess} />
        )}
      </div>
      {!isMobileDevice ?
        <input
          className="hidden-input"
          onKeyDown={handleKeyDown}
          onBlur={({ target }) => target.focus()}
          autoFocus /> : <></>}

      <Mistakes totalStrikes={totalStrikes} />
      <Keyboard onKeyPress={handleKeyPress} />
    </div>
  </>

}

export default App;
