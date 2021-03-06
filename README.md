# TDD Starter Kit

This is a Starter Kit for my future Test-Driven Development projects.

## The Idea

The _**master**_ branch is a general and very basic branch, while each branch under _**addition**_ is a different configuration that could be used for a different kind of project.

These branches should always be _rebased_ on _**master**_, so that a project using eg. _TypeScript_ could be easily forked from this repository then have its _**addition**_/_**TypeScript**_ branch merged on _**master**_. (The rest of the _**addition**_ branches could be deleted if not needed.)

### Webserver

By default, de _build_ folder is served locally with `gulp-connect`.

### Unit Testing

JavaScript files and their unit tests correspond. If either of them is changed, tests should run and will run automatically.

The unit tests are written in _Jasmine_ and ran with _Karma_ in a headless _PhantomJS_ browser.

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
And finally, create your _**dev**_ branch and run the _serve_ task
```
git checkout -b dev
gulp serve
```

Code!

Note: While using `gulp serve`, file changes like _add_, _change_ and _delete_ will be handled automatically. The _webserver_ will be reloaded and the unit tests will be ran again.

## License

The MIT License (MIT)
Copyright (c) 2016 Peter Seprus

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
