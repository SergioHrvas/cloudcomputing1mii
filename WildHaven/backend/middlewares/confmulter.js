// middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de almacenamiento (storage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determinar la carpeta de destino según la URL de la ruta
        let uploadDir = '';

        if (req.baseUrl.includes('/user')) {
            uploadDir = path.join('./uploads', 'users');  // Para imágenes de usuario
        } else if (req.baseUrl.includes('/species')) {
            uploadDir = path.join('./uploads', 'species');  // Para imágenes de especie
        } else {
            uploadDir = path.join('./uploads', 'others');  // Carpeta por defecto
        }
        // Crear el directorio si no existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir); // Establecer el destino
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// Filtro de archivo para validar los tipos de imagen
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];  // Tipos de archivos permitidos
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);  // Aceptar archivo
    } else {
        cb(new Error('Tipo de archivo no permitido'), false);  // Rechazar archivo
    }
};

// Exportamos el middleware multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // Límite de tamaño de archivo de 5MB
    fileFilter: fileFilter
});

module.exports = upload;
