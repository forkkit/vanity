const { verifyToken } = require('../../utils/token');
const { User } = require('../../models');

const preferences = async (req, res) => {
	try {
		const auth = req.headers.authorization;
		const { token } = JSON.parse(auth);
		const user = await verifyToken(token);
		const userByID = await User.findByPk(user.id);
		const { repos } = userByID.get({ plain: true });
		user.repos = repos;
		res.status(200).send(user);
	} catch (error) {
		console.error(error); // TODO: handle error
		res
			.clearCookie('github-user')
			.clearCookie('jwt')
			.status(401).json();
	}
};

const updateRepos = async (req, res) => {
	try {
		const { repos } = req.body;
		const auth = req.headers.authorization;
		const { token } = JSON.parse(auth);
		const user = await verifyToken(token);
		User.update(
			{ repos },
			{
				where: {
					id: user.id,
				},
			}
		)
			.then(returned => res.status(200).json({ res: returned }))
			.catch(error => res.status(500).json({ error: error.message }));
	} catch (error) {
		// TODO: handle success & error responses
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	preferences,
	updateRepos,
};
