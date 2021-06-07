/**
 * @jest-environment jsdom
 */
const { removeElements } = require('../src/utilities');

test('should remove last child', () => {
  document.body.innerHTML = '<div id="items">'
  + '  <li id="itemOne">Helo<li/>'
  + '  <li id="itemTwo">Helo2<li/>'
  + '</div>';
  const items = document.getElementById('items');
  const itemTwo = document.getElementById('itemTwo');
  removeElements(items);
  expect(items).not.toContain(itemTwo);
});