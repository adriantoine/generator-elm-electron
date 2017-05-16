'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const commandExists = require('command-exists').sync;
const _s = require('underscore.string');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        'Welcome to the ' + chalk.red('generator-elm-electron') + ' generator!'
      )
    );

    const prompts = [
      {
        name: 'appName',
        message: 'Please enter your application name',
        default: _s.slugify(this.appname),
        filter: x => _s.slugify(x),
      },
      {
        name: 'description',
        message: 'Please enter your application description',
        validate: x =>
          x.length > 0 ? true : 'You have to provide a description',
      },
      {
        name: 'githubUsername',
        message: 'What is your GitHub username?',
        store: true,
        validate: x => (x.length > 0 ? true : 'You have to provide a username'),
      },
    ];

    return this.prompt(prompts).then(props => {
      this.props = {
        appName: props.appName,
        description: props.description,
        classifiedAppName: _s.classify(props.appName),
        githubUsername: props.githubUsername,
        name: this.user.git.name(),
        email: this.user.git.email(),
        website: props.website,
      };
    });
  }

  writing() {
    this.fs.copyTpl(
      `${this.templatePath()}/**`,
      this.destinationPath(),
      this.props
    );

    const mv = (from, to) => {
      this.fs.move(this.destinationPath(from), this.destinationPath(to));
    };

    mv('editorconfig', '.editorconfig');
    mv('gitattributes', '.gitattributes');
    mv('gitignore', '.gitignore');
    mv('eslintignore', '.eslintignore');
    mv('_package.json', 'package.json');
  }

  install() {
    const hasYarn = commandExists('yarn');

    this.installDependencies({
      npm: !hasYarn,
      bower: false,
      yarn: hasYarn,
      callback: () => {
        const hasElmInstall = commandExists('elm');
        if (hasElmInstall === false) {
          this.log(
            chalk.red(
              `\nYou don't have ${chalk.bold('Elm')} installed on this machine.`
            )
          );
          this.log(
            `Please refer to the official documentation: https://guide.elm-lang.org/install.html to install Elm and run ${chalk.bold.yellow('elm package install')} once it is installed and set up.`
          );
        } else {
          this.spawnCommandSync('elm', ['package', 'install', '-y']);
        }

        const hasCreateElmApp = commandExists('elm-app');
        if (!hasCreateElmApp) {
          this.log(
            chalk.red(
              `\nYou don't have ${chalk.bold('create-elm-app')} installed on this machine.`
            )
          );
          this.log(
            `You will need create-elm-app to run the application generated, but don't worry it's very easy to install, just run ${chalk.bold.yellow(hasYarn ? 'yarn global add create-elm-app' : 'npm install create-elm-app --global')}`
          );
        }
      },
    });
  }
};
