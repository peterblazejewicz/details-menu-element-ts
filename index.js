// @ts-check
class DetailsMenuElement extends HTMLElement {

    get src() {
        throw new Error('Not implemented');
        return '';
    }

    /** @prop {string} value */
    set src(value) {
        throw new Error('Not implemented');
    }

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