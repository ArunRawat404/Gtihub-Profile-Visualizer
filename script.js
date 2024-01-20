const perPage = 10;
let currentPage = 1;

const searchBox = document.querySelector(".searchBox");
const searchButton = document.querySelector(".searchButton");

const avatarDiv = document.getElementById("avatar");
const nameDiv = document.getElementById("name");
const bioDiv = document.getElementById("bio");
const userLocationDiv = document.getElementById("location");
const socialMediaDiv = document.getElementById("socialMedia");
const githubURLDiv = document.getElementById("githubURL");
const currentPageDiv = document.getElementById("currentPage");

const reposContainer = document.querySelector(".reposContainer");

const showProfile = function () {
    // Reset currentPage when a new search is performed
    currentPage = 1;
    const username = searchBox.value;
    if (username) {
        fetchUserDetails(searchBox.value);
    }
};

const fetchUserDetails = async function (username) {
    showLoader();
    const url = `https://api.github.com/users/${username}`;

    try {
        const response = await fetch(`${url}`);
        const data = await response.json();

        avatarDiv.src = data.avatar_url;
        nameDiv.innerHTML = `Name: ${data.name || "Not Available"}`;
        bioDiv.innerHTML = `Bio: ${data.bio || "Not Available"}`;
        userLocationDiv.innerHTML = `Location: ${data.location || "Not Available"}`;
        socialMediaDiv.href = `https://twitter.com/${data.twitter_username}`;
        githubURLDiv.href = `${data.html_url}`;

        // server side pagination
        const res = await fetch(`${url}/repos?per_page=${perPage}&page=${currentPage}`);
        const repos = await res.json();
        // Clear previous repos
        reposContainer.innerHTML = "";
        currentPageDiv.innerHTML = currentPage;

        for (let key in repos) {
            let repo = repos[key];

            const repoDiv = document.createElement("div");
            const repoTitleDiv = document.createElement("h2");
            const repoDescriptionDiv = document.createElement("h3");

            repoTitleDiv.innerHTML = repo.name;
            repoTitleDiv.classList.add("repoTitle");
            repoDescriptionDiv.innerHTML = repo.description;
            repoDescriptionDiv.classList.add("repoDescription");

            repoDiv.appendChild(repoTitleDiv);
            repoDiv.appendChild(repoDescriptionDiv);

            repoDiv.classList.add("repo");

            const languagesDiv = document.createElement("div");
            languagesDiv.style.display = "flex";
            languagesDiv.classList.add("languages");

            const languagesResponse = await fetch(
                `https://api.github.com/repos/${username}/${repo.name}/languages`
            );
            const languages = await languagesResponse.json();

            for (const key in languages) {
                const languageDiv = document.createElement("div");
                languageDiv.innerHTML = key;
                languageDiv.classList.add("language");
                languagesDiv.appendChild(languageDiv);
            }

            repoDiv.appendChild(languagesDiv);
            reposContainer.appendChild(repoDiv);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    hideLoader();
};

const prevPage = () => {
    if (currentPage > 1) {
        currentPage--;
        const username = searchBox.value;
        if (username) {
            fetchUserDetails(searchBox.value);
        }
    }
};

const nextPage = () => {
    currentPage++;
    const username = searchBox.value;
    if (username) {
        fetchUserDetails(searchBox.value);
    }
};

function showLoader() {
    const loaderContainer = document.getElementById("loaderContainer")
    loaderContainer.style.display = 'flex';
}

function hideLoader() {
    const loaderContainer = document.getElementById("loaderContainer")
    loaderContainer.style.display = 'none';
}

searchButton.addEventListener("click", () => {
    showProfile();
});

// Additional event listeners for pagination buttons
document.getElementById("prevBtn").addEventListener("click", prevPage);
document.getElementById("nextBtn").addEventListener("click", nextPage);
