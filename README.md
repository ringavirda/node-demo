# Basic demonstration of how to write node console app

There are several implementation of the same logic utilizing different API and styles. Javascript implementations contain:

- eventIO – the original way using `process` and event handlers.
- readline – the same thing only with I/O streams being wrapped into standard `readline` interface. More "Imperative" approach.
- crud – basic application with the capabilities of store and mutate date in JSON format. Due to conflicts between different ANSI injectors (chalk and readonly) it is quite buggy.

To rectify the issue with Javascript implementations a Typescript version was added. To spice things app it also uses standard model-service architecture, and due to this uses dependency injection container. For some reason, even though this one is more complex, it works fine for some reason.

To run both examples you can use the following commands (any package manager works, not only yarn):

```powershell
yarn start-js # for javascript examples, to switch implementation change app.js file.
yarn start-ts # for the typescript part. 
```
