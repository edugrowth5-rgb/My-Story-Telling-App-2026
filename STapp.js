// STapp.js - StoryTeller Logic with Hindi/English Support
let currentVoice = null;

window.onload = () => {
    initSTUI();
    setupSTVoices();
};

function toggleSTSidebar() {
    document.getElementById('leftSidebar').classList.toggle('collapsed');
}

// Sidebar mein Stories load karne ka function
function initSTUI() {
    const container = document.getElementById('topicsContainer');
    if (!container) return;
    container.innerHTML = ""; 

    for (let cat in stStoryLibrary) {
        const catDiv = document.createElement('div');
        catDiv.className = 'st-category-name';
        catDiv.innerText = cat.toUpperCase();
        container.appendChild(catDiv);

        for (let title in stStoryLibrary[cat]) {
            const item = document.createElement('div');
            item.className = 'st-topic-item';
            item.innerText = title;
            item.onclick = () => loadSTStory(cat, title);
            container.appendChild(item);
        }
    }
}

// Story load aur display karne ka function
function loadSTStory(category, title) {
    const story = stStoryLibrary[category][title];
    
    document.getElementById('welcomeMessage').classList.add('hidden');
    document.getElementById('displayWrapper').classList.remove('hidden');
    
    document.getElementById('topicHeading').innerText = title;
    document.getElementById('topicDescription').innerText = story.text;
    
    const img = document.getElementById('topicImg');
    if (story.img) {
        img.src = story.img;
        img.parentElement.style.display = 'block';
    } else {
        img.parentElement.style.display = 'none';
    }

    // Story apne aap shuru ho jayegi
    startSTReading(story.text);
}

// Voices setup karne ka function
function setupSTVoices() {
    const loadVoices = () => {
        window.speechSynthesis.getVoices();
    };
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
}

// MAIN VOICE ENGINE (Hindi/English Smart Switch)
function startSTReading(text) {
    window.speechSynthesis.cancel(); 

    const msg = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Check if text is Hindi (Unicode range for Devanagari)
    const isHindi = /[\u0900-\u097F]/.test(text);
    
    // --- AAPKA NAYA UPDATE YAHAN HAI ---
    const voiceInfo = document.getElementById('voiceTypeDisplay');
    if (voiceInfo) {
        if (isHindi) {
            voiceInfo.innerText = "Mode: Hindi Narrator 🇮🇳";
        } else {
            voiceInfo.innerText = "Mode: English Narrator 🇺🇸";
        }
    }
    // ------------------------------------

    if (isHindi) {
        // HINDI SETTINGS
        msg.voice = voices.find(v => v.lang.includes('hi-IN')) || voices[0];
        msg.pitch = 1.0; 
        msg.rate = 0.9;  // Thoda dhire taaki bachhe samajh sakein
    } else {
        // ENGLISH SETTINGS (Deep Male Voice)
        msg.voice = voices.find(v => v.name.includes('Google US English Male')) || 
                    voices.find(v => v.name.includes('David')) || 
                    voices.find(v => v.name.toLowerCase().includes('male')) ||
                    voices[0];
        msg.pitch = 0.78; // Deep/Robust tone
        msg.rate = 0.85;  // Slow narration
    }

    msg.volume = 1.0;
    window.speechSynthesis.speak(msg);

    // Update Status
    const status = document.getElementById('statusIndicator');
    if (status) {
        status.innerText = isHindi ? "Kahani Suniye... 🎧" : "Listening... 🎧";
        status.style.background = "#ffecd2";
    }
    
    msg.onend = () => {
        if (status) {
            status.innerText = "System Ready";
            status.style.background = "#fff";
        }
    };
}

function killSTSpeech() {
    window.speechSynthesis.cancel();
    const status = document.getElementById('statusIndicator');
    if (status) status.innerText = "Stopped ⏹️";
}
