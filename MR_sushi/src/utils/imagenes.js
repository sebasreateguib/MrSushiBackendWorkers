// ===== Utilidades para resolver imágenes de productos (ahora servidas desde S3) =====

const S3_BUCKET_URL = 'https://mrsushi-productos-dev-447499682439.s3.us-east-1.amazonaws.com/productos';

export const PLACEHOLDER_IMG = "https://placehold.co/140x140/333333/666666?text=Foto";
export const PLACEHOLDER_IMG_GRANDE = "https://placehold.co/600x600/333333/666666?text=Foto";

export const getImagen = (id) => `${S3_BUCKET_URL}/${id}.webp`;
export const getImagenGrande = (id) => `${S3_BUCKET_URL}/${id}.webp`;