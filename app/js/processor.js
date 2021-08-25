const textInput = document.getElementById('textInput');
const charCountText = document.getElementById('charCountText');
const wordCountText = document.getElementById('wordCountText');
const historyArea = document.getElementById('historyArea');
const bracketsBtns = document.querySelectorAll('a.bBtn');

window.addEventListener('DOMContentLoaded', () => {
  // initialize materialcss
  M.AutoInit();

  // disable buttons on page load
  bracketsBtns.forEach((btn) => {
    btn.classList.add('disabled');
  });

  const windowTitle = document.getElementById('title-bar-title');
  windowTitle.innerHTML = 'IPA Editor V1.0.0';
});

document.querySelector('#copyBtn').onclick = function () {
  textInput.select();
  document.execCommand('copy');
};

let charCount; let
  wordCount;
const charMemory = [];

// simple character and word counters
function updateCounters() {
  charCountText.innerHTML = textInput.value.length;
  wordCountText.innerHTML = textInput.value.split(' ').length;
  if (textInput.value.length < 1) {
    wordCountText.innerHTML = '0';
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
  } else if (input.createTextRange) {
    const range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

function setCaretToPos(input, pos) {
  setSelectionRange(input, pos, pos);
}

function add(char) {
  let temp = '';
  // add char at cursor position
  if (textInput.selectionStart || textInput.selectionStart == '0') {
    const startPos = textInput.selectionStart;
    const endPos = textInput.selectionEnd;
    textInput.value = textInput.value.substring(0, startPos)
            + char
            + textInput.value.substring(endPos, textInput.value.length);
    textInput.focus();
    setCaretToPos(textInput, endPos + char.length);
  } else {
    // add char at end of textarea if there is no cursor pos
    textInput.value += char;
  }
  // then select the textarea and update counters
  textInput.focus();
  updateCounters();

  // charMemory
  if (charMemory.includes(char)) {
  // remove char from Array if it already exists
    const index = charMemory.indexOf(char);
    if (index > -1) {
      charMemory.splice(index, 1);
    }
    // then add it again
    charMemory.unshift(char);
  } else {
  // otherwise add it
    charMemory.unshift(char);
  }
  // remove the last entry of the Array if there are more than 10
  if (charMemory.length > 10) {
    charMemory.pop(1);
  }
  // create the new list of buttons and update the HTML
  charMemory.forEach((char) => {
    temp += `<a class="waves-effect waves-light btn" onclick="add('${char}')">${char}</a> `;
    historyArea.innerHTML = temp;
  });
}

function resetTextInput() {
  textInput.value = '';
  updateCounters();
}

function enclose(char1, char2) {
  // if there is no char2 provided use char1 twice
  char2 = (typeof char2 !== 'undefined') ? char2 : char1;
  // get selection ends
  const start = textInput.selectionStart;
  const end = textInput.selectionEnd;
  // slice the textarea content
  const selectedText = textInput.value.slice(start, end);
  const before = textInput.value.slice(0, start);
  const after = textInput.value.slice(end);
  // add enclosing characters and recombine string
  const text = before + char1 + selectedText + char2 + after;
  textInput.value = text;
  // disable buttons again
  bracketsBtns.forEach((btn) => {
    btn.classList.add('disabled');
  });
}

// enable buttons on selection
textInput.onselect = function () {
  bracketsBtns.forEach((btn) => {
    btn.classList.remove('disabled');
  });
};

const langSelection = document.getElementById('langSelection');
let idList = []; let vowelList = []; let
  consList = [];

const resetLastList = function () {
  document.querySelectorAll('.hvgTable td > a').forEach((elem) => {
    elem.classList.remove('hvg1', 'hvg2');
    // console.log(elem.innerHTML, elem.id)
  });
  idList = [], vowelList = [], consList = [];
};

langSelection.addEventListener('change', () => {
  switch (langSelection.value) {
    // All
    case '0':
      resetLastList();
      M.toast({ html: 'Target language set to All' });
      break;
    // American English
    case '1':
      resetLastList();
      M.toast({ html: 'Target language set to American English' });
      vowelList = [1, 6, 10, 9, 7, 12, 21, 25, 27, 32];
      consList = [2, 6, 12, 14, 15, 20, 21, 26, 27, 42, 43, 46, 47, 32, 33, 34, 35, 61, 64, 66, 67, 96];
      break;
    // German
    case '2':
      resetLastList();
      M.toast({ html: 'Target language set to German' });
      vowelList = [1, 2, 6, 7, 8, 9, 10, 11, 15, 18, 21, 22, 26, 28, 29];
      consList = [2, 6, 12, 14, 15, 20, 21, 26, 27, 31, 42, 43, 32, 33, 34, 35, 53, 55, 57, 58, 61, 66, 96];
      break;
  }
  vowelList.forEach((vowel) => {
    idList.push(`vow${vowel}`);
  });
  consList.forEach((cons) => {
    idList.push(`cons${cons}`);
  });
  document.querySelectorAll('.hvgTable td > a').forEach((elem) => {
    if (idList.includes(elem.id)) {
      document.getElementById(elem.id).classList.add('hvg1');
    } else if (langSelection.value != '0') { elem.classList.add('hvg2'); }
  });
});

const vowelTest = (function () {
  const re = /^[aeiou]$/i;
  return function (s) {
    return re.test(s);
  };
}());
function limit(element) {
  const max_chars = 5;

  if (element.value.length > max_chars) {
    element.value = element.value.substr(0, max_chars);
  }
}

// JS will only naturally handle characters up to 0xFFFF, this fixes it
function fixedFromCharCode(codePt) {
  if (codePt > 0xFFFF) {
    codePt -= 0x10000;
    return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
  }

  return String.fromCharCode(codePt);
}

function UpdateLivePreview() {
  const UnicodeInput = document.getElementById('unicodeInput');
  const LivePreview = document.getElementById('LivePreview');

  Result = fixedFromCharCode((parseInt(UnicodeInput.value, 16)));
  LivePreview.innerHTML = Result;
}
function autoPinyin(char) {
  let Index; const val = textInput.value; const
    arr = Array.from(val);

  if (val.indexOf('a') !== -1) {
    Index = val.indexOf('a');
  } else if (val.indexOf('e') !== -1) {
    Index = val.indexOf('e');
  } else if (val.indexOf('ou') !== -1) {
    Index = val.indexOf('ou', 0);
  } else if (val.indexOf('nü') !== -1) {
    Index = 1;
  } else {
    arr2 = arr.reverse();
    let i;
    for (i = 0; i < val.length; i++) {
      if (vowelTest(arr2[i]) === true) {
        Index = val.indexOf(arr[i]);
        break;
      }
    }
  }
  setCaretToPos(textInput, Index + char.length);
  add(char);
}

function toggleMenu(element) {
  element = document.getElementById(element);
  element.classList.toggle('clickedOn');
  console.log(element);
}

let els; const
  appContent = document.getElementById('app-content');
appContent.addEventListener('click', () => {
  els = document.getElementsByClassName('clickedOn');
  Array.from(els).forEach((el) => {
    el.classList.remove('clickedOn');
  });
});
