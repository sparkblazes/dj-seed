import React from 'react';

const NetworkErrorPage: React.FC = () => (
    <div style={{ textAlign: 'center', marginTop: '10%' }}>
        <h1>Network Error</h1>
        <p>
            Unable to connect to the server. Please check your internet connection and try again.
        </p>
    </div>
);

export default NetworkErrorPage;