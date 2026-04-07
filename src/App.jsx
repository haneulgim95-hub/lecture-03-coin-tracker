import { useEffect, useState } from "react";

function App() {
    // 외부에서 데이터를 받아다가 화면을 출력해주는 프로그램
    // 초기렌더링 -> 데이터를 받아오고 -> 데이터로 화면을 갱신

    // state. 우리는 이 화면을 작성할 때 어떤 state가 필요할까?
    const [loading, setLoading] = useState(true); // 어떠한 목적의 state : loading 관리용 state
    // 데이터를 불러오는 중에는 true, 데이터가 도착되면 false.
    const [coins, setCoins] = useState(""); // 어떠한 목적의 state : 외부에서 받아오는 데이터를 저장할 목적의 state

    // useEffect(() => {}, [의존성]) :  최초 렌더링이  끝난 이후 1회 무조건 실행됨
    useEffect(() => {
        // 외부에서 데이터를 받아와서  coins에 저장하는 일
        // fetch() : 외부에서 데이터를 받아오는 비동기함수. 비동기함수는 .then()과 .catch()로 처리해야 함
        // .then(함수) : fetch()가 완료되면 실행되는 함수를 적어줘야 함       => then()은 메소드 체인으로 여러개를 적어줄 수 있음
        // .catch(함수) : fetch()가 실패하면 실행되는 함수를 적어줘야 함       => catch()는 보통적으로 한 번만 적어줄 수 있음
        fetch("https://api.coinlore.net/api/tickers/")
            // .fetch()를 실행한 결과가 .then의 매개변수인 함수의 매개변수 자리로 들어간다.
            .then(response => {
                return response.json();
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
            {loading ? <strong>데이터를 불러오는 중입니다...</strong> : (<div>
                <select>
                    {coins.map((value, index) => {          // coins(data)가 배열이라서 map메소드 사용 가능하다.
                        return <option key={index}>{value.name} ({value.symbol})</option>
                    })}
                </select>
            </div>)}
        </div>
    );
}

export default App;
