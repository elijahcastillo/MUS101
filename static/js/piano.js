let g_piano_key_container = document.getElementsByClassName("piano_key_container")[0];
let g_is_sustain_pedal_on = false; // Flag to track the "Control" key state

// Cache piano piano sounds when played
const pianoSounds = {};

// Track the pressed state of keys to prevent re-triggering while held down
const keysPressed = {};

// Mapping of keyboard keys to piano notes
const keyToNoteMapping = {
  q: "C1",
  2: "Csharp1",
  w: "D1",
  3: "Dsharp1",
  e: "E1",
  r: "F1",
  5: "Fsharp1",
  t: "G1",
  6: "Gsharp1",
  y: "A1",
  7: "Asharp1",
  u: "B1",
  i: "C2",
  9: "Csharp2",
  o: "D2",
  0: "Dsharp2",
  p: "E2",
  "[": "F2",
  "=": "Fsharp2",
  "]": "G2",
  s: "Gsharp2",
  x: "A2",
  d: "Asharp2",
  c: "B2",

  //   backspace: "Gsharp2",
};

document.querySelectorAll(".piano_white_key").forEach((elem) => {
  // Scan through the existing mapping to find the key that matches the note value
  for (const [key, note] of Object.entries(keyToNoteMapping)) {
    if (note === elem.dataset.key) {
      // If a match is found, update the element's innerHTML with the key and break the loop
      elem.innerHTML += key;
      break; // Exit the loop once the matching key is found
    }
  }
});

document.querySelectorAll(".piano_black_key").forEach((elem) => {
  // Scan through the existing mapping to find the key that matches the note value
  for (const [key, note] of Object.entries(keyToNoteMapping)) {
    if (note === elem.dataset.key) {
      // If a match is found, update the element's innerHTML with the key and break the loop
      elem.innerHTML += key;
      break; // Exit the loop once the matching key is found
    }
  }
});

function playSoundForNote(note) {
  // Check if the note is already playing (key is pressed), to prevent re-triggering
  if (!keysPressed[note]) {
    const noteElement = document.querySelector(`[data-key="${note}"]`);
    if (noteElement) {
      noteElement.classList.add("pressed");
    }

    if (note && pianoSounds[note]) {
      pianoSounds[note].currentTime = 0;
      pianoSounds[note].play().catch((error) => console.error("Error playing the sound:", error));
    } else {
      const soundFilePath = `static/sounds/${note}.mp3`;
      const audio = new Audio(soundFilePath);
      audio.play().catch((error) => console.error("Error playing the sound:", error));
      pianoSounds[note] = audio; // Cache
    }

    // Mark the key as pressed
    keysPressed[note] = true;
  }
}

g_piano_key_container.addEventListener("mousedown", (e) => {
  const clicked_key = e.target;
  const clicked_note = clicked_key.dataset.key;
  playSoundForNote(clicked_note);
});

g_piano_key_container.addEventListener("mouseup", (e) => {
  const clicked_key = e.target;
  const clicked_note = clicked_key.dataset.key;
  if (clicked_note) {
    const noteElement = document.querySelector(`[data-key="${clicked_note}"]`);
    if (noteElement) {
      // Reset the key's visual state after a delay to simulate the key being released
      setTimeout(() => {
        //   noteElement.style.transform = 'translateY(0px)'; // Move the key back up
        // Optionally, remove the class that changes the key's appearance
        noteElement.classList.remove("pressed");
      }, 100); // Adjust delay as needed to match your audio's sustain or aesthetic preference
    }

    // Mark the key as not pressed
    keysPressed[clicked_note] = false;
  }
});

// Listen for keydown events
document.addEventListener("keydown", (event) => {
  const note = keyToNoteMapping[event.key.toLowerCase()];
  if (note && !keysPressed[note]) {
    // Check if the key is not already pressed
    playSoundForNote(note);
  }
});

// Listen for keyup events to release notes and visually reset keys
document.addEventListener("keyup", (event) => {
  const note = keyToNoteMapping[event.key.toLowerCase()];
  if (note) {
    const noteElement = document.querySelector(`[data-key="${note}"]`);
    if (noteElement) {
      noteElement.classList.remove("pressed");
      setTimeout(() => {
        noteElement.classList.remove("pressed");
      }, 100);
    }
    // Mark the key as not pressed
    keysPressed[note] = false;
  }
});
