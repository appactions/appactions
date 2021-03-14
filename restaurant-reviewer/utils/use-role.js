import useSession from 'utils/use-session';

export default function useRole({ restaurantOwner } = {}) {
    const session = useSession();
    if (!session) {
        return {
            isOwner: false,
            isOwnerOfThis: false,
            isAdmin: false,
        };
    }
    if (session.user.role === 'admin') {
        return {
            isOwner: false,
            isOwnerOfThis: false,
            isAdmin: true,
        };
    }
    return {
        isOwner: session.user.role === 'owner_user',
        isOwnerOfThis: restaurantOwner && session.user.id === restaurantOwner,
        isAdmin: false,
    };
}
