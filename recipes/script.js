function addMealsList(meals, allMeals) {
    const recipesList = document.getElementById('recipes-list');
    recipesList.innerHTML = "";
    meals.forEach(meal => {
        recipesList.innerHTML += `
                <li>
                    <div class="li-section">
                        <img class="recipe-image"
                            src="${meal.image}"
                            width="50px" height="50px">
                        <div class="recipe-name">
                            ${meal.name}
                        </div>
                    </div>
                    <div class="li-section">
                        <div>
                        ${getRating(meal.id)}
                        </div>&nbsp;&nbsp;&nbsp;
                        <div>
                        ${getCommentsCount(meal.id)}
                        </div>&nbsp;&nbsp;&nbsp;
                        
                        <button class="see-recipe-button" id="${meal.id}">See recipe</button>
                    </div>
                    <div id="${meal.id}-recipe" class="modal">
                        <div class="modal-content">
                            <div class="modal-recipe-name">${meal.name}
                                <div class="recipe-categories">
                                ${meal.category}, ${meal.region}
                                </div>
                            </div>
                            <img src="${meal.image}"
                                width="200px" height="200px" class="modal-recipe-image">
                            <div class="modal-recipe-description">${meal.instruction}</div>
                            <table class="modal-table">
                                <tr>
                                    <th>Ingredients</th>
                                    <th>Measure</th>
                                </tr>
                                ${meal.ingredients.map(ingr => `<tr>
                                    <td>${ingr.name}</td>
                                    <td>${ingr.measure}</td>
                                </tr>`)}
                            </table>
                            <div class="comment-section">

                            <textarea id="${meal.id}-comment-input" rows="5" class="comment-input" maxlength="200" placeholder="Comment..."></textarea>
                            <button class="comment-button" id="${meal.id}-comment">Comment</button>

                            <div>
                            <input type="radio" id="1" name="${meal.id}-rating" value="1">
                            <label for="1">1</label>
                            <input type="radio" id="2" name="${meal.id}-rating" value="2">
                            <label for="2">2</label>
                            <input type="radio" id="3" name="${meal.id}-rating" value="3">
                            <label for="3">3</label> 
                            <input type="radio" id="4" name="${meal.id}-rating" value="4">
                            <label for="4">4</label>
                            <input type="radio" id="5" name="${meal.id}-rating" value="5">
                            <label for="5">5</label>
                            <input type="radio" id="6" name="${meal.id}-rating" value="6">
                            <label for="6">6</label> 
                            <button class="rate-button" id="${meal.id}-rate">Rate</button>
                            </div>
                            <div class="all-comments" id="${meal.id}-comments" > 
                                ${getComments(meal.id).map(comment => `<div class="comment-container">
                                    <div class="comment-author">
                                        ${comment.author}
                                    </div>
                                    <div class="comment-text">
                                        ${comment.comment}
                                    </div>
                                    <div class="comment-date">
                                        ${comment.timestamp}
                                    </div>
                                </div>`).join('<br>')}
                            </div>  
                            </div>
                            <div class="close-button-section">
                                <button class="close-button" id="${meal.id}-close">Close</button>
                            </div>
                        </div>
                    </div>
                </li>
        `
    })


    const buttons = document.getElementsByClassName("see-recipe-button");

    Array.prototype.forEach.call(buttons, function (button) {
        const modal = document.getElementById(`${button.id}-recipe`);
        const close = document.getElementById(`${button.id}-close`);

        button.onclick = function () {
            modal.style.display = "block";
        }

        close.onclick = function () {
            modal.style.display = "none";
        }
    });

    const commentButtons = document.getElementsByClassName("comment-button");
    Array.prototype.forEach.call(commentButtons, (button) => {
        button.onclick = () => {
            const mealId = button.id.substr(0, button.id.indexOf('-'));
            const comment = document.getElementById(`${mealId}-comment-input`).value;
            addComment(comment, mealId);
        }
    });

    const rateButtons = document.getElementsByClassName("rate-button");
    Array.prototype.forEach.call(rateButtons, (button) => {
        button.onclick = () => {
            const mealId = button.id.substr(0, button.id.indexOf('-'));
            const value = document.querySelector(`input[name="${mealId}-rating"]:checked`).value;
            rate(value, mealId);
        }
    });

    const top10RateButton = document.getElementById("top-10-rated");
    top10RateButton.onclick = () => getTop10Rated(allMeals);

    const top10PopularButton = document.getElementById("top-10-popular");
    top10PopularButton.onclick = () => getTop10Popular(allMeals);
}

function getTop10Rated(meals) {
    const ratingsItem = localStorage.getItem("ratings");
    if(!ratingsItem) {
        return [];
    } else {
        const ratings = JSON.parse(ratingsItem);
        const topMeals = meals.filter(meal => {
            const rating = ratings.find(r => r.mealId === meal.id);
            return !!rating;
        }).sort((meal1, meal2) => {
            const rating1 = ratings.find(r => r.mealId === meal1.id);
            const rating2 = ratings.find(r => r.mealId === meal2.id);
            return rating1.rating < rating2.rating ? 1 : -1;
        })
        topMeals.slice(0, 10);
        addMealsList(topMeals, meals);
    }
}

