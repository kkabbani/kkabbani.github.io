import useXarrow from "react-xarrows"

const Cursor = ({ top, left }) => {
    const updateXarrow = useXarrow();
    return (
        <div id='cursor' onMouseOver={updateXarrow} style={{ width: '10px', height: '10px', position: 'absolute', top: top, left: left, visibility: 'hidden' }}></div>
    );
};

export default Cursor