import { createRef, forwardRef, useImperativeHandle, useState } from "react";
import Modal, { ModalRef } from "../Modal";

// Define the props type for the component
export interface HowToPlayModalProps {
    // Add any props if needed
}

// Define the ref type for the component
export interface HowToPlayModalRef {
    open: () => void;
}

const HowToPlayModal = forwardRef<HowToPlayModalRef, HowToPlayModalProps>((props, ref) => {
    const [open] = useState<boolean>(localStorage.getItem('howToPlay') === 'true');
    const modalRef = createRef<ModalRef>();

    useImperativeHandle(ref, () => ({
        open() {
            modalRef.current?.open();
        }
    }))

    const handleClose = () => {
        localStorage.setItem('howToPlay', 'false');
    }

    return <Modal ref={modalRef} open={open} onClose={handleClose}>
        <h2>How To Play</h2>
        <p>Chain the words together.</p>
        <ul>
            <li>Each adjacent rows combine to make a compound word.</li>
        </ul>

        <strong>Examples</strong>
        <div className="example">
            <div className='word'>
                <div className='letter revealed'>c</div>
                <div className='letter revealed'>l</div>
                <div className='letter revealed'>u</div>
                <div className='letter revealed'>b</div>
            </div>
            <p>The starting word is <b>CLUB</b></p>
        </div>

        <div className="example">
            <div className='word correct'>
                <div className='letter'>s</div>
                <div className='letter'>o</div>
                <div className='letter'>d</div>
                <div className='letter'>a</div>
            </div>
            <p>Adding <b>SODA</b> makes <b>CLUB SODA</b></p>
        </div>

        <div className="example">
            <div className='word'>
                <div className='letter revealed'>p</div>
                <div className='letter'></div>
                <div className='letter'></div>
            </div>
            <p>The second compound word with <b>SODA</b> starts with <b>P</b></p>
        </div>

        <div className="example">
            <div className='word'>
                <div className='letter revealed'>p</div>
                <div className='letter incorrect'>o</div>
                <div className='letter'></div>
            </div>
            <p>After guessing incorrectly, the second letter <b>O</b> is given.</p>
        </div>
    </Modal>
});

export default HowToPlayModal;