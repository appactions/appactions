import { useStore } from './hooks';

export default function SidePanel() {
    const data = useStore('selectionChange', store => {
        const id = store.selectedElementID;
        return store.getRoleByID(id)
    });

    if (!data) {
        return null;
    }

    return <h2>{JSON.stringify(data, null, 2)}</h2>;
}
