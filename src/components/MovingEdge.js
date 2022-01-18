import Xarrow from "react-xarrows"

const MovingEdge = ({ isMoving, movingFrom, movingTo, directed }) => {
    return (
        (<div style={{ visibility: isMoving ? 'visible' : 'hidden' }}>
            <Xarrow start={movingFrom.toString()} end={movingTo} path="straight" showHead={directed}></Xarrow>
        </div>)
    )
}

export default MovingEdge
