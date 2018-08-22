import * as ts from 'typescript';

export function isComponentClass(node: ts.Node): boolean {
    return true;
}

export function hasDecoratorNamed(node: ts.Node, name: string): boolean {
    return true;
}