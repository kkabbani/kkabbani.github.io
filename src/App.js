import React, { useState, useEffect } from 'react'
import './App.css';
import { useXarrow, Xwrapper } from "react-xarrows"
import { FaRegHandPointer } from 'react-icons/fa';
import { FiMousePointer } from 'react-icons/fi';


import Vertex from './components/Vertex'
import Vertices from './components/Vertices'
import Edges from './components/Edges'
import MovingEdge from './components/MovingEdge'
import MenuVertex from './components/MenuVertex';
import MoveModeContext from './moveModeContext'
import SelectElement from './components/SelectElement';
import ToggleSwitch from './components/ToggleSwitch';
import AboutPopUp from './components/AboutPopUp';
import AlertPopUp from './components/AlertPopUp';

const Cursor = ({ top, left }) => {
  const updateXarrow = useXarrow();
  return (
    <div id='cursor' onMouseOver={updateXarrow} style={{ width: '1px', height: '1px', position: 'absolute', top: top, left: left, visibility: 'hidden' }}></div>
  );
};

//to compare objects, may be useful at some point
const equals = (a, b) => {
  if (a === b) {
    return true
  }
  const aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)
  if (aProps.length !== bProps.length) {
    return false
  }
  for (var i = 0; i < aProps.length; ++i) {
    if (aProps[i] !== bProps[i] || a[aProps[i]] !== b[aProps[i]]) {
      return false
    }
  }
  return true
}

//to check whether an array contains a particular element
const arrayIncludes = (array, element) => {
  for (var i = 0; i < array.length; ++i) {
    if (array[i].valueOf() === element.valueOf()) {
      return true
    }
  }
  return false
}

//helper function to find the index of the smallest key, used for Dijkstra and Prim's
const smallestEdge = (array, visited) => {
  let n = array.length
  let minValue = Infinity
  let minIndex = -1
  for (let i = 0; i < n; ++i) {
    if (!visited[i] && array[i] < minValue) {
      minValue = array[i]
      minIndex = i
    }
  }
  return minIndex
}

//create custom forceUpdate hook
function useForceUpdate() {
  const [value, setValue] = useState(0)
  return () => setValue(value => value + 1) // update the state to force render
}

class EdgeObject {
  constructor(id = '', from, to, weight, toDraw = true, visited = false) {
    this.id = id
    this.from = from
    this.to = to
    this.weight = weight
    this.toDraw = toDraw //whether we draw the edge in this direction in directed graph
    this.visited = visited
  }
}

class Node {
  constructor(value) {
    this.value = value
    this.parent = this
    this.rank = 0
  }
}
const find = (node) => {
  if (node.parent !== node) {
    node.parent = find(node.parent)
  }
  return node.parent
}
const union = (node1, node2) => {
  const root1 = find(node1)
  const root2 = find(node2)
  if (root1 !== root2) {
    if (root1.rank < root2.rank) {
      root1.parent = root2
    } else if (root1.rank > root2.rank) {
      root2.parent = root1
    } else {
      root2.parent = root1
      root1.rank += 1
    }
    return true
  }
  return false
}

