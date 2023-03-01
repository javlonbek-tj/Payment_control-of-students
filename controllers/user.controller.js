const UserRepo = require('../repos/user-repo');
const MessageRepo = require('../repos/message-repo');
const { formatData, getMonth } = require('../repos/utils/formatData');

const getAllUsers = async (req, res, next) => {
  try {
    let users;
    let courseName;
    if (req.query.search) {
      const { search } = req.query;
      users = await UserRepo.findPartial(search);
    } else if (
      req.query.course ||
      req.query.mentor ||
      req.query.paymentstatus ||
      req.query.dateFrom ||
      req.query.dateTo
    ) {
      let { course, mentor, paymentstatus, dateFrom, dateTo } = req.query;
      switch (course) {
        case 'math':
          course = 'Matematika';
          break;
        case 'physics':
          course = 'Fizika';
          break;
        case 'english':
          course = 'Ingliz tili';
          break;
        case 'chemistry':
          course = 'Kimyo';
      }
      users = await UserRepo.findByCategories(course, mentor, paymentstatus, dateFrom, dateTo);
    } else {
      users = await UserRepo.find();
    }
    users.map(user => (user.date = getMonth(user.date)));
    const allUsers = await UserRepo.find();
    const mathUsers = allUsers.filter(user => user.course === 'Matematika');
    const mathPaidUsers = mathUsers.filter(user => user.paymentstatus === 'paid');
    const englishUsers = allUsers.filter(user => user.course === 'Ingliz tili');
    const englishPaidUsers = englishUsers.filter(user => user.paymentstatus === 'paid');
    const physicsUsers = allUsers.filter(user => user.course === 'Fizika');
    const physicsPaidUsers = physicsUsers.filter(user => user.paymentstatus === 'paid');
    const chemistryUsers = allUsers.filter(user => user.course === 'Kimyo');
    const chemistryPaidUsers = chemistryUsers.filter(user => user.paymentstatus === 'paid');
    const unreadMessages = await MessageRepo.find();
    formatData(users);
    res.render('home', {
      pageTitle: "O'quvchilar to'lov nazorati",
      users,
      unreadMessages,
      courseName,
      mathUsers,
      englishUsers,
      physicsUsers,
      chemistryUsers,
      mathPaidUsers,
      englishPaidUsers,
      physicsPaidUsers,
      chemistryPaidUsers,
    });
  } catch (err) {
    console.log(err);
  }
};

const getOneUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await UserRepo.findById(userId);
    if (!user) {
      return res.status(400).json('No user Found');
    }
    formatData(user);
    res.render('user/user-detail', {
      pageTitle: "Mening ma'lumotlarim",
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

const getPayment = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await UserRepo.findById(userId);
    if (!user) {
      return res.status(400).json('User not found');
    }
    res.render('user/payment', {
      pageTitle: "Ma'lumotlarni o'zgartirish",
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

const postPayment = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const pdfCashUrl = req.file.path;
    await UserRepo.uploadCash(pdfCashUrl, userId);
    const user = await UserRepo.changePaymentStatusToProgress(userId);
    await MessageRepo.insert(
      `${user.firstname} ${user.month} oyi uchun to'lovni amalga oshirdi`,
      userId,
    );
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  getPayment,
  postPayment,
};
