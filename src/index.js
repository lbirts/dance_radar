const danceURL = "http://localhost:3000/dancers"
const dancerList = document.querySelector("ul");
const dancerDetails = document.querySelector(".details")
const dancerFeedback = document.querySelector(".feedback")
const feedbackUl = dancerFeedback.querySelector("ul")
const form = dancerFeedback.querySelector("form")

// grab all dancers
function getAllDancers() {
    dancerList.innerHTML = ""
    return fetch(danceURL)
        .then(res => res.json())
        .then(dancers => dancers.forEach(renderAllDancers))
}

// list all dancers on page
function renderAllDancers(dancer) {
    const li = document.createElement("li")
    const btn = document.createElement("button")

    btn.innerText = dancer.name
    btn.dataset.id = dancer.id
    li.append(btn)
    dancerList.append(li)

    btn.addEventListener("click", e => {
        getSingleDancer(e.target.dataset.id).then(renderDancer)
        console.log(e.target.dataset.id)
    })

}

// event listner for feedback Li
function delteFeedback(e) {
    const id = e.target.parentElement.dataset.id
    getSingleDancer(id).then(dancer => {
       let feed = dancer.feedback
       const newFeed = feed.filter(element => !element.includes(e.target.innerText))
       newFeedback(id, newFeed)
       
   })
   
}

// grabs feedback array and push new value into it
// pass in id argument
function pushNewFeedback(e) {
    e.preventDefault()
    const id = e.target.dataset.id
    getSingleDancer(id).then(dancer => {
        let newFeed = dancer.feedback
        const feedbackValue = e.target[0].value
        newFeed.push(feedbackValue)
        newFeedback(id, newFeed)
        e.target.reset()
    })
}

function newFeedback(id, array) {
    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "feedback": array
        })
    }
    fetch(danceURL + `/${id}`, options)
        .then(res => res.json())
        .then(
            feedbackUl.innerHTML = "",
            array.forEach(single => renderFeedback(single))
        )
}

// puts Feeback on the page in Lis
function renderFeedback(feedbackArray) {
    const li = document.createElement("li")
    li.innerText = feedbackArray
    feedbackUl.append(li)
}

// puts Individual dancer on the page
function renderDancer(dancer) {
    const image = dancerDetails.querySelector("#dancer-img")
    const name = dancerDetails.querySelector("#dancer-name")
    const likeCount = dancerDetails.querySelector("#like-count")
    likeCount.dataset.id = dancer.id
    const desc = dancerDetails.querySelector("#dancer-description")
    feedbackUl.innerHTML = ""
    feedbackUl.dataset.id = dancer.id
    form.dataset.id = dancer.id

    image.src = dancer.image
    name.innerText = dancer.name
    likeCount.innerText = dancer.likes
    desc.innerText = dancer.description
    dancer.feedback.forEach(renderFeedback)

    feedbackUl.addEventListener("click", e => delteFeedback(e))
}

// Fetches a single dancer
// need to pass in id argument
function getSingleDancer(id) {
    return fetch(danceURL + `/${id}`)
        .then(res => res.json())
}

// udpates dancer json with a new like
function updateDancer(id, newLikes) {
    
    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "likes": newLikes
        })
    };
    fetch(danceURL + `/${id}`, options)
        .then(res => res.json())
        .then()
}

// increments page with a new like
function likeDancer() {
    const likeCount = dancerDetails.querySelector("#like-count")
    likeCount.innerText++
    const id = likeCount.dataset.id
    updateDancer(id, Number(likeCount.innerText))
    // updateDancer(Number(likeCount.innerText), likeCount.dataset.id)
}

// decrements likes on page
function unlikeDancer() {
    const likeCount = dancerDetails.querySelector("#like-count")
    const id = likeCount.dataset.id
    if (likeCount.innerText > 0) {
        likeCount.innerText--
    }
    updateDancer(id, Number(likeCount.innerText))
    // updateDancer(likeCount.dataset.id)
}

// event listner for like and unlike button
function likeUnlike() {
    const like = dancerDetails.querySelector("#like")
    const unlike = dancerDetails.querySelector("#unlike")

    like.addEventListener("click", () => likeDancer())
    unlike.addEventListener("click", () => unlikeDancer())
}

// event listner for feedback form
function feedbackForm() {
    form.addEventListener("submit", e => pushNewFeedback(e))
}

// needed to call all functions together
function main() {
    getAllDancers()
    getSingleDancer(1).then(renderDancer)
    likeUnlike()
    feedbackForm()
}

main()