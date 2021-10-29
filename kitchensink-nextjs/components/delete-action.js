import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';

export default function DeleteAction({ config, children }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation(async () => {
        const res = await fetch(config.url, {
            method: config.method || 'delete',
            body: JSON.stringify(config.data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await res.json();
    });

    const onClick = async () => {
        if (!window.confirm('Do you really want to delete this resource?')) {
            return;
        }

        await mutation.mutateAsync(null, {
            onError: config.onError,
            onSettled: config.onSettled,
            onSuccess() {
                if (config.onSuccess) config.onSuccess();
                if (config.invalidateQueries) {
                    queryClient.invalidateQueries(config.invalidateQueries);
                }
                if (config.goto) {
                    router.push(config.goto);
                }
            },
        });
    };
    return React.cloneElement(children, { onClick: onClick });
}
