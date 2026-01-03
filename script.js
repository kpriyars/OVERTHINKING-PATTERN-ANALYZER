// State Management
let currentStep = 0;
let userAnswers = {
    thought: "",
    recurring: false,
    category: "",
    emotion: "",
    impact: false
};

const questions = [
    {
        id: "recurring",
        text: "Is this thought recurring?",
        options: [{text: "YES", val: true}, {text: "NO", val: false}]
    },
    {
        id: "category",
        text: "What is the core of this?",
        options: [
            {text: "FEAR", val: "fear"},
            {text: "REGRET", val: "regret"},
            {text: "CONTROL", val: "control"},
            {text: "EXPECTATIONS", val: "expectations"}
        ]
    },
    {
        id: "emotion",
        text: "Which emotion fits best?",
        options: [
            {text: "ANXIETY", val: "anxiety"},
            {text: "SADNESS", val: "sadness"},
            {text: "ANGER", val: "anger"},
            {text: "CONFUSION", val: "confusion"}
        ]
    }
];

function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function saveThought() {
    userAnswers.thought = document.getElementById('thought-input').value;
    if(!userAnswers.thought) return alert("Type something first!");
    navigateTo('screen-quiz');
    showQuestion();
}

function showQuestion() {
    const q = questions[currentStep];
    document.getElementById('npc-text').innerText = q.text;
    const container = document.getElementById('options-container');
    container.innerHTML = "";

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "pixel-btn";
        btn.style.margin = "5px";
        btn.innerText = opt.text;
        btn.onclick = () => handleAnswer(q.id, opt.val);
        container.appendChild(btn);
    });
}

function handleAnswer(key, value) {
    userAnswers[key] = value;
    currentStep++;
    if(currentStep < questions.length) {
        showQuestion();
    } else {
        processResults();
    }
}

function processResults() {
    let type = "General Reflection";
    let intensity = 30;

    // Logic Tree
    if(userAnswers.recurring && userAnswers.category === 'regret') {
        type = "Rumination Loop";
        intensity = 80;
    } else if (userAnswers.category === 'fear') {
        type = "Catastrophizing";
        intensity = 90;
    } else if (userAnswers.category === 'control') {
        type = "Future Tripping";
        intensity = 60;
    }

    // Update UI
    document.getElementById('res-pattern').innerText = type;
    document.getElementById('res-intensity').innerText = intensity + "%";
    document.getElementById('intensity-fill').style.width = intensity + "%";
    document.getElementById('res-message').innerText = "This pattern is a way your mind tries to protect you. Try grounding yourself in the present.";
    
    saveToLocal(type, intensity);
    navigateTo('screen-results');
    renderChart();
}

function saveToLocal(type, intensity) {
    const history = JSON.parse(localStorage.getItem('overthink_logs') || "[]");
    history.push({ date: new Date().toLocaleDateString(), type, intensity });
    localStorage.setItem('overthink_logs', JSON.stringify(history));
}

function renderChart() {
    const ctx = document.getElementById('patternChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Intensity'],
            datasets: [{
                label: 'Analysis Result',
                data: [70], // Example static data, can be dynamic
                backgroundColor: '#ff00ff',
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            scales: { y: { beginAtZero: true, grid: { color: "#333" } } }
        }
    });
}
