import Settings from '../models/settingsModel';
import catchAsync from '../utils/catchAsync';
import slugify from 'slugify';

var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'codesmart',
  api_key: '924552959278257',
  api_secret: 'nyl74mynmNWo5U0rzF8LqzcCE8U',
});

export const createCompanyDetails = async (req, res) => {
  // console.log(req.body);
  try {
    const { slug, companyLogo } = req.body;
    const found = await Settings.findOne({ slug });

    const imageResult = await cloudinary.v2.uploader.upload(companyLogo, {
      folder: 'pos',
    });

    if (found) {
      await cloudinary.v2.uploader.destroy(found.companyLogo.public_id);
      const updated = await Settings.findOneAndUpdate(
        { slug },
        {
          ...req.body,
          companyLogo: {
            public_id: imageResult.public_id,
            url: imageResult.url,
          },
        },
        {
          new: true,
        },
      );
      return res.json(updated);
    } else {
      // create
      const created = await new Settings(req.body).save();
      return res.json(created);
    }
  } catch (err) {
    console.log(err);
  }
};

export const getAllDetails = async (req, res) => {
  try {
    const { slug } = req.query;
    const found = await Settings.findOne({ slug });
    return res.json(found);
  } catch (err) {
    console.log(err);
  }
};
