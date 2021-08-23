//initialize materialcss
M.AutoInit();

let textInput = document.getElementById('textInput');
let charCountText = document.getElementById('charCountText'),charCount, wordCountText = document.getElementById('wordCountText'), wordCount;

function updateCounters(){
  charCountText.innerHTML = textInput.value.length;
  wordCountText.innerHTML = textInput.value.split(" ").length;
  if (textInput.value.length < 1){
    wordCountText.innerHTML='0';
  }
}

textInput.onkeyup = function () {
updateCounters();
};
function add(char) {
  textInput.value += char;
  M.textareaAutoResize(textInput);
  textInput.focus()
  // update counters
  updateCounters();
}
function resetTextInput() {
  textInput.value='';
  updateCounters();
}