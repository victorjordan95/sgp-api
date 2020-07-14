import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });
    return res.json(file);
  }

  async update(req, res) {
    const { originalname: name, filename: path } = req.file;
    const file = await File.findByPk(req.body.id);

    await file.update({
      name,
      path,
    });
    return res.json(file);
  }
}

export default new FileController();
