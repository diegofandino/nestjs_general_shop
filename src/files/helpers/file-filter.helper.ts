export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {

    /*   if (!file) return callback(new Error('No file uploaded'), false); */

    const extensionFile = file.mimetype.split('/').pop();

    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if (extensionFile && !validExtensions.includes(extensionFile)) {
        return callback(null, false);
    }

    callback(null, true);


}