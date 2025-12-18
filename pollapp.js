const API_URL ="https://pollingapplication-production-c411.up.railway.app/api/polls";


/* ===== Add Option Input ===== */
function addOption() {
    const optionsDiv = document.getElementById("options");
    const count = optionsDiv.children.length + 1;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "option-input";
    input.placeholder = `Option ${count}`;

    optionsDiv.appendChild(input);
}

/* ===== Create Poll ===== */
function createPoll() {
    const questionInput = document.getElementById("question");
    const question = questionInput.value.trim();
    const optionInputs = document.querySelectorAll(".option-input");

    const options = [];
    optionInputs.forEach(input => {
        if (input.value.trim() !== "") {
            options.push({ voteOption: input.value.trim(), voteCount: 0 });
        }
    });

    if (!question || options.length < 2) {
        alert("Please enter a question and at least 2 options");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, options })
    })
    .then(res => res.json())
    .then(() => {
        alert("✅ Poll created successfully!");
        questionInput.value = "";

        const optionsDiv = document.getElementById("options");
        optionsDiv.innerHTML = `
            <input type="text" class="option-input" placeholder="Option 1">
            <input type="text" class="option-input" placeholder="Option 2">
        `;
        loadPolls();
    })
    .catch(err => {
        console.error(err);
        alert("❌ Error creating poll");
    });
}

/* ===== Load All Polls ===== */
function loadPolls() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const pollsDiv = document.getElementById("polls");
            pollsDiv.innerHTML = "";

            if (!data || data.length === 0) {
                pollsDiv.innerHTML = "<p>No polls available</p>";
                return;
            }

            data.forEach(poll => {
                const div = document.createElement("div");
                div.className = "poll";

                const optionsHtml = poll.options.map((opt, idx) => `
                    <div class="option">
                        <span>${opt.voteOption} — <b>${opt.voteCount}</b></span>
                        <button onclick="vote(${poll.id}, ${idx})">Vote</button>
                    </div>
                `).join("");

                div.innerHTML = `<h3>${poll.question}</h3>${optionsHtml}`;
                pollsDiv.appendChild(div);
            });
        })
        .catch(err => console.error(err));
}

/* ===== Vote ===== */
function vote(pollId, optionIndex) {
    fetch(`${API_URL}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId, optionIndex })
    })
    .then(() => loadPolls())
    .catch(err => console.error(err));
}

/* ===== Auto Load Polls ===== */
window.onload = loadPolls;

 


