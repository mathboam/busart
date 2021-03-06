const router = require('express-promise-router')();
const publisherController = require('./controllers/publisherController');
const articleController = require('./controllers/articleController');
const frontEndController = require('./controllers/frontEndController');
router.route('/')
.get(articleController.getAllVerifiedArtcles,frontEndController.homepageController);




router.route('/userDashboard/articles/')
.get(articleController.getAllArtricles);

router.route('/register')
.get(frontEndController.registerController)
.post(publisherController.saveImage, publisherController.addPublisher);

router.route('/login')
.get(frontEndController.loginController)
.post(publisherController.login);


router.route('/register/publisher')
.post(publisherController.addPublisher)
.get(publisherController.getUsers);

router.route('/publishers/:userId/publisher')
.delete(publisherController.deleteUser,publisherController.getUsers);

router.route('/publisher/:userId/article')
.post(articleController.saveImage,articleController.addArticle);
// .get(articleController.getUserArticles);

router.route('/articles/:postId/article')
.patch(articleController.updateArticle)
.delete(articleController.deleteArticle,articleController.getAllVerifiedArtcles);

router.route('/userDashboard')
.get(publisherController.ensureAuthenticated,frontEndController.userDashboardController)

router.route('/logout')
.get(publisherController.logoutController)

router.route('/readmore/:articleId')
.get(publisherController.readmore)

/* 
    API
*/
router.route('/api/search')
.get(articleController.search);

router.route('/activate/:userId')
.get(publisherController.activate);

router.route('/delete')
.get(publisherController.delete)

router.route('/userDashboard/articles/:userid')
.get(publisherController.articles)
module.exports = router;