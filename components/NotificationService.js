// NotificationService.js
"use client";
import { createContext, useContext, useCallback } from 'react';
import { useSnackbar } from 'notistack';

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { enqueueSnackbar } = useSnackbar();

    const notify = useCallback((message, options) => {
        enqueueSnackbar(message, {
            ...options,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
            },
        });
    }, [enqueueSnackbar]);

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
        </NotificationContext.Provider>
    );
};
