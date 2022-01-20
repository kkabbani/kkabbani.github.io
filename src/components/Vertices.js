import Vertex from './Vertex'

const Vertices = ({ vertices, onRightClick, onAddEdge, cursorPosition, playArea }) => {
    //put stamp either above or below vertex depending on position among the other vertices
    let avg = 0
    vertices.forEach(vertex => avg += vertex.top)
    avg /= vertices.length
    vertices.map(vertex => vertex.top < avg ? vertex.stampIsUp = true : vertex.stampIsUp = false)
    return (
        <>
            {vertices.map((vertex) => (
                <Vertex key={vertex.id}
                    vertex={vertex}
                    onRightClick={onRightClick}
                    onAddEdge={onAddEdge}
                    cursorPosition={cursorPosition}
                    playArea={playArea}>
                </Vertex>
            ))}
        </>
    )
}

export default Vertices
