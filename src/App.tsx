import React, {useEffect} from 'react';
import Converter from "./components/converter";
import HistoricalRates from "./components/historical-rates";
import AvailableCurrencies from "./components/available-currencies";
import {useAction} from "./hooks/use-action";


const App = () => {
    const {makeConversion} = useAction();
    const {getAvailableCurrencies} = useAction();
    const {getHistoricalRates} = useAction();
    const initRequests = [getAvailableCurrencies, getHistoricalRates];
    useEffect(() => {
        let requestIndex = 0;
        const interval = 1000;
        const timer = setInterval(() => {
            initRequests[requestIndex]();
            if (requestIndex === initRequests.length - 1) {
                clearInterval(timer);
            }
            requestIndex++;
        },interval)
    }, []);
    return (
        <div className="App">
            App
            <Converter/>
            <HistoricalRates/>
            <AvailableCurrencies/>
        </div>
    );
}
export default App;
