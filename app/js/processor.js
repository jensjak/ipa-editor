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
    if (textInput.selectionStart || textInout.selectionStart == '0') {
        let startPos = textInput.selectionStart;
        let endPos = textInput.selectionEnd;
        textInput.value = textInput.value.substring(0, startPos)
            + char
            + textInput.value.substring(endPos, textInput.value.length);
    } else {
        textInput.value += char;
    }
  // etc
  M.textareaAutoResize(textInput);
  textInput.focus()
  // update counters
  updateCounters();
}
function resetTextInput() {
  textInput.value='';
  updateCounters();
}
function enclose(char1, char2){
    // if there is no char2 provided use char1 twice
    char2 = (typeof char2 !== 'undefined') ?  char2 : char1
    // get selection ends
    let start = textInput.selectionStart;
    let end = textInput.selectionEnd;
    // slice the textarea content
    let selectedText = textInput.value.slice(start, end);
    let before = textInput.value.slice(0, start);
    let after = textInput.value.slice(end);
    // add enclosing characters and recombine string
    let text = before + char1 + selectedText + char2 + after;
    textInput.value = text;
    // disable buttons again
    bracketsBtns.forEach(function (btn) {
        btn.classList.add('disabled')
    })
}
// disable buttons on page load
const bracketsBtns = document.querySelectorAll('a.bBtn');
bracketsBtns.forEach(function (btn) {
    btn.classList.add('disabled')
})
// enable buttons on selection
textInput.onselect = function () {
    bracketsBtns.forEach(function (btn){
        btn.classList.remove('disabled')
    })
}