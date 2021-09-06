import multer from 'multer';
import sharp from 'sharp';
import Async from 'express-async-handler';
import path from 'path';
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + '-' + Date.now() + path.extname(file.originalname)
		);
	},
	fileSize: 1000000,
});

export const upload = multer({
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
			return cb(new Error('it must be an image'));
		}

		cb(undefined, true);
	},
	storage,
});

// export const resizeMultiImgs = async (req, res, next) => {
// 	if (req.files && req.files.length) {
// 		req.files = req.files.map((file) => {
// 			const newFile =
// 				file.fieldname +
// 				'-' +
// 				Date.now() +
// 				path.extname(file.originalname);
// 			sharp(file.buffer)
// 				.toFormat('png')
// 				.png({ quality: 90 })
// 				.resize({ width: 250, height: 250 })
// 				.toFile(`/uploads/${newFile}`, (err, info) => {
// 					if (err) return res.status(400).send(err);
// 					console.log(info);
// 				});
// 		});
// 		next();
// 	}
// 	console.log('no files');
// };
