# Winding Tree documentation in the form of gitbook

[![Greenkeeper badge](https://badges.greenkeeper.io/windingtree/developers.svg)](https://greenkeeper.io/)

## Local development

Either use [gitbook-editor](https://legacy.gitbook.com/editor)
or run the following commands after checking out this repo:

```
npm install
npm run dev
```

These will fire up a local server on http://localhost:4000
where you can observe your changes live.

## Specifics

- Intergram bot - see https://github.com/windingtree/internal-documents/blob/master/telegram-bots.md#tech-support-chat
- Links to `apis` and `data-model` has to be done with plain HTML with `target="_blank"`, otherwise gitbook does not
pick them up for some reason when they are domain-agnostic.
