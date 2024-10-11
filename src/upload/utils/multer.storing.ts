import { diskStorage } from 'multer';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);
config();

export const storage = diskStorage({
  destination: async function (req, file, cb) {
    await createFolders();
    cb(null, `./${process.env.UPLOAD_DIR}`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1],
    );
  },
});

async function createFolders() {
  const publicFolderPath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'public',
  );
  const uploadsFolderPath = path.join(publicFolderPath, 'uploads');
  console.log({ publicFolderPath, uploadsFolderPath });
  try {
    await access(publicFolderPath, fs.constants.F_OK);
    console.log('Public folder already exists.');
  } catch (err) {
    try {
      await mkdir(publicFolderPath);
      console.log('Public folder created.');
    } catch (err) {
      console.error('Error creating public folder:', err);
      return;
    }
  }

  try {
    await access(uploadsFolderPath, fs.constants.F_OK);
    console.log('Uploads folder already exists.');
  } catch (err) {
    try {
      await mkdir(uploadsFolderPath);
      console.log('Uploads folder created.');
    } catch (err) {
      console.error('Error creating uploads folder:', err);
      return;
    }
  }
}
