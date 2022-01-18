import React, { useState, useContext } from 'react'
import MoveModeContext from '../moveModeContext'

const Vertex = ({ vertex, onRightClick, onAddEdge, cursorPosition }) => {
    const [scaleBy, setScaleBy] = useState(1)

    const moveMode = useContext(MoveModeContext)

    if (vertex.dragging) {
        //prevent from moving outside playground
        // max found by trial and error
        vertex.top = Math.max(cursorPosition.top, 100)
        vertex.left = Math.max(cursorPosition.left, 250)
    }
    let t = (vertex.top - 25) + 'px'
    let l = (vertex.left - 25) + 'px'

    return (
        <div
            id={vertex.id}
            className='vertex'
            onMouseDown={(e) => {
                e.preventDefault()
                if (e.button === 0 && !vertex.draggable) {
                    onAddEdge(vertex)
                    if (moveMode) {
                        vertex.dragging = true
                    }
                }
            }}
            onMouseUp={(e) => {
                e.preventDefault()
                if (vertex.dragging) {
                    vertex.dragging = false
                }
            }}
            onContextMenu={(e) => {
                e.preventDefault()
                if (!moveMode) {
                    onRightClick(vertex)
                }
            }}
            //make hover effect
            onMouseEnter={() => {
                if (moveMode) {
                    setScaleBy(0.97)
                }
            }}
            onMouseLeave={() => {
                if (moveMode) {
                    setScaleBy(1)
                }
            }}
            style={{ top: t, left: l, zIndex: vertex.dragging ? '100' : '0', transform: `scale(${scaleBy})`, opacity: vertex.draggable && '0.2', border: vertex.color ? `3px solid ${vertex.color}` : 'none' }}>

            <div className='vertex-label'>
                {vertex.label}
            </div>
            <div style={{ position: 'absolute', top: vertex.stampIsUp ? '-20px' : '50px', left: '8px', opacity: '0.5' }}>
                {vertex.stamp}
            </div>
        </div>
    )
}

Vertex.defaultProps = {
    label: '',
    draggable: false,
    stamp: '',
    stampIsUp: false
}


export default Vertex
