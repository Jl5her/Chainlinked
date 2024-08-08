import { createRef, forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useState } from "react";
import Modal, { ModalRef } from "../Modal";
import { Game, Word } from "chainlinked";
import Statistics from "../Statistics";
import MistakeDistribution from "../MistakeDistribution";
import constants from "../../constants";
import RandomGameButton from "../RandomGameButton";
import AppContext from "../../context";
import "./GameOverModal.scss";

export interface GameOverModalProps {
    open?: boolean;
    words: Word[] | null;
    gameKey: string;
}

const GameOverModal = forwardRef<ModalRef, GameOverModalProps>((props, ref) => {
    const [open] = useState(props.open ?? false);
    const [games, setGames] = useState<Game[]>([]);
    const modalRef = createRef<ModalRef>();
    const { showAlert } = useContext(AppContext);

    useImperativeHandle(ref, () => ({
        open() {
            modalRef.current?.open()
            refreshGames();
        }
    }));

    const totalStrikes = useMemo(() => {
        return props.words?.reduce((acc, word) => acc + word.strikes, 0);
    }, [props.words]);

    const isGameOver = useMemo(() => {
        return props.words?.every((word) => word.revealed) || (totalStrikes ?? -1) >= constants.MAX_STRIKES;
    }, [props.words, totalStrikes]);

    const refreshGames = () => {
        const savedGames = localStorage.getItem('chainlink-games');
        const games = savedGames !== null ? JSON.parse(savedGames).games : [];
        setGames(games);
    }

    useEffect(() => refreshGames, [])

    const share = () => {
        let gameSharePlain = `Chainlinked  ${props.gameKey} ${totalStrikes}/${constants.MAX_STRIKES} \n`;
        props.words?.forEach((word, wordIndex) => {
            word.text.split("").forEach((letter, index) => {
                if (index === 0 || wordIndex === 0) {
                    gameSharePlain += "⬛️";
                } else {
                    gameSharePlain += index > 0 && index <= word.strikes ? "🟥" : (word.revealed ? "🟩" : "⬛️");
                }
            })
            gameSharePlain += "\n";
        })

        var gameShareRich = gameSharePlain.replace("Chainlinked", '<a href="https://chainlinked.jackp.me">Chainlinked</a>').replaceAll("\n", "<br>");

        const data = [new ClipboardItem({
            ["text/plain"]: new Blob([gameSharePlain], { type: "text/plain" }),
            ["text/html"]: new Blob([gameShareRich], { type: "text/html" })
        })]

        navigator.clipboard.write(data);
        showAlert("Copied results to clipboard");
    }

    return <Modal ref={modalRef} open={open}>
        {isGameOver ?
            (totalStrikes ?? 9999) < constants.MAX_STRIKES ? <h2>Congratulations</h2> : <h2>Game Over</h2>
            : <></>}

        <Statistics games={games} />
        <MistakeDistribution games={games} currentMistakes={totalStrikes} />

        {isGameOver ? <>
            <div className="action-items">
                <RandomGameButton label={"Random Game"} />

                <button className="button share-button" onClick={share}>
                    <span>Share</span>
                    <svg id="Footer-module_shareIcon__wOwOt" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" className="game-icon" data-testid="icon-share"><path fill="var(--white)" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></svg>
                </button>
            </div>
        </> : <></>}
    </Modal>
});

export default GameOverModal;