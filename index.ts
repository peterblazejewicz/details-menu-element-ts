
declare global  {
    interface Window {
        DetailsMenuElement?: typeof  DetailsMenuElement;
    }
    
}

class DetailsMenuElement extends HTMLElement {
    /**
     *
     */
    constructor() {
        super()
    }
}
export default DetailsMenuElement

if (!window.customElements.get('details-menu')) {
    window.DetailsMenuElement = DetailsMenuElement;
    window.customElements.define('details-menu', DetailsMenuElement)
  }