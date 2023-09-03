$(document).ready(function () {
    $('.sk-fading-circle').fadeOut(500, function () {
        $('#loading').fadeOut(500, function () {
            $('body').css('overflow','auto');
            $('#loading').remove();
        })
    })

    function open() {
        $(".sideBar").animate({ left: 0 }, 500)

        $(".open-close-icon").removeClass("fa-align-justify");
        $(".open-close-icon").addClass("fa-x");
        
        
        for (let i = 0; i < 5; i++) {
            $(".links a").eq(i).animate({ top: 0 }, (i + 5) * 100)
        }
        
    }
    function close() {
        let sideBarBodyWidth = $(".sideBarBody").outerWidth()
        $(".sideBar").animate({ left: -sideBarBodyWidth }, 500)
        $(".open-close-icon").addClass("fa-align-justify");
        $(".open-close-icon").removeClass("fa-x");
        $(".links a").animate({ top: 300 }, 500)
        
    }


    close();
    $(".sideBarHeader .open-close-icon").click(() => {
        if ($(".sideBar").css("left") == "0px") {
            close();
        } else {
            open();
        }
    })

    let sideBarHeader = $(".sideBarHeader").outerWidth();
    $(".Body").css("marginLeft", sideBarHeader)

    let mealsNoName = [];
    let box = ''
    let IngredientAndMeasure = ``
    let tagsStr = ``

    function apiBody() {
        let MealsBody = window.document.getElementById('MealsBody')
        displayMeal(mealsNoName);
        
        $(".meal-layer").click(function (e) {
            $(".container").css('display', 'none')
            let id = e.target.getAttribute('id');
            let index;
            for (let j = 0; j < mealsNoName.length; j++) {
                if(mealsNoName[j].idMeal == id){
                    index = j;
                }
            }
            recipesBody(mealsNoName[index]);
            box = `
            
            <div class="col-md-4">
                <img src="${mealsNoName[index].strMealThumb}" class="w-100 rounded-3" alt="${mealsNoName[index].strMeal}">
                <h2>${mealsNoName[index].strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${mealsNoName[index].strInstructions}</p>
                <h3> <span class="fw-bolder">Area : </span> ${mealsNoName[index].strArea}</h3>
                <h3> <span class="fw-bolder">Category :  </span> ${mealsNoName[index].strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${IngredientAndMeasure}
                </ul>
                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>
                <a target="_blank" href="${mealsNoName[index].strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${mealsNoName[index].strYoutube}" class="btn btn-danger">Youtube</a>
            </div>

            
            `
            MealsBody.innerHTML = box;

            
        })
        
    }

    async function getAPI(Name=''){
        let apiRespone = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${Name}`);
        let allPosts = await apiRespone.json();
        mealsNoName = allPosts.meals;

        if(mealsNoName != null){
            
            apiBody();
        }else{
            MealsBody.innerHTML = ''
        }
        
    }
    async function getAPISearchLetter(Name=''){
        let apiRespone = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${Name}`);
        let allPosts = await apiRespone.json();
        mealsNoName = allPosts.meals;
        if(mealsNoName != null){
            
            apiBody();
        }else{
            MealsBody.innerHTML = ''
        }
    }

    getAPI();
    
    function displayMeal(mealsNoName) {
        box = ''
        
        for (let i = 0; i < mealsNoName.length; i++) {
            box += `
            <div class="col-md-3 pb-4">
                <div class="meal position-relative overflow-hidden rounded-2" >
                    <img src="${mealsNoName[i].strMealThumb}" class="w-100" alt="${mealsNoName[i].strMeal}">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2" id="${mealsNoName[i].idMeal}">
                        <h3 id="${mealsNoName[i].idMeal}">${mealsNoName[i].strMeal}</h3>
                    </div>
                </div>
            
            </div>
            
            ` 
            
        }
        MealsBody.innerHTML = box;
        
    }

    function recipesBody(meal) {
        IngredientAndMeasure = ''
        tagsStr = ''
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                IngredientAndMeasure += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
            }
        }

        let tags = meal.strTags?.split(",")
        if(tags == undefined || tags == ''){
            tags = []
        }
        for (let i = 0; i < tags.length; i++) {
            tagsStr += `
            <li class="alert alert-danger m-2 p-1">${tags[i]}</li>
            `
        }
        
        
    }

    $("#Search").click(function () {
        close();
        box = `

        <div class="container">
            <div class="row mx-0 py-4">
                <div class="col-md-6 pb-2">
                    <form>
                        <input type="text" class="searchName form-control bg-transparent text-white" placeholder="Search By Name" >
                    </form>
                </div>
                <div class="col-md-6 pb-2">
                    <form>
                        <input type="text" class="searchFirstLetter form-control bg-transparent text-white" placeholder="Search By First Letter" maxlength="1" >
                    </form>
                </div>

            </div>

        </div>
        <div class="row p-5 mx-0" id="MealsBody">
            
        </div>
        
        `
        document.getElementById("Body").innerHTML = box;

        
        $(".searchName").keyup( e=>getAPI(e.target.value))
        $(".searchFirstLetter").keyup( e=>getAPISearchLetter(e.target.value))
    })

    async function getCategoryMeals(category){
        let apiRespone = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        let allPosts = await apiRespone.json()
        mealsNoName = allPosts.meals;
        let MealsBody = window.document.getElementById('MealsBody')
        displayMeal(mealsNoName);

        $(".meal-layer").click(async function (e){
            let id = e.target.getAttribute('id');
            let apiRespone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            let allPosts = await apiRespone.json();
            mealsNoName = allPosts.meals;

            for (let j = 0; j < mealsNoName.length; j++) {
                if(mealsNoName[j].idMeal == id){
                    index = j;
                }
            }
            recipesBody(mealsNoName[index]);
            box = `
            
            <div class="col-md-4">
                <img src="${mealsNoName[index].strMealThumb}" class="w-100 rounded-3" alt="${mealsNoName[index].strMeal}">
                <h2>${mealsNoName[index].strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${mealsNoName[index].strInstructions}</p>
                <h3> <span class="fw-bolder">Area : </span> ${mealsNoName[index].strArea}</h3>
                <h3> <span class="fw-bolder">Category :  </span> ${mealsNoName[index].strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${IngredientAndMeasure}
                </ul>
                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>
                <a target="_blank" href="${mealsNoName[index].strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${mealsNoName[index].strYoutube}" class="btn btn-danger">Youtube</a>
            </div>

            
            `
            MealsBody.innerHTML = box;
            
        })

    }
    
    async function categorieAPI(){
        let categorieAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        let categorieAllPosts = await categorieAPI.json();
        mealsNoName = categorieAllPosts.categories;

        
        displayCategories(mealsNoName);

        $(".meal-layer").click(function (e) {
            $(".container").css('display', 'none')
            let name = e.target.getAttribute('catid');
            getCategoryMeals(name);
        })
        
    }
    
    function displayCategories(mealsNoName) {
        let MealsBody = window.document.getElementById('MealsBody')
        box = '';
        for (let i = 0; i < mealsNoName.length; i++) {
            let description = mealsNoName[i].strCategoryDescription;
            let firstTwentyWords = '';
            let words = description.split(" ");
            firstTwentyWords = words.slice(0, 20).join(" ");
            box += `
            <div class="col-md-3 pb-4">
                <div class="meal position-relative overflow-hidden rounded-2" >
                    <img src="${mealsNoName[i].strCategoryThumb}" class="w-100" alt="${mealsNoName[i].strCategory}">
                    <div class="meal-layer position-absolute text-center text-black p-2" >
                        <div class="w-100 h-100" catid="${mealsNoName[i].strCategory}">
                            <h3 catid="${mealsNoName[i].strCategory}">${mealsNoName[i].strCategory}</h3>
                            <p catid="${mealsNoName[i].strCategory}">${firstTwentyWords}</p>
                        </div>
                    </div>
                </div>
            
            </div>
            
            ` 
            
        }
        MealsBody.innerHTML = box;

        
    }

    $("#Categories").click(function () {
        close();
        $(".container").css('display', 'none')
        categorieAPI();
    })
    $("#Area").click(function () {
        close();
        $(".container").css('display', 'none')
        areaAPI();
    })
    
    async function areaAPI(){
        let AreaAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
        let AreaAllPosts = await AreaAPI.json();
        mealsNoName = AreaAllPosts.meals;

        
        displayArea(mealsNoName);

        $(".meal").click(function (e) {
            $(".container").css('display', 'none')
            let name = e.target.getAttribute('name');
            getAreaMeals(name);
        })
        
    }



    function displayArea(mealsNoName) {
        let MealsBody = window.document.getElementById('MealsBody')
        box = '';
        for (let i = 0; i < mealsNoName.length; i++) {
            box += `
            <div class="col-md-3 pb-4">
                <div class="meal text-center rounded-2"  >
                    <div name="${mealsNoName[i].strArea}">
                        <i class="fa-solid fa-house-laptop fa-4x" name="${mealsNoName[i].strArea}"></i>
                        <h3 name="${mealsNoName[i].strArea}">${mealsNoName[i].strArea}</h3>
                    </div>
                </div>
            
            </div>
            
            ` 
            
        }
        MealsBody.innerHTML = box;

        
    }

    async function getAreaMeals(area){
        let apiRespone = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
        let allPosts = await apiRespone.json()
        mealsNoName = allPosts.meals;
        let MealsBody = window.document.getElementById('MealsBody')
        displayMeal(mealsNoName);

        $(".meal-layer").click(async function (e){
            let id = e.target.getAttribute('id');
            let apiRespone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            let allPosts = await apiRespone.json();
            mealsNoName = allPosts.meals;

            for (let j = 0; j < mealsNoName.length; j++) {
                if(mealsNoName[j].idMeal == id){
                    index = j;
                }
            }
            recipesBody(mealsNoName[index]);
            box = `
            
            <div class="col-md-4">
                <img src="${mealsNoName[index].strMealThumb}" class="w-100 rounded-3" alt="${mealsNoName[index].strMeal}">
                <h2>${mealsNoName[index].strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${mealsNoName[index].strInstructions}</p>
                <h3> <span class="fw-bolder">Area : </span> ${mealsNoName[index].strArea}</h3>
                <h3> <span class="fw-bolder">Category :  </span> ${mealsNoName[index].strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${IngredientAndMeasure}
                </ul>
                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>
                <a target="_blank" href="${mealsNoName[index].strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${mealsNoName[index].strYoutube}" class="btn btn-danger">Youtube</a>
            </div>

            
            `
            MealsBody.innerHTML = box;
            
        })

    }

    $("#Ingredients").click(function () {
        close();
        $(".container").css('display', 'none')
        ingredientsAPI();
    })
    
    async function ingredientsAPI(){
        let AreaAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
        let AreaAllPosts = await AreaAPI.json();
        mealsNoName = AreaAllPosts.meals;

        
        displayIngredients(mealsNoName);

        $(".meal").click(function (e) {
            $(".container").css('display', 'none')
            let name = e.target.getAttribute('name');
            getIngredientsMeals(name);
        })
        
    }



    function displayIngredients(mealsNoName) {
        let MealsBody = window.document.getElementById('MealsBody')
        box = '';
        for (let i = 0; i <20; i++) {
            let description = mealsNoName[i].strDescription;
            let firstTwentyWords = '';
            let words = description.split(" ");
            firstTwentyWords = words.slice(0, 20).join(" ");
            
            box += `
            <div class="col-md-3 pb-4">
                <div class="meal text-center rounded-2"  >
                    <div class="w-100 h-100" name="${mealsNoName[i].strIngredient}">
                        <i class="fa-solid fa-drumstick-bite fa-4x" name="${mealsNoName[i].strIngredient}"></i>
                        <h3 name="${mealsNoName[i].strIngredient}">${mealsNoName[i].strIngredient}</h3>
                        <p name="${mealsNoName[i].strIngredient}">${firstTwentyWords}</p>
                    </div>
                </div>
            
            </div>
            
            ` 
            
        }
        MealsBody.innerHTML = box;

        
    }

    async function getIngredientsMeals(ingredients){
        let apiRespone = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
        let allPosts = await apiRespone.json()
        mealsNoName = allPosts.meals;
        let MealsBody = window.document.getElementById('MealsBody')
        displayMeal(mealsNoName);

        $(".meal-layer").click(async function (e){
            let id = e.target.getAttribute('id');
            let apiRespone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            let allPosts = await apiRespone.json();
            mealsNoName = allPosts.meals;

            for (let j = 0; j < mealsNoName.length; j++) {
                if(mealsNoName[j].idMeal == id){
                    index = j;
                }
            }
            recipesBody(mealsNoName[index]);
            box = `
            
            <div class="col-md-4">
                <img src="${mealsNoName[index].strMealThumb}" class="w-100 rounded-3" alt="${mealsNoName[index].strMeal}">
                <h2>${mealsNoName[index].strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${mealsNoName[index].strInstructions}</p>
                <h3> <span class="fw-bolder">Area : </span> ${mealsNoName[index].strArea}</h3>
                <h3> <span class="fw-bolder">Category :  </span> ${mealsNoName[index].strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${IngredientAndMeasure}
                </ul>
                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>
                <a target="_blank" href="${mealsNoName[index].strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${mealsNoName[index].strYoutube}" class="btn btn-danger">Youtube</a>
            </div>

            
            `
            MealsBody.innerHTML = box;
            
        })

    }

    $("#Contact").click(function () {
        close();
        $(".container").css('display', 'none');
        document.getElementById("Body").innerHTML = `
        
        <div class="Contact container vh-100 text-center justify-content-center align-items-center">
        <div>
            <div class="row mx-0 g-4">
                <div class="col-md-6 ">
                    <form>
                        <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name" >
                        <p id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">Special characters and numbers not allowed</p>
                    </form>
                </div>
                <div class="col-md-6 ">
                    <form>
                        <input id="emailInput" type="email" class="form-control" placeholder="Enter Your Email" >
                        <p id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">Email not valid *exemple@yyy.zzz</p>
                    </form>
                </div>
                <div class="col-md-6 ">
                    <form>
                        <input id="phoneInput" type="text" class="form-control" placeholder="Enter Your Phone" >
                        <p id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid Phone Number</p>
                    </form>
                </div>
                <div class="col-md-6 ">
                    <form>
                        <input id="ageInput" type="number" class="form-control" placeholder="Enter Your Age" >
                        <p id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid age</p>
                    </form>
                </div>
                <div class="col-md-6 ">
                    <form>
                        <input id="passwordInput" type="password" class="form-control" placeholder="Enter Your Password" >
                        <p id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid password *Minimum eight characters, at least one letter and one number:*</p>
                    </form>
                </div>
                <div class="col-md-6 ">
                    <form>
                        <input id="repasswordInput" type="password" class="form-control" placeholder="Repassword" >
                        <p id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid repassword</p>
                    </form>
                </div>
                

            </div>
            <button id="submitBtn" disabled="true" class="btn btn-outline-danger px-2 mt-3">Submit</button>
        </div>
        
    </div>
    <div class="row p-5 mx-0" id="MealsBody">
            
    </div>
        
        `

        document.getElementById("nameInput").addEventListener("keyup",function (e) {
            if(nameValidation()){
                document.getElementById("nameAlert").classList.replace("d-block", "d-none")
            } else {
                document.getElementById("nameAlert").classList.replace("d-none", "d-block")
            }
            btnValidationButton();
            
        })
        document.getElementById("emailInput").addEventListener("keyup",function (e) {
            if(emailValidation()){
                document.getElementById("emailAlert").classList.replace("d-block", "d-none")
            } else {
                document.getElementById("emailAlert").classList.replace("d-none", "d-block")
            }
            btnValidationButton()
        })
        document.getElementById("phoneInput").addEventListener("keyup",function (e) {
            if(phoneValidation()){
                document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
            } else {
                document.getElementById("phoneAlert").classList.replace("d-none", "d-block")
            }
            btnValidationButton()
        })
        document.getElementById("ageInput").addEventListener("keyup",function (e) {
            if(ageValidation()){
                document.getElementById("ageAlert").classList.replace("d-block", "d-none")
            } else {
                document.getElementById("ageAlert").classList.replace("d-none", "d-block")
            }
            btnValidationButton()
        })
        document.getElementById("passwordInput").addEventListener("keyup",function (e) {
            if(passwordValidation()){
                document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
            } else {
                document.getElementById("passwordAlert").classList.replace("d-none", "d-block")
            }
            btnValidationButton()
        })
        document.getElementById("repasswordInput").addEventListener("keyup",function (e) {
            if(repasswordValidation()){
                document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
            } else {
                document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")
            }
            btnValidationButton()
        })
        

        function btnValidationButton() {
            if (nameValidation() == true && emailValidation() == true && phoneValidation() == true && ageValidation() == true && passwordValidation() == true && repasswordValidation() == true) {
                document.getElementById("submitBtn").removeAttribute("disabled")
            } else {
                // $("#submitBtn").setAttribute("disabled", true)
                document.getElementById("submitBtn").setAttribute("disabled", true)
            }
            
        }
        
        
    })

    function nameValidation() {
        return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
    }
    
    function emailValidation() {
        return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
    }
    
    function phoneValidation() {
        return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
    }
    
    function ageValidation() {
        return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
    }
    
    function passwordValidation() {
        return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
    }
    
    function repasswordValidation() {
        return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
    }

})
