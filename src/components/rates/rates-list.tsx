import React, {useEffect, useState} from "react";
import {useAction} from "../../hooks/use-action";
import {useTypedSelector} from "../../hooks/use-typed-selector";

type Props = {
    currency: string,
}

type Rate = {
    currency_name: string;
    rate: string;
    rate_for_amount: string;
    isFavorite: boolean;
}

export const RatesList: React.FC<Props> = ({currency}) => {
    const [list, setList] = useState<JSX.Element[] | null>(null);
    const {rates} = useTypedSelector(state => state.historicalRates);
    const [tempRates, setTempRates] = useState(structuredClone(rates));

    useEffect(() => {
        if (tempRates) {
            setList(makeList());
        }
    }, [tempRates])

    const removeFavoriteHandler = (key: string, value: Rate) => {
        removeFavoriteRateFromLocalStorage(currency, key, value);
        setTempRates(tempRates)
        setList(makeList());
    }

    const addFavoriteHandler = (key: string, value: Rate) => {
        addFavoriteRateToLocalStorage(currency, key, value);
        setTempRates(tempRates)
        setList(makeList());
    }
    type FavoriteRate = {
        from: string;
        to: string;
    }
    const addFavoriteRateToLocalStorage = (from: string, to: string, value: Rate) => {
        const favoriteRatesStr = localStorage.getItem("favorite-rates");
        const favoriteRates: FavoriteRate[] = favoriteRatesStr ? JSON.parse(favoriteRatesStr) : null;
        if (!favoriteRates) {
            localStorage.setItem("favorite-rates", JSON.stringify([{from: from, to: to}]));
            value.isFavorite = true;
        } else {
            if (findFavoriteRate(favoriteRates, from, to)) {
                return;
            }
            favoriteRates.push({from: from, to: to});
            localStorage.setItem("favorite-rates", JSON.stringify(favoriteRates));
            value.isFavorite = true;
        }
    }

    const removeFavoriteRateFromLocalStorage = (from: string, to: string, value: Rate) => {
        const favoriteRatesStr = localStorage.getItem("favorite-rates");
        const favoriteRates: FavoriteRate[] = favoriteRatesStr ? JSON.parse(favoriteRatesStr) : null;
        const favoriteRate = findFavoriteRate(favoriteRates, from, to);
        if (favoriteRate) {
            const idx = favoriteRates.indexOf(favoriteRate);
            if (idx > -1) {
                favoriteRates.splice(idx, 1);
                localStorage.setItem("favorite-rates", JSON.stringify(favoriteRates));
                value.isFavorite = false;
            }

        }
    }

    const findFavoriteRate = (favoriteRates: FavoriteRate[], from: string, to: string, value?: Rate): FavoriteRate | null => {
        const foundValue = favoriteRates?.find((favoriteRate) => {
            return favoriteRate.from === from && favoriteRate.to === to;
        })
        if (foundValue && value) {
            value.isFavorite = true;
        }
        return foundValue ? foundValue : null;
    }

    const makeList = () => {
        const favoriteRatesStr = localStorage.getItem("favorite-rates");
        const favoriteRates: FavoriteRate[] = favoriteRatesStr ? JSON.parse(favoriteRatesStr) : null;
        const sortedRates = Object.keys(tempRates)
            .sort()
            .reduce((accumulator: any, key) => {
                accumulator[key] = tempRates[key];
                return accumulator;
            }, {});
        const defaultAmount = "1";
        const list: JSX.Element[] = [];
        for (let [key, value] of Object.entries(sortedRates)) {
            if (currency === key) {
                continue;
            }
            const listItem =
                <div className={"rate"} style={{height: "40px"}} key={key}>
                    {(value as Rate)?.isFavorite || findFavoriteRate(favoriteRates, currency, key, (value as Rate)) ?
                        <button
                            onClick={() => removeFavoriteHandler(key, (value as Rate))}>remove
                        </button> :
                        <button onClick={() => addFavoriteHandler(key, (value as Rate))}>to favs
                        </button>
                    }
                    <span>{defaultAmount}</span>
                    <span>{currency}</span>
                    =
                    <span>{(value as Rate).rate_for_amount}</span>
                    <span>{key}</span>
                </div>;
            list.push(listItem);
        }
        return list;
    }

    return (
        <div className={"rates__list"} style={{height: "300px", overflowY: "auto"}}>
            {tempRates && list ? list : <></>}
        </div>
    )
}





