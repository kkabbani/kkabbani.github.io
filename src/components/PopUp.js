import { AiOutlineClose } from 'react-icons/ai';

const PopUp = ({ display, onClose, title, content, isAlert }) => {
    let popUpClassName = "pop-up"
    if (isAlert) {
        popUpClassName += " pop-up-alert"
    }
    return (
        <>
            {display &&
                <>
                    < div className={popUpClassName}>
                        <h1>{title}</h1>
                        <div className="pop-up-inner">
                            {content}
                        </div>
                        <AiOutlineClose className="pop-up-close" onMouseDown={onClose}></AiOutlineClose>
                    </div >
                    <div className='modal' onMouseDown={onClose}></div>
                </>
            }
        </>
    )
}

PopUp.defaultProps = {
    isAlert: false
}

export default PopUp
