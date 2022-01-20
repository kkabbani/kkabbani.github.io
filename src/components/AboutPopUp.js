import PopUp from './PopUp';

const AboutPopUp = ({ display, onClose }) => {
    const title = 'Welcome to GraphVisualize'
    const content = (
        <>
            <section>
                <h3>What is GraphVisualize?</h3>
                <p>
                    GraphVisualize is a tool that serves as a graph algorithms visualizer.
                    It helps to better understand how such algorithms work by offering an interactive platform to see them in action on customly drawn graphs.
                    It includes the main basic graph algorithms that are essential when solving graph problems and they are the following: BFS, DFS, Prim's, Kruskal and Dijkstra.
                </p>
            </section>
            <section>
                <h3>How do I use it?</h3>
                <p>
                    The first step is to draw a graph.
                    To do so you need to add vertices (nodes) by dragging them from the black circle on the top left.
                    You can then place them anywhere on the drawing area.
                    <br />
                    <br />
                    Once a vertex is drawn, you can right click on it either to draw an edge with a certain weight or to delete the vertex.
                    You can also move your vertices by switching the cursor to the "move" mode.
                    You can choose to show either directed or undirected edges with the toggle switch (however some algorithms only consider undirected edges).
                    <br />
                    <br />
                    Once you are satisfied with the graph, you can select the algorithm you want to try as
                    well as the starting point when possible.
                    Press on "GO" to run.
                </p>
                You will see edges and/or vertices highlighted depending on the algorithm.
                The colors depend on the algorithm but usually the following ones are used:
                an edge is <span className='span-red'>red</span> when it is chosen/visited and for vertices the colors usually mean the following:
                <br />
                <ul>
                    <li><span className='span-black'>black</span> means not visited yet</li>
                    <li><span className='span-yellow'>yellow</span> means queued or being visited</li>
                    <li><span className='span-red'>red</span> means visited</li>
                </ul>
                <p>
                    To remove all the colors press on "Reset Graph" and to delete the graph press on "Clear Graph".
                </p>
            </section>
        </>)
    return (
        <PopUp display={display} onClose={onClose} title={title} content={content}></PopUp>
    )
}

export default AboutPopUp
