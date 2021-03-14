import React, { useState } from 'react';
import Head from 'next/head';
import { Provider, getSession } from 'next-auth/client';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import Header from 'components/header';
import Main from 'components/main';
import { Alert } from 'components/message';
import OnboardWidget from 'components/onboard-widget';
import { SessionContext } from 'utils/use-session';
import './style.css';

const sessionOptions = {
    clientMaxAge: 2 * 60 * 60, // re-fetch session if cache is older than 2 hours
    keepAlive: 60 * 60, // send keepAlive message every hour
};

const queryClient = new QueryClient();

function App({ Component, pageProps }) {
    const [session, setSession] = useState(pageProps.session);

    return (
        <Provider session={session} options={sessionOptions}>
            <SessionContext.Provider value={session}>
                <QueryClientProvider client={queryClient}>
                    <Hydrate state={pageProps.dehydratedState}>
                        <Head>
                            <title>Restaurant Reviewer</title>
                        </Head>
                        <Header />
                        <Main>
                            <QueryErrorResetBoundary>
                                {({ reset }) => (
                                    <ErrorBoundary
                                        onReset={reset}
                                        fallbackRender={({ resetErrorBoundary }) => (
                                            <Alert text="There was an error!">
                                                <button
                                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 border border-transparent leading-4 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    onClick={() => resetErrorBoundary()}
                                                >
                                                    Try again
                                                </button>
                                            </Alert>
                                        )}
                                    >
                                        {session && session.user.role === 'onboarding' ? (
                                            <OnboardWidget
                                                onSuccess={() => {
                                                    getSession().then(session => {
                                                        setSession(session);
                                                    });
                                                }}
                                            />
                                        ) : (
                                            <Component {...pageProps} />
                                        )}
                                    </ErrorBoundary>
                                )}
                            </QueryErrorResetBoundary>
                        </Main>
                    </Hydrate>
                </QueryClientProvider>
            </SessionContext.Provider>
        </Provider>
    );
}

export default App;
