//initialize materialcss
M.AutoInit();

// disable buttons on page load
const bracketsBtns = document.querySelectorAll('a.bBtn');
bracketsBtns.forEach(function (btn) {
    btn.classList.add('disabled')
})


var injectedHTML = document.createElement("DIV");
    injectedHTML.innerHTML = '<dragBox id="dragBox" class="drag-box">\
  <dragBoxBar id="dragBoxBar" class="no-select"></dragBoxBar>\
  <injectedBox id="injectedBox"><form>\
    <div class="input-field">\
  <textarea id="textInput" class="materialize-textarea" spellcheck="false" onchange="updateCounters()"></textarea></div></form>\
</injectedBox>\
  </dragBox>';

    document.body.appendChild(injectedHTML);

    var isMouseDown,
        initX,
        initY,
        height = injectedBox.offsetHeight,
        width = injectedBox.offsetWidth,
        dragBoxBar = document.getElementById('dragBoxBar');


    dragBoxBar.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        document.body.classList.add('no-select');
        injectedBox.classList.add('pointer-events');
        initX = e.offsetX;
        initY = e.offsetY;
        dragBox.style.opacity = 0.5;
    })

    dragBoxBar.addEventListener('mouseup', function(e) {
        mouseupHandler();
    })

    document.addEventListener('mousemove', function(e) {
        if (isMouseDown) {
            var cx = e.clientX - initX,
                cy = e.clientY - initY;
            if (cx < 0) {
                cx = 0;
            }
            if (cy < 0) {
                cy = 0;
            }
            if (window.innerWidth - e.clientX + initX < width + 16) {
                cx = window.innerWidth - width;
            }
            if (e.clientY > window.innerHeight - height - dragBoxBar.offsetHeight + initY) {
                cy = window.innerHeight - dragBoxBar.offsetHeight - height;
            }
            dragBox.style.left = cx + 'px';
            dragBox.style.top = cy + 'px';
        }
    })


    document.addEventListener('mouseup', function(e) {
        if (e.clientY > window.innerWidth || e.clientY < 0 || e.clientX < 0 || e.clientX > window.innerHeight) {
            mouseupHandler();
        }
    });

    function mouseupHandler() {
        isMouseDown = false;
        document.body.classList.remove('no-select');
        injectedBox.classList.remove('pointer-events');
        dragBox.style.opacity = 1;
    }

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

function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
  }
}

function setCaretToPos (input, pos) {
  setSelectionRange(input, pos, pos);
}

function add(char) {
    // add char at cursor position
    if (textInput.selectionStart || textInput.selectionStart == '0') {
        let startPos = textInput.selectionStart;
        let endPos = textInput.selectionEnd;
        textInput.value = textInput.value.substring(0, startPos)
            + char
            + textInput.value.substring(endPos, textInput.value.length);
            textInput.focus()
            setCaretToPos(textInput,endPos+char.length)
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
let idList = [], vowelList = [], consList = [];

let resetLastList = function () {
  document.querySelectorAll('td > a').forEach(function (elem){
    elem.classList.remove('hvg1', 'hvg2');
    console.log(elem.innerHTML, elem.id)
  })
  idList = [], vowelList = [], consList = [];
}

langSelection.addEventListener('change', function () {
  switch(langSelection.value){
    // All
    case "0":
      resetLastList();
    break;
    // English
    case "1":
      resetLastList();
    idList = ['vow1'];
    break;
    // German
    case "2":
      resetLastList();
      vowelList = [1,2,6,7,8,9,10,11,15,18,21,22,26,29];
      consList = [2,6,12,14,15,20,21,26,27,31,42,43,32,33,34,35,53,55,57,58,61,66,96];
    break;
  }
  vowelList.forEach(function (vowel){
    idList.push('vow'+vowel);
  })
  consList.forEach(function (cons){
    idList.push('cons'+cons);
  })
  document.querySelectorAll('td > a').forEach(function (elem){
    if(idList.includes(elem.id)){
      document.getElementById(elem.id).classList.add('hvg1')
    } else {
      if (langSelection.value != "0"){elem.classList.add('hvg2')} 
  }
  })
})
