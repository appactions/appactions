import { useMutation, useQueryClient } from 'react-query';
import * as original from 'react-hook-form';
import { useRouter } from 'next/router';

export default function useForm() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation(async ({ config, data }) => {
        const res = await fetch(config.url, {
            method: config.method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // ????
        // if (!res.ok) throw new Error(res.statusText);

        return await res.json();
    });

    const api = original.useForm();

    return {
        ...api,
        handleSubmit: config => {
            if (!config.method) {
                throw new Error('form config is missing "method" value');
            }
            if (!config.url) {
                throw new Error('form config is missing "url" value');
            }
            return api.handleSubmit(async data => {
                return await mutation.mutateAsync(
                    {
                        config,
                        data,
                    },
                    {
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
                    },
                );
            });
        },
        originalHandleSubmit: api.handleSubmit,
    };
}
