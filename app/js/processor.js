//initialize materialcss
M.AutoInit();

// disable buttons on page load
const bracketsBtns = document.querySelectorAll('a.bBtn');
bracketsBtns.forEach(function (btn) {
    btn.classList.add('disabled')
})

let textInput = document.getElementById('textInput');
let charCountText = document.getElementById('charCountText'),charCount, wordCountText = document.getElementById('wordCountText'), wordCount;

// simple character and word counters
function updateCounters(){
  charCountText.innerHTML = textInput.value.length;
  wordCountText.innerHTML = textInput.value.split(" ").length;
  if (textInput.value.length < 1){
    wordCountText.innerHTML='0';
  }
}

// update counters on typing in textarea
textInput.onkeyup = function () {
updateCounters();
};

function add(char) {
    // add char at cursor position
    if (textInput.selectionStart || textInout.selectionStart == '0') {
        let startPos = textInput.selectionStart;
        let endPos = textInput.selectionEnd;
        textInput.value = textInput.value.substring(0, startPos)
            + char
            + textInput.value.substring(endPos, textInput.value.length);
    } else {
        // add char at end of textarea if there is no cursor pos
        textInput.value += char;
    }
  // then resize and select the textarea and update counters
  M.textareaAutoResize(textInput);
  textInput.focus();
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

// enable buttons on selection
textInput.onselect = function () {
    bracketsBtns.forEach(function (btn){
        btn.classList.remove('disabled')
    })
}

const langSelection = document.getElementById('langSelection');
let idList = [], idList2 = [];

let resetLastList = function () {
  idList.forEach(function (id){
    document.getElementById(id).classList.remove('hvg1')
  })
  idList2.forEach(function (id){
    document.getElementById(id).classList.remove('hvg2')
  })
idList = [];
idList2 = [];
}
langSelection.addEventListener('change', function () {
  switch(langSelection.value){
    // All
    case "0":
      resetLastList()
    break;
    // English
    case "1":
      resetLastList();
    idList = ['vow1'];
    idList2 = ['vow2'];
    idList.forEach(function (id){
      document.getElementById(id).classList.add('hvg1')
    })
    idList2.forEach(function (id){
      document.getElementById(id).classList.add('hvg2')
    })
    break;
    // German
    case "2":
      resetLastList();
      idList = ['vow1', 'vow2'];
    idList2 = [];
    idList.forEach(function (id){
      document.getElementById(id).classList.add('hvg1')
    })
    idList2.forEach(function (id){
      document.getElementById(id).classList.add('hvg2')
    })
    break;
  }
})
