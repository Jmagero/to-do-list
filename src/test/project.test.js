import Project from '../src/project';

test('it creates a project object', () => {
  const newpojrct = Project('name');
  expect(typeof newpojrct).toBe('object');
});

test('it does not create a project without a name attribute', () => {
  const newpro = Project();
  expect(newpro.name).toBeFalsy();
})

test('it creates a project object with a name attribute', () => {
  const newpojrct = Project('Project-one');
  expect(newpojrct.name).toEqual('Project-one');
});

