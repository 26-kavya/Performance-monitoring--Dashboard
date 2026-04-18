import React, { createContext, useState } from 'react';

export const AdminFilterContext = createContext();

export const AdminFilterProvider = ({ children }) => {
    const [departmentFilter, setDepartmentFilter] = useState('All');

    return (
        <AdminFilterContext.Provider value={{ departmentFilter, setDepartmentFilter }}>
            {children}
        </AdminFilterContext.Provider>
    );
};
