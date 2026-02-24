const validate = (schema) => (req, res, next) => {
	const parsed = schema.safeParse(req.body);
	if (parsed.success) {
		req.body = parsed.data; // use parsed & coerced data
		return next();
	}

	let errorsArray = [];
	if (parsed.error) {
		if (Array.isArray(parsed.error.errors)) errorsArray = parsed.error.errors;
		else if (Array.isArray(parsed.error.error && parsed.error.error.errors)) errorsArray = parsed.error.error.errors;
		else if (typeof parsed.error.message === 'string') {
			try {
				const maybe = JSON.parse(parsed.error.message);
				if (Array.isArray(maybe)) errorsArray = maybe;
			} catch (e) {
			}
		}
	}

	if (!errorsArray || errorsArray.length === 0) {
		const topMessage = parsed.error && parsed.error.message ? parsed.error.message : 'Validation failed';
		return res.status(400).json({ message: topMessage, errors: [] });
	}

	const first = errorsArray[0];
	const formatted = errorsArray.map((e) => ({
		field: e.path && e.path.length ? e.path.join('.') : null,
		message: e.message,
	}));

	const topMessage = first ? `${(first.path && first.path.join('.')) || 'field'}: ${first.message}` : 'Validation failed';
	return res.status(400).json({ message: topMessage, errors: formatted });
};

module.exports = { validate };
