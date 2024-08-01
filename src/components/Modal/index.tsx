import { forwardRef, PropsWithChildren, useImperativeHandle, useState } from "react";
import "./Modal.scss";

export type ModalProps = PropsWithChildren<{
    open: boolean;
    onClose?: () => void;
}>;

export interface ModalRef {
    open: () => void;
}

const Modal = forwardRef<ModalRef, ModalProps>((props, ref) => {
    const [open, setOpen] = useState(props.open)

    useImperativeHandle(ref, () => ({
        open() {
            setOpen(true);
        }
    }))

    const closeModal = () => {
        setOpen(false);
        if (props.onClose) {
            props.onClose();
        }
    }

    if (open) {
        return <dialog open={open}>
            <div className="Modal">
                <button className="closeButton" onClick={closeModal}>
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" className="game-icon" data-testid="icon-close"><path fill="var(--color-tone-1)" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                </button>
                <div className="Modal-Content">
                    {props.children}
                </div>
            </div>
        </dialog>
    } else {
        return <></>
    }
});

export default Modal;