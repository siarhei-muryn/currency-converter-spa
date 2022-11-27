import React, {useEffect} from 'react';
import {useTypedSelector} from "../hooks/use-typed-selector";
import {useAction} from "../hooks/use-action";

const HistoricalRates: React.FC = () => {
    const {loading_status} = useTypedSelector(state => state.historicalRates);
    const {getHistoricalRates} = useAction();
    useEffect(() => {
       setTimeout(()=>{
           getHistoricalRates();
       },1100)
    }, []);
    return (
        <div className={"historical-rates"}>
            historical rates {loading_status ? <b>Loading...</b> : <></>}
        </div>
    );
};

export default HistoricalRates;