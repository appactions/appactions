import { useStore } from './hooks';
import json2yaml from './json-to-yaml';

export default function InspectPanel() {
    const data = useStore('selectionChange', store => {
        const id = store.selectedElementID;
        return store.getPatternByID(id);
    });

    if (!data) {
        return null;
    }

    return <code className="block pt-2 pl-2 whitespace-pre-wrap">{json2yaml(data)}</code>;
}
