import React from "react"
import Xarrow from "react-xarrows"
const computeTop = (from, to) => {
    const styleFrom = document.getElementById(from).style
    const styleTo = document.getElementById(to).style
    const topFrom = parseInt(styleFrom.top.replace('px', ''))
    const topTo = parseInt(styleTo.top.replace('px', ''))
    return (topFrom + topTo) / 2 + 'px'
}
const computeLeft = (from, to) => {
    const styleFrom = document.getElementById(from).style
    const styleTo = document.getElementById(to).style

    const leftFrom = parseInt(styleFrom.left.replace('px', ''))
    const leftTo = parseInt(styleTo.left.replace('px', ''))
    return (leftFrom + leftTo) / 2 + 'px'
}

const Edge = ({ edge, directed, showWeights }) => {
    return (
        <>
            {edge.toDraw &&
                <>
                    {showWeights && <div style={{ position: 'absolute', top: computeTop(edge.from, edge.to), left: computeLeft(edge.from, edge.to), zIndex: '1' }}>{edge.weight.toString()}</div>}
                    <div>
                        <Xarrow id={edge.id} start={edge.from} end={edge.to} color={edge.visited ? 'red' : 'CornflowerBlue'} path="straight" showHead={directed} strokeWidth={3}></Xarrow>
                    </div>
                </>
            }
        </>
    )
}

Edge.defaultProps = {
    visited: false
}

export default Edge
