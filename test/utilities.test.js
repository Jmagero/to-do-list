/**
 * @jest-environment jsdom
 */
import { removeElements } from "../src/utilities";

test ('should remove last child', () =>{
    const items = document.createElement('div');
    const itemOne = document.createElement('li')
    const itemTwo = document.createElement('li')
    expect(items).not.toContain(itemOne);
})