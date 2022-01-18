import PopUp from './PopUp';

const AlertPopUp = ({ display, onClose }) => {
    const title = 'Error'
    const content = (
        <>
            <section>
                <h3>Disconnected Graph</h3>
                <p>
                    This graph is disconnected which means it has no <strong>Minimum Spanning Tree</strong>.
                    Therefore <strong>Prim's</strong> and <strong>Kruskal</strong> algorithms do not work on it.
                    <br></br><br></br>
                    If you want to run one these algorithms you need to make the graph fully connected.
                </p>
            </section>
        </>)
    return (
        <PopUp display={display} onClose={onClose} title={title} content={content} isAlert={true}></PopUp>
    )
}

export default AlertPopUp
