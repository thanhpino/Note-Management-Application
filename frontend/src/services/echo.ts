import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<any>;
    }
}

window.Pusher = Pusher;

const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const backendHost = new URL(backendUrl).hostname;

const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || 'notes_key_123',
    wsHost: backendHost,
    wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT || 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${backendUrl}/broadcasting/auth`,
    auth: {
        headers: {
            get Authorization() {
                return `Bearer ${localStorage.getItem('token')}`;
            },
            Accept: 'application/json',
        },
    },
});

export default echo;
