declare class DetailsMenuElement extends HTMLElement {
    src: string
}

declare global {
    interface Window {
        DetailsMenuElement: typeof DetailsMenuElement;
    }
  }