document
    .getElementById("foodnutrition-search-button")
    .addEventListener("click", async function () {
        const foodName = document.getElementById("search-input").value;
        const resultDiv = document.getElementById("foodnutrition-result");

        try {
            const response = await axios.get("api/food-nutrition", {
                params: {
                    foodName: foodName,
                },
            });
            const data = response.data.data.data;
            console.log(data);

            let htmlStr = "";
            for (let i of data) {
                const energy =
                    i.energy_kcal != null
                        ? Number(i.energy_kcal).toFixed(1) + "kcal"
                        : "N/A";
                const energyPercent =
                    i.energy_kcal != null
                        ? ((i.energy_kcal * 100) / 2700).toFixed(2) + "%"
                        : "";
                const carbohydrate =
                    i.carbohydrate_g != null
                        ? Number(i.carbohydrate_g).toFixed(2) + "g"
                        : "N/A";
                const carbohydratePercent =
                    i.carbohydrate_g != null
                        ? ((i.carbohydrate_g * 100) / 324).toFixed(2) + "%"
                        : "";
                const fiber =
                    i.total_dietary_fiber_g != null
                        ? Number(i.total_dietary_fiber_g).toFixed(2) + "g"
                        : "N/A";
                const fiberPercent =
                    i.total_dietary_fiber_g != null
                        ? ((i.total_dietary_fiber_g * 100) / 25).toFixed(2) +
                          "%"
                        : "";
                const sugar =
                    i.total_sugars_g != null
                        ? Number(i.total_sugars_g).toFixed(2) + "g"
                        : "N/A";
                const sugarPercent =
                    i.total_sugars_g != null
                        ? ((i.total_sugars_g * 100) / 100).toFixed(2) + "%"
                        : "";
                const protein =
                    i.protein_g != null
                        ? Number(i.protein_g).toFixed(2) + "g"
                        : "N/A";
                const proteinPercent =
                    i.protein_g != null
                        ? ((i.protein_g * 100) / 55).toFixed(2) + "%"
                        : "";
                const fat =
                    i.fat_g != null ? Number(i.fat_g).toFixed(2) + "g" : "N/A";
                const fatPercent =
                    i.fat_g != null
                        ? ((i.fat_g * 100) / 54).toFixed(2) + "%"
                        : "";
                const saturatedFattyAcids =
                    i.total_saturated_fatty_acids_g != null
                        ? Number(i.total_saturated_fatty_acids_g).toFixed(2) +
                          "g"
                        : "N/A";
                const saturatedFattyAcidsPercent =
                    i.total_saturated_fatty_acids_g != null
                        ? (
                              (i.total_saturated_fatty_acids_g * 100) /
                              15
                          ).toFixed(2) + "%"
                        : "";
                const transFattyAcids =
                    i.trans_fatty_acids_g != null
                        ? Number(i.trans_fatty_acids_g).toFixed(2) + "g"
                        : "N/A";
                const transFattyAcidsPercent =
                    i.trans_fatty_acids_g != null
                        ? ((i.trans_fatty_acids_g * 100) / 2).toFixed(2) + "%"
                        : "";
                const cholesterol =
                    i.cholesterol_mg != null
                        ? Number(i.cholesterol_mg).toFixed(2) + "mg"
                        : "N/A";
                const cholesterolPercent =
                    i.cholesterol_mg != null
                        ? ((i.cholesterol_mg * 100) / 2000).toFixed(2) + "%"
                        : "";
                const sodium =
                    i.sodium_mg != null
                        ? Number(i.sodium_mg).toFixed(2) + "mg"
                        : "N/A";
                const sodiumPercent =
                    i.sodium_mg != null
                        ? ((i.sodium_mg * 100) / 2000).toFixed(2) + "%"
                        : "";
                const vitaminA =
                    i.retinol_mcg != null
                        ? Number(i.retinol_mcg).toFixed(1) + "µg"
                        : "N/A";
                const vitaminB1 =
                    i.vitamin_B1_mg != null
                        ? Number(i.vitamin_B1_mg).toFixed(2) + "mg"
                        : "N/A";
                const vitaminB2 =
                    i.vitamin_B2_mg != null
                        ? Number(i.vitamin_B2_mg).toFixed(2) + "mg"
                        : "N/A";
                const vitaminC =
                    i.vitamin_C_mg != null
                        ? Number(i.vitamin_C_mg).toFixed(2) + "mg"
                        : "N/A";
                const vitaminE =
                    i.tocopherol_mg != null
                        ? Number(i.tocopherol_mg).toFixed(2) + "mg"
                        : "N/A";
                const calcium =
                    i.calcium_mg != null
                        ? Number(i.tocopherol_mg).toFixed(2) + "mg"
                        : "N/A";
                const iron =
                    i.iron_mg != null
                        ? Number(i.iron_mg).toFixed(2) + "mg"
                        : i.iron_mcg != null
                        ? Number(i.iron_mcg).toFixed(2) + "µg"
                        : "N/A";
                const potassium =
                    i.potassium_mg != null
                        ? Number(i.potassium_mg).toFixed(1) + "mg"
                        : "N/A";
                const magnesium =
                    i.magnesium_mg != null
                        ? Number(i.magnesium_mg).toFixed(1) + "mg"
                        : "N/A";

                console.log(vitaminB1, vitaminB2);
                htmlStr += `
                    <div class="nutrition-facts">
                    <h5><${i.food_name} 영양정보></h5>
                    <h1>Nutrition Facts</h1>
                    <p class="right-align">% 1일 기준치 비율</p>
                    <table>
                        <tr>
                            <td>칼로리</td>
                            <td>${energy}</td>
                            <td>${energyPercent}</td>
                        </tr>
                        <tr>
                            <td>탄수화물</td>
                            <td>${carbohydrate}</td>
                            <td>${carbohydratePercent}</td>
                        </tr>
                        <tr>
                            <td>식이섬유</td>
                            <td>${fiber}</td>
                            <td>${fiberPercent}</td>
                        </tr>
                        <tr>
                            <td>당류</td>
                            <td>${sugar}</td>
                            <td>${sugarPercent}</td>
                        </tr>
                        <tr>
                            <td>단백질</td>
                            <td>${protein}</td>
                            <td>${proteinPercent}</td>
                        </tr>
                        <tr>
                            <td>지방</td>
                            <td>${fat}</td>
                            <td>${fatPercent}</td>
                        </tr>
                        <tr>
                            <td>포화지방</td>
                            <td>${saturatedFattyAcids}</td>
                            <td>${saturatedFattyAcidsPercent}</td>
                        </tr>
                        <tr>
                            <td>트랜스지방</td>
                            <td>${transFattyAcids}</td>
                            <td>${transFattyAcidsPercent}</td>
                        </tr>
                        <tr>
                            <td>콜레스테롤</td>
                            <td>${cholesterol}</td>
                            <td>${cholesterolPercent}</td>
                        </tr>
                        <tr>
                            <td>나트륨</td>
                            <td>${sodium}</td>
                            <td>${sodiumPercent}</td>
                        </tr>
                    </table>
                    <div class="vitamin-info">
                        <div>
                            <p>비타민 A</p>
                            <p>비타민 B1</p>
                            <p>비타민 B2</p>
                            <p>비타민 C</p>
                            <p>비타민 E</p>
                        </div>
                        <div>
                            <p>${vitaminA}</p>
                            <p>${vitaminB1}</p>
                            <p>${vitaminB2}</p>
                            <p>${vitaminC}</p>
                            <p>${vitaminE}</p>
                        </div>
                        <div>
                            <p>칼슘</p>
                            <p>철분</p>
                            <p>칼륨</p>
                            <p>마그네슘</p>
                        </div>
                        <div>
                            <p>${calcium}</p>
                            <p>${iron}</p>
                            <p>${potassium}</p>
                            <p>${magnesium}</p>
                        </div>
                    </div>
                    <p class="explane">1일 기준치 비율(%)은 회원님의 일일 권장 2700칼로리에 대한 비율로 계산되었습니다.</p>
                </div>
                `;
            }
            resultDiv.innerHTML = htmlStr;
        } catch (e) {}

        // api/food-nutrition

        // if (foodName === "소고기") {
        //     let resultDiv = document.getElementById("foodnutrition-result");
        //     resultDiv.innerHTML = `
        //     <div class="nutrition-facts">
        //         <h5><소고기 영양정보></h5>
        //         <h1>Nutrition Facts</h1>
        //         <p class="right-align">% 1일 기준치 비율</p>
        //         <table>
        //             <tr><td>칼로리</td><td>14kcal</td><td>1%</td></tr>
        //             <tr><td>탄수화물</td><td>3.0g</td><td>1%</td></tr>
        //             <tr><td>식이섬유</td><td>5.7g</td><td>1%</td></tr>
        //             <tr><td>당류</td><td>N/A</td><td>1%</td></tr>
        //             <tr><td>단백질</td><td>0.98g</td><td>1%</td></tr>
        //             <tr><td>지방</td><td>0.07g</td><td>1%</td></tr>
        //             <tr><td>포화지방</td><td>N/A</td><td>1%</td></tr>
        //             <tr><td>트랜스지방</td><td>N/A</td><td>1%</td></tr>
        //             <tr><td>콜레스테롤</td><td>N/A</td><td>1%</td></tr>
        //             <tr><td>나트륨</td><td>11.2mg</td><td>1%</td></tr>
        //         </table>
        //         <div class="vitamin-info">
        //             <div>
        //                 <p>비타민 A</p>
        //                 <p>비타민 C</p>
        //                 <p>비타민 E</p>
        //                 <p>오메가 3</p>
        //                 <p>오메가 6</p>
        //             </div>
        //             <div>
        //                 <p>8.23RAE</p>
        //                 <p>5.3mg</p>
        //                 <p>N/A</p>
        //                 <p>N/A</p>
        //                 <p>N/A</p>
        //             </div>
        //             <div>
        //                 <p>칼슘</p>
        //                 <p>철분</p>
        //                 <p>엽산</p>
        //                 <p>칼륨</p>
        //             </div>
        //             <div>
        //                 <p>21.7mg</p>
        //                 <p>0.35mg</p>
        //                 <p>N/A</p>
        //                 <p>144.2mg</p>
        //             </div>
        //         </div>
        //         <p class="explane">1일 기준치 비율(%)은 회원님의 일일 권장 2700칼로리에 대한 비율로 계산되었습니다.</p>
        //     </div>
        // `;
        // } else {
        //     document.getElementById("foodnutrition-result").innerHTML =
        //         "결과를 찾을 수 없습니다.";
        // }
    });
