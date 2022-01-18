import Edge from './Edge'

const Edges = ({ edges, directed, showWeights }) => {
    const edgesArray = Object.values(edges)
    return (
        <>
            {edgesArray.map((edge) => (
                <Edge key={edge.id} edge={edge} directed={directed} showWeights={showWeights}></Edge>
            ))}
        </>
    )
}

export default Edges
