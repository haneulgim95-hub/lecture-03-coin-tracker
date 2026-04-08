import { useEffect, useState } from "react";

function App() {
    // 외부에서 데이터를 받아다가 화면을 출력해주는 프로그램
    // 초기렌더링 -> 데이터를 받아오고 -> 데이터로 화면을 갱신

    // state. 우리는 이 화면을 작성할 때 어떤 state가 필요할까?
    const [loading, setLoading] = useState(true); // 어떠한 목적의 state : loading 관리용 state
    // 데이터를 불러오는 중에는 true, 데이터가 도착되면 false.
    const [coins, setCoins] = useState([]); // 어떠한 목적의 state : 외부에서 받아오는 데이터를 저장할 목적의 state
    const [selectedId, setSelectedId] = useState(""); // 사용자가 select에서 선택한 값을 저장할 state => id 값은 "90" 과 같이 string 이다.

    const selectedCoin = coins.find(value => {
        return value.id === selectedId;
    }); // selectedCoin은 state로 써주지 않았지만 그에대한 결과를 도출하는데에 selectedId라는 state가 사용이 되어서
    //   selectedId가 바뀌면 화면에 다시 랜더링 하게 된다.

    // useEffect(() => {}, [의존성]) :  최초 렌더링이  끝난 이후 1회 무조건 실행됨
    useEffect(() => {
        // 외부에서 데이터를 받아와서  coins에 저장하는 일
        // fetch() : 외부에서 데이터를 받아오는 비동기함수. 비동기함수는 .then()과 .catch()로 처리해야 함
        // .then(함수) : fetch()가 완료되면 실행되는 함수를 적어줘야 함       => then()은 메소드 체인으로 여러개를 적어줄 수 있음
        // .catch(함수) : fetch()가 실패하면 실행되는 함수를 적어줘야 함       => catch()는 보통적으로 한 번만 적어줄 수 있음
        fetch("https://api.coinlore.net/api/tickers/")
            // .fetch()를 실행한 결과가 .then의 매개변수인 함수의 매개변수 자리로 들어간다.
            .then(response => {
                return response.json(); // 문자열을 객체로 변환
            }) // 성공하면, 그 데이터를 json형태로 가공
            // 위에 then을 실행한 결과가 또 아래의 then의 매개변수인 함수의 매개변수 자리로 들어간다
            .then(json => {
                setCoins(json.data); // 우리가 원하는 정보는 json이라는 큰 객체 안에 있는 키가 "datq"인 프라퍼티이다. 그리고 그 data는 배열이다.
                setLoading(false);
            })
            .catch(error => {
                console.log("데이터 로드 실패 :", error);
                setLoading(false);
            }); // fetch에서 실행이 실패가 되든, 첫번째 then에서 실패가 되든, 두번째 then에서 실패가 되든 catch절로 간다.
        // 자바스크립트 엔진이 실패 사유에 대해서 분석을 해서 매개변수 자리로 넣어준다.
    }, []);

    return (
        <div>
            <h1>The coins! ({coins.length})</h1>
            <hr />
            {loading ? (
                <strong>데이터를 불러오는 중입니다...</strong>
            ) : (
                <div>
                    <select
                        value={selectedId}
                        onChange={e => {
                            // 사용자가 변경한 값을 저장해야 함
                            setSelectedId(e.target.value);
                        }}>
                        {coins.map((value, index) => {
                            // coins(data)가 배열이라서 map메소드 사용 가능하다.
                            return (
                                <option key={index} value={value.id}>
                                    {value.name} ({value.symbol})
                                </option>
                            );
                        })}
                    </select>

                    {selectedCoin && (
                        <div
                            style={{
                                marginTop: "20px",
                                padding: "20px",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                backgroundColor: "#f9f9f9",
                                maxWidth: "400px",
                            }}>
                            <h2 style={{ marginBottom: "15px" }}>
                                {selectedCoin.name}{" "}
                                <span style={{ color: "gray", fontSize: "1rem" }}>
                                    {selectedCoin.symbol}
                                </span>
                            </h2>
                            <ul style={{ listStyle: "none", padding: "0", margine: "0" }}>
                                <li>
                                    {" "}
                                    {/* number 타입에 쓸 수 있는 메소드 .toFixed(숫자) : 소숫점 갯수 */}
                                    <strong>현재 가격:</strong> $
                                    {Number(selectedCoin.price_usd).toFixed(4)}
                                </li>
                                <li>
                                    {/* number 타입에 쓸 수 있는 메소드 .toLocalString() : 숫자에 식별 콤마를 넣어 문자열로 변환*/}
                                    {/* 한국 컴퓨터에서 열면, 로 숫자를 나누는데 중동에서 열면 .로 숫자를 나눔*/}
                                    <strong>시가 총액:</strong> $
                                    {Number(selectedCoin.market_cap_usd).toLocaleString()}
                                </li>
                                <li>
                                    <strong>1시간 변동률:</strong>{" "}
                                    <span
                                        style={{
                                            color:
                                                selectedCoin.percent_change_1h >= 0
                                                    ? "red"
                                                    : "blue",
                                        }}>
                                        {selectedCoin.percent_change_1h}%
                                    </span>
                                </li>
                                <li>
                                    <strong>24시간 변동률:</strong>{" "}
                                    <span
                                        style={{
                                            color:
                                                selectedCoin.percent_change_24h >= 0
                                                    ? "red"
                                                    : "blue",
                                        }}>
                                        {selectedCoin.percent_change_24h}%
                                    </span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;

// 원래 input이나 select나, 사용자가 입력한 값(또는 선택한 값)이 웹브라우저 상 value에 들어가게 되어 있음
// => Uncontrolled Component => 우리(프로그래머가 또는 이 프로그램이)가 제어하지 않는 컴포넌트

// onChange를 걸어준 건 input을 바꾸는게 아니라 state를 바꾸는 행위

// 우리가 value를 적어주게 되면서, 이에 대한 제어를 우리가(프로그래머가 또는 이프로그램이) 하게 됨
// => controlled Component
