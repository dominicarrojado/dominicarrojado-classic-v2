import { Screen } from '@testing-library/react';
import { Nullish } from '../types';

export function setReadOnlyProperty<
  O extends Record<string, any>,
  K extends keyof O,
  V extends any
>(object: O, property: K, value: V) {
  Object.defineProperty(object, property, {
    value,
    configurable: true,
  });
}

export function queryByTextIgnoreHTML(screen: Screen, text: string) {
  return screen.getByText((_: string, node: Nullish<Element>) => {
    const hasText = (node: Nullish<Element>) => node?.textContent === text;
    const nodeHasText = hasText(node);
    let childrenDontHaveText = true;

    if (node) {
      childrenDontHaveText = Array.from(node.children).every(
        (child) => !hasText(child)
      );
    }

    return nodeHasText && childrenDontHaveText;
  });
}
