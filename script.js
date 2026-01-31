//Speech Synth
const synth = window.speechSynthesis;
let voices = [];

// DOM Elements
const textInput   = document.getElementById("text-input");
const charCount   = document.getElementById("char-count");
const speakBtn    = document.getElementById("speak-btn");
const stopBtn     = document.getElementById("stop-btn");
const speedSlider = document.getElementById("speed-slider");
const pitchSlider = document.getElementById("pitch-slider");
const status      = document.getElementById("status");
const statusText  = document.getElementById("status-text");
const voiceSelect = document.getElementById("voice-select");

// slider value display
const speedValue = document.getElementById("speed-value");
const pitchValue = document.getElementById("pitch-value");

//Load Voices
function loadVoices() {
    voices = synth.getVoices();
    if (!voices.length) return;

    voiceSelect.innerHTML = "";

    voices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });

    voiceSelect.value = 0;
}

//Char Count
function updateCharCount() {
    charCount.textContent = textInput.value.length;
}

//  Speak
function speak() {
    const text = textInput.value.trim();
    if (!text) {
        alert("Please enter text to speak.");
        return;
    }

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const selectedVoiceIndex = voiceSelect.value;
    if (selectedVoiceIndex !== "") {
        utterance.voice = voices[selectedVoiceIndex];
    }

    utterance.rate  = parseFloat(speedSlider.value);
    utterance.pitch = parseFloat(pitchSlider.value);

    utterance.onstart = () => {
        statusText.textContent = "Speaking...";
        speakBtn.disabled = true;
        stopBtn.disabled = false;
    };

    utterance.onend = () => {
        statusText.textContent = "Ready";
        speakBtn.disabled = false;
        stopBtn.disabled = true;
    };

    synth.speak(utterance);
}

//  Stop 
function stopSpeech() {
    synth.cancel();
    statusText.textContent = "Stopped";
    speakBtn.disabled = false;
    stopBtn.disabled = true;
}

// Init 
function init() {
    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);

    stopBtn.disabled = true;
    updateCharCount();

   
    speedValue.textContent = speedSlider.value + "x";
    pitchValue.textContent = pitchSlider.value + "x";

    speedSlider.addEventListener("input", () => {
        speedValue.textContent = speedSlider.value + "x";
    });

    pitchSlider.addEventListener("input", () => {
        pitchValue.textContent = pitchSlider.value + "x";
    });

    textInput.addEventListener("input", updateCharCount);
    speakBtn.addEventListener("click", speak);
    stopBtn.addEventListener("click", stopSpeech);
}

document.addEventListener("DOMContentLoaded", init);

//  Custom Cursor 
const cursor = document.querySelector(".cursor");
const ranges = document.querySelectorAll('input[type="range"]');

document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top  = e.clientY + "px";
});

// disable cursor on slider
ranges.forEach(range => {
    range.addEventListener("mouseenter", () => {
        cursor.classList.add("disabled");
        document.body.style.cursor = "auto";
    });

    range.addEventListener("mouseleave", () => {
        cursor.classList.remove("disabled");
        document.body.style.cursor = "none";
    });
});
