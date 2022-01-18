import { useState } from 'react'

import SelectOptions from './SelectOptions'

const SelectElement = ({ options, selected, onSelect, emptyMessage }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="select-element" style={{ height: open ? 25 + (options.length * 25) + 'px' : '25px', zIndex: open ? '10' : '0' }} onClick={() => setOpen(!open)}>
            <div className="select-chosen">
                <div className="select-text">
                    &nbsp;
                    {options.length === 0 ? emptyMessage : options[selected]}
                </div>
            </div>
            {open ?
                <div className="select-arrow-up"></div>
                :
                <div className="select-arrow-down"></div>
            }
            {open && <SelectOptions options={options} onSelect={onSelect}></SelectOptions>}
        </div>
    )
}

SelectElement.defaultProps = {
    emptyMessage: ''
}

export default SelectElement
