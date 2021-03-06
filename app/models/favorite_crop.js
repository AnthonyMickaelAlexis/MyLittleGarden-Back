const client = require('../config/db');

module.exports = {

  async findAllCropsFavorite(userId) {
    const result = await client.query(`SELECT favorite_crop.id, crop.*
             FROM favorite_crop 
             JOIN "crop" ON "favorite_crop".crop_id = "crop".id
             JOIN "user" ON "favorite_crop".user_id = "user".id
             WHERE "user"."id" = $1`, [userId]);
    return result.rows;
  },

  async checkIfFavoriteCropExist(cropId, userId) {
    const checkIfFavCropExist = await client.query(
      'SELECT * FROM "favorite_crop" WHERE user_id = $1 AND crop_id = $2',
      [userId, cropId],
    );
    return checkIfFavCropExist.rows[0];
  },

  async findByPk(cropId) {
    const result = await client.query('SELECT * FROM crop WHERE id = $1', [cropId]);

    return result.rows[0];
  },

  async delete(id) {
    const result = await client.query('DELETE FROM crop WHERE id = $1', [id]);
    return !!result.rowCount;
  },

  async insertIntoFavoriteList(cropid, userid) {
    const preparedQuery = {
      text: `
                INSERT INTO favorite_crop 
                (
                    "crop_id",
                    "user_id"
                )
                VALUES ($1, $2);
            `,
      values: [
        cropid,
        userid,
      ],
    };
    const result = await client.query(preparedQuery);
    return result.rowCount;
  },

  async deleteIntoFavoriteList(cropid, userid) {
    const result = await client.query(
      `
            DELETE FROM "favorite_crop"
            WHERE "crop_id" = $1
            AND "user_id" = $2
        
        `,
      [
        cropid,
        userid,

      ],
    );
    return result.rowCount;
  },

};
