export const createAuthHeader = (accessToken) => {
    return {
        Authorization: `Bearer ${accessToken}`,
    };
};
