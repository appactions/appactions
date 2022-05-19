import { useStore } from './hooks';
import json2yaml from '../../json-to-yaml';

export default function InspectPanel() {
    const data = useStore('selectionChange', store => {
        const id = store.selectedElementID;
        return store.getPatternByID(id);
    });

    return (
        <code className="block pt-2 pl-2 whitespace-pre-wrap">
            {data ? json2yaml(data) : 'Select a pattern to debug'}
        </code>
    );
}
