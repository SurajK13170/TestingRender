const express = require('express');
const blogRoutes = express.Router();
const { Blog } = require('../model/blog.model');
const { authenticateToken } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/authoriz');
const multer = require('multer');
const path = require('path');

const directories = require('../data/directories.json');

const getUploadsPath = (absPath) => {
  const serverPath = path.join(__dirname, '..', 'uploads');
  return absPath.replace(serverPath, '').replaceAll('\\', '/')
}

// Create a storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const urlSegments = req.originalUrl.split('/');
    
    let uploadType = directories;

    for (const segment of urlSegments) {
      if (uploadType[segment]) {
        uploadType = uploadType[segment];
      } else {
        break;
      }
    }

    uploadType = uploadType[file.fieldname] || 'public'

    const uploadPath = path.join(__dirname, '..', 'uploads', uploadType);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

blogRoutes.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  const {
    title,
    url,
    description,
    content,
    metaTags,
    metaKeywords,
    metaTitle,
    metaDescription,
    status,
  } = req.body;

  try {
    const imagePath = getUploadsPath(req.files.image[0].path) ;
    const thumbnailPath = getUploadsPath(req.files.thumbnail[0].path);
    const newBlog = await Blog.create({
      title,
      image:imagePath,
      blogthumbnail: thumbnailPath,
      url,
      description,
      content,
      metaTags,
      metaKeywords,
      metaTitle,
      metaDescription,
      status,
    })


    res.status(201).json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating blog.' });
  }
});




blogRoutes.get('/', authenticateToken, authorizeRoles(['admin', 'super admin']),async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching blogs.' });
  }
});

blogRoutes.post('/test', upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
  res.status(200).send(req.files.image[0].path)
})



blogRoutes.get('/:id',authenticateToken, authorizeRoles(['admin', 'super admin']), async (req, res) => {
  const blogId = req.params.id;

  try {
    const blog = await Blog.findByPk(blogId);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching blog.' });
  }
});

blogRoutes.put('/:id',authenticateToken, authorizeRoles(['admin', 'super admin']), async (req, res) => {
  const blogId = req.params.id;
  const updatedBlogData = req.body;
  try {
    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }
    await blog.update(updatedBlogData);
    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating blog.' });
  }
});

blogRoutes.delete('/:id', authenticateToken, authorizeRoles(['admin', 'super admin']),async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }
    await blog.destroy();
    res.status(204).send('Data deleted');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting blog.' });
  }
});

module.exports = {blogRoutes};
