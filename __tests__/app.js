'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-elm-electron:app', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({someAnswer: true});
  });

  it('creates files', () => {
    assert.file([
      'package.json',
      '.editorconfig',
      'elm-package.json',
      '.eslintignore',
      '.gitattributes',
      '.gitignore',
      'index.js',
      'src/App.elm',
      'src/favicon.ico',
      'src/index.html',
      'src/index.js',
      'src/logo.svg',
      'src/main.css',
      'src/Main.elm',
      'tests/elm-package.json',
      'tests/Main.elm',
      'tests/Tests.elm',
    ]);
  });
});
