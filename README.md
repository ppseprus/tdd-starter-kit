# TDD Starter Kit

This is a Starter Kit for my future Test-Driven Development projects.

## The Idea

The _**master**_ branch is a general and very basic branch.
Each branch under _**addition**_  is a different configuration used for different kinds of projects. These should always be _rebased_ on _**master**_, so that a project using eg. _TypeScript_ could be easily forked from this repository then have its _**addition**_/_**TypeScript**_ branch merged on _**master**_. (The rest of the _**addition**_ branches could be deleted if not needed.)

### Webserver

By default, de _build_ fodler is served locally with `gulp-connect`.

### Unit Testing

JavaScript files and their unit tests correspond. If either of them is changed, tests will run automatically.

The unit test are written in _Jasmine_ and ran with _Karma_ in a headless _PhantomJS_ browser.

## Usage

First, _fork_ this repository and find the branches you need
```
git branch --all
```
All additional branches should be under _**addition**_
Merge the branch you need to _**master**_
```
git merge addition/<your-selected-branch> master
```
And finally, create your _**dev**_ branch
```
git checkout -b dev
```
Code!