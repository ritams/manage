
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Load Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse
                });
                window.google.accounts.id.renderButton(
                    document.getElementById("googleBtn"),
                    { theme: "outline", size: "large", width: "100%" }
                );
            }
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleCredentialResponse = async (response) => {
        try {
            await googleLogin(response.credential);
            navigate('/');
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed! Ensure you are an admin.");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-muted/50">
            <Card className="w-[350px]">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Admin Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <div id="googleBtn" className="w-full"></div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
