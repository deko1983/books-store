const Book = require('../models/book');

class BookDao {
  static async create(bookData) {
    try {
      const book = await Book.create(bookData);
      return book;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const books = await Book.findAll();
      return books;
    } catch (error) {
      throw error;
    }
  }

  static async getById(bookId) {
    try {
      const book = await Book.findByPk(bookId);
      return book;
    } catch (error) {
      throw error;
    }
  }

  static async update(bookId, updatedBookData) {
    try {
      const book = await Book.findByPk(bookId);
      if (!book) {
        throw new Error('Item not found');
      }
      await book.update(updatedBookData);
      return book;
    } catch (error) {
      throw error;
    }
  }

  static async delete(bookId) {
    try {
      const book = await Book.findByPk(bookId);
      if (!book) {
        throw new Error('Item not found');
      }
      await book.destroy();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BookDao;