const SelectOptions = ({ options, onSelect }) => {
    return (
        <>
            {options.map((option, index) => <div key={index} className="select-option" onClick={() => onSelect(index)}>
                <div className="select-text">
                    &nbsp;
                    {option}
                </div>
            </div>)}
        </>
    )
}

export default SelectOptions
