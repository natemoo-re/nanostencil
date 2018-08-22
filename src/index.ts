import * as ts from 'typescript';
import * as STENCIL from './constants';
import { StencilMetadata } from './interfaces';
import { isComponentClass, hasDecoratorNamed } from './utils';

function empty(): StencilMetadata {
    return {
        internalProperties: [],
        elements: [],
        states: [],
        props: [],
        watched: [],
        events: [],
        lifecycle: [],
        listeners: [],
        methods: [],
        internalMethods: []
    }
}

export function nanostencil(sourceFile: ts.SourceFile) {

    const metadata: StencilMetadata = empty();

    function visit(node: ts.Node) {
        if (ts.isClassDeclaration(node) && isComponentClass(node)) {
            
            node.members
                .filter((member) => !member.decorators)
                .forEach((member) => {
                    const name: string = toName(member);
                    if (STENCIL.BUILTIN_METHODS.includes(name)) return;
                    else if (STENCIL.LIFECYCLE_METHODS.includes(name)) metadata.lifecycle.push({ handler: name });
                    else if (ts.isPropertyDeclaration(member)) metadata.internalProperties.push({ name });
                    else if (ts.isMethodDeclaration(member)) metadata.internalMethods.push({ handler: name });
                });
            
            
            node.members
                .filter((member) => Array.isArray(member.decorators))
                .forEach((member) => {
                    if (hasDecoratorNamed(member, 'Element')) { metadata.elements.push(toName(member)); }
                    if (hasDecoratorNamed(member, 'State')) { metadata.states.push(toName(member)); }
                    if (hasDecoratorNamed(member, 'Watch')) {
                        const decorator = member.decorators.find((dec) => ts.isCallExpression(dec.expression) && ts.isIdentifier(dec.expression.expression) && dec.expression.expression.text === 'Watch');
                        const prop = ts.isCallExpression(decorator.expression) && ts.isStringLiteral(decorator.expression.arguments[0]) && (decorator.expression.arguments[0] as ts.StringLiteral).text;
                        metadata.watched.push({ prop, handler: toName(member) });
                    }
                    if (hasDecoratorNamed(member, 'Listen')) {
                        const decorators = member.decorators.filter((dec) => ts.isCallExpression(dec.expression) && ts.isIdentifier(dec.expression.expression) && dec.expression.expression.text === 'Listen');
                        const events = decorators.map(decorator => ts.isCallExpression(decorator.expression) && ts.isStringLiteral(decorator.expression.arguments[0]) && (decorator.expression.arguments[0] as ts.StringLiteral).text);
                        metadata.listeners.push({ events, handler: toName(member) });
                    }
                    if (hasDecoratorNamed(member, 'Event')) { metadata.events.push(toName(member)); }
                    if (hasDecoratorNamed(member, 'Method')) { metadata.methods.push(toName(member)); }
                    if (hasDecoratorNamed(member, 'Prop')) { metadata.props.push(toName(member)); }
                })
        }
        node.forEachChild(visit);
    }
    
    visit(sourceFile);
    
    return metadata;
}
