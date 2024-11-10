const { google } = require("googleapis");
const { uuid } = require("uuidv4");

const googleDriveSetup = () => {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT__SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });

  return drive;
};

const googleDrive = googleDriveSetup();

exports.googleDriveUpload = async (req, stream) => {
  try {
    const response = await googleDrive.files.create({
      requestBody: {
        name: uuid() + "-" + req.file.originalname,
        mimeType: req.file.mimeType,
      },
      media: {
        mimeType: req.file.mimeType,
        body: stream,
      },
    });

    return response;
  } catch (err) {
    return err;
  }
};

exports.googleDriveDelete = async (fileId) => {
  try {
    const response = await googleDrive.files.delete({
      fileId,
    });
    return response;
  } catch (err) {
    return err;
  }
};

exports.googleDriveGetLink = async (fileId) => {
  try {
    await googleDrive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await googleDrive.files.get({
      fileId,
      fields: "webContentLink, webViewLink",
    });

    return result;
  } catch (err) {
    return err;
  }
};
