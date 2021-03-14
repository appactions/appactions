import { Alert } from 'components/message';
import { useRouter } from 'next/router';

function AuthError() {
    const router = useRouter();
    return <Alert text="Error at authentication">{router.query.error}</Alert>;
}

export default AuthError;
