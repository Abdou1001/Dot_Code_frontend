export const getApiErrorMessage = (error: any, fallback = "حدث خطأ غير متوقع"): string => {
    if (!error) return fallback;

    // Check backend standardized envelope: { status: 'fail', message: '...' }
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    // Check Zod validation errors: { status: 'fail', errors: [{ field, message }] }
    if (Array.isArray(error.response?.data?.errors) && error.response.data.errors.length > 0) {
        return error.response.data.errors.map((e: any) => e.message).join(" | ");
    }

    if (error.message) {
        return error.message;
    }

    return fallback;
};

export const useApiError = () => {
    return {
        getErrorMessage: getApiErrorMessage,
    };
};
