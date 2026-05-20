const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const profileContainer = document.getElementById("profile-container");

async function getGithubData() {

    const username = document.getElementById("username").value.trim();

    if(username === ""){
        showError("Please enter a GitHub username");
        return;
    }

    loading.classList.remove("hidden");
    errorBox.classList.add("hidden");
    profileContainer.classList.add("hidden");

    try {

        // Fetch Profile
        const profileResponse = await fetch(
            `https://api.github.com/users/${username}`
        );

        if(!profileResponse.ok){
            throw new Error("GitHub user not found");
        }

        const profileData = await profileResponse.json();

        // Fetch Repositories
        const repoResponse = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated`
        );

        const repoData = await repoResponse.json();

        displayProfile(profileData);
        displayRepos(repoData);

        loading.classList.add("hidden");
        profileContainer.classList.remove("hidden");

    } catch(error){

        loading.classList.add("hidden");
        showError(error.message);
    }
}

function displayProfile(data){

    document.getElementById("avatar").src = data.avatar_url;

    document.getElementById("name").innerText =
        data.name || "No Name";

    document.getElementById("usernameText").innerText =
        "@" + data.login;

    document.getElementById("bio").innerText =
        data.bio || "No bio available";

    document.getElementById("location").innerText =
        "📍 " + (data.location || "Unknown");

    document.getElementById("company").innerText =
        "🏢 " + (data.company || "No Company");

    document.getElementById("repos").innerText =
        data.public_repos;

    document.getElementById("followers").innerText =
        data.followers;

    document.getElementById("following").innerText =
        data.following;

    document.getElementById("profileLink").href =
        data.html_url;
}

function displayRepos(repos){

    const reposContainer =
        document.getElementById("reposContainer");

    reposContainer.innerHTML = "";

    repos.slice(0, 6).forEach(repo => {

        reposContainer.innerHTML += `

            <div class="repo-card">

                <h3>${repo.name}</h3>

                <p>
                    ${repo.description || "No description available"}
                </p>

                <p>⭐ ${repo.stargazers_count}</p>

                <a href="${repo.html_url}" target="_blank">
                    View Repository →
                </a>

            </div>

        `;
    });
}

function showError(message){

    errorBox.innerText = message;
    errorBox.classList.remove("hidden");
}