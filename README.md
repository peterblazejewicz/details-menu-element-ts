# details-menu-element-ts

A workshop: recreate Github's `details-menu` component in TypeScript 3.*

## Babel 7 and TypeScript

### Summary

Karma does not support (yet) the `<script type="module">`, hence the Babel 7 is used to created browser compatible class version for custom element - as in original repo.
The TypeScript does not transpile content using `tsc`. The `tsc` is used to peform type check only. Still the `tsc` emits the type definition files.

## Author

@peterblazejewicz