function getTop10Popular(meals) {
    const commentsItem = localStorage.getItem("comments");
    if(!commentsItem) {
        return [];
    } else {
        const comments = JSON.parse(commentsItem);
        const topMeals = meals.filter(meal => {
            const rating = comments.find(r => r.mealId === meal.id);
            return !!rating;
        }).sort((meal1, meal2) => {
            const comments1 = comments.filter(r => r.mealId === meal1.id).length;
            const comments2 = comments.filter(r => r.mealId === meal2.id).length;
            return comments1 < comments2 ? 1 : -1;

        })
        topMeals.slice(0, 10);
        addMealsList(topMeals, meals);
    }
}

function getRating(mealId) {
    const ratingsItem = localStorage.getItem("ratings");
    if (!ratingsItem) {
        return "No reviews";
    }
    const ratings = JSON.parse(ratingsItem);
    const rating = ratings.filter(rating => rating.mealId === mealId);
    return rating.length === 0  ? 'No reviews' : `${rating[0].rating.toFixed(2)}&nbsp;/&nbsp;6.00`;
}

function getCommentsCount(mealId) {
    const commentsItem = localStorage.getItem("comments");
    if (!commentsItem) {
        return "No comments";
    }
    const comments = JSON.parse(commentsItem);
    const count = comments.filter(comment => comment.mealId === mealId).length;
    return count === 0  ? 'No comments' : `${count} comments`;
}

function getComments(mealId) {
    const commentsItem = localStorage.getItem("comments");
    if (!commentsItem) {
        return [];
    }
    const comments = JSON.parse(commentsItem);
    return comments.filter(comment => comment.mealId === mealId);
}

function addComment(comment, mealId) {
    const author = JSON.parse(localStorage.getItem("currentUser")).email;
    const commentsItem = localStorage.getItem("comments");
    const commentsDiv = document.getElementById(`${mealId}-comments`);
    if (!commentsItem) {
        localStorage.setItem("comments", JSON.stringify([{
            author,
            comment,
            mealId,
            timestamp: (new Date()).toString(),
        }]));
        const dv = document.createElement("div");
        dv.setAttribute("class", "comment-container");
        dv.innerHTML = `<br>
                        <div class="comment-author">
                            ${author}
                        </div>
                        <div class="comment-text">
                            ${comment}
                        </div>
                        <div class="comment-date">
                            ${(new Date()).toString()}
                        </div>
                        <br>`;
        commentsDiv.appendChild(dv);
        const close = document.getElementById(`${mealId}-close`);
        close.onclick = () => {
            window.location.reload();
        }
    } else {
        const comments = JSON.parse(commentsItem);
        comments.push({
            author,
            comment,
            mealId,
            timestamp: (new Date()).toString(),
        });
        localStorage.setItem("comments", JSON.stringify(comments)); 
        const dv = document.createElement("div");
        dv.setAttribute("class", "comment-container");
        dv.innerHTML = `<br>
                        <div class="comment-author">
                            ${author}
                        </div>
                        <div class="comment-text">
                            ${comment}
                        </div>
                        <div class="comment-date">
                            ${(new Date()).toString()}
                        </div>
                        <br>`;
        commentsDiv.appendChild(dv);
        const close = document.getElementById(`${mealId}-close`);
        close.onclick = () => {
            window.location.reload();
        }
    }
}

function rate(rating, mealId) {
    const ratingsItem = localStorage.getItem("ratings");
    if (!ratingsItem) {
        localStorage.setItem("ratings", JSON.stringify([{
            mealId,
            rating: new Number(rating),
            votes: 1,
        }]))
        window.location.reload();
    }
    else {
        const ratings = JSON.parse(ratingsItem);
        if (ratings.filter(r => r.mealId === mealId).length === 0) {
            ratings.push({
                mealId,
                rating: new Number(rating),
                votes: 1,
            })
            localStorage.setItem("ratings", JSON.stringify(ratings));
            window.location.reload();
        } else {
            const newRatings = ratings.map(r => {
                if (r.mealId === mealId) {
                    const currentRating = new Number(r.rating);
                    const newRating = new Number(rating);
                    let votes = new Number(r.votes);
                    votes++;
                    r.votes = votes;
                    r.rating = currentRating + (newRating - currentRating) / votes;
                }
                return r;
            });
            localStorage.setItem("ratings", JSON.stringify(newRatings));
            window.location.reload();
        }

    }
}

function filterByName(meals, name) {
    return meals.filter(meal => meal.name.toLowerCase().startsWith(name.toLowerCase()))
}

fetch('https://api.npoint.io/51ed846bdd74ff693d7e')
    .then(response => response.json())
    .then(data => {
        const meals = data.meals.slice(10, 20);
        addMealsList(meals, data.meals);

        const search = document.getElementById("search");
        search.addEventListener('change', (e) => {
            const name = search.value;
            let filteredMeals = filterByName(data.meals, name);
            addMealsList(filteredMeals.slice(0, 10));
        })
    });
