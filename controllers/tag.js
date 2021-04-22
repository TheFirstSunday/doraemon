// import models
const {
  tag: TagModel,
  category: CategoryModel,
  sequelize,
} = require('../models');

class TagController {
  static async getTagList(ctx) {
    ctx.body = await TagModel.findAll({
      attributes: [
        'name',
        [sequelize.fn('COUNT', sequelize.col('name')), 'count'],
      ],
      group: 'name',
      where: {
        articleId: { $not: null },
      },
      order: [[sequelize.fn('COUNT', sequelize.col('name')), 'desc']],
    });
  }

  static async getCategoryList(ctx) {
    ctx.body = await CategoryModel.findAll({
      attributes: [
        'name',
        [sequelize.fn('COUNT', sequelize.col('name')), 'count'],
      ],
      group: 'name',
      where: {
        articleId: { $not: null },
      },
      order: [[sequelize.fn('COUNT', sequelize.col('name')), 'desc']],
    });
  }
}

module.exports = TagController;
