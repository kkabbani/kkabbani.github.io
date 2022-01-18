const ToggleSwitch = ({ isOn, turnOn, turnOff }) => {
    return (
        <>
            {isOn ?
                <div className="switch-outer switch-outer-on"
                    onClick={turnOff}>
                    <div className="switch-inner switch-inner-on"></div>
                </div>
                :
                <div className="switch-outer switch-outer-off"
                    onClick={turnOn}>
                    <div className="switch-inner switch-inner-off"></div>
                </div>
            }
        </>
    )
}

export default ToggleSwitch
