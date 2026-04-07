import { useEffect, useState } from "react";

function App() {
    const [loading, setLoading] = useState(true);
    const [coins, setCoins] = useState("");

    useEffect(() => {
        fetch("https://api.coinlore.net/api/tickers/")
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                setCoins(json.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log("데이터 로드 실패 :", error);
                setLoading(false);
            })
    }, [])

    return (
        <div>
            <h1>The coins! ({coins.length})</h1>
            <hr />
            {loading ? (
                <strong>데이터를 불러오는 중입니다..</strong>
            ) : (
                <select>
                    {coins.map((value, index) => {
                        return <option key={index}>{value.name} ({value.symbol})</option>;
                    })}
                </select>
            )}
        </div>
    );
}

export default App;
