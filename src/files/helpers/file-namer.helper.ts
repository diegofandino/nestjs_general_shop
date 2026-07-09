export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, fileName: string) => void) => {

    /*   if (!file) return callback(new Error('No file uploaded'), false); */

    const extensionFile = file.mimetype.split('/').pop();

    const date = new Date().getTime();

    const fileName = `${date}-${file.originalname}.${extensionFile}`;

    callback(null, fileName);


}