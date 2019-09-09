import { Document } from "./dom/Document";
import { Element } from "./dom/Element";
import { HTMLElement } from "./dom/HTMLElement";

export function rewriteAPI (document: Document) {
  {
    const descriptor = {
      enumerable: false,
      configurable: false,
      writable: false,
    }

    const createElement = document.createElement;
    const head = document.querySelector('app-head')
    const body = document.querySelector('app-body')

    const blackList = new Set(['script', 'embed', 'iframe'])
    Object.defineProperties(document, {
      head: { ...descriptor, value: head },
      body: { ...descriptor, value: body },
      createElement: {
        ...descriptor,
        value (tagName: string) {
          tagName = tagName.toLowerCase()
          if (blackList.has(tagName)) {
            const msg = '<script> element is not allowed.';
            const error = new TypeError(msg);
            console.error(error);
            return createElement.call(this, 'span');
          }
          return createElement.call(this, tagName);
        }
      }
    })

    Object.defineProperty(document.body, 'appendChild', {
      ...descriptor,
      value() {
        throw new TypeError(
          'Illegal invocation: document.body.appendChild is not allowed.'
        );
      }
    })
  }

  /**
   * fix possible innerHTML
   * https://stackoverflow.com/questions/2592092
   *
   * TODO: maybe use a sanitizer?
   * https://github.com/apostrophecms/sanitize-html
   */
  {
    [Element, HTMLElement].forEach(Element => {
      const descriptor = Object.getOwnPropertyDescriptor(
        Element.prototype,
        'innerHTML'
      );

      if (descriptor) {
        Object.defineProperty(Element.prototype, 'innerHTML', {
          ...descriptor,
          enumerable: false,
          configurable: false,
          set() {
            console.error(
              new TypeError('Illegal invocation: set innerHTML is not allowed!')
            );
          }
        });
      }
    });
  }
}