function App() {
  const [vertices, setVertices] = useState([])
  const [isDraggingVertex, setIsDraggingVertex] = useState(false)
  const [edges, setEdges] = useState({})
  const [isMovingEdge, setIsMovingEdge] = useState(false)
  const [movingEdgeFrom, setMovingEdgeFrom] = useState('')
  const [addEdgeWeight, setAddEdgeWeight] = useState(1)
  const [cursorTop, setCursorTop] = useState(0)
  const [cursorLeft, setCursorLeft] = useState('0')
  const [directedEdges, setDirectedEdges] = useState(false)
  const [graph, setGraph] = useState([])
  const [speed, setSpeed] = useState(0.5)
  const [delayTime, setDelayTime] = useState(1500) //to change
  const [showMenuToVertex, setShowMenuToVertex] = useState()
  const [moveMode, setMoveMode] = useState(false)
  const [selectedAlgo, setSelectedAlgo] = useState(0)
  const [vertexStart, setVertexStart] = useState(0)
  const [displayAboutPopUp, setDisplayAboutPopUp] = useState(true)
  const [displayAlertPopUp, setDisplayAlertPopUp] = useState(false)
  const [enteredPlayground, setEnteredPlayground] = useState(false)

  const algoOptions = ['BFS', 'DFS', "Prim's", 'Kruskal', 'Dijkstra']
  const algoWithWeights = [2, 3, 4]
  const algoWithStartVertex = [0, 1, 4]

  //const indicating max values for top and left to stay in playground area
  //values found by trial and error
  const playArea = { top: 100, left: 250 }

  const vertexColors = [
    "red",
    "blue",
    "orange",
    "DarkOrchid",
    "Gold",
    "LawnGreen",
    "LightSalmon",
    "Pink",
    "StateBlue"
  ]

  useEffect(() => { //update computed graph based on drawn graph
    let tmpGraph = []
    const nbVertices = vertices.length
    for (var i = 0; i < nbVertices; ++i) {
      let row = []
      for (var j = 0; j < nbVertices; ++j) {
        let edge = edges[vertices[i].id + '-' + vertices[j].id]
        if ((!directedEdges && edge === undefined)) {
          edge = edges[vertices[j].id + '-' + vertices[i].id]
        }

        if (i === j || edge === undefined || (directedEdges && !edge.toDraw)) {
          row.push(0)
        } else {
          row.push(edge.weight)
        }
      }
      tmpGraph.push(row)
    }
    setGraph(tmpGraph)
  }, [vertices, edges, directedEdges])

  useEffect(() => { //update value of whether cursor is in playground area
    if (cursorTop >= playArea.top && cursorLeft >= playArea.left) {
      setEnteredPlayground(true)
    } else {
      setEnteredPlayground(false)
    }
  }, [cursorTop, cursorLeft])

  const sleep = () => {
    return new Promise(resolve => setTimeout(resolve, delayTime));
  }
  const forceUpdate = useForceUpdate();

  const findToColor = (colorArray, disjointSets, index) => {
    const node = disjointSets[index]
    if (node.parent !== node) {
      node.parent = findToColor(colorArray, disjointSets, node.parent.value)
      vertices[index].color = colorArray[node.parent.value]
    }
    return node.parent
  }

  const updateVerticesColor = (colorArray, disjointSets) => {
    vertices.forEach((vertex) => {
      findToColor(colorArray, disjointSets, vertex.id)
    })
    forceUpdate()
  }

  const computeKruskal = async () => {
    let sortedEdges = Object.values(edges).filter((edge) => edge.toDraw)
    sortedEdges.sort((a, b) => {
      if (a.weight < b.weight) {
        return -1
      } else if (a.weight > b.weight) {
        return 1
      }
      return 0
    })
    const colorArray = vertexColors
    let mst = []
    let disjointSets = vertices.map((vertex) => {
      vertex.color = colorArray[vertex.id]
      return new Node(vertex.id)
    })
    forceUpdate()
    await sleep()
    for (var i = 0; i < sortedEdges.length; ++i) {
      const edge = sortedEdges[i]
      if (union(disjointSets[edge.from], disjointSets[edge.to])) {
        mst.push(edge)
        edge.visited = true

        updateVerticesColor(colorArray, disjointSets)
        await sleep()
      }
    }
  }

  const computeDFS = async (current, states) => {
    states[current] = 1
    vertices[current].color = 'yellow'
    forceUpdate()
    await sleep()
    for (var to = 0; to < graph[current].length; ++to) {
      if (graph[current][to] !== 0 && states[to] === 0) {
        await computeDFS(to, states)
      }
    }
    states[current] = 2
    vertices[current].color = 'red'
    forceUpdate()
    await sleep()
  }

  const computeNormalDFS = (current, states, counter) => {
    states[current] = 1
    for (var to = 0; to < graph[current].length; ++to) {
      if (graph[current][to] !== 0 && states[to] === 0) {
        counter = computeNormalDFS(to, states, counter) + 1
      }
    }
    states[current] = 2
    return counter
  }

  const computeBFS = async (source) => {
    console.log(graph)
    let n = graph.length
    let states = new Array(n).fill(0) //0: not seen, 1: queued, 2: visited
    states[source] = 1
    let queue = [source]
    vertices[source].color = 'yellow'
    forceUpdate()
    await sleep()
    while (queue.length > 0) {
      const current = queue.shift()
      graph[current].forEach((weight, to) => {
        if (weight !== 0 && states[to] === 0) {
          queue.push(to)
          states[to] = 1
          vertices[to].color = 'yellow'
        }
      })
      states[current] = 2
      vertices[current].color = 'red'
      forceUpdate()
      await sleep()
    }
  }

  const computeDijkstra = async (source) => {
    let n = graph.length
    let keys = []
    let visited = []
    let parent = []
    for (let i = 0; i < n; ++i) {
      if (i === source) {
        keys.push(0)
      } else {
        keys.push(Infinity)
      }
      visited.push(false);
      parent.push(-1)
    }

    let nbVisited = 0
    while (nbVisited < n) {
      let currNode = smallestEdge(keys, visited) //smallest distance
      visited[currNode] = true
      ++nbVisited
      vertices[currNode].stamp = 'd: ' + keys[currNode]
      if (parent[currNode] !== -1) {
        edges[vertices[parent[currNode]].id + '-' + vertices[currNode].id].visited = true
        edges[vertices[currNode].id + '-' + vertices[parent[currNode]].id].visited = true
        forceUpdate()
        await sleep()
      }
      for (let i = 0; i < n; ++i) {
        if (!visited[i]) {
          if (graph[currNode][i] !== 0 && keys[i] > keys[currNode] + graph[currNode][i]) {
            keys[i] = keys[currNode] + graph[currNode][i]
            parent[i] = currNode
          }
        }
      }
    }
  }

  const computePrims = async () => {
    //Prim's algorithm
    let n = graph.length
    let keys = [0]
    let visited = [false]
    for (let i = 1; i < n; ++i) {
      keys.push(Infinity)
      visited.push(false);
    }

    let nbVisited = 0
    let parent = [-1]
    while (nbVisited < n) {
      let currNode = smallestEdge(keys, visited)
      visited[currNode] = true
      vertices[currNode].color = 'red'
      ++nbVisited
      if (parent[currNode] !== -1) {
        console.log(vertices[parent[currNode]].id + '-' + vertices[currNode].id)
        console.log(edges)
        const edge1 = edges[vertices[parent[currNode]].id + '-' + vertices[currNode].id]
        const edge2 = edges[vertices[currNode].id + '-' + vertices[parent[currNode]].id]
        if (edge1 !== undefined) {
          edge1.visited = true
        }
        if (edge2 !== undefined) {
          edge2.visited = true
        }
        forceUpdate()
        await sleep()
      }
      for (let i = 0; i < n; ++i) {
        if (!visited[i]) {
          if (graph[currNode][i] !== 0 && keys[i] > graph[currNode][i]) {
            keys[i] = graph[currNode][i]
            parent[i] = currNode
          }
        }
      }
    }
    let mst = []
    for (let i = 1; i < n; ++i) {
      mst.push([parent[i], i])
    }
    return mst
  }

  const onComputeDFS = async () => {
    let states = new Array(graph.length).fill(0) //0: not seen, 1: visiting, 2: visited
    await computeDFS(vertexStart, states)
  }

  const onComputeBFS = async () => {
    await computeBFS(vertexStart)
  }

  const onComputeDijkstra = async () => {
    await computeDijkstra(vertexStart)
  }

  const onComputePrims = async () => {
    setDirectedEdges(false)
    let states = new Array(graph.length).fill(0)
    const c = computeNormalDFS(0, states, 1)
    if (c === graph.length) { //source to be changed
      await computePrims()
    } else {
      setDisplayAlertPopUp(true)
    }
  }
  const onComputeKruskal = async () => {
    setDirectedEdges(false)
    let states = new Array(graph.length).fill(0)
    if (computeNormalDFS(0, states, 1) === graph.length) { //source to be changed
      await computeKruskal()
    } else {
      setDisplayAlertPopUp(true)
    }
  }

  const drawingEdge = (id, weight) => {
    if (!isMovingEdge) {
      setAddEdgeWeight(weight)
      setMovingEdgeFrom(id)
      setIsMovingEdge(true)
    }
  }

  const onRightClickVertex = (vertex) => {
    if (vertex !== undefined && vertex.id !== undefined) {
      setShowMenuToVertex(vertex)
    } else {
      setShowMenuToVertex(undefined)
    }
  }

  const deleteVertex = async (vertex) => {
    let updatedEdges = {}
    Object.values(edges).forEach((edge) => {
      if (edge.from !== vertex.id && edge.to !== vertex.id) {
        updatedEdges[edge.id] = edge
      }
    })
    setEdges(updatedEdges)
    const tmpVertices = vertices.filter((v) => v.id !== vertex.id)
    setVertices(tmpVertices)
    setVertexStart(0)
  }

  const cancelMouseAction = (e) => {
    //onRightClickVertex()
    if (e.target.className !== 'vertex') {
      onRightClickVertex()
    }
    if (e.target.className !== 'vertex') {
      addEdge()
    }
    //addEdge()

  }

  const addEdge = (vertexTo) => {
    if (isMovingEdge) {
      setIsMovingEdge(false)
      setMovingEdgeFrom('')
      if (vertexTo === undefined || !arrayIncludes(vertices, vertexTo)) {
        return
      }
      const from = movingEdgeFrom
      const to = vertexTo.id.toString()
      const weight = addEdgeWeight
      const newEdge = new EdgeObject(from + "-" + to, from, to, weight)
      if (!edges.hasOwnProperty(newEdge.id)) {
        let newElement = {}
        newElement[newEdge.id] = newEdge
        if (!directedEdges) { //add reverse edge if undirected
          const newEdgeRev = new EdgeObject(to + "-" + from, to, from, weight, false)
          newElement[newEdgeRev.id] = newEdgeRev
        }
        setEdges({ ...edges, ...newElement })
      }
    }
  }

  const moveCursor = (e) => {
    setCursorTop(e.pageY)
    setCursorLeft(e.pageX)
  }

  const startDragVertex = (e) => {
    setIsDraggingVertex(true)
  }

  const stopDragVertex = (e) => {
    if (isDraggingVertex) {
      setIsDraggingVertex(false)
      if (enteredPlayground) {
        let nextId = 0
        if (vertices.length > 0) {
          nextId = vertices[vertices.length - 1].id + 1
        }
        setVertices([...vertices, { id: nextId, label: nextId, top: e.pageY, left: e.pageX }])
      }
    }
  }

  const dragVertex = { id: 'dragVertex', top: cursorTop, left: cursorLeft, draggable: true }

  const onResetGraph = () => {
    for (const edge of Object.values(edges)) {
      edge.visited = false
    }
    vertices.forEach(vertex => {
      vertex.stamp = ''
      vertex.color = undefined
    })
    forceUpdate()
  }

  const onClearGraph = () => {
    setVertices([])
    setEdges([])
    setShowMenuToVertex(undefined)
    setIsMovingEdge(false)
    setMovingEdgeFrom('')
    setVertexStart(0)
  }

  const selectAlgo = (algo) => {
    setSelectedAlgo(algo)
    if (algo === 2 || algo === 3) {
      setDirectedEdges(false)
    }
  }

  const computeAlgo = () => {
    onResetGraph()
    switch (selectedAlgo) {
      case 0:
        onComputeBFS()
        break
      case 1:
        onComputeDFS()
        break
      case 2:
        onComputePrims()
        break
      case 3:
        onComputeKruskal()
        break
      case 4:
        onComputeDijkstra()
        break
      default:
        break
    }
  }

  const selectVertexStart = (start) => {
    setVertexStart(start)
  }

  const closePopUps = () => {
    setDisplayAboutPopUp(false)
    setDisplayAlertPopUp(false)
  }

  return (
    <MoveModeContext.Provider value={moveMode}>
      <div className="Container" style={{ cursor: moveMode ? 'pointer' : 'auto', width: window.innerWidth, height: window.innerHeight }} onMouseMove={moveCursor} onMouseDown={cancelMouseAction} onMouseUp={() => {
        vertices.forEach(vertex => {
          vertex.dragging = false
        })
        //setVertices(vertices.filter(vertex => vertex.top >= 100 && vertex.left >= 250))
      }}>
        <div className="navbar-top grid-nav2">
          <h1>GraphVisualize</h1>
          <div className="flex">
            <div className="flex flex-element">
              <h4>Add a vertex: &nbsp;</h4>
              <div id="add-vertex" className="vertex" onMouseDown={startDragVertex} style={{ cursor: 'pointer' }}><div id="add-vertex-label">+</div></div>
            </div>
            <div className="flex flex-element">
              <h4>Cursor: &nbsp;</h4>
              <div className="icons-mouse">
                <div className="icon-mouse-normal" style={{ backgroundColor: !moveMode ? 'salmon' : '' }}>
                  <FiMousePointer onMouseUp={() => setMoveMode(false)} title="normal" size="1.3em" style={{ position: 'absolute', top: '5px', left: '5px' }}></FiMousePointer>
                </div>
                <div className="icon-mouse-pointer" style={{ backgroundColor: moveMode ? 'salmon' : '' }}>
                  <FaRegHandPointer onMouseUp={() => setMoveMode(true)} title="move elements" size="1.3em" style={{ position: 'absolute', top: '5px', left: '5px' }}></FaRegHandPointer>
                </div>
              </div>
            </div>
            <div className="flex flex-element">
              <h4>Directed Edges: &nbsp;</h4>
              <ToggleSwitch isOn={directedEdges} turnOn={() => setDirectedEdges(true)} turnOff={() => setDirectedEdges(false)}></ToggleSwitch>
            </div>
          </div>
          <div id="about" onMouseDown={() => setDisplayAboutPopUp(true)}><p>About</p></div>
        </div>
        <div className="content grid-nav">
          <div className="navbar-left">
            <div className="grid-2">
              <h3>Algorithm</h3>
              <SelectElement options={algoOptions} selected={selectedAlgo} onSelect={selectAlgo}></SelectElement>
            </div>
            <div className="grid-2">
              {arrayIncludes(algoWithStartVertex, selectedAlgo) &&
                <>
                  <h4>Start from vertex</h4>
                  <SelectElement options={vertices.map((vertex) => vertex.label)} selected={vertexStart} onSelect={selectVertexStart} emptyMessage={"No vertices"}></SelectElement>
                </>
              }
            </div>
            <div id="button-go" className="btn btn-nav" onClick={computeAlgo}>GO</div>
            <div id="button-reset" className="btn btn-nav" onClick={onResetGraph}>Reset Graph</div>
            <div id="button-clear" className="btn btn-nav" onClick={onClearGraph}>Clear Graph</div>
          </div>
          <div className="playground" onMouseUp={stopDragVertex}>
            {isDraggingVertex && <Vertex vertex={dragVertex}></Vertex>}
            <Xwrapper>
              <Cursor top={cursorTop} left={cursorLeft}></Cursor>
              <MovingEdge isMoving={isMovingEdge} movingFrom={movingEdgeFrom} movingTo='cursor' directed={directedEdges}></MovingEdge>
            </Xwrapper>

            <Vertices vertices={vertices} onRightClick={onRightClickVertex} onAddEdge={addEdge} cursorPosition={{ top: cursorTop, left: cursorLeft }} playArea={playArea}></Vertices>
            <Edges edges={edges} directed={directedEdges} showWeights={arrayIncludes(algoWithWeights, selectedAlgo)}></Edges>
            <MenuVertex vertex={showMenuToVertex} onDrawingEdge={drawingEdge} onDeleteVertex={deleteVertex}></MenuVertex>
          </div>
        </div>
        <AboutPopUp display={displayAboutPopUp} onClose={closePopUps}></AboutPopUp>
        <AlertPopUp display={displayAlertPopUp} onClose={closePopUps}></AlertPopUp>
      </div>
    </MoveModeContext.Provider>
  );
}


export default App;
