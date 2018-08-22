interface PropertyMetadata {
    name: string;
}
interface ElementMetadata extends PropertyMetadata { }
interface StateMetadata extends PropertyMetadata { }
interface PropMetadata extends PropertyMetadata {
    isConnect?: true;
    isContext?: true;
}

interface MethodMetadata {
    handler: string;
}
interface WatchMetadata extends MethodMetadata {
    prop: string;
}
interface EventMetadata extends MethodMetadata { }
interface ListenerMetadata extends MethodMetadata {
    events: string[];
}
interface LifecycleMetadata extends MethodMetadata { }
interface ListenerMetadata extends MethodMetadata {
    events: string[];
}

export interface StencilMetadata {
    internalProperties: PropertyMetadata[];
    elements: ElementMetadata[];
    states: StateMetadata[];
    props: PropMetadata[];
    watched: WatchMetadata[]
    events: EventMetadata[],
    lifecycle: LifecycleMetadata[],
    listeners: ListenerMetadata[],
    methods: MethodMetadata[],
    internalMethods: MethodMetadata[]
}