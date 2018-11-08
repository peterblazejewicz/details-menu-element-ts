describe('details-menu element', () => {
    describe('element creation', () => {
        it('creates from document.createElement', () => {
            const el = document.createElement('details-menu')
            assert.equal('DETAILS-MENU', el.nodeName)
            assert(el instanceof window.DetailsMenuElement)
        })

        it('creates from constructor', () => {
            const el = new window.DetailsMenuElement()
            assert.equal('DETAILS-MENU', el.nodeName)
        })
    })

    describe('after tree insertion', () => {
        beforeEach(() => {
            const container = document.createElement('div')
            container.innerHTML = `
          <details>
            <summary data-menu-button><em>Click</em></summary>
            <details-menu>
              <button type="button" role="menuitem" data-menu-button-text>Hubot</button>
              <button type="button" role="menuitem" data-menu-button-contents><strong>Bender</strong></button>
              <button type="button" role="menuitem">BB-8</button>
              <button type="button" role="menuitem" data-menu-button-text aria-disabled="true">WALL-E</button>
              <button type="button" role="menuitem" disabled>R2-D2</button>
            </details-menu>
          </details>
        `
            document.body.append(container)
        })

        afterEach(() => {
            document.body.innerHTML = ''
        })

        it('manages focus', () => {
            const details = document.querySelector('details')
            const summary = details.querySelector('summary')

            summary.focus()
            summary.dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }))
            assert.equal(summary, document.activeElement, 'summary remains focused on toggle')

            details.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowDown'
            }))
            const first = details.querySelector('[role="menuitem"]')
            assert.equal(first, document.activeElement, 'arrow focuses first item')

            details.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Escape'
            }))
            assert.equal(summary, document.activeElement, 'escape focuses summary')
        })

        it('updates the button label with text', () => {
            const details = document.querySelector('details')
            const summary = details.querySelector('summary')
            const item = details.querySelector('button')
            assert.equal(summary.textContent, 'Click')
            item.dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }))
            assert.equal(summary.textContent, 'Hubot')
        })

        it('updates the button label with HTML', () => {
            const details = document.querySelector('details')
            const summary = details.querySelector('summary')
            const item = details.querySelector('[data-menu-button-contents]')
            assert.equal(summary.textContent, 'Click')
            item.dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }))
            assert.equal(summary.innerHTML, '<strong>Bender</strong>')
        })

        it('fires events in order', function (done) {
            const details = document.querySelector('details')
            const summary = details.querySelector('summary')
            const item = details.querySelector('button')

            item.addEventListener('details-menu-select', () => {
                assert(details.open, 'menu is still open')
                assert.equal(summary.textContent, 'Click')
            })

            item.addEventListener('details-menu-selected', () => {
                assert(!details.open, 'menu is closed')
                assert.equal(summary.textContent, 'Hubot')
                done()
            })

            summary.dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }))
            item.dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }))
            assert(details.open)
        })

        it('fires cancellable select event', function (done) {
            const details = document.querySelector('details')
            const summary = details.querySelector('summary')
            const item = details.querySelector('button')
            let selectedEventCounter = 0

            item.addEventListener('details-menu-select', event => {
                event.preventDefault()
                assert(details.open, 'menu is still open')
                assert.equal(summary.textContent, 'Click')
                setTimeout(() => {
                    assert.equal(selectedEventCounter, 0, 'selected event is not fired')
                    done()
                }, 0)
            })

            item.addEventListener('details-menu-selected', () => {
                selectedEventCounter++
            })

            summary.dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }))
            item.dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }))
            assert(details.open)
        })

        it('does not trigger aria-disabled item', () => {
            const details = document.querySelector('details')
            const summary = details.querySelector('summary')
            let eventCounter = 0

            summary.focus()
            summary.dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }))
            details.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowUp'
            }))

            const notDisabled = details.querySelectorAll('[role="menuitem"]')[2]
            assert.equal(notDisabled, document.activeElement, 'arrow focuses on the last non-disabled item')

            const disabled = details.querySelector('[aria-disabled="true"]')
            disabled.addEventListener('details-menu-selected', () => eventCounter++)
            disabled.dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }))

            assert.equal(eventCounter, 0, 'selected event is not fired')
            assert(details.open, 'menu stays open')
        })

        it('does not trigger disabled item', () => {
            const details = document.querySelector('details')
            const summary = details.querySelector('summary')
            let eventCounter = 0

            summary.focus()
            summary.dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }))
            details.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowUp'
            }))

            const disabled = details.querySelector('[disabled]')
            disabled.addEventListener('details-menu-selected', () => eventCounter++)
            disabled.dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }))

            assert.equal(eventCounter, 0, 'selected event is not fired')
            assert(details.open, 'menu stays open')
        })
    })

    describe('mutually exclusive menu items', () => {
        beforeEach(() => {
            const container = document.createElement('div')
            container.innerHTML = `
          <details>
            <summary>Click</summary>
            <details-menu>
              <button type="button" role="menuitemradio" aria-checked="false">Hubot</button>
              <button type="button" role="menuitemradio" aria-checked="false">Bender</button>
              <button type="button" role="menuitemradio" aria-checked="false">BB-8</button>
            </details-menu>
          </details>
        `
            document.body.append(container)
        })

        afterEach(() => {
            document.body.innerHTML = ''
        })

        it('manages checked state', () => {
            const details = document.querySelector('details')
            const item = details.querySelector('button')
            assert.equal(item.getAttribute('aria-checked'), 'false')
            item.dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }))
            assert.equal(item.getAttribute('aria-checked'), 'true')
            assert.equal(details.querySelectorAll('[aria-checked="true"]').length, 1)
        })
    })

    describe('menu item checkboxes', () => {
        beforeEach(() => {
            const container = document.createElement('div')
            container.innerHTML = `
          <details>
            <summary>Click</summary>
            <details-menu>
              <button type="button" role="menuitemcheckbox" aria-checked="false">Hubot</button>
              <button type="button" role="menuitemcheckbox" aria-checked="true">Bender</button>
              <button type="button" role="menuitemcheckbox" aria-checked="false">BB-8</button>
            </details-menu>
          </details>
        `
            document.body.append(container)
        })

        afterEach(() => {
            document.body.innerHTML = ''
        })

        it('manages checked state and menu stays open', () => {
            const details = document.querySelector('details')
            const summary = document.querySelector('summary')
            const item = details.querySelector('button')
            summary.dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }))
            assert(details.open, 'menu opens')
            item.dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }))
            assert(details.open, 'menu stays open')
            assert.equal(item.getAttribute('aria-checked'), 'true')
            assert.equal(details.querySelectorAll('[aria-checked="true"]').length, 2)
        })
    })

    describe('with no valid menu items', () => {
        beforeEach(() => {
            const container = document.createElement('div')
            container.innerHTML = `
          <details>
            <summary>Click</summary>
            <details-menu>
              <button type="button" role="menuitem" aria-disabled="true">Hubot</button>
              <button type="button" role="menuitem" disabled>Bender</button>
            </details-menu>
          </details>
        `
            document.body.append(container)
        })

        afterEach(() => {
            document.body.innerHTML = ''
        })

        it('focus stays on summary', () => {
            const details = document.querySelector('details')
            const summary = details.querySelector('summary')

            summary.focus()
            summary.dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }))
            assert.equal(summary, document.activeElement, 'summary remains focused on toggle')

            details.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowDown'
            }))
            assert.equal(summary, document.activeElement, 'summary remains focused on navigation')
        })
    })

    describe('opening the menu', () => {
        beforeEach(() => {
            const container = document.createElement('div')
            container.innerHTML = `
          <details class="parent">
            <summary>Menu 1</summary>
            <details-menu>
              <details class="nested">
                <summary>Menu 2</summary>
                <details-menu></details-menu>
              </details>
            </details-menu>
          </details>
          <details class="sibling">
            <summary>Menu 3</summary>
            <details-menu></details-menu>
          </details>
        `
            document.body.append(container)
        })

        afterEach(() => {
            document.body.innerHTML = ''
        })

        it('closes other open menus', () => {
            const parent = document.querySelector('.parent')
            const sibling = document.querySelector('.sibling')

            parent.open = true
            parent.dispatchEvent(new CustomEvent('toggle'))
            assert(parent.open)

            sibling.open = true
            sibling.dispatchEvent(new CustomEvent('toggle'))

            assert(sibling.open)
            assert(!parent.open)
        })

        it('does not close open parent menu', () => {
            const parent = document.querySelector('.parent')
            const nested = document.querySelector('.nested')

            parent.open = true
            parent.dispatchEvent(new CustomEvent('toggle'))
            assert(parent.open)

            nested.open = true
            nested.dispatchEvent(new CustomEvent('toggle'))

            assert(nested.open)
            assert(parent.open)
        })
    })
})