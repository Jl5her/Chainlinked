import { HowToPlayModal, HowToPlayModalRef, Keyboard, Mistakes, Row } from "./components";
import { Word } from "chainlinked";
import useChainlink from "./useChainlink";
import { createRef } from "react";
import './App.scss';

const App = () => {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  const todayKey = new Date(Date.now() - tzoffset).toISOString().split('T')[0]

  const howToPlay = createRef<HowToPlayModalRef>();

  const isMobileDevice = window.navigator.maxTouchPoints > 2;
  var url = new URLSearchParams(window.location.search);
  const gameKey = url.get('gameKey') ?? todayKey;

  const { words, mistakesRemaining, currentGuess, handleKeyPress } = useChainlink(gameKey);

  const randomGame = () => {
    // navigate to ?gameKey=randomGameKey where randomGameKey is a random string of 10 characters
    const randomGameKey = Math.random().toString(36).substring(2, 12);
    window.location.search = `gameKey=${randomGameKey}`;

  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) return;
    handleKeyPress(event.key);
  };

  return <>
    <HowToPlayModal ref={howToPlay} />

    <div className="App">
      <div className="gameBar">
        <button onClick={() => howToPlay.current?.open()}>How To Play</button>
        <button onClick={randomGame}>Random Game</button>
      </div>

      <div className="title">
        <div>
          <h1>Chain Linked</h1>
          <p className="datestring">{gameKey}</p>
        </div>
        <p>Chain the words together.</p>
      </div>

      <div className="Game">
        {words.map((word: Word, index: number) =>
          <Row
            key={`word-${index}`}
            word={word}
            currentGuess={currentGuess} />
        )}
      </div>
      {!isMobileDevice ?
        <input
          className="hidden-input"
          onKeyDown={handleKeyDown}
          onBlur={({ target }) => target.focus()}
          autoFocus /> : <></>}

      <Mistakes remaining={mistakesRemaining} />
      <Keyboard onKeyPress={handleKeyPress} />
    </div>
  </>

}

export default App;
