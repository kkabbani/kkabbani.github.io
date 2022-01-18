import { useState } from 'react'

const MenuVertex = ({ vertex, onDrawingEdge, onDeleteVertex }) => {
    let possibleWeights = []
    for (var i = 1; i <= 20; ++i) {
        possibleWeights.push(i)
    }
    const [showWeights, setShowWeights] = useState(false)

    if (vertex === undefined) {
        return (<></>)
    }
    const showWeightSelect = () => {
        setShowWeights(true)
    }
    const hideWeightSelect = () => {
        setShowWeights(false)
    }
    const findBorderRadius = (index, length) => {
        if (index === 0) {
            return '5px 5px 0 0'
        } else if (index === length - 1) {
            return '0 0 5px 5px'
        } else {
            return '0'
        }
    }
    return (
        <div className='menu-vertex-select' style={{ top: vertex.top + 'px', left: (vertex.left + 25) + 'px', width: '300px', height: possibleWeights.length * 20 + 'px' }}>
            <div className='menu-vertex-sub-select'>
                {/* <div className='menu-vertex-option' onMouseDown={(e) => e.button === 0 && onDrawingEdge(vertex.id.toString())}>Add edge</div> */}
                <div className='menu-vertex-option'
                    style={{ borderRadius: findBorderRadius(0, 2) }}
                    onMouseEnter={showWeightSelect}
                    onMouseLeave={hideWeightSelect}>
                    Add edge
                </div>
                <div className='menu-vertex-option' style={{ top: '20px', borderRadius: findBorderRadius(1, 2) }} onMouseDown={(e) => e.button === 0 && onDeleteVertex(vertex)}>Delete vertex</div>
            </div >
            {
                showWeights &&
                <div className='menu-vertex-sub-select'
                    onMouseEnter={showWeightSelect}
                    onMouseLeave={hideWeightSelect}
                    style={{ position: 'absolute', top: '0px', left: '150px', width: '150px', height: possibleWeights.length * 20 + 'px' }}>
                    {/* <div className='menu-vertex-option' onMouseDown={(e) => e.button === 0 && onDrawingEdge(vertex.id.toString())}>Add edge</div> */}
                    {possibleWeights.map((i, index) => (<div key={i} className='menu-vertex-option' style={{ top: (i - 1) * 20 + 'px', borderRadius: findBorderRadius(index, possibleWeights.length) }} onMouseDown={(e) => e.button === 0 && onDrawingEdge(vertex.id.toString(), i)}>{i}</div>))}
                </div >
            }
        </div >
    )
}

export default MenuVertex
