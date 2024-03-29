const pool = require('../pool');

class CourseRepo {
  static async insert(name) {
    await pool.query('INSERT INTO courses(name) VALUES ($1); ', [name]);
  }

  static async find() {
    const { rows } = await pool.query('SELECT * FROM courses');
    return rows;
  }
  static async findByName(name) {
    const { rows } = await pool.query('SELECT * FROM courses WHERE name = $1;', [name]);
    return rows;
  }

  static async deleteCourse(id) {
    await pool.query('DELETE FROM courses WHERE id=$1', [id]);
  }
}

module.exports = CourseRepo;
