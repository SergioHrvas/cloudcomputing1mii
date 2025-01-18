let apiUrl: string;
let uploadsUrl: string;

if (window.location.hostname === 'localhost') {
    // Si estamos en desarrollo
    apiUrl = "http://localhost:3800/api/";
    uploadsUrl = "http://localhost:3800/uploads/";
} else {
    // Si estamos en producción (Google Cloud)
    apiUrl = "http://34.175.69.125:3800/api/";
    uploadsUrl = "http://34.175.69.125:3800/uploads/";
}

export const GLOBAL = {
    url: apiUrl,
    urlUploads: uploadsUrl
};
