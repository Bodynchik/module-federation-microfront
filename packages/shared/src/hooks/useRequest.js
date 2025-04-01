import { useState, useCallback } from 'react';

export function useRequest() {
    const [spinner, setSpinner] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
        setSpinner(true);

        try {
            const response = await fetch(url, {method, body, headers});

            if (response.status !== 200) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            const data = await response.json();

            setSpinner(false);
            
            return data;
        } catch (error) {
            setSpinner(false);
            setError(error.message);
            throw error;
        }
    }, []);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    return {spinner, error, request, resetError};
}

export default useRequest;