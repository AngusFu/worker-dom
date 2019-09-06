import { Document } from "./dom/Document";
import { Element } from "./dom/Element";
import { HTMLElement } from "./dom/HTMLElement";

export function rewriteAPI (document: Document) {
  {
    document.head = document.querySelector('app-head');
    document.body = document.querySelector('app-body') as Element;
    document.mountingNode = document.body.querySelector('div');

    document.body.appendChild = function() {
      throw new TypeError(
        'Illegal invocation: document.body.appendChild is not allowed.'
      );
    };
  }

  {
    const createElement = document.createElement;
    document.createElement = function(tagName) {
      if (tagName === 'script') {
        const msg = '<script> element is not allowed.';
        const error = new TypeError(msg);
        console.error(error);
        return createElement.call(this, 'span');
      }
      return createElement.call(this, tagName);
    };
  }

  /**
   * fix possible innerHTML
   * https://stackoverflow.com/questions/2592092
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
