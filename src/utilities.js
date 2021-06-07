exports.removeElements = (parent) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};

exports.displayElement = (element) => {
  element.style.display = '';
};

exports.removeDisplay = (element) => {
  element.style.display = 'none';
};

// export {
//   removeElements, displayElement, removeDisplay,
// };