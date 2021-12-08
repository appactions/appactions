import { useStore } from './hooks';

export default function SidePanel() {
    const inspectedElement = useStore('inspectedElement', store => {
        // return (Math.random() * 100) | 0;
        return store.inspectedElement;
    });

    if (!inspectedElement) {
        return null;
    }

    return <h2>{JSON.stringify(inspectedElement, null, 2)}</h2>;
}
