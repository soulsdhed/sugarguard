document.getElementById('foodnutrition-search-button').addEventListener('click', function () {
    var searchInput = document.getElementById('search-input').value;

    if (searchInput === '소고기') {
        var resultDiv = document.getElementById('foodnutrition-result');
        resultDiv.innerHTML = `
            <div class="nutrition-facts">
                <h1>Nutrition Facts</h1>
                <p class="right-align">% 1일 기준치 비율</p>
                <table>
                    <tr><td>칼로리</td><td>14kcal</td><td>1%</td></tr>
                    <tr><td>탄수화물</td><td>3.0g</td><td>1%</td></tr>
                    <tr><td>식이섬유</td><td>5.7g</td><td>1%</td></tr>
                    <tr><td>당류</td><td>N/A</td><td>1%</td></tr>
                    <tr><td>단백질</td><td>0.98g</td><td>1%</td></tr>
                    <tr><td>지방</td><td>0.07g</td><td>1%</td></tr>
                    <tr><td>포화지방</td><td>N/A</td><td>1%</td></tr>
                    <tr><td>트랜스지방</td><td>N/A</td><td>1%</td></tr>
                    <tr><td>콜레스테롤</td><td>N/A</td><td>1%</td></tr>
                    <tr><td>나트륨</td><td>11.2mg</td><td>1%</td></tr>
                </table>
                <div class="vitamin-info">
                    <div>
                        <p>비타민 A</p>
                        <p>비타민 C</p>
                        <p>비타민 E</p>
                        <p>오메가 3</p>
                        <p>오메가 6</p>
                    </div>
                    <div>
                        <p>8.23RAE</p>
                        <p>5.3mg</p>
                        <p>N/A</p>
                        <p>N/A</p>
                        <p>N/A</p>
                    </div>
                    <div>
                        <p>칼슘</p>
                        <p>철분</p>
                        <p>엽산</p>
                        <p>칼륨</p>
                    </div>
                    <div>
                        <p>21.7mg</p>
                        <p>0.35mg</p>
                        <p>N/A</p>
                        <p>144.2mg</p>
                    </div>
                </div>
                <p class="explane">1일 기준치 비율(%)은 회원님의 일일 권장 2700칼로리에 대한 비율로 계산되었습니다.</p>
            </div>
        `;
    } else {
        document.getElementById('foodnutrition-result').innerHTML = '결과를 찾을 수 없습니다.';
    }
});
