import React from 'react';

export default function AuthLayout({ title, children }) {
    return (
        <div>
            <div>{children}</div>
        </div>
    );
}
