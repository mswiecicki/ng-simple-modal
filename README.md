#ng-simple-modal

This is an extremely simple modal service, written in ES2015 (ES6), allowing for creating and closing modal,
with completely custom template, both from outside (controller with injected service) and inside (method exposed on modal's isolated scope).
It has no dependencies outside of angular

######Currently it supports:  
- only one modal at a time
- isolated scope on modal

##Install:  
You can either download the repo, or use npm:  

`npm install --save ng-simple-modal`

Just plug and play, really.
- Add the file to your codebase
- Put 'simple-modal' in your angular module dependencies
- Inject modalService into your controller
- ...
- Profit!

##Usage:  
Service exposes two methods: `open()` and `close()` which do what says on the can.
Calling `close()` before `open()` will throw a `Error` - so don't do that.

The `open()` method accepts a configuration object with following properties:
- `template` - HTML string being the template for the modal (bear in mind, that modal itself does not provide anything, not even background-color)
- `scope` - object literal containing things you'd like to put on modal's isolated scope
- `backdropClosing` - `(defaults: true)` boolean indicating whether clicking on backdrop should close the modal
- `onClose` - function which will be ran each time modal closes (both from backdrop or service)
- `controller` - controller function for modal contents

Also on the modal's scope is exposed API in the form of `closeModal()` method allowing you to attach it to
your cancel button (the `closeModal` method exposed will take into account `onClose` method passed in `open`).

##Declaration of Compliance to SemVer:  
For what it's worth I'd like to promise here that I will strictly respect Semantic Versioning  
understood as follows:  
- all bugs, fixes and minor changes of any kind will increment last digit (**path**)
- all additive, but non-breaking changes of any kind will increment middle digit (**minor**)
- any and all breaking changes of any significance will increment first digit (**major**)  
I have no problem whatsoever with having for instance version 35.12.178 as long as it stays meaningful.

##Contribs, feature requests, PRs etc.  
It's my first ever OSS work, so i haven't figured out how to deal with such things yet.
But i really do appreciate any feedback, so open issues, message me and so forth; i'd be happy to make this a useful lib for many people.

##License  
MIT

##Credits  
I'd like to give my thanks to [icebox](https://github.com/albertosantini) from #angularjs
for help in putting this together and lots of good advice!

